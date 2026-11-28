'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Building2,
  FileCheck2,
  HeartHandshake,
  Hotel,
  Palmtree,
  Plane,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { SERVICES, type TravelService } from '@/data/services';
import { useJourneySelection } from '@/lib/journey-selection';

type AudienceFilter = 'all' | 'b2c' | 'b2b';

const FILTER_TABS: { id: AudienceFilter; label: string; shortLabel: string }[] = [
  { id: 'all', label: 'All Services', shortLabel: 'All (9)' },
  { id: 'b2c', label: 'Leisure & Personal (B2C)', shortLabel: 'Leisure (B2C)' },
  { id: 'b2b', label: 'Corporate & MICE (B2B)', shortLabel: 'Corporate (B2B)' },
];

interface ServiceMeta {
  displayTitle: string;
  audiences: ('b2c' | 'b2b')[];
  featured?: boolean;
  highlightBadge?: string;
  offerTag: string;
  icon: typeof Plane;
  order: number;
}

const SERVICE_META: Record<string, ServiceMeta> = {
  'leisure-travel': {
    displayTitle: 'Leisure Holidays',
    audiences: ['b2c'],
    featured: true,
    highlightBadge: 'Most Requested · B2C',
    offerTag: 'Unlisted Hotel & Flight Desk Rates',
    icon: Palmtree,
    order: 1,
  },
  'corporate-travel': {
    displayTitle: 'Corporate Travel Management',
    audiences: ['b2b'],
    featured: true,
    highlightBadge: 'Executive Priority · B2B',
    offerTag: 'Corporate & Group Priority Desk',
    icon: Building2,
    order: 2,
  },
  'mice-services': {
    displayTitle: 'MICE & Global Events',
    audiences: ['b2b'],
    highlightBadge: 'Delegations & Offsites',
    offerTag: 'Corporate & Group Priority Desk',
    icon: Users,
    order: 3,
  },
  'visa-services': {
    displayTitle: 'Visa Assistance',
    audiences: ['b2c', 'b2b'],
    highlightBadge: 'Fast Turnaround Desk',
    offerTag: 'Fast-Track Visa + Zero-Stress Bundling',
    icon: FileCheck2,
    order: 4,
  },
  'air-tickets': {
    displayTitle: 'International & Domestic Air Tickets',
    audiences: ['b2c', 'b2b'],
    offerTag: 'Unlisted Hotel & Flight Desk Rates',
    icon: Plane,
    order: 5,
  },
  'hotel-bookings': {
    displayTitle: 'Curated Hotel Bookings',
    audiences: ['b2c', 'b2b'],
    offerTag: 'Unlisted Hotel & Flight Desk Rates',
    icon: Hotel,
    order: 6,
  },
  'medical-travel': {
    displayTitle: 'Medical Travel Coordination',
    audiences: ['b2c', 'b2b'],
    highlightBadge: 'Patient & Family Care',
    offerTag: 'Fast-Track Visa + Zero-Stress Bundling',
    icon: HeartHandshake,
    order: 7,
  },
  'forex-services': {
    displayTitle: 'Forex & Travel Cards',
    audiences: ['b2c', 'b2b'],
    offerTag: 'Fast-Track Visa + Zero-Stress Bundling',
    icon: Banknote,
    order: 8,
  },
  'travel-insurance': {
    displayTitle: 'Comprehensive Travel Insurance',
    audiences: ['b2c', 'b2b'],
    offerTag: 'Fast-Track Visa + Zero-Stress Bundling',
    icon: ShieldCheck,
    order: 9,
  },
};

export function ServicesBentoSection() {
  const [filter, setFilter] = useState<AudienceFilter>('all');
  const { openConcierge } = useJourneySelection();

  const orderedServices = useMemo(() => {
    const sorted = [...SERVICES].sort(
      (a, b) => (SERVICE_META[a.slug]?.order ?? 99) - (SERVICE_META[b.slug]?.order ?? 99)
    );
    if (filter === 'all') return sorted;
    return sorted.filter((svc) => SERVICE_META[svc.slug]?.audiences.includes(filter));
  }, [filter]);

  const activeTabIndex = FILTER_TABS.findIndex((t) => t.id === filter);

  const handleRequestService = (svc: TravelService, meta: ServiceMeta) => {
    openConcierge({
      service: svc.name,
      offerTag: meta.offerTag,
      groupSize: meta.audiences.includes('b2b') && !meta.audiences.includes('b2c')
        ? 'Group / Corporate 8+'
        : undefined,
      mode: 'scroll',
    });
  };

  return (
    <section
      id="services-bento"
      className="border-y border-[#DCE5F2] bg-[#F4F7FC] px-4 py-20 sm:px-8 lg:py-28"
      aria-labelledby="bento-services-heading"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header + Sliding B2B / B2C Segmented Control */}
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="font-mono-hud text-xs font-semibold tracking-[0.18em] text-[#0B56E8] uppercase">
              Nine Travel Verticals · One Accountable Desk
            </p>
            <h2
              id="bento-services-heading"
              className="font-display mt-2.5 text-4xl font-extrabold leading-[1.02] text-[#091933] sm:text-5xl"
            >
              Built for personal escapes &amp; enterprise mobility.
            </h2>
            <p className="mt-3.5 text-sm leading-relaxed text-[#3B4F6B] sm:text-base">
              Select any vertical below to pre-load our Fast-Track Concierge with your exact
              requirement—zero re-typing, direct New Delhi &amp; Dubai advisor response.
            </p>
          </div>

          {/* Sliding Cobalt Pill Switch */}
          <div
            className="relative grid w-full max-w-lg grid-cols-3 rounded-full border border-[#DCE5F2] bg-white p-1.5 shadow-[0_10px_28px_-14px_rgba(24,44,53,0.16)]"
            role="tablist"
            aria-label="Filter EzyQuick services by audience"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1.5 bottom-1.5 left-1.5 w-[calc((100%-12px)/3)] rounded-full bg-[#0B56E8] shadow-[0_8px_20px_-6px_rgba(46,116,115,0.55)] transition-transform duration-300 ease-out"
              style={{ transform: `translate3d(${activeTabIndex * 100}%, 0, 0)` }}
            />
            {FILTER_TABS.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={`relative z-10 min-h-[42px] rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                    active ? 'text-white' : 'text-[#091933] hover:text-[#0B56E8]'
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-6 lg:grid-cols-12">
          {orderedServices.map((svc) => {
            const meta = SERVICE_META[svc.slug] ?? {
              displayTitle: svc.name,
              audiences: ['b2c', 'b2b'],
              offerTag: 'Unlisted Hotel & Flight Desk Rates',
              icon: Plane,
              order: 99,
            };
            const Icon = meta.icon;
            const isFeatured = Boolean(meta.featured);
            const isVisa = svc.slug === 'visa-services';

            return (
              <article
                key={svc.slug}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 ${
                  isFeatured
                    ? 'border-[#DCE5F2] bg-[#091933] text-white shadow-[0_24px_54px_-20px_rgba(9,25,51,0.42)] hover:border-[#0B56E8] md:col-span-6 lg:col-span-6'
                    : 'border-[#DCE5F2] bg-white text-[#091933] shadow-[0_14px_34px_-18px_rgba(9,25,51,0.12)] hover:border-[#0B56E8]/55 hover:shadow-[0_22px_44px_-16px_rgba(11,86,232,0.18)] md:col-span-3 lg:col-span-4'
                }`}
              >
                {/* Featured Bento Background Photo + Deep Atlas Navy Gradient */}
                {isFeatured && (
                  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    <img
                      src={svc.image}
                      alt=""
                      width={800}
                      height={520}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-35 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#091933] via-[#091933]/88 to-[#083FA8]/55" />
                  </div>
                )}

                <div className="relative z-10 flex h-full flex-col p-6 sm:p-7">
                  {/* Top Row: Animated Icon Container + Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 ${
                        isFeatured
                          ? 'border border-[#60A5FA]/30 bg-[#0B56E8]/25 text-[#F5A623]'
                          : isVisa
                            ? 'bg-[#F5A623]/18 text-[#091933]'
                            : 'bg-[#F4F7FC] text-[#0B56E8] group-hover:bg-[#0B56E8] group-hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      {meta.highlightBadge && (
                        <span
                          className={`font-mono-hud inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                            isVisa || isFeatured
                              ? 'bg-[#F5A623] text-[#091933]'
                              : 'bg-[#DCE5F2] text-[#083FA8]'
                          }`}
                        >
                          {isVisa && <Sparkles className="h-3 w-3" aria-hidden="true" />}
                          {meta.highlightBadge}
                        </span>
                      )}
                      <span
                        className={`font-mono-hud rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                          isFeatured
                            ? 'border border-[#DCE5F2]/20 bg-white/10 text-[#DCE5F2]'
                            : 'bg-[#F4F7FC] text-[#5B708D]'
                        }`}
                      >
                        {svc.index}
                      </span>
                    </div>
                  </div>

                  {/* Title & Copy */}
                  <div className="mt-5 flex-1">
                    <h3
                      className={`font-display font-extrabold tracking-tight ${
                        isFeatured ? 'text-2xl text-white sm:text-3xl' : 'text-xl text-[#091933]'
                      }`}
                    >
                      {meta.displayTitle}
                    </h3>
                    <p
                      className={`mt-2.5 text-sm leading-relaxed ${
                        isFeatured ? 'max-w-lg text-[#DCE5F2]/90' : 'text-[#3B4F6B]'
                      }`}
                    >
                      {svc.summary}
                    </p>

                    {isFeatured && (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {svc.scope.slice(0, 3).map((point) => (
                          <li
                            key={point}
                            className="rounded-full border border-[#DCE5F2]/18 bg-white/8 px-3 py-1 text-[11px] font-medium text-[#F4F7FC]"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Bottom Conversion Hook + Service Guide Link */}
                  <div
                    className={`mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4 ${
                      isFeatured ? 'border-[#DCE5F2]/16' : 'border-[#DCE5F2]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleRequestService(svc, meta)}
                      className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                        isFeatured
                          ? 'bg-[#0B56E8] text-white hover:bg-[#60A5FA] hover:text-[#091933]'
                          : 'bg-[#F4F7FC] text-[#0B56E8] hover:bg-[#0B56E8] hover:text-white'
                      }`}
                    >
                      <span>Ask Desk for Quote</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>

                    <Link
                      href={`/services/${svc.slug}/`}
                      className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors ${
                        isFeatured
                          ? 'text-[#DCE5F2] hover:text-[#F5A623]'
                          : 'text-[#3B4F6B] hover:text-[#091933]'
                      }`}
                    >
                      <span>Details</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Services Index Link */}
        <div className="mt-8 flex justify-end">
          <Link href="/services/" className="btn-outline-kinetic px-5 py-2.5 text-xs">
            <span>Compare All 9 Service Guides</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
