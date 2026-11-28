'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Compass, MapPin, ShieldCheck, X } from 'lucide-react';
import type { PortalDestination } from '@/data/destination-portals';

interface PortalGalleryModalProps {
  portal: PortalDestination;
  open: boolean;
  planHref: string;
  onClose: () => void;
}

export function PortalGalleryModal({
  portal,
  open,
  planHref,
  onClose,
}: PortalGalleryModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [open, onClose]);

  if (!open) return null;

  const { detail } = portal;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#091933]/80 p-4 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-gallery-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="overscroll-contain relative max-h-[88svh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#DCE5F2]/22 bg-[#091933] text-white shadow-[0_32px_90px_-16px_rgba(0,0,0,0.75)]">
        {/* Hero Frame */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={detail.image}
            alt={detail.imageAlt}
            width={960}
            height={540}
            className="h-full w-full object-cover"
            style={{ objectPosition: portal.horizonObjectPosition }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091933] via-[#091933]/20 to-transparent" />

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="portal-focus absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DCE5F2]/30 bg-[#061124]/80 text-white backdrop-blur-md transition-colors hover:border-[#F5A623] hover:text-[#F5A623]"
            aria-label={`Close ${detail.name} preview`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="font-mono-hud text-[11px] font-semibold tracking-widest text-[#60A5FA] uppercase">
                {portal.regionBadge}
              </p>
              <h3 id="portal-gallery-title" className="font-display mt-1 text-3xl font-extrabold text-white">
                {detail.name}
              </h3>
            </div>
            <span className="font-mono-hud inline-flex items-center gap-1.5 rounded-full border border-[#DCE5F2]/25 bg-[#061124]/85 px-3 py-1 text-[11px] text-[#DCE5F2]">
              <Compass className="h-3.5 w-3.5 text-[#F5A623]" aria-hidden="true" />
              {detail.coordinates}
            </span>
          </div>
        </div>

        {/* Verified Dossier Content */}
        <div className="space-y-5 p-5 sm:p-7">
          <p className="text-sm leading-relaxed text-[#DCE5F2]">{detail.editorialIntro}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#DCE5F2]/15 bg-[#061124]/70 p-3.5">
              <div className="font-mono-hud flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-[#60A5FA] uppercase">
                <Calendar className="h-3.5 w-3.5 text-[#F5A623]" aria-hidden="true" />
                Best Travel Window
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[#F4F7FC]">
                {detail.planningInfo.suggestedWindow}
              </p>
            </div>
            <div className="rounded-2xl border border-[#DCE5F2]/15 bg-[#061124]/70 p-3.5">
              <div className="font-mono-hud flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-[#60A5FA] uppercase">
                <ShieldCheck className="h-3.5 w-3.5 text-[#F5A623]" aria-hidden="true" />
                Entry &amp; Planning Notes
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[#F4F7FC]">
                {detail.planningInfo.visaAdvisory}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-mono-hud mb-2.5 text-[11px] font-semibold tracking-wider text-[#60A5FA] uppercase">
              Signature Highlights
            </h4>
            <ul className="grid gap-2 sm:grid-cols-2">
              {detail.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 rounded-xl border border-[#DCE5F2]/12 bg-[#083FA8]/20 p-2.5 text-xs text-[#F4F7FC]"
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F5A623]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DCE5F2]/15 pt-5">
            <Link
              href={`/destinations/${detail.slug}/`}
              onClick={onClose}
              className="portal-focus inline-flex items-center gap-2 rounded-full border border-[#DCE5F2]/30 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:border-[#60A5FA] hover:text-[#60A5FA]"
            >
              <span>Open Full Destination Guide</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>

            <Link
              href={planHref}
              onClick={onClose}
              className="portal-focus inline-flex items-center gap-2 rounded-full bg-[#0B56E8] px-6 py-2.5 text-xs font-semibold text-white shadow-[0_12px_28px_-8px_rgba(46,116,115,0.6)] transition-colors hover:bg-[#083FA8]"
            >
              <span>Plan This Trip</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
