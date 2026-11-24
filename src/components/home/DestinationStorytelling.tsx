'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STORYTELLING_CHAPTERS } from '@/data/site';
import { usePage } from '@/engine/next';

gsap.registerPlugin(ScrollTrigger);

export function DestinationStorytelling() {
  const [activeChapter, setActiveChapter] = useState(0);

  usePage(() => {
    const blocks = gsap.utils.toArray<HTMLElement>('[data-story-chapter]');
    if (!blocks.length) return;

    blocks.forEach((block, i) => {
      ScrollTrigger.create({
        trigger: block,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveChapter(i),
        onEnterBack: () => setActiveChapter(i),
      });
    });
  });

  const current = STORYTELLING_CHAPTERS[activeChapter];

  return (
    <section
      aria-labelledby="storytelling-heading"
      className="bg-white py-[var(--section-space)]"
    >
      <div className="site-container space-y-12 lg:space-y-16">
        <div className="max-w-3xl space-y-3">
          <p className="t-meta text-[var(--color-brand-primary-ink)]">
            Destination Journal
          </p>
          <h2
            id="storytelling-heading"
            data-split="lines"
            className="t-display text-[var(--color-text-primary)]"
          >
            Journeys shaped around light, rhythm, and real local timing.
          </h2>
        </div>

        {/* Desktop Sticky Visual Stage + Scrolling Editorial Chapters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Sticky Photography Stage (Desktop) */}
          <div className="hidden lg:block lg:col-span-6 sticky top-28">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-bg-dark)]">
              {STORYTELLING_CHAPTERS.map((ch, idx) => {
                const isShown = idx === activeChapter;
                return (
                  <div
                    key={ch.id}
                    aria-hidden={!isShown}
                    className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${
                      isShown ? 'opacity-100 scale-100 z-[1]' : 'opacity-0 scale-105 z-0 pointer-events-none'
                    }`}
                  >
                    <Image
                      src={ch.image}
                      alt={ch.alt}
                      fill
                      sizes="48vw"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(8,20,38,0.22) 0%, rgba(8,20,38,0) 45%, rgba(8,20,38,0.74) 100%)',
                      }}
                    />
                  </div>
                );
              })}

              <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-white/95 tabular-nums z-10">
                <span>{current.region}</span>
                <span>{current.coordinates}</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  {STORYTELLING_CHAPTERS.map((ch, idx) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setActiveChapter(idx)}
                      aria-label={`View ${ch.region} chapter`}
                      className={`h-1.5 transition-all duration-300 ${
                        idx === activeChapter
                          ? 'w-10 bg-[var(--color-brand-secondary)]'
                          : 'w-4 bg-white/45 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
                <span className="t-meta text-white/95">
                  0{activeChapter + 1} / 0{STORYTELLING_CHAPTERS.length}
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Chapters */}
          <div className="lg:col-span-6 space-y-12 lg:space-y-0">
            {STORYTELLING_CHAPTERS.map((chapter, idx) => {
              const isActive = idx === activeChapter;
              return (
                <article
                  key={chapter.id}
                  data-story-chapter
                  className={`lg:min-h-[68vh] flex flex-col justify-center gap-6 py-4 lg:py-16 lg:pl-7 border-b border-[var(--color-border)] last:border-b-0 lg:border-l-2 transition-colors duration-300 ${
                    isActive
                      ? 'lg:border-l-[var(--color-brand-primary)]'
                      : 'lg:border-l-transparent'
                  }`}
                >
                  {/* Mobile / Tablet Inline Visual Plate */}
                  <div className="lg:hidden relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-bg-dark)]">
                    <Image
                      src={chapter.image}
                      alt={chapter.alt}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <p className="t-meta text-[var(--color-brand-primary-ink)]">
                      0{idx + 1} · {chapter.region} · {chapter.coordinates}
                    </p>
                    <h3 className="font-display text-3xl sm:text-5xl leading-[1.06] text-[var(--color-text-primary)]">
                      {chapter.title}
                    </h3>
                    <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
                      {chapter.caption}
                    </p>
                    <p className="text-sm text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] border-l-2 border-[var(--color-brand-primary)] px-4 py-3">
                      {chapter.note}
                    </p>
                  </div>

                  <div>
                    <Link
                      href={`/destinations/${chapter.slug}`}
                      className="btn-ezy btn-outline !min-h-[44px]"
                    >
                      <span>Read {chapter.slug === 'dubai' ? 'Dubai' : chapter.slug === 'kerala' ? 'Kerala' : 'Ladakh'} dossier</span>
                      <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
