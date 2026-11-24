'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { APPROACH_CHAPTERS } from '@/data/site';
import { usePage } from '@/engine/next';
import { prefersReducedMotion } from '@/engine';

gsap.registerPlugin(ScrollTrigger);

export function ApproachMeridian() {
  usePage(() => {
    if (prefersReducedMotion()) return;
    const path = document.querySelector<SVGPathElement>('[data-meridian-path]');
    const section = document.querySelector<HTMLElement>('[data-meridian-section]');
    if (!path || !section) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 72%',
        end: 'bottom 78%',
        scrub: 0.7,
      },
    });
  });

  return (
    <section
      data-meridian-section
      aria-labelledby="approach-heading"
      className="bg-[var(--color-bg-secondary)] border-y border-[var(--color-border)] py-[var(--section-space)] overflow-hidden"
    >
      <div className="site-container space-y-12 lg:space-y-16">
        {/* Top Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">
              The EzyQuick Approach
            </p>
            <h2
              id="approach-heading"
              data-split="lines"
              className="t-display text-[var(--color-text-primary)] max-w-[16ch]"
            >
              Four quiet chapters from first enquiry to arrival.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-md">
            Every journey follows one disciplined meridian—linking New Delhi and Dubai into a
            predictable, human-led itinerary sequence.
          </p>
        </div>

        {/* SVG Scroll-Drawn Meridian Route (Desktop & Tablet) */}
        <div className="relative pt-2" aria-hidden="true">
          <svg
            viewBox="0 0 1200 72"
            fill="none"
            className="w-full h-14 sm:h-16"
            preserveAspectRatio="none"
          >
            {/* Base hairline guide */}
            <path
              d="M 20 36 C 220 10, 380 62, 600 36 C 820 10, 980 62, 1180 36"
              stroke="#D2CFC6"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
            {/* Active scroll-drawn Official Cobalt route */}
            <path
              data-meridian-path
              d="M 20 36 C 220 10, 380 62, 600 36 C 820 10, 980 62, 1180 36"
              stroke="#0059FD"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Waypoint beacons in Official Solar Gold + Cobalt ring */}
            {[20, 410, 790, 1180].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy={36} r="8" fill="#F7F6F2" stroke="#0059FD" strokeWidth="2" />
                <circle cx={cx} cy={36} r="3.5" fill="#FDBC03" />
              </g>
            ))}
          </svg>
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)] tabular-nums -mt-1">
            <span>DEL · 28.65°N</span>
            <span className="hidden sm:inline">Single Point of Contact</span>
            <span>DXB · 25.12°N</span>
          </div>
        </div>

        {/* Four Sequential Chapters */}
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {APPROACH_CHAPTERS.map((chapter, idx) => (
            <li
              key={chapter.index}
              data-reveal="up"
              data-delay={String(idx * 0.08)}
              className="bg-white border border-[var(--color-border)] p-6 sm:p-7 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                  <span className="t-meta text-[var(--color-brand-primary-ink)]">
                    {chapter.index} / {chapter.code}
                  </span>
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-[var(--color-brand-secondary)] ring-2 ring-[var(--color-brand-primary)]/20"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-display text-3xl sm:text-4xl text-[var(--color-text-primary)]">
                  {chapter.title}
                </h3>
                <p className="text-sm font-medium text-[var(--color-text-primary)] leading-relaxed">
                  {chapter.summary}
                </p>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {chapter.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
