'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SITE } from '@/data/site';
import { assetPath } from '@/lib/asset-path';
import { usePage } from '@/engine/next';
import { prefersReducedMotion, scrollToTarget } from '@/engine';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  usePage(() => {
    if (prefersReducedMotion()) return;
    const media = document.querySelector<HTMLElement>('[data-hero-parallax]');
    if (!media) return;

    gsap.to(media, {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: {
        trigger: '[data-hero-stage]',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  return (
    <section
      data-hero-stage
      className="relative min-h-[94svh] w-full flex flex-col justify-end overflow-hidden bg-[var(--color-bg-dark)] text-[var(--color-text-on-dark)] pt-28 pb-8 sm:pb-10"
    >
      {/* Full-Bleed Cinematic Photography with Ambient Breath & Scroll Depth */}
      <div
        data-hero-parallax
        className="pointer-events-none absolute inset-0 -top-[8%] -bottom-[8%]"
        aria-hidden="true"
      >
        <Image
          src={assetPath('/images/hero/main-hero.jpg')}
          alt="Dubai skyline bathed in golden twilight light"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center hero-ambient"
        />
        {/* Multi-stop editorial scrim ensuring WCAG AA/AAA text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,20,38,0.62) 0%, rgba(8,20,38,0.28) 38%, rgba(8,20,38,0.72) 76%, rgba(8,20,38,0.92) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(8,20,38,0.68) 0%, rgba(8,20,38,0.25) 55%, rgba(8,20,38,0.08) 100%)',
          }}
        />
      </div>

      {/* Foreground Composition */}
      <div className="site-container relative z-10 flex flex-col gap-10 lg:gap-14">
        <div className="max-w-4xl space-y-6">
          <div
            data-reveal="fade"
            data-intro
            className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-secondary)]"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-brand-primary)] ring-2 ring-[var(--color-brand-secondary)]/50" />
            <span>New Delhi &amp; Dubai · International Travel Desk</span>
          </div>

          <h1
            data-split="lines"
            data-intro
            className="t-hero text-white max-w-[14ch]"
          >
            {SITE.heroHeadline}
          </h1>

          <p
            data-reveal="up"
            data-intro
            data-delay="0.16"
            className="text-base sm:text-lg lg:text-xl text-white/88 max-w-2xl leading-relaxed font-normal"
          >
            {SITE.heroSubheadline}
          </p>

          <div
            data-reveal="up"
            data-intro
            data-delay="0.26"
            className="flex flex-wrap items-center gap-3.5 pt-2"
          >
            <Link href="/contact#enquiry" className="btn-ezy btn-light">
              <span>Plan Your Journey</span>
              <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/destinations" className="btn-ezy btn-outline-light">
              <span>Explore Destinations</span>
              <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Bottom Gateway Telemetry Strip */}
        <div className="pt-6 border-t border-white/18 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-white/75">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 tabular-nums tracking-[0.1em] uppercase">
            <span className="text-white font-semibold">{SITE.corridorLabel}</span>
            <span>Corporate · Medical · Leisure · Visas · Flights · Stays</span>
          </div>

          <button
            type="button"
            onClick={() => scrollToTarget('#brand-introduction')}
            className="inline-flex items-center gap-2 self-start sm:self-auto text-xs font-semibold uppercase tracking-[0.12em] text-white/85 hover:text-[var(--color-brand-secondary)] transition-colors"
          >
            <span>Scroll to discover</span>
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
