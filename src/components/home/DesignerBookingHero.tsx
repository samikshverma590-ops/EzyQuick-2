'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Building2,
  Compass,
  FileCheck2,
  HeartPulse,
  Hotel,
  MapPin,
  Minus,
  Plane,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import {
  ATLAS_DESTINATIONS,
  INTERNATIONAL_ORIGINS,
  type AtlasDestination,
} from '@/data/atlas';
import { haversineKm } from '@/lib/geo';
import { useJourneySelection } from '@/lib/journey-selection';

const ORIGIN_GROUPS = [
  'EzyQuick Office Hubs',
  'India Gateways',
  'International Gateways',
] as const;

const FEATURED_SLUGS = ['dubai', 'bali', 'ladakh', 'phuket', 'singapore', 'almaty'] as const;

const SERVICE_TABS = [
  { label: 'Holidays', value: 'Leisure Travel', icon: Compass },
  { label: 'Flights', value: 'Air Tickets', icon: Plane },
  { label: 'Hotels', value: 'Hotel Bookings', icon: Hotel },
  { label: 'Corporate', value: 'Corporate Travel', icon: Building2 },
  { label: 'Visas', value: 'Visa Services', icon: FileCheck2 },
  { label: 'Medical', value: 'Medical Travel', icon: HeartPulse },
] as const;

const POPULAR_ROUTES: {
  label: string;
  origin: string;
  destSlug: string;
  service: string;
}[] = [
  { label: 'New Delhi to Dubai', origin: 'New Delhi', destSlug: 'dubai', service: 'Leisure Travel' },
  { label: 'London to Bali', origin: 'London', destSlug: 'bali', service: 'Leisure Travel' },
  { label: 'New Delhi to Ladakh', origin: 'New Delhi', destSlug: 'ladakh', service: 'Leisure Travel' },
  { label: 'Dubai to Phuket', origin: 'Dubai', destSlug: 'phuket', service: 'Leisure Travel' },
  { label: 'Mumbai to Singapore', origin: 'Mumbai', destSlug: 'singapore', service: 'Corporate Travel' },
];

export function DesignerBookingHero() {
  const {
    selection,
    originCity,
    originHub,
    selectedDestination,
    setOrigin,
    selectDestinationBySlug,
    setService,
    setTravellers,
  } = useJourneySelection();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const featuredScenes = useMemo(
    () =>
      FEATURED_SLUGS.map((slug) => ATLAS_DESTINATIONS.find((d) => d.slug === slug)).filter(
        (d): d is AtlasDestination => Boolean(d)
      ),
    []
  );

  // Active hero scene follows selected destination (defaults to Dubai golden skyline)
  const activeScene = selectedDestination ?? featuredScenes[0] ?? ATLAS_DESTINATIONS[0];

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ATLAS_DESTINATIONS.slice(0, 6);
    return ATLAS_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.stateOrProvince.toLowerCase().includes(q) ||
        d.subregion.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  const siblingRegions = useMemo(() => {
    const sameCountry = ATLAS_DESTINATIONS.filter((d) => d.country === activeScene.country);
    return sameCountry.length > 1 ? sameCountry : [];
  }, [activeScene.country]);

  const routeDistanceKm = useMemo(
    () => haversineKm(originCity, activeScene),
    [originCity, activeScene]
  );

  const planJourneyHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set('origin', originCity.city);
    params.set('desk', originHub.id);
    params.set('service', selection.service);
    params.set('destination', activeScene.name);
    if (selection.travellers) params.set('travellers', String(selection.travellers));
    return `/plan-your-journey/?${params.toString()}`;
  }, [originCity.city, originHub.id, selection.service, selection.travellers, activeScene.name]);

  return (
    <section
      id="global-atlas"
      aria-label="EzyQuick Travel Booking Hero"
      className="relative w-full bg-white pt-20 pb-12 text-[#091933] sm:pt-24 sm:pb-16"
    >
      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-6 lg:px-8">
        {/* ROUNDED FULL-BLEED PHOTOGRAPHIC HERO CANVAS (Dribbble / Pinterest Architectural Framing) */}
        <div className="relative overflow-hidden rounded-[28px] bg-[#091933] shadow-[0_32px_80px_-24px_rgba(9,25,51,0.34)] sm:rounded-[36px]">
          {/* Crossfading Destination Photography */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {featuredScenes.map((scene) => {
              const isCurrent = scene.slug === activeScene.slug;
              return (
                <img
                  key={scene.slug}
                  src={scene.image}
                  alt={scene.imageAlt}
                  width={1920}
                  height={1080}
                  fetchPriority={scene.slug === 'dubai' ? 'high' : 'auto'}
                  className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-1000 ease-out ${
                    isCurrent ? 'scale-[1.03] opacity-100' : 'scale-100 opacity-0'
                  }`}
                />
              );
            })}
            {/* Fallback layer if user selects one of the other 8 destinations outside featured 6 */}
            {!featuredScenes.some((s) => s.slug === activeScene.slug) && (
              <img
                src={activeScene.image}
                alt={activeScene.imageAlt}
                width={1920}
                height={1080}
                className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center"
              />
            )}

            {/* Editorial Directional Contrast Scrim — clear sky & subject, high-contrast left copy */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(102deg, rgba(9, 25, 51, 0.78) 0%, rgba(9, 25, 51, 0.44) 46%, rgba(9, 25, 51, 0.16) 100%)',
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-44"
              style={{
                background:
                  'linear-gradient(to top, rgba(9, 25, 51, 0.78) 0%, rgba(9, 25, 51, 0.28) 55%, transparent 100%)',
              }}
            />
          </div>

          {/* INNER HERO CONTENT GRID */}
          <div className="relative z-10 flex min-h-[520px] flex-col justify-between p-6 pb-28 sm:min-h-[560px] sm:p-10 sm:pb-32 lg:min-h-[600px] lg:p-14 lg:pb-36">
            {/* TOP ROW: Editorial Headline (Left) + Minimalist Boarding-Pass Route Card (Right) */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h1 className="hero-reveal font-editorial max-w-2xl text-4xl font-semibold leading-[1.03] tracking-[-0.025em] text-white sm:text-5xl lg:text-[4.15rem]">
                  Travel the world, without the planning stress.
                </h1>

                <p className="hero-reveal-delay-1 mt-5 max-w-lg text-sm leading-relaxed text-white/88 sm:text-base sm:leading-relaxed">
                  Flights, curated stays, visas, and corporate travel arranged end-to-end by
                  reachable human desks in New Delhi and Dubai.
                </p>

                {/* Subtle Secondary Links */}
                <div className="hero-reveal-delay-2 mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/92 sm:text-sm">
                  <Link
                    href="/destinations/"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/28 bg-white/12 px-4 py-2 backdrop-blur-md transition-colors hover:bg-white hover:text-[#091933]"
                  >
                    <span>Explore all 14 destinations</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a
                    href="#destination-portals"
                    className="inline-flex items-center gap-1.5 text-white/90 underline decoration-white/40 underline-offset-4 transition-colors hover:text-[#FCB400] hover:decoration-[#FCB400]"
                  >
                    <span>See destination showcases</span>
                  </a>
                </div>
              </div>

              {/* RIGHT: Hand-Crafted Minimalist Boarding-Pass Preview Card */}
              <div className="hidden lg:col-span-5 lg:flex lg:justify-end">
                <aside
                  className="w-full max-w-[340px] rounded-3xl border border-white/22 bg-white/12 p-5 text-white shadow-[0_24px_60px_-16px_rgba(6,17,36,0.45)] backdrop-blur-xl"
                  aria-live="polite"
                >
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <span className="font-semibold text-white">{activeScene.country}</span>
                    <span>{activeScene.stateOrProvince}</span>
                  </div>

                  {/* Boarding-Pass Route Visual */}
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#091933]/55 px-4 py-3.5">
                    <div>
                      <div className="text-xl font-bold tracking-tight text-white">
                        {originCity.code}
                      </div>
                      <div className="text-[11px] text-white/75">{originCity.city}</div>
                    </div>

                    <div className="flex flex-1 flex-col items-center gap-1 px-2">
                      <div className="flex w-full items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FCB400]" />
                        <span className="h-[1px] flex-1 border-b border-dashed border-white/45" />
                        <Plane className="h-3.5 w-3.5 text-[#FCB400]" aria-hidden="true" />
                        <span className="h-[1px] flex-1 border-b border-dashed border-white/45" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                      <span className="text-[11px] font-medium text-white/80">
                        {routeDistanceKm > 60
                          ? `~${routeDistanceKm.toLocaleString()} km`
                          : 'Local hub desk'}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold tracking-tight text-white">
                        {(
                          {
                            dubai: 'DXB',
                            'abu-dhabi': 'AUH',
                            bali: 'DPS',
                            ladakh: 'IXL',
                            phuket: 'HKT',
                            krabi: 'KBV',
                            singapore: 'SIN',
                            almaty: 'ALA',
                            kerala: 'COK',
                            goa: 'GOI',
                            'phu-quoc': 'PQC',
                            malaysia: 'KUL',
                            'sri-lanka': 'CMB',
                            'andaman-nicobar': 'IXZ',
                          } as Record<string, string>
                        )[activeScene.slug] || activeScene.name.slice(0, 3).toUpperCase()}
                      </div>
                      <div className="text-[11px] text-white/75">{activeScene.name}</div>
                    </div>
                  </div>

                  {/* Multi-region switcher when country has multiple destinations (India / UAE / Thailand) */}
                  {siblingRegions.length > 1 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {siblingRegions.map((reg) => {
                        const active = reg.slug === activeScene.slug;
                        return (
                          <button
                            key={reg.slug}
                            type="button"
                            onClick={() => selectDestinationBySlug(reg.slug)}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                              active
                                ? 'bg-white text-[#091933]'
                                : 'bg-white/14 text-white/90 hover:bg-white/25'
                            }`}
                          >
                            {reg.name}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-white/16 pt-3 text-xs">
                    <span className="text-white/80">
                      Handled by <strong className="text-white">{originHub.city} desk</strong>
                    </span>
                    <Link
                      href={`/destinations/${activeScene.slug}/`}
                      className="inline-flex items-center gap-1 font-semibold text-[#FCB400] hover:underline"
                    >
                      <span>View guide</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </aside>
              </div>
            </div>

            {/* LOWER-LEFT: Tactile Destination Scene Thumbnails */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div
                className="flex flex-wrap items-center gap-2"
                role="group"
                aria-label="Preview featured destinations"
              >
                {featuredScenes.map((scene) => {
                  const active = scene.slug === activeScene.slug;
                  return (
                    <button
                      key={scene.slug}
                      type="button"
                      onClick={() => selectDestinationBySlug(scene.slug)}
                      aria-pressed={active}
                      className={`group inline-flex items-center gap-2 rounded-full border py-1 pr-3.5 pl-1.5 text-xs font-semibold backdrop-blur-md transition-all ${
                        active
                          ? 'border-white bg-white text-[#091933] shadow-lg'
                          : 'border-white/25 bg-white/12 text-white hover:border-white/60 hover:bg-white/22'
                      }`}
                    >
                      <img
                        src={scene.image}
                        alt=""
                        width={26}
                        height={26}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <span>{scene.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden items-center gap-2 text-xs text-white/85 md:flex">
                <MapPin className="h-3.5 w-3.5 text-[#FCB400]" aria-hidden="true" />
                <span>
                  Currently viewing <strong className="text-white">{activeScene.name}</strong>,{' '}
                  {activeScene.country}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SIGNATURE DRIBBBLE OVERLAPPING WHITE BOOKING DOCK */}
        <div
          className="relative z-30 mx-auto -mt-16 max-w-6xl px-2 sm:-mt-20 sm:px-4"
          aria-label="Trip planning and booking dock"
        >
          {/* Service Category Tabs */}
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5 pl-2">
            {SERVICE_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = selection.service === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setService(tab.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition-all ${
                    active
                      ? 'bg-[#091933] text-white shadow-[0_10px_24px_-8px_rgba(9,25,51,0.55)]'
                      : 'border border-white/60 bg-white/95 text-[#3B4F6B] backdrop-blur-md hover:border-[#0B56E8] hover:text-[#0B56E8]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Pure-White Floating Booking Card */}
          <div className="rounded-[26px] border border-[#DCE5F2] bg-white p-3.5 shadow-[0_30px_75px_-20px_rgba(9,25,51,0.20)] sm:p-5">
            <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-2 lg:grid-cols-12">
              {/* Departure City (15 International & Domestic Gateways) */}
              <div className="lg:col-span-3">
                <label
                  htmlFor="hero-origin"
                  className="mb-1.5 block text-xs font-semibold text-[#5B708D]"
                >
                  Leaving from
                </label>
                <select
                  id="hero-origin"
                  value={originCity.city}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full rounded-2xl border border-[#DCE5F2] bg-[#F7F9FC] px-3.5 py-3 text-sm font-semibold text-[#091933] transition-colors focus-visible:border-[#0B56E8] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#0B56E8]/20"
                >
                  {ORIGIN_GROUPS.map((group) => (
                    <optgroup key={group} label={group}>
                      {INTERNATIONAL_ORIGINS.filter((o) => o.regionGroup === group).map((o) => (
                        <option key={o.id} value={o.city}>
                          {o.city} ({o.code})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Going To (Live Searchable Destination Input) */}
              <div className="relative lg:col-span-4">
                <label
                  htmlFor="hero-destination-search"
                  className="mb-1.5 block text-xs font-semibold text-[#5B708D]"
                >
                  Going to
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#0B56E8]"
                    aria-hidden="true"
                  />
                  <input
                    id="hero-destination-search"
                    type="search"
                    value={searchOpen ? searchQuery : `${activeScene.name}, ${activeScene.country}`}
                    onFocus={() => {
                      setSearchQuery('');
                      setSearchOpen(true);
                    }}
                    onBlur={() => window.setTimeout(() => setSearchOpen(false), 180)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchResults.length > 0) {
                        e.preventDefault();
                        selectDestinationBySlug(searchResults[0].slug);
                        setSearchOpen(false);
                      }
                    }}
                    placeholder="Search country, city, or state..."
                    className="w-full rounded-2xl border border-[#DCE5F2] bg-[#F7F9FC] py-3 pr-3.5 pl-10 text-sm font-semibold text-[#091933] placeholder:font-normal placeholder:text-[#5B708D] transition-colors focus-visible:border-[#0B56E8] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#0B56E8]/20"
                  />
                </div>

                {searchOpen && (
                  <div
                    role="listbox"
                    aria-label="Destination suggestions"
                    className="absolute right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-[#DCE5F2] bg-white shadow-2xl"
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((dest) => (
                        <button
                          key={dest.slug}
                          type="button"
                          role="option"
                          aria-selected={activeScene.slug === dest.slug}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectDestinationBySlug(dest.slug);
                            setSearchOpen(false);
                          }}
                          className="flex w-full items-center justify-between gap-3 border-b border-[#DCE5F2]/60 px-4 py-2.5 text-left text-xs transition-colors last:border-b-0 hover:bg-[#F4F7FC]"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={dest.image}
                              alt=""
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-bold text-[#091933]">{dest.name}</div>
                              <div className="text-[11px] text-[#5B708D]">
                                {dest.stateOrProvince}, {dest.country}
                              </div>
                            </div>
                          </div>
                          <span className="rounded-full bg-[#F4F7FC] px-2.5 py-0.5 text-[11px] font-semibold text-[#0B56E8]">
                            {dest.region}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-xs text-[#5B708D]">
                        Planning a custom destination? Continue to{' '}
                        <Link href={planJourneyHref} className="font-semibold text-[#0B56E8] underline">
                          Plan Your Journey
                        </Link>{' '}
                        and type any city worldwide.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Travellers Stepper */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="hero-travellers"
                  className="mb-1.5 block text-xs font-semibold text-[#5B708D]"
                >
                  Travellers
                </label>
                <div className="flex items-center justify-between rounded-2xl border border-[#DCE5F2] bg-[#F7F9FC] px-2.5 py-2">
                  <button
                    type="button"
                    onClick={() => setTravellers(selection.travellers - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#091933] shadow-2xs transition-colors hover:text-[#0B56E8]"
                    aria-label="Decrease travellers"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span
                    id="hero-travellers"
                    className="flex items-center gap-1.5 text-sm font-bold text-[#091933]"
                  >
                    <Users className="h-3.5 w-3.5 text-[#0B56E8]" aria-hidden="true" />
                    {selection.travellers}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTravellers(selection.travellers + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#091933] shadow-2xs transition-colors hover:text-[#0B56E8]"
                    aria-label="Increase travellers"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="lg:col-span-3">
                <Link
                  href={planJourneyHref}
                  className="btn-kinetic w-full py-3.5 text-sm font-semibold"
                >
                  <span>Plan Your Journey</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Popular Route Quick-Picks beneath the Dock */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#5B708D]">
            <span className="font-medium">Popular routes:</span>
            {POPULAR_ROUTES.map((route) => (
              <button
                key={route.label}
                type="button"
                onClick={() => {
                  setOrigin(route.origin);
                  selectDestinationBySlug(route.destSlug);
                  setService(route.service);
                }}
                className="rounded-full border border-[#DCE5F2] bg-[#F7F9FC] px-3 py-1 font-medium text-[#091933] transition-colors hover:border-[#0B56E8] hover:bg-white hover:text-[#0B56E8]"
              >
                {route.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
