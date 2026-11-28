'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, ArrowUpRight, LockOpen, MapPin, Sparkles } from 'lucide-react';
import { DESTINATIONS, type DestinationDetail } from '@/data/destinations';
import { useJourneySelection } from '@/lib/journey-selection';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type CollectionFilter = 'all' | 'trending' | 'luxury' | 'india' | 'visa-easy';

const COLLECTION_PILLS: { id: CollectionFilter; label: string }[] = [
  { id: 'all', label: 'All (14)' },
  { id: 'trending', label: 'Trending International' },
  { id: 'luxury', label: 'Luxury & Islands' },
  { id: 'india', label: 'India Escapes' },
  { id: 'visa-easy', label: 'Visa-Easy / Fast Getaways' },
];

interface DestinationHookMeta {
  hook: string;
  offerTag: string;
  collections: Exclude<CollectionFilter, 'all'>[];
  featuredSpan?: boolean;
}

const HOOK_META: Record<string, DestinationHookMeta> = {
  dubai: {
    hook: 'Express UAE Visa + Direct Flights',
    offerTag: 'Fast-Track Visa + Zero-Stress Bundling',
    collections: ['trending', 'luxury', 'visa-easy'],
    featuredSpan: true,
  },
  bali: {
    hook: '5-Night Private Pool Villa Perks',
    offerTag: 'Unlisted Hotel & Flight Desk Rates',
    collections: ['trending', 'luxury', 'visa-easy'],
    featuredSpan: true,
  },
  'abu-dhabi': {
    hook: 'Saadiyat Luxury + Twin-Emirate Pairing',
    offerTag: 'Unlisted Hotel & Flight Desk Rates',
    collections: ['trending', 'luxury', 'visa-easy'],
  },
  'phu-quoc': {
    hook: 'Vietnam Island Calm + Sunset Resorts',
    offerTag: 'Unlisted Hotel & Flight Desk Rates',
    collections: ['trending', 'luxury', 'visa-easy'],
  },
  phuket: {
    hook: 'Andaman Bay Resorts + Boat Charters',
    offerTag: 'Unlisted Hotel & Flight Desk Rates',
    collections: ['trending', 'luxury', 'visa-easy'],
  },
  krabi: {
    hook: 'Limestone Cliff Coves + Railay Stays',
    offerTag: 'Unlisted Hotel & Flight Desk Rates',
    collections: ['trending', 'luxury', 'visa-easy'],
  },
  singapore: {
    hook: 'Curated B2B Retreat & Family City Break',
    offerTag: 'Corporate & Group Priority Desk',
    collections: ['trending', 'luxury'],
  },
  malaysia: {
    hook: 'Kuala Lumpur Skyline + Langkawi Coves',
    offerTag: 'Fast-Track Visa + Zero-Stress Bundling',
    collections: ['trending', 'visa-easy'],
  },
  'sri-lanka': {
    hook: 'Private Chauffeur Highlands-to-Coast Circuit',
    offerTag: 'Fast-Track Visa + Zero-Stress Bundling',
    collections: ['trending', 'visa-easy'],
  },
  almaty: {
    hook: 'Short-Haul Alpine Peaks + Lake Passes',
    offerTag: 'Fast-Track Visa + Zero-Stress Bundling',
    collections: ['trending', 'visa-easy'],
  },
  kerala: {
    hook: 'Private Backwater Houseboats + Munnar Tea',
    offerTag: 'Unlisted Hotel & Flight Desk Rates',
    collections: ['india', 'luxury', 'visa-easy'],
  },
  goa: {
    hook: 'South Goa Beachfront Villas & Offsites',
    offerTag: 'Corporate & Group Priority Desk',
    collections: ['india', 'luxury', 'visa-easy'],
  },
  'andaman-nicobar': {
    hook: 'Havelock Coral Reefs + Inter-Island Ferries',
    offerTag: 'Unlisted Hotel & Flight Desk Rates',
    collections: ['india', 'luxury', 'visa-easy'],
  },
  ladakh: {
    hook: 'Acclimatised Himalayan Passes & Pangong',
    offerTag: 'Unlisted Hotel & Flight Desk Rates',
    collections: ['india', 'visa-easy'],
  },
};

export function DestinationCollectionsSection() {
  const [filter, setFilter] = useState<CollectionFilter>('all');
  const [cursorVisible, setCursorVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const { openConcierge, selectDestinationBySlug } = useJourneySelection();

  const gridRef = useRef<HTMLDivElement>(null);
  const cursorPillRef = useRef<HTMLDivElement>(null);
  const quickXRef = useRef<gsap.QuickToFunc | null>(null);
  const quickYRef = useRef<gsap.QuickToFunc | null>(null);

  const visibleDestinations = useMemo(() => {
    if (filter === 'all') return DESTINATIONS;
    return DESTINATIONS.filter((d) => HOOK_META[d.slug]?.collections.includes(filter));
  }, [filter]);

  // Smooth desktop-only cursor-following "Explore ->" preview pill via gsap.quickTo
  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const pill = cursorPillRef.current;
    if (!pill) return;

    quickXRef.current = gsap.quickTo(pill, 'x', { duration: 0.25, ease: 'power3.out' });
    quickYRef.current = gsap.quickTo(pill, 'y', { duration: 0.25, ease: 'power3.out' });
  }, [reducedMotion]);

  const handleGridPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType !== 'mouse' || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    quickXRef.current?.(e.clientX - rect.left + 14);
    quickYRef.current?.(e.clientY - rect.top - 18);
  };

  const handleUnlockRate = (dest: DestinationDetail, offerTag: string) => {
    selectDestinationBySlug(dest.slug);
    openConcierge({
      destination: dest.name,
      offerTag,
      service: dest.planningInfo.idealStyles.some((s) => s.toLowerCase().includes('corporate'))
        ? 'Corporate Travel'
        : 'Leisure Travel',
      mode: 'scroll',
    });
  };

  return (
    <section
      id="destination-collections"
      className="bg-[#F4F7FC] px-4 py-20 sm:px-8 lg:py-28"
      aria-labelledby="collections-heading"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Header + Filter Pills */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[#DCE5F2] pb-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="font-mono-hud text-xs font-semibold tracking-[0.18em] text-[#0B56E8] uppercase">
              Wanderlust Collections · 14 Verified Places
            </p>
            <h2
              id="collections-heading"
              className="font-display mt-2.5 text-4xl font-extrabold leading-[1.02] text-[#091933] sm:text-5xl"
            >
              Hand-picked corridors—with desk-only perks.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#3B4F6B] sm:text-base">
              Skip generic portal estimates. Tap any destination to unlock unpublished hotel,
              flight, and visa-bundle rates directly from our advisors.
            </p>
          </div>

          <Link href="/destinations/" className="btn-outline-kinetic self-start px-5 py-2.5 text-xs lg:self-auto">
            <span>Open Full 14-Place Atlas</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Interactive Quick-Filter Pills */}
        <div
          className="mb-8 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter destination collections"
        >
          {COLLECTION_PILLS.map((pill) => {
            const active = filter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(pill.id)}
                className={`min-h-[42px] rounded-full border px-4 py-2 text-xs font-semibold transition-[background-color,border-color,color,transform] duration-200 ${
                  active
                    ? 'border-[#0B56E8] bg-[#0B56E8] text-white shadow-[0_10px_24px_-8px_rgba(46,116,115,0.5)]'
                    : 'border-[#DCE5F2] bg-white text-[#091933] hover:border-[#0B56E8] hover:text-[#0B56E8]'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Full-Bleed Editorial Magazine Grid + Cursor-Following "Explore ->" Pill */}
        <div
          ref={gridRef}
          onPointerMove={handleGridPointerMove}
          onPointerLeave={() => setCursorVisible(false)}
          className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12"
        >
          {/* Floating Desktop Cursor Follower Pill */}
          {!reducedMotion && (
            <div
              ref={cursorPillRef}
              aria-hidden="true"
              className={`pointer-events-none absolute top-0 left-0 z-30 hidden items-center gap-1.5 rounded-full bg-[#F5A623] px-3.5 py-1.5 text-[11px] font-extrabold text-[#091933] shadow-[0_12px_28px_-6px_rgba(24,44,53,0.55)] transition-opacity duration-200 lg:inline-flex ${
                cursorVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span>Explore</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          )}

          {visibleDestinations.map((dest, idx) => {
            const meta = HOOK_META[dest.slug] ?? {
              hook: 'Curated Flights, Stays & Local Support',
              offerTag: 'Unlisted Hotel & Flight Desk Rates',
              collections: ['trending'],
            };
            const isHeroSpan = filter === 'all' && idx < 2;

            return (
              <article
                key={dest.slug}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') setCursorVisible(true);
                }}
                onPointerLeave={() => setCursorVisible(false)}
                className={`group relative flex min-h-[370px] flex-col justify-between overflow-hidden rounded-3xl border border-[#DCE5F2] bg-[#091933] text-white shadow-[0_20px_50px_-20px_rgba(24,44,53,0.35)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[#0B56E8] ${
                  isHeroSpan ? 'lg:col-span-6 lg:min-h-[430px]' : 'lg:col-span-4'
                }`}
              >
                {/* Full-Bleed Destination Photography */}
                <img
                  src={dest.image}
                  alt={dest.imageAlt}
                  width={isHeroSpan ? 860 : 600}
                  height={460}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061124]/96 via-[#091933]/42 to-[#091933]/25" />

                {/* Top Badges */}
                <div className="relative z-10 flex items-start justify-between gap-2 p-5">
                  <span className="font-mono-hud inline-flex items-center gap-1.5 rounded-full border border-[#DCE5F2]/25 bg-[#091933]/72 px-3 py-1 text-[10px] font-semibold text-[#F4F7FC] backdrop-blur-sm">
                    <MapPin className="h-3 w-3 text-[#60A5FA]" aria-hidden="true" />
                    {dest.country}
                  </span>
                  <span className="font-mono-hud inline-flex items-center gap-1 rounded-full bg-[#F5A623] px-2.5 py-1 text-[10px] font-extrabold text-[#091933] uppercase">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Desk Rate
                  </span>
                </div>

                {/* Bottom Editorial Content + Unlock Private Rate CTA */}
                <div className="relative z-10 p-5 sm:p-6">
                  <p className="font-mono-hud text-[11px] font-semibold tracking-wide text-[#60A5FA]">
                    {meta.hook}
                  </p>
                  <h3 className="font-display mt-1.5 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                    <Link
                      href={`/destinations/${dest.slug}/`}
                      onClick={() => selectDestinationBySlug(dest.slug)}
                      className="portal-focus hover:text-[#60A5FA]"
                    >
                      {dest.name}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#DCE5F2]/90 sm:text-sm">
                    {dest.shortDescription}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5 border-t border-[#DCE5F2]/18 pt-4">
                    <button
                      type="button"
                      onClick={() => handleUnlockRate(dest, meta.offerTag)}
                      className="portal-focus inline-flex min-h-[42px] items-center gap-1.5 rounded-full bg-[#0B56E8] px-4 py-2 text-xs font-bold text-white shadow-[0_10px_24px_-8px_rgba(46,116,115,0.65)] transition-colors hover:bg-[#F5A623] hover:text-[#091933]"
                    >
                      <LockOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Unlock Private Rate</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>

                    <Link
                      href={`/destinations/${dest.slug}/`}
                      onClick={() => selectDestinationBySlug(dest.slug)}
                      className="portal-focus inline-flex items-center gap-1 text-xs font-semibold text-[#DCE5F2] hover:text-[#60A5FA]"
                    >
                      <span>Guide</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
