'use client';

import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '@/data/site';

export function WhatsAppDock() {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with EzyQuick on WhatsApp"
      className="group fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2.5 rounded-full bg-[#0D7C56] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(8,20,38,0.22)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand-primary)]"
    >
      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp Desk</span>
    </a>
  );
}
