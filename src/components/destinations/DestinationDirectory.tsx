'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import { REGION_FILTERS, type AtlasRegionFilter } from '@/data/atlas';

export function DestinationDirectory() {
  const [region, setRegion] = useState<AtlasRegionFilter>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DESTINATIONS.filter((dest) => {
      const matchesRegion = region === 'All' || dest.subregion === region;
      if (!matchesRegion) return false;
      if (!q) return true;
      return (
        dest.name.toLowerCase().includes(q) ||
        dest.country.toLowerCase().includes(q) ||
        dest.subregion.toLowerCase().includes(q) ||
        dest.shortDescription.toLowerCase().includes(q) ||
        dest.planningInfo.idealStyles.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [region, query]);

  return (
    <div id="destination-directory" className="space-y-8">
      {/* Search & Region Filter Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-[#091933]/12 bg-[#FFFFFF] p-4 sm:p-5 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter destination list">
          {REGION_FILTERS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              className={`atlas-pill rounded-full px-3.5 py-2 text-xs font-semibold ${
                region === r ? 'atlas-pill-active' : ''
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#5B708D]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destination, country, style…"
            aria-label="Search destinations"
            className="w-full rounded-full border border-[#091933]/16 bg-white py-2.5 pr-4 pl-10 text-sm text-[#091933] placeholder:text-[#5B708D] focus-visible:border-[#0B56E8] focus-visible:ring-2 focus-visible:ring-[#0B56E8]/25"
          />
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-[#091933]/12 bg-[#FFFFFF] p-10 text-center">
          <p className="font-display text-xl font-bold text-[#091933]">No destinations matched your filter.</p>
          <button
            type="button"
            onClick={() => {
              setRegion('All');
              setQuery('');
            }}
            className="btn-outline-kinetic mt-4 px-5 py-2.5 text-xs"
          >
            <span>Show all 14 destinations</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dest) => (
            <article key={dest.slug} className="studio-card flex flex-col overflow-hidden rounded-3xl">
              <Link href={`/destinations/${dest.slug}/`} className="img-frame relative block aspect-[16/10]">
                <img
                  src={dest.image}
                  alt={dest.imageAlt}
                  width={640}
                  height={400}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <span className="font-mono-hud absolute top-3 left-3 rounded-full bg-[#091933]/85 px-3 py-1 text-[10px] font-semibold text-[#FFFFFF]">
                  {dest.subregion}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl font-bold text-[#091933]">
                    <Link href={`/destinations/${dest.slug}/`} className="hover:text-[#0B56E8]">
                      {dest.name}
                    </Link>
                  </h3>
                  <span className="font-mono-hud text-[11px] text-[#5B708D]">{dest.country}</span>
                </div>

                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#3B4F6B]">
                  {dest.shortDescription}
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-[#091933]/10 pt-4">
                  {dest.highlights.slice(0, 2).map((h) => (
                    <li key={h} className="flex items-start gap-2 text-xs text-[#091933]">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0B56E8]" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#091933]/10 pt-4">
                  <Link
                    href={`/destinations/${dest.slug}/`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#091933] hover:text-[#0B56E8]"
                  >
                    <span>Explore guide</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href={`/plan-your-journey/?destination=${encodeURIComponent(dest.name)}`}
                    className="rounded-full bg-[#DCE5F2] px-3.5 py-1.5 text-xs font-semibold text-[#091933] transition-colors hover:bg-[#0B56E8] hover:text-white"
                  >
                    Plan This Journey
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
