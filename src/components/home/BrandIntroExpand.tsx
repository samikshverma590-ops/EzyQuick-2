'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePage } from '@/engine/next';
import { prefersReducedMotion, isMobile } from '@/engine';

gsap.registerPlugin(ScrollTrigger);

export function BrandIntroExpand() {
  usePage(() => {
    if (prefersReducedMotion() || isMobile()) return;
    const frame = document.querySelector<HTMLElement>('[data-expand-frame]');
    const img = document.querySelector<HTMLElement>('[data-expand-img]');
    if (!frame || !img) return;

    gsap.fromTo(
      frame,
      { clipPath: 'inset(6% 9% 6% 9% round 4px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: frame,
          start: 'top 85%',
          end: 'top 20%',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      }
    );

    gsap.fromTo(
      img,
      { scale: 1.12 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: frame,
          start: 'top 85%',
          end: 'bottom top',
          scrub: 0.7,
        },
      }
    );
  });

  return (
    <section
      id="brand-introduction"
      className="bg-[var(--color-bg-primary)] py-[var(--section-space)]"
    >
      <div className="site-container space-y-14 lg:space-y-20">
        {/* Asymmetric Editorial Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7 space-y-5">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">
              Travel Beyond the Ordinary
            </p>
            <h2
              data-split="lines"
              className="t-display text-[var(--color-text-primary)] max-w-[16ch]"
            >
              One calm desk for every moving part of your journey.
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-6 lg:pb-2">
            <p
              data-reveal="up"
              className="text-[var(--color-text-secondary)] text-base sm:text-lg leading-relaxed"
            >
              Modern travel rarely stops at a single flight ticket. Between visa documentation,
              hotel neighbourhoods, airport transfers, foreign exchange, and shifting business or
              family timelines, EzyQuick brings nine specialised travel services into one coherent
              plan from our New Delhi and Dubai desks.
            </p>
            <div data-reveal="up" data-delay="0.1" className="flex flex-wrap items-center gap-6">
              <Link href="/about" className="editorial-link text-sm text-[var(--color-text-primary)]">
                <span>About EzyQuick</span>
                <ArrowUpRight className="link-arrow h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/services" className="editorial-link text-sm text-[var(--color-text-primary)]">
                <span>Browse all nine services</span>
                <ArrowUpRight className="link-arrow h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll-Driven Expanding Cinematic Frame */}
        <div
          data-expand-frame
          className="relative aspect-[16/10] sm:aspect-[21/10] w-full overflow-hidden bg-[var(--color-bg-dark)]"
        >
          <div data-expand-img className="relative h-full w-full">
            <Image
              src="/images/editorial/expanding-frame.jpg"
              alt="Wooden boat bow facing tranquil emerald alpine waters and mountains"
              fill
              sizes="(max-width: 768px) 100vw, 92vw"
              className="object-cover"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(8,20,38,0) 45%, rgba(8,20,38,0.72) 100%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <p className="font-display text-2xl sm:text-4xl max-w-xl leading-tight">
              Whether you are crossing continents for work, care, or unhurried discovery—we
              sequence the details before you pack.
            </p>
            <span className="t-meta text-[var(--color-brand-secondary)] shrink-0">
              EzyQuick · Travel Made Easy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
