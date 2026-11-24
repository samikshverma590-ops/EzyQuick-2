'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '@/data/services';

export function ServicesDossier() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = SERVICES[activeIndex];

  return (
    <section
      id="services"
      aria-labelledby="services-dossier-heading"
      className="bg-[var(--color-bg-primary)] py-[var(--section-space)]"
    >
      <div className="site-container space-y-12 lg:space-y-16">
        {/* Heading Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7 space-y-3">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">
              Nine Travel Disciplines
            </p>
            <h2
              id="services-dossier-heading"
              data-split="lines"
              className="t-display text-[var(--color-text-primary)]"
            >
              Travel, in every form it takes.
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] lg:text-right max-w-md">
              Explore all nine services arranged by EzyQuick—each backed by its own detailed scope,
              planning guidance, and direct enquiry pathway.
            </p>
            <Link href="/services" className="editorial-link text-sm text-[var(--color-text-primary)]">
              <span>View full service directory</span>
              <ArrowUpRight className="link-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Desktop Split-Screen Editorial Index (Zero Boring Identical Icon Cards) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Sticky Editorial Visual Stage */}
          <div className="lg:col-span-5 sticky top-28 space-y-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-bg-dark)]">
              {SERVICES.map((svc, idx) => {
                const isShown = idx === activeIndex;
                return (
                  <div
                    key={svc.slug}
                    aria-hidden={!isShown}
                    className={`absolute inset-0 transition-[opacity,transform] duration-500 ease-out ${
                      isShown ? 'opacity-100 scale-100 z-[1]' : 'opacity-0 scale-105 z-0 pointer-events-none'
                    }`}
                  >
                    <Image
                      src={svc.image}
                      alt={svc.imageAlt}
                      fill
                      sizes="42vw"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(8,20,38,0.12) 0%, rgba(8,20,38,0.08) 45%, rgba(8,20,38,0.86) 100%)',
                      }}
                    />
                  </div>
                );
              })}

              <div className="absolute inset-x-0 bottom-0 p-7 text-white space-y-3 z-10">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em]">
                  <span className="text-[var(--color-brand-secondary)] font-semibold">
                    {current.index} · {current.shortLabel}
                  </span>
                  <span className="text-white/75">{current.category}</span>
                </div>
                <p className="font-display text-3xl leading-tight">{current.headline}</p>
                <p className="text-sm text-white/82 leading-relaxed">{current.summary}</p>
                <div className="pt-2">
                  <Link
                    href={`/services/${current.slug}`}
                    className="btn-ezy btn-light !min-h-[42px] !px-5 !py-2"
                  >
                    <span>Explore {current.name}</span>
                    <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Numbered Editorial Service Ledger */}
          <div className="lg:col-span-7 border-t border-[var(--color-border-strong)]">
            {SERVICES.map((service, idx) => {
              const isActive = idx === activeIndex;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  className={`group flex items-center justify-between gap-6 py-5 px-4 -mx-4 border-b border-[var(--color-border)] transition-colors duration-300 ${
                    isActive
                      ? 'bg-white shadow-[0_6px_26px_rgba(8,20,38,0.04)]'
                      : 'hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-baseline gap-6 min-w-0">
                    <span
                      className={`t-meta w-8 shrink-0 transition-colors ${
                        isActive
                          ? 'text-[var(--color-brand-primary)]'
                          : 'text-[var(--color-text-muted)]'
                      }`}
                    >
                      {service.index}
                    </span>
                    <div className="min-w-0 space-y-1">
                      <h3
                        className={`font-display text-3xl xl:text-[2.15rem] leading-none transition-transform duration-300 ${
                          isActive
                            ? 'text-[var(--color-text-primary)] translate-x-1.5'
                            : 'text-[var(--color-text-primary)]/85'
                        }`}
                      >
                        {service.name}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)] truncate max-w-lg">
                        {service.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden xl:inline-block text-xs uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                      {service.shortLabel}
                    </span>
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                        isActive
                          ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] text-white translate-x-0.5 -translate-y-0.5'
                          : 'border-[var(--color-border-strong)] text-[var(--color-text-primary)]'
                      }`}
                    >
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile & Tablet Deliberate Editorial Card Stack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-5">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group bg-white border border-[var(--color-border)] overflow-hidden flex flex-col"
            >
              <div className="media-frame relative aspect-[16/10] w-full bg-[var(--color-bg-dark)]">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-white/95 text-[var(--color-brand-primary-ink)] px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase tabular-nums">
                  {service.index} · {service.shortLabel}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <h3 className="font-display text-2xl text-[var(--color-text-primary)]">
                    {service.name}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {service.tagline}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-brand-primary-ink)]">
                  <span>View service details</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
