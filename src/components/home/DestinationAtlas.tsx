'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FEATURED_HOME_DESTINATIONS } from '@/data/destinations';
import { usePage } from '@/engine/next';
import { prefersReducedMotion } from '@/engine';

gsap.registerPlugin(ScrollTrigger);

export function DestinationAtlas() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = FEATURED_HOME_DESTINATIONS.length;

  usePage(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(max-width: 1023px)').matches) return;

    const wrap = document.querySelector<HTMLElement>('[data-atlas-pin]');
    const track = document.querySelector<HTMLElement>('[data-atlas-track]');
    const bar = document.querySelector<HTMLElement>('[data-atlas-progress]');
    if (!wrap || !track) return;

    const getDist = () => Math.max(track.scrollWidth - window.innerWidth + 128, 0);

    gsap.to(track, {
      x: () => -getDist(),
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        start: 'top top',
        end: () => `+=${Math.max(getDist(), 600)}`,
        pin: true,
        scrub: 0.85,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.min(total - 1, Math.floor(self.progress * total));
          setActiveIndex(idx);
          if (bar) {
            bar.style.transform = `scaleX(${Math.max(0.08, self.progress)})`;
          }
        },
      },
    });
  });

  return (
    <section
      data-atlas-pin
      aria-labelledby="featured-destinations-heading"
      className="relative bg-white border-y border-[var(--color-border)] py-16 lg:py-0 lg:min-h-[100svh] lg:flex lg:flex-col lg:justify-center overflow-hidden"
    >
      {/* Top Editorial Header */}
      <div className="site-container mb-8 lg:mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <p className="t-meta text-[var(--color-brand-primary-ink)]">
            Curated Destination Atlas
          </p>
          <h2
            id="featured-destinations-heading"
            data-split="lines"
            className="t-display text-[var(--color-text-primary)]"
          >
            Places that stay with you.
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-5 lg:gap-8">
          <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">
            From our Gulf hub in Dubai and Abu Dhabi to Southeast Asian islands and India’s
            backwaters and high passes.
          </p>
          <Link href="/destinations" className="btn-ezy btn-outline !min-h-[44px] shrink-0">
            <span>All 14 Destinations</span>
            <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Desktop Horizontal Track / Mobile Native Swipe Snap */}
      <div className="w-full overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory">
        <div
          data-atlas-track
          className="flex items-end gap-6 lg:gap-8 px-[var(--gutter)] pb-4 lg:pb-0 w-max"
        >
          {FEATURED_HOME_DESTINATIONS.map((dest, i) => {
            // Deliberate editorial asymmetry: alternating aspect proportions
            const tall = i % 2 === 0;
            return (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                className={`group snap-start shrink-0 flex flex-col justify-between ${
                  tall
                    ? 'w-[78vw] sm:w-[46vw] lg:w-[27vw] xl:w-[24vw]'
                    : 'w-[82vw] sm:w-[52vw] lg:w-[33vw] xl:w-[30vw]'
                }`}
              >
                <div
                  className={`media-frame w-full bg-[var(--color-bg-dark)] ${
                    tall ? 'aspect-[4/5]' : 'aspect-[16/11]'
                  }`}
                >
                  <Image
                    src={dest.image}
                    alt={dest.imageAlt}
                    fill
                    sizes="(max-width: 768px) 82vw, 33vw"
                    className="object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(8,20,38,0.12) 0%, rgba(8,20,38,0.0) 45%, rgba(8,20,38,0.68) 100%)',
                    }}
                  />
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-semibold tracking-[0.12em] uppercase text-white/90 tabular-nums">
                    <span>{dest.country}</span>
                    <span className="bg-[#081426]/65 backdrop-blur-sm px-2.5 py-1 rounded-[2px]">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <span className="text-xs text-white/80 tabular-nums">{dest.coordinates}</span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--color-bg-dark)] transition-transform duration-300 group-hover:bg-[var(--color-brand-primary)] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-3xl text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary-ink)] transition-colors">
                      {dest.name}
                    </h3>
                    <span className="t-meta text-[var(--color-text-muted)]">{dest.region}</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                    {dest.shortDescription}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Telemetry Progress Hairline */}
      <div className="site-container mt-8 hidden lg:flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-xs tabular-nums">
          <span className="font-semibold text-[var(--color-brand-primary-ink)]">
            0{activeIndex + 1} / 0{total}
          </span>
          <span className="text-[var(--color-text-muted)]">
            {FEATURED_HOME_DESTINATIONS[activeIndex]?.name} —{' '}
            {FEATURED_HOME_DESTINATIONS[activeIndex]?.country}
          </span>
        </div>
        <div className="h-[2px] w-64 bg-[var(--color-border)] overflow-hidden">
          <div
            data-atlas-progress
            className="h-full w-full origin-left bg-[var(--color-brand-primary)]"
            style={{ transform: 'scaleX(0.14)' }}
          />
        </div>
      </div>
    </section>
  );
}
