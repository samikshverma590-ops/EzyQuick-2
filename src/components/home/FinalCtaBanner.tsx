'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { buildSafeWhatsAppUrl, SITE } from '@/data/site';
import { useJourneySelection } from '@/lib/journey-selection';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function FinalCtaBanner() {
  const reducedMotion = useReducedMotion();
  const { openConcierge } = useJourneySelection();
  const magBtnRef = useRef<HTMLButtonElement>(null);

  const { url: whatsappUrl } = buildSafeWhatsAppUrl(
    'Hello EzyQuick, I would like a fast custom travel estimate.'
  );

  // Desktop-only magnetic hover button via GSAP quickTo (disabled on touch & reduced motion)
  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const btn = magBtnRef.current;
    if (!btn) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * 0.22);
      yTo(relY * 0.28);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, [reducedMotion]);

  return (
    <section
      id="final-cta"
      className="bg-[#F4F7FC] px-4 py-16 sm:px-8 lg:py-24"
      aria-labelledby="final-cta-heading"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#F5A623]/35 bg-gradient-to-br from-[#091933] via-[#1E4D4F] to-[#0054FC]/85 px-6 py-14 text-[#FFFFFF] shadow-[0_32px_80px_-24px_rgba(24,44,53,0.5)] sm:px-12 sm:py-20 lg:px-16">
          {/* Atmospheric Warm Champagne Glow */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[34rem] -translate-x-1/2 rounded-full bg-[#F5A623]/22 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <span className="font-mono-hud inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] text-[#F5A623] uppercase backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              New Delhi &amp; Dubai · Desk Ready
            </span>

            <h2
              id="final-cta-heading"
              className="font-display mt-5 text-4xl font-extrabold leading-[0.98] tracking-tight text-white sm:text-6xl"
            >
              Where Will You Wake Up Next?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#DCE5F2] sm:text-base">
              Tell our travel specialists your destination or corporate brief in 2 minutes and unlock
              curated routing, visa readiness, and unpublished desk rates.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <button
                ref={magBtnRef}
                type="button"
                onClick={() => openConcierge({ mode: 'scroll' })}
                className="portal-focus inline-flex min-h-[54px] items-center gap-2.5 rounded-full bg-[#F5A623] px-8 py-3.5 text-sm font-extrabold text-[#091933] shadow-[0_18px_40px_-10px_rgba(198,161,107,0.55)] transition-colors hover:bg-white"
              >
                <span>Unlock My Custom Estimate</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="portal-focus inline-flex min-h-[54px] items-center gap-2 rounded-full border border-white/30 bg-[#091933]/45 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-[#60A5FA] hover:bg-[#091933]/75"
              >
                <MessageCircle className="h-4 w-4 text-[#60A5FA]" aria-hidden="true" />
                <span>WhatsApp ({SITE.whatsappNumber})</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
