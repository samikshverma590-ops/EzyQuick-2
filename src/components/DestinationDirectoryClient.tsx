'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { Destination } from '@/data/destinations';

interface Props {
  destinations: Destination[];
}

const FILTERS = ['All', 'International', 'India'] as const;

export function DestinationDirectoryClient({ destinations }: Props) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const filtered =
    filter === 'All'
      ? destinations
      : destinations.filter((d) => d.region === filter);

  return (
    <div className="space-y-10">
      {/* Filter Controls */}
      <div
        role="tablist"
        aria-label="Filter destinations by region"
        className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] pb-5"
      >
        {FILTERS.map((tab) => {
          const active = filter === tab;
          const count =
            tab === 'All'
              ? destinations.length
              : destinations.filter((d) => d.region === tab).length;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(tab)}
              className={`relative px-5 py-2.5 text-sm font-semibold rounded-[2px] transition-colors ${
                active
                  ? 'bg-[var(--color-bg-dark)] text-white'
                  : 'bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <span>{tab}</span>
              <span className="ml-2 text-xs opacity-75 tabular-nums">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Editorial Asymmetric Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {filtered.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="group bg-white border border-[var(--color-border)] overflow-hidden flex flex-col justify-between"
            >
              <div className="media-frame relative aspect-[4/3] w-full bg-[var(--color-bg-dark)]">
                <Image
                  src={dest.image}
                  alt={dest.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(8,20,38,0.12) 0%, rgba(8,20,38,0) 45%, rgba(8,20,38,0.62) 100%)',
                  }}
                />
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  <span className="bg-[#081426]/65 backdrop-blur-sm px-2.5 py-1 rounded-[2px]">
                    {dest.region}
                  </span>
                  <span className="tabular-nums opacity-90">{dest.country}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs text-[var(--color-text-muted)] tabular-nums">
                    {dest.coordinates}
                  </p>
                  <h2 className="font-display text-3xl text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary-ink)] transition-colors">
                    {dest.name}
                  </h2>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {dest.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-brand-primary-ink)]">
                  <span>View destination guide</span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
