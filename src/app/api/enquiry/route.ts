import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { enquirySchema } from '@/lib/enquiry-schema';

// Simple sliding-window rate limiter per IP (5 requests per 10 minutes)
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const ipHits = new Map<string, number[]>();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (ipHits.get(ip) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  ipHits.set(ip, recent);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        code: 'rate_limited',
        message: 'Too many enquiries sent in a short window. Please wait a few minutes or message us directly on WhatsApp.',
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: 'invalid_json', message: 'Invalid enquiry payload.' },
      { status: 400 }
    );
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] || 'form');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      {
        ok: false,
        code: 'validation_error',
        message: 'Please review the highlighted fields before submitting.',
        fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const referenceId = `EZQ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase()}`;

  // Never log raw secrets or passport data; strip honeypot
  const { website: _honeypot, ...safeRecord } = data;
  void _honeypot;

  const entry = {
    referenceId,
    receivedAt: new Date().toISOString(),
    ...safeRecord,
  };

  // Optional live server-side Resend email dispatch when configured via env vars
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ENQUIRY_TO_EMAIL || 'info@ezyquick.in';
  const fromEmail = process.env.ENQUIRY_FROM_EMAIL;

  let deliveryMode: 'email_dispatched' | 'recorded_pending_mail_config' =
    'recorded_pending_mail_config';

  if (resendKey && fromEmail) {
    try {
      const mailResp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: safeRecord.email,
          subject: `[EzyQuick ${referenceId}] ${safeRecord.serviceType} — ${safeRecord.destination}`,
          text: [
            `Reference: ${referenceId}`,
            `Service: ${safeRecord.serviceType}`,
            `Name: ${safeRecord.fullName}`,
            `Email: ${safeRecord.email}`,
            `Mobile: ${safeRecord.mobile}`,
            `Route: ${safeRecord.originCity} -> ${safeRecord.destination}`,
            `Dates: ${safeRecord.departureDate || 'Flexible'} to ${safeRecord.returnDate || 'Flexible'}`,
            `Travellers: ${safeRecord.travellers}`,
            safeRecord.companyName ? `Company: ${safeRecord.companyName}` : null,
            safeRecord.holidayType ? `Holiday Type: ${safeRecord.holidayType}` : null,
            safeRecord.budgetRange ? `Budget Range: ${safeRecord.budgetRange}` : null,
            safeRecord.visaCategory ? `Visa Category: ${safeRecord.visaCategory}` : null,
            safeRecord.specialRequirements ? `Notes: ${safeRecord.specialRequirements}` : null,
          ]
            .filter(Boolean)
            .join('\n'),
        }),
      });
      if (mailResp.ok) {
        deliveryMode = 'email_dispatched';
      }
    } catch {
      // Fall through cleanly to local server persistence and report honestly
    }
  }

  // Persist a structured audit record locally (outside public/) when writable
  try {
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    await fs.appendFile(
      path.join(dataDir, 'enquiries.jsonl'),
      `${JSON.stringify({ ...entry, deliveryMode })}\n`,
      'utf8'
    );
  } catch {
    // Read-only serverless filesystems skip local file writes without failing valid email dispatch
    if (deliveryMode !== 'email_dispatched') {
      return NextResponse.json(
        {
          ok: false,
          code: 'delivery_not_configured',
          message:
            'Automated email delivery is not yet configured on this server. Please continue via WhatsApp or email info@ezyquick.in directly.',
        },
        { status: 503 }
      );
    }
  }

  return NextResponse.json(
    {
      ok: true,
      referenceId,
      deliveryMode,
      message:
        deliveryMode === 'email_dispatched'
          ? `Your enquiry (${referenceId}) has been delivered to the EzyQuick travel desk.`
          : `Your enquiry (${referenceId}) has been validated and recorded on our server. Live outbound email delivery awaits SMTP/Resend credentials — you may also tap Continue via WhatsApp below for immediate response.`,
    },
    { status: 201 }
  );
}
