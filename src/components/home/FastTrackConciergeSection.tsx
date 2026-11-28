'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import { buildSafeMailtoUrl, buildSafeWhatsAppUrl, SITE } from '@/data/site';
import {
  useJourneySelection,
  type ConciergeGroupSize,
} from '@/lib/journey-selection';

export const EXCLUSIVE_OFFERS = [
  {
    id: 'desk-rates',
    tag: 'Unlisted Hotel & Flight Desk Rates',
    badge: 'Exclusive Offer',
    badgeStyle: 'bg-[#F5A623] text-[#091933]',
    borderActive: 'border-[#F5A623] bg-[#F5A623]/12',
    description:
      'Direct B2B & consolidator hotel and airfare inventory you will not see on public booking portals.',
  },
  {
    id: 'visa-bundle',
    tag: 'Fast-Track Visa + Zero-Stress Bundling',
    badge: 'Speed Bundle',
    badgeStyle: 'bg-[#60A5FA] text-[#091933]',
    borderActive: 'border-[#60A5FA] bg-[#60A5FA]/12',
    description:
      'Flights, stays, forex cards, insurance, and visa checklists coordinated cleanly in one single thread.',
  },
  {
    id: 'corporate-priority',
    tag: 'Corporate & Group Priority Desk',
    badge: 'B2B Priority',
    badgeStyle: 'bg-[#0B56E8] text-white',
    borderActive: 'border-[#0B56E8] bg-[#0B56E8]/18',
    description:
      'Rapid multi-traveller proposals for MICE delegations, leadership offsites, and family celebrations.',
  },
] as const;

const QUICK_DESTINATIONS = [
  ...DESTINATIONS.slice(0, 8).map((d) => d.name),
  'Kerala',
  'Goa',
  'Ladakh',
  'Surprise Me / Custom',
];

const VIBE_CHIPS = [
  { label: 'Leisure Holiday', service: 'Leisure Travel' },
  { label: 'Luxury Escape', service: 'Leisure Travel' },
  { label: 'Corporate / MICE', service: 'Corporate Travel' },
  { label: 'Visa & Flights Only', service: 'Visa Services' },
  { label: 'Medical Travel', service: 'Medical Travel' },
] as const;

const GROUP_SIZES: ConciergeGroupSize[] = [
  'Solo',
  'Couple',
  'Family',
  'Group / Corporate 8+',
];

interface ConciergeCardProps {
  compact?: boolean;
  onSuccessClose?: () => void;
}

export function FastTrackConciergeCard({ compact = false }: ConciergeCardProps) {
  const {
    selection,
    originCity,
    originHub,
    selectDestinationByName,
    setService,
    setConciergeGroupSize,
    setConciergeOfferTag,
  } = useJourneySelection();

  const [step, setStep] = useState<1 | 2>(1);
  const [customDestination, setCustomDestination] = useState<string>(
    selection.destination || 'Dubai'
  );
  const [selectedVibe, setSelectedVibe] = useState<string>('Leisure Holiday');
  const [handoffChannel, setHandoffChannel] = useState<'whatsapp' | 'callback'>('whatsapp');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [travelMonth, setTravelMonth] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync card whenever user clicks a destination/service/offer elsewhere on the page
  useEffect(() => {
    if (selection.destination) {
      setCustomDestination(selection.destination);
    }
  }, [selection.destination]);

  useEffect(() => {
    const matchedVibe = VIBE_CHIPS.find((v) => v.service === selection.service);
    if (matchedVibe) setSelectedVibe(matchedVibe.label);
  }, [selection.service]);

  const activeOffer = selection.conciergeOfferTag || EXCLUSIVE_OFFERS[0].tag;

  const briefText = useMemo(() => {
    return [
      'EzyQuick Fast-Track Concierge Request',
      '-------------------------------------',
      `Departure City: ${originCity.city} (${originCity.code})`,
      `Servicing Hub: ${originHub.city} (${originHub.code})`,
      `Destination: ${customDestination}`,
      `Travel Vibe / Service: ${selectedVibe} (${selection.service})`,
      `Group Size: ${selection.conciergeGroupSize}`,
      `Attached Offer Perk: ${activeOffer}`,
      travelMonth ? `Rough Travel Month: ${travelMonth}` : null,
      name ? `Name: ${name}` : null,
      contact ? `Contact: ${contact}` : null,
      `Preferred Response: ${handoffChannel === 'whatsapp' ? 'Fast Quote on WhatsApp' : 'Instant Callback / Email Quote'}`,
    ]
      .filter(Boolean)
      .join('\n');
  }, [
    originCity.city,
    originCity.code,
    originHub.city,
    originHub.code,
    customDestination,
    selectedVibe,
    selection.service,
    selection.conciergeGroupSize,
    activeOffer,
    travelMonth,
    name,
    contact,
    handoffChannel,
  ]);

  const waPayload = useMemo(() => buildSafeWhatsAppUrl(briefText), [briefText]);
  const mailPayload = useMemo(
    () =>
      buildSafeMailtoUrl(
        `[EzyQuick Fast-Track Estimate] ${customDestination} — ${selectedVibe}`,
        briefText
      ),
    [customDestination, selectedVibe, briefText]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Please enter your name so our advisor knows how to address you.');
      return;
    }
    if (contact.trim().length < 5) {
      setError('Please enter a valid WhatsApp number, phone, or email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleCopy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(briefText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard fallback ignored safely
    }
  };

  return (
    <div
      className={`rounded-3xl border border-[#DCE5F2] bg-white text-[#091933] shadow-[0_28px_72px_-20px_rgba(0,0,0,0.45)] ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'
      }`}
    >
      {/* Top Progress Header */}
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#DCE5F2] pb-4">
        <div>
          <span className="font-mono-hud inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-[#0B56E8] uppercase">
            <Zap className="h-3.5 w-3.5 text-[#F5A623]" aria-hidden="true" />
            Step {step} of 2 · Fast-Track Estimate
          </span>
          <h3 className="font-display mt-0.5 text-xl font-extrabold text-[#091933] sm:text-2xl">
            {submitted
              ? 'Your Custom Brief Is Ready'
              : step === 1
                ? 'Tap Your Ideal Trip'
                : 'Where Should We Send Your Quote?'}
          </h3>
        </div>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-7 rounded-full bg-[#0B56E8]" />
          <span
            className={`h-2 w-7 rounded-full transition-colors ${
              step === 2 || submitted ? 'bg-[#F5A623]' : 'bg-[#DCE5F2]'
            }`}
          />
        </div>
      </div>

      {/* Attached Offer Pill */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#F5A623]/45 bg-[#F5A623]/12 px-3.5 py-2.5 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#091933]">
          <Sparkles className="h-4 w-4 shrink-0 text-[#0B56E8]" aria-hidden="true" />
          <span>Offer Attached: {activeOffer}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            const idx = EXCLUSIVE_OFFERS.findIndex((o) => o.tag === activeOffer);
            const next = EXCLUSIVE_OFFERS[(idx + 1) % EXCLUSIVE_OFFERS.length];
            setConciergeOfferTag(next.tag);
          }}
          className="font-mono-hud text-[10px] font-bold text-[#0B56E8] underline hover:text-[#091933]"
        >
          Switch Perk
        </button>
      </div>

      {submitted ? (
        <div className="space-y-4" role="status" aria-live="polite">
          <div className="flex items-start gap-3 rounded-2xl border border-[#F5A623]/55 bg-[#F4F7FC] p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0B56E8]" aria-hidden="true" />
            <div className="text-xs leading-relaxed text-[#3B4F6B]">
              <p className="font-bold text-[#091933]">
                Brief formatted for our {originHub.city} ({originHub.code}) advisor desk — one
                final step to send:
              </p>
              <p className="mt-1">
                Opening WhatsApp pre-fills this message —{' '}
                <strong className="text-[#091933]">
                  you must still press Send inside WhatsApp
                </strong>{' '}
                so our team receives it. Because this site runs in static hosting mode, briefs are
                not stored in a backend database yet.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href={waPayload.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-kinetic min-h-[46px] flex-1 px-5 py-3 text-xs sm:text-sm"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Open WhatsApp &amp; Press Send ({SITE.whatsappNumber})</span>
            </a>
            <a
              href={mailPayload.url}
              className="btn-outline-kinetic min-h-[46px] px-4 py-3 text-xs"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>Email Desk</span>
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="atlas-pill inline-flex min-h-[46px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-[#0B56E8]" aria-hidden="true" />
                  <span>Copy Brief</span>
                </>
              )}
            </button>
          </div>

          <pre className="font-mono-hud max-h-40 overflow-auto rounded-2xl border border-[#DCE5F2] bg-[#F4F7FC] p-3.5 text-[11px] leading-relaxed text-[#091933] whitespace-pre-wrap">
            {briefText}
          </pre>

          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setStep(1);
            }}
            className="text-xs font-semibold text-[#3B4F6B] underline hover:text-[#091933]"
          >
            Modify trip selection
          </button>
        </div>
      ) : step === 1 ? (
        <div className="space-y-5">
          {/* Quick Destination Pills */}
          <div>
            <p className="font-mono-hud mb-2 text-[10px] font-bold tracking-wider text-[#5B708D] uppercase">
              1. Pick Destination (Tap Once)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_DESTINATIONS.map((dest) => {
                const active = customDestination === dest;
                return (
                  <button
                    key={dest}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setCustomDestination(dest);
                      if (dest !== 'Surprise Me / Custom') {
                        selectDestinationByName(dest);
                      }
                    }}
                    className={`min-h-[38px] rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? 'border-[#0B56E8] bg-[#0B56E8] text-white'
                        : 'border-[#DCE5F2] bg-[#F4F7FC] text-[#091933] hover:border-[#0B56E8] hover:text-[#0B56E8]'
                    }`}
                  >
                    {dest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Travel Vibe Chips */}
          <div>
            <p className="font-mono-hud mb-2 text-[10px] font-bold tracking-wider text-[#5B708D] uppercase">
              2. Travel Vibe
            </p>
            <div className="flex flex-wrap gap-1.5">
              {VIBE_CHIPS.map((vibe) => {
                const active = selectedVibe === vibe.label;
                return (
                  <button
                    key={vibe.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedVibe(vibe.label);
                      setService(vibe.service);
                    }}
                    className={`min-h-[38px] rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? 'border-[#091933] bg-[#091933] text-white'
                        : 'border-[#DCE5F2] bg-white text-[#091933] hover:border-[#0B56E8]'
                    }`}
                  >
                    {vibe.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Size Selector */}
          <div>
            <p className="font-mono-hud mb-2 text-[10px] font-bold tracking-wider text-[#5B708D] uppercase">
              3. Group Size
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {GROUP_SIZES.map((size) => {
                const active = selection.conciergeGroupSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setConciergeGroupSize(size)}
                    className={`min-h-[42px] rounded-xl border px-2.5 py-2 text-xs font-semibold transition-colors ${
                      active
                        ? 'border-[#0B56E8] bg-[#0B56E8]/10 text-[#0B56E8]'
                        : 'border-[#DCE5F2] bg-[#F4F7FC] text-[#091933] hover:border-[#0B56E8]/50'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="btn-kinetic min-h-[50px] w-full px-6 py-3.5 text-sm"
          >
            <span>Unlock My Custom Estimate</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#F4F7FC] px-3.5 py-2.5 text-xs text-[#3B4F6B]">
            <span>
              <strong className="text-[#091933]">{customDestination}</strong> · {selectedVibe} ·{' '}
              {selection.conciergeGroupSize}
            </span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 font-bold text-[#0B56E8] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-900"
            >
              {error}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="concierge-name"
                className="font-mono-hud mb-1 block text-[10px] font-bold text-[#091933] uppercase"
              >
                Your Name *
              </label>
              <input
                id="concierge-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Mehta…"
                className="w-full rounded-xl border border-[#DCE5F2] bg-[#F4F7FC] px-3.5 py-2.5 text-sm text-[#091933] placeholder:text-[#5B708D] focus-visible:border-[#0B56E8] focus-visible:ring-2 focus-visible:ring-[#0B56E8]/25"
                required
              />
            </div>

            <div>
              <label
                htmlFor="concierge-contact"
                className="font-mono-hud mb-1 block text-[10px] font-bold text-[#091933] uppercase"
              >
                WhatsApp / Phone or Email *
              </label>
              <input
                id="concierge-contact"
                name="contact"
                type="text"
                spellCheck={false}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+91 / +971 or email…"
                className="w-full rounded-xl border border-[#DCE5F2] bg-[#F4F7FC] px-3.5 py-2.5 text-sm text-[#091933] placeholder:text-[#5B708D] focus-visible:border-[#0B56E8] focus-visible:ring-2 focus-visible:ring-[#0B56E8]/25"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="concierge-month"
              className="font-mono-hud mb-1 block text-[10px] font-bold text-[#091933] uppercase"
            >
              Rough Travel Month (Optional)
            </label>
            <input
              id="concierge-month"
              name="travelMonth"
              type="text"
              value={travelMonth}
              onChange={(e) => setTravelMonth(e.target.value)}
              placeholder="e.g. December, Next Month, Q2 Offsite…"
              className="w-full rounded-xl border border-[#DCE5F2] bg-[#F4F7FC] px-3.5 py-2.5 text-sm text-[#091933] placeholder:text-[#5B708D] focus-visible:border-[#0B56E8] focus-visible:ring-2 focus-visible:ring-[#0B56E8]/25"
            />
          </div>

          {/* Speed Handoff Toggle */}
          <fieldset>
            <legend className="font-mono-hud mb-2 text-[10px] font-bold text-[#091933] uppercase">
              Preferred Speed Handoff
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                aria-pressed={handoffChannel === 'whatsapp'}
                onClick={() => setHandoffChannel('whatsapp')}
                className={`flex min-h-[46px] items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-xs font-bold transition-colors ${
                  handoffChannel === 'whatsapp'
                    ? 'border-[#0B56E8] bg-[#0B56E8]/10 text-[#0B56E8]'
                    : 'border-[#DCE5F2] bg-white text-[#3B4F6B] hover:border-[#0B56E8]/50'
                }`}
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Send Fast Quote on WhatsApp</span>
              </button>
              <button
                type="button"
                aria-pressed={handoffChannel === 'callback'}
                onClick={() => setHandoffChannel('callback')}
                className={`flex min-h-[46px] items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-xs font-bold transition-colors ${
                  handoffChannel === 'callback'
                    ? 'border-[#0B56E8] bg-[#0B56E8]/10 text-[#0B56E8]'
                    : 'border-[#DCE5F2] bg-white text-[#3B4F6B] hover:border-[#0B56E8]/50'
                }`}
              >
                <PhoneCall className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Request Instant Callback / Email</span>
              </button>
            </div>
          </fieldset>

          <button type="submit" className="btn-kinetic min-h-[50px] w-full px-6 py-3.5 text-sm">
            <span>
              {handoffChannel === 'whatsapp'
                ? 'Generate My WhatsApp Estimate Brief'
                : 'Prepare Instant Callback & Email Brief'}
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <p className="flex items-start gap-1.5 text-[11px] leading-snug text-[#5B708D]">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0B56E8]" aria-hidden="true" />
            <span>
              Privacy-first: never share passport numbers or card details here. Quotes are prepared
              directly by our New Delhi &amp; Dubai travel specialists.
            </span>
          </p>
        </form>
      )}
    </div>
  );
}

export function FastTrackConciergeSection() {
  const { selection, setConciergeOfferTag } = useJourneySelection();
  const activeOffer = selection.conciergeOfferTag || EXCLUSIVE_OFFERS[0].tag;

  return (
    <section
      id="fast-track-concierge"
      className="relative overflow-hidden bg-[#091933] px-4 py-20 text-white sm:px-8 lg:py-28"
      aria-labelledby="concierge-heading"
    >
      {/* Subtle Cobalt & Sky Cyan Ambient Horizon Glow */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-[#0B56E8]/24 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-[#60A5FA]/14 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT COLUMN: Temptation, Exclusive Unlisted Offers & Speed Guarantee */}
          <div className="lg:col-span-6">
            <span className="font-mono-hud inline-flex items-center gap-2 rounded-full border border-[#F5A623]/40 bg-[#F5A623]/15 px-3.5 py-1 text-[11px] font-bold tracking-wider text-[#F5A623] uppercase">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Unlock Your Custom Offer · Zero Bots
            </span>

            <h2
              id="concierge-heading"
              className="font-display mt-4 text-4xl font-extrabold leading-[1.02] text-white sm:text-5xl"
            >
              Skip the 20 Tabs. Get a Custom Itinerary &amp; Desk-Only Rate in Minutes.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#DCE5F2]/88 sm:text-base">
              Why ask our desk instead of guessing with generic calculators? Tap any exclusive
              desk perk below to attach it directly to your custom estimate brief:
            </p>

            {/* 3 Clickable Exclusive Offer Teaser Cards */}
            <div className="mt-6 space-y-3" role="group" aria-label="Select exclusive desk offer">
              {EXCLUSIVE_OFFERS.map((offer) => {
                const isSelected = activeOffer === offer.tag;
                return (
                  <button
                    key={offer.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setConciergeOfferTag(offer.tag)}
                    className={`portal-focus flex w-full flex-col rounded-2xl border p-4 text-left transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 sm:p-5 ${
                      isSelected
                        ? offer.borderActive
                        : 'border-[#DCE5F2]/16 bg-[#061124]/70 hover:border-[#60A5FA]/55'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`font-mono-hud rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${offer.badgeStyle}`}
                      >
                        {offer.badge}
                      </span>
                      <span className="font-mono-hud text-[10px] font-semibold text-[#60A5FA] uppercase">
                        {isSelected ? '✓ Attached to Your Brief' : 'Tap to Attach'}
                      </span>
                    </div>
                    <h3 className="font-display mt-2.5 text-lg font-extrabold text-white">
                      {offer.tag}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#DCE5F2]/82 sm:text-sm">
                      {offer.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Speed Guarantee Strip */}
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#60A5FA]/28 bg-[#083FA8]/25 px-4 py-3.5 text-xs text-[#F4F7FC]">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5A623] text-[#091933]">
                <Zap className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="leading-relaxed">
                <strong className="text-white">Real travel specialist—not a bot.</strong> Fast
                custom estimate delivered directly on WhatsApp or Email by our New Delhi &amp;
                Dubai advisors.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Progressive 2-Step Interactive Estimate Card */}
          <div className="lg:col-span-6">
            <FastTrackConciergeCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Compact, non-intrusive floating trigger + slide-over drawer so any page or scroll
 * position gives immediate access to the Fast-Track Concierge with pre-filled context.
 */
export function ConciergeFloatingTrigger() {
  const { conciergeDrawerOpen, setConciergeDrawerOpen, openConcierge } = useJourneySelection();
  const [hiddenBySection, setHiddenBySection] = useState(true);

  // Auto-hide floating trigger whenever Hero, Destination Portals (full-width HUD),
  // or the inline Fast-Track Concierge section is in view — zero corner UI collision.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setHiddenBySection(false);
      return;
    }

    const trackedIds = ['global-atlas', 'destination-portals', 'fast-track-concierge'];
    const targets = trackedIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (targets.length === 0) {
      setHiddenBySection(false);
      return;
    }

    const visibleSet = new Set<string>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleSet.add(entry.target.id);
          else visibleSet.delete(entry.target.id);
        }
        setHiddenBySection(visibleSet.size > 0);
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!conciergeDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConciergeDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [conciergeDrawerOpen, setConciergeDrawerOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => openConcierge({ mode: 'drawer' })}
        aria-hidden={hiddenBySection}
        tabIndex={hiddenBySection ? -1 : 0}
        className={`fixed right-4 bottom-4 z-40 inline-flex min-h-[46px] items-center gap-2 rounded-full border border-[#F5A623]/60 bg-[#091933] px-4 py-2.5 text-xs font-bold text-white shadow-[0_18px_40px_-10px_rgba(9,25,51,0.55)] transition-[transform,opacity,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#0B56E8] sm:right-6 sm:bottom-6 ${
          hiddenBySection ? 'pointer-events-none translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        }`}
        aria-label="Open Fast-Track Concierge to unlock a custom travel estimate"
      >
        <span className="inline-flex h-2 w-2 rounded-full bg-[#F5A623]" aria-hidden="true" />
        <span>Unlock Desk Rate</span>
      </button>

      {conciergeDrawerOpen && (
        <div
          className="fixed inset-0 z-[75] flex justify-end bg-[#091933]/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Fast-Track Concierge Drawer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConciergeDrawerOpen(false);
          }}
        >
          <div className="overscroll-contain relative h-full w-full max-w-lg overflow-y-auto bg-[#091933] p-4 shadow-2xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono-hud text-xs font-bold tracking-wider text-[#F5A623] uppercase">
                EzyQuick Fast-Track Concierge
              </span>
              <button
                type="button"
                onClick={() => setConciergeDrawerOpen(false)}
                className="portal-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DCE5F2]/25 bg-white/10 text-white hover:border-[#F5A623] hover:text-[#F5A623]"
                aria-label="Close Fast-Track Concierge drawer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <FastTrackConciergeCard compact />
          </div>
        </div>
      )}
    </>
  );
}
