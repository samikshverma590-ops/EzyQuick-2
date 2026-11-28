'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowRight,
  Compass,
  Globe,
  Info,
  Map as MapIcon,
  MapPin,
  Minus,
  Phone,
  Plane,
  Plus,
  RotateCcw,
  Search,
  Users,
  X,
} from 'lucide-react';
import {
  ATLAS_DESTINATIONS,
  ATLAS_HUBS,
  INTERNATIONAL_ORIGINS,
  REGION_FILTERS,
  type AtlasDestination,
  type AtlasHub,
} from '@/data/atlas';
import { SERVICE_OPTIONS } from '@/lib/enquiry-schema';
import { formatCoordinates, haversineKm } from '@/lib/geo';
import { useJourneySelection } from '@/lib/journey-selection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { FallbackAtlas2D } from './FallbackAtlas2D';

const GlobalAtlasCanvas = dynamic(
  () => import('./GlobalAtlasCanvas').then((m) => m.GlobalAtlasCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#DCE5F2] border-t-[#0B56E8]" />
        <p className="font-mono-hud text-xs font-medium tracking-wider text-[#3B4F6B] uppercase">
          Loading EzyQuick Global Atlas…
        </p>
      </div>
    ),
  }
);

interface GlobalAtlasExperienceProps {
  mode?: 'hero' | 'destinations';
}

const ORIGIN_GROUPS = [
  'EzyQuick Office Hubs',
  'India Gateways',
  'International Gateways',
] as const;

const QUICK_SERVICE_TABS: { label: string; value: string }[] = [
  { label: 'Leisure Holidays', value: 'Leisure Travel' },
  { label: 'Air Tickets', value: 'Air Tickets' },
  { label: 'Hotel Bookings', value: 'Hotel Bookings' },
  { label: 'Corporate & MICE', value: 'Corporate Travel' },
  { label: 'Visa Services', value: 'Visa Services' },
  { label: 'Medical Travel', value: 'Medical Travel' },
];

export function GlobalAtlasExperience({ mode = 'hero' }: GlobalAtlasExperienceProps) {
  const reducedMotion = useReducedMotion();
  const device = useDeviceTier();

  const {
    selection,
    originCity,
    originHub,
    selectedDestination,
    selectedHub,
    visibleDestinations,
    setOrigin,
    selectDestinationBySlug,
    selectHub,
    setService,
    setTravellers,
    setRegionFilter,
    resetToGlobalView,
  } = useJourneySelection();

  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [followFlight, setFollowFlight] = useState(false);
  const [replaySeq, setReplaySeq] = useState(0);
  const [zoomEvent, setZoomEvent] = useState<{ delta: number; seq: number }>({ delta: 0, seq: 0 });
  const [resetCounter, setResetCounter] = useState(0);
  const [atlasReady, setAtlasReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ATLAS_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.stateOrProvince.toLowerCase().includes(q) ||
        d.subregion.toLowerCase().includes(q) ||
        d.highlights.some((h) => h.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchQuery]);

  const siblingStates = useMemo(() => {
    if (!selectedDestination) return [];
    const sameCountry = ATLAS_DESTINATIONS.filter(
      (d) => d.country === selectedDestination.country
    );
    return sameCountry.length > 1 ? sameCountry : [];
  }, [selectedDestination]);

  const focusTarget = useMemo(() => {
    if (selectedDestination) {
      return { lat: selectedDestination.lat, lng: selectedDestination.lng };
    }
    if (selectedHub) {
      return {
        lat: selectedHub.lat,
        lng: selectedHub.lng,
        distance: device.isMobile ? 5.1 : 4.45,
      };
    }
    if (!originCity.isEzyQuickHub) {
      return {
        lat: (originCity.lat + originHub.lat) / 2,
        lng: (originCity.lng + originHub.lng) / 2,
        distance: device.isMobile ? 5.85 : 5.2,
      };
    }
    return null;
  }, [selectedDestination, selectedHub, originCity, originHub, device.isMobile]);

  const handleSelectDestination = (dest: AtlasDestination) => {
    setFollowFlight(false);
    setSearchQuery('');
    setSearchFocused(false);
    selectDestinationBySlug(dest.slug);
  };

  const handleSelectHub = (hub: AtlasHub) => {
    setFollowFlight(false);
    selectHub(hub.id);
  };

  const handleResetGlobalView = () => {
    setFollowFlight(false);
    setSearchQuery('');
    resetToGlobalView();
    setResetCounter((c) => c + 1);
  };

  const handleZoom = (delta: number) => {
    setFollowFlight(false);
    setZoomEvent((prev) => ({ delta, seq: prev.seq + 1 }));
  };

  const planJourneyHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set('origin', originCity.city);
    params.set('desk', originHub.id);
    params.set('service', selection.service);
    if (selectedDestination) params.set('destination', selectedDestination.name);
    if (selection.travellers) params.set('travellers', String(selection.travellers));
    return `/plan-your-journey/?${params.toString()}`;
  }, [originCity.city, originHub.id, selection.service, selection.travellers, selectedDestination]);

  const activeCoordsReadout = selectedDestination
    ? `${originCity.code} → ${selectedDestination.name.toUpperCase()} (${selectedDestination.stateOrProvince.toUpperCase()}) · ${formatCoordinates(selectedDestination.lat, selectedDestination.lng)}`
    : selectedHub
      ? `${selectedHub.code} OFFICE HUB · ${formatCoordinates(selectedHub.lat, selectedHub.lng)}`
      : originCity.isEzyQuickHub
        ? `ORIGIN ${originCity.code} · DEL 28.6519° N ↔ DXB 25.1212° N`
        : `ORIGIN ${originCity.code} (${originCity.city.toUpperCase()}) → ${originHub.code} DESK · ${formatCoordinates(originCity.lat, originCity.lng)}`;

  const globeCanvasNode =
    viewMode === '3d' ? (
      <GlobalAtlasCanvas
        visibleDestinations={visibleDestinations}
        originCity={originCity}
        originHub={originHub}
        selectedDestination={selectedDestination}
        selectedHub={selectedHub}
        regionFilter={selection.regionFilter}
        focusTarget={focusTarget}
        followFlight={followFlight}
        replaySeq={replaySeq}
        zoomEvent={zoomEvent}
        resetCounter={resetCounter}
        reducedMotion={reducedMotion}
        isMobile={device.isMobile}
        maxDpr={device.maxDpr}
        textureWidth={device.textureWidth}
        sphereSegments={device.sphereSegments}
        onSelectDestination={handleSelectDestination}
        onSelectHub={handleSelectHub}
        onReady={() => setAtlasReady(true)}
      />
    ) : (
      <FallbackAtlas2D
        visibleDestinations={visibleDestinations}
        originCity={originCity}
        originHub={originHub}
        selectedDestination={selectedDestination}
        selectedHub={selectedHub}
        onSelectDestination={handleSelectDestination}
        onSelectHub={handleSelectHub}
        reason="2D Interactive Atlas — Keyboard & Non-WebGL Parity"
      />
    );

  const isLocalSameCityMatch =
    (originCity.id === 'dubai' && selectedDestination?.slug === 'dubai') ||
    (originCity.id === 'singapore' && selectedDestination?.slug === 'singapore');

  return (
    <section
      id="global-atlas"
      className="atlas-hero-bg relative w-full overflow-hidden border-b border-[#DCE5F2] pt-20 text-[#091933] sm:pt-24"
      aria-label="EzyQuick Global Atlas Interactive 3D Experience"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-4 pb-8 sm:px-8 lg:min-h-[calc(100svh-5rem)] lg:justify-between lg:pb-9">
        {/* TOP UTILITY BAR: Office Hubs + Aircraft Controls + 3D/2D Mode Switch */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 pb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {ATLAS_HUBS.map((hub) => {
              const active = selectedHub?.id === hub.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => handleSelectHub(hub)}
                  className={`atlas-pill font-mono-hud flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    active ? 'atlas-pill-active' : ''
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-[#F5A623]" />
                  <span>
                    {hub.code} · {hub.city} Hub
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleResetGlobalView}
              className={`atlas-pill font-mono-hud flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                !selectedDestination && !selectedHub && selection.regionFilter === 'All'
                  ? 'atlas-pill-active'
                  : ''
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-[#0B56E8]" aria-hidden="true" />
              <span>Global View</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {viewMode === '3d' && !reducedMotion && (
              <>
                <button
                  type="button"
                  onClick={() => setReplaySeq((s) => s + 1)}
                  className="atlas-pill font-mono-hud flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-[#0B56E8]" aria-hidden="true" />
                  <span>Replay Flight</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFollowFlight((f) => !f)}
                  className={`atlas-pill font-mono-hud flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                    followFlight ? 'atlas-pill-active' : ''
                  }`}
                  aria-pressed={followFlight}
                >
                  <Plane
                    className={`h-3.5 w-3.5 ${followFlight ? 'text-[#FCB400]' : 'text-[#0B56E8]'}`}
                    aria-hidden="true"
                  />
                  <span>{followFlight ? 'Following Flight' : 'Follow Aircraft'}</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setFollowFlight(false);
                setViewMode((m) => (m === '3d' ? '2d' : '3d'));
              }}
              className="atlas-pill font-mono-hud flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
              aria-label={
                viewMode === '3d'
                  ? 'Switch to 2D accessible atlas map'
                  : 'Switch to 3D interactive globe'
              }
            >
              {viewMode === '3d' ? (
                <>
                  <MapIcon className="h-3.5 w-3.5 text-[#0B56E8]" aria-hidden="true" />
                  <span>2D Map</span>
                </>
              ) : (
                <>
                  <Globe className="h-3.5 w-3.5 text-[#0B56E8]" aria-hidden="true" />
                  <span>3D Globe</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* MAIN STAGE: Dribbble-Inspired Clean Editorial Left + Unobstructed 3D Globe Centerpiece + Contextual Right Inspector */}
        <div className="relative grid flex-1 grid-cols-1 items-center gap-5 py-2 lg:grid-cols-12">
          {/* LEFT COLUMN: Clean Sunlit Editorial Headline & Quick Value Highlights */}
          <div className="pointer-events-auto relative z-30 lg:col-span-4">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DCE5F2] bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-[#0B56E8] shadow-xs">
              <Compass className="h-3.5 w-3.5 text-[#F5A623]" aria-hidden="true" />
              <span>New Delhi &amp; Dubai · International Travel Desk</span>
            </div>

            {mode === 'hero' ? (
              <h1 className="hero-reveal font-editorial text-4xl font-semibold leading-[1.02] tracking-tight text-[#091933] sm:text-5xl lg:text-[3.5rem]">
                More world.{' '}
                <span className="text-cobalt-kinetic">Less to organise.</span>
              </h1>
            ) : (
              <h1 className="hero-reveal font-editorial text-4xl font-semibold leading-[1.02] tracking-tight text-[#091933] sm:text-5xl">
                Explore 14{' '}
                <span className="text-cobalt-kinetic">Verified Destinations.</span>
              </h1>
            )}

            <p className="hero-reveal-delay-1 mt-3.5 max-w-[390px] text-sm leading-relaxed text-[#3B4F6B] sm:text-base">
              {mode === 'hero'
                ? 'Flights, hotels, corporate MICE, medical travel, and visas across India, the UAE, and Asia — coordinated end-to-end by reachable desks in New Delhi and Dubai.'
                : 'Rotate the 3D Earth, search any country or state, or select a destination to preview routes and request a tailored itinerary.'}
            </p>

            {/* Clean Dribbble-Style Quick Trust Strip */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs font-semibold text-[#091933]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE5F2] bg-white/90 px-3 py-1.5 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-[#0B56E8]" />
                15+ Global Departures
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE5F2] bg-white/90 px-3 py-1.5 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-[#F5A623]" />
                DEL &amp; DXB Live Desks
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleSelectDestination(ATLAS_DESTINATIONS[0])}
                className="btn-outline-kinetic px-5 py-2.5 text-xs sm:text-sm"
              >
                <Globe className="h-4 w-4 text-[#0B56E8]" aria-hidden="true" />
                <span>Explore Featured Route</span>
              </button>
              <a
                href="#destination-portals"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#0B56E8] hover:underline sm:text-sm"
              >
                <span>View Destination Portals</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* CENTERPIECE: Interactive 3D Animated Globe + Real Airbus A350 */}
          <div
            className={
              viewMode === '3d'
                ? 'relative z-10 h-[360px] w-full sm:h-[440px] lg:absolute lg:inset-0 lg:z-10 lg:h-full'
                : 'relative z-20 flex w-full items-center justify-center lg:col-span-5'
            }
          >
            {globeCanvasNode}
          </div>

          {viewMode === '3d' && (
            <div
              className="hidden lg:pointer-events-none lg:col-span-5 lg:block lg:h-[470px]"
              aria-hidden="true"
            />
          )}

          {/* RIGHT COLUMN: Contextual Floating Inspector Card (Destination / Hub / Clean Atlas Legend) */}
          <div className="relative z-40 text-[#091933] lg:col-span-3">
            {selectedDestination ? (
              <aside className="atlas-panel w-full rounded-3xl p-4 sm:p-5" aria-live="polite">
                <div className="mb-2.5 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono-hud rounded-full bg-[#0B56E8]/10 px-2 py-0.5 text-[10px] font-bold text-[#0B56E8] uppercase">
                        {selectedDestination.region === 'India' ? 'Regional · India' : 'International'}
                      </span>
                      <span className="font-mono-hud text-[10px] font-semibold text-[#5B708D] uppercase">
                        {selectedDestination.country}
                      </span>
                    </div>
                    <h2 className="font-editorial mt-1 text-2xl font-semibold text-[#091933]">
                      {selectedDestination.name}
                    </h2>
                    <p className="font-mono-hud mt-0.5 text-[10px] font-semibold text-[#0B56E8]">
                      {selectedDestination.stateOrProvince}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetGlobalView}
                    className="rounded-full border border-[#DCE5F2] bg-[#F4F7FC] p-1.5 text-[#3B4F6B] hover:border-[#0B56E8] hover:text-[#0B56E8]"
                    aria-label="Close destination panel and return to global view"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* State / Emirate / Province Switcher for Multi-Region Countries */}
                {siblingStates.length > 1 && (
                  <div className="mb-2.5 rounded-2xl border border-[#DCE5F2] bg-[#F4F7FC] p-2.5">
                    <span className="font-mono-hud mb-1.5 block text-[9px] font-bold tracking-wider text-[#5B708D] uppercase">
                      Switch Region in {selectedDestination.country}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {siblingStates.map((st) => {
                        const active = st.slug === selectedDestination.slug;
                        return (
                          <button
                            key={st.slug}
                            type="button"
                            onClick={() => handleSelectDestination(st)}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                              active
                                ? 'bg-[#091933] text-white'
                                : 'border border-[#DCE5F2] bg-white text-[#091933] hover:border-[#0B56E8] hover:text-[#0B56E8]'
                            }`}
                          >
                            {st.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="img-frame relative mb-2.5 rounded-2xl border border-[#DCE5F2]">
                  <img
                    src={selectedDestination.image}
                    alt={selectedDestination.imageAlt}
                    width={420}
                    height={132}
                    className="h-28 w-full object-cover"
                    loading="lazy"
                  />
                  <span className="font-mono-hud absolute bottom-2 left-2 rounded-full bg-[#091933]/90 px-2.5 py-0.5 text-[10px] font-medium text-white">
                    {formatCoordinates(selectedDestination.lat, selectedDestination.lng)}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-[#3B4F6B]">
                  {selectedDestination.shortDescription}
                </p>

                {/* Origin -> Destination Illustrative Route Context */}
                <div className="mt-2.5 rounded-2xl border border-[#DCE5F2] bg-[#F4F7FC] p-2.5 text-[11px] text-[#3B4F6B]">
                  {isLocalSameCityMatch ? (
                    <>
                      <div className="font-mono-hud font-bold text-[#091933]">
                        LOCAL DEPARTURE · {originCity.city.toUpperCase()} ({originCity.code})
                      </div>
                      <p className="mt-1 text-[10px] leading-snug">
                        Coordinated via our {originHub.city} ({originHub.code}) desk. Select another
                        departure city to preview an international route.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="font-mono-hud flex items-center justify-between font-bold text-[#091933]">
                        <span>
                          {originCity.code} → {selectedDestination.name.toUpperCase()}
                        </span>
                        <span className="text-[#0B56E8]">
                          ~{haversineKm(originCity, selectedDestination).toLocaleString()} km
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] leading-snug">
                        Illustrative route from {originCity.city} for {selection.service} ({selection.travellers}{' '}
                        {selection.travellers === 1 ? 'traveller' : 'travellers'}) — not a live
                        flight schedule.
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/destinations/${selectedDestination.slug}/`}
                    className="btn-kinetic flex-1 px-3.5 py-2.5 text-xs"
                  >
                    <span>Explore {selectedDestination.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link href={planJourneyHref} className="btn-outline-kinetic px-3.5 py-2 text-xs">
                    <span>Plan</span>
                  </Link>
                </div>
              </aside>
            ) : selectedHub ? (
              <aside className="atlas-panel w-full rounded-3xl p-4 sm:p-5" aria-live="polite">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono-hud inline-flex items-center gap-1.5 rounded-full bg-[#F5A623]/18 px-2.5 py-0.5 text-[10px] font-bold text-[#091933] uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F5A623]" />
                      EzyQuick Office Hub · {selectedHub.code}
                    </span>
                    <h2 className="font-editorial mt-1 text-2xl font-semibold text-[#091933]">
                      {selectedHub.city}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetGlobalView}
                    className="rounded-full border border-[#DCE5F2] bg-[#F4F7FC] p-1.5 text-[#3B4F6B] hover:border-[#0B56E8] hover:text-[#0B56E8]"
                    aria-label="Close hub card"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs font-semibold text-[#0B56E8]">{selectedHub.role}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#3B4F6B]">{selectedHub.address}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#DCE5F2] pt-3">
                  <div className="rounded-xl bg-[#F4F7FC] p-2.5">
                    <span className="font-mono-hud block text-[9px] text-[#5B708D]">COORDINATES</span>
                    <span className="font-mono-hud text-[10px] font-semibold text-[#091933]">
                      {formatCoordinates(selectedHub.lat, selectedHub.lng)}
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#F4F7FC] p-2.5">
                    <span className="font-mono-hud block text-[9px] text-[#5B708D]">TIMEZONE</span>
                    <span className="font-mono-hud text-[10px] font-semibold text-[#091933]">
                      {selectedHub.timezone}
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 flex flex-col gap-2">
                  <a href={selectedHub.phoneHref} className="btn-kinetic w-full px-4 py-2.5 text-xs">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Call {selectedHub.phoneDisplay}</span>
                  </a>
                  <Link
                    href={`/plan-your-journey/?desk=${selectedHub.id}&origin=${encodeURIComponent(originCity.city)}`}
                    className="btn-outline-kinetic w-full px-4 py-2 text-xs"
                  >
                    <span>Enquire with {selectedHub.city} Desk</span>
                  </Link>
                </div>
              </aside>
            ) : (
              <div className="atlas-panel hidden rounded-3xl p-5 lg:block">
                <span className="font-mono-hud text-[10px] font-bold tracking-wider text-[#0B56E8] uppercase">
                  Live Flight Atlas
                </span>
                <h2 className="font-editorial mt-1 text-xl font-semibold text-[#091933]">
                  Two Offices. Global Departures.
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[#3B4F6B]">
                  Rotate the 3D Earth or use the booking dock below to preview live country
                  highlights and Airbus A350 routes from{' '}
                  <strong className="text-[#091933]">{originCity.city}</strong>.
                </p>

                <div className="mt-3.5 space-y-2 border-t border-[#DCE5F2] pt-3 text-[11px] text-[#3B4F6B]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F5A623]" />
                    <span>
                      <strong className="text-[#091933]">DEL &amp; DXB Hubs:</strong> Solar Gold
                      beacons
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full border-2 border-[#0B56E8] bg-[#60A5FA]" />
                    <span>
                      <strong className="text-[#091933]">Departure:</strong> {originCity.country} (
                      {originCity.code})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 shrink-0 text-[#0B56E8]" aria-hidden="true" />
                    <span>
                      <strong className="text-[#091933]">14 Curated Pins:</strong> 10 International ·
                      4 India States
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DRIBBBLE-INSPIRED FLOATING HORIZONTAL FLIGHT & JOURNEY BOOKING DOCK */}
        <div
          className="relative z-30 mt-3"
          aria-label="Interactive journey booking dock"
        >
          {/* Service Mode Pill Tabs (attached cleanly above the dock) */}
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {QUICK_SERVICE_TABS.map((tab) => {
              const active = selection.service === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setService(tab.value)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#091933] text-white shadow-sm'
                      : 'border border-[#DCE5F2] bg-white/90 text-[#3B4F6B] hover:border-[#0B56E8] hover:text-[#0B56E8]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Sleek Single-Row White Booking Bar */}
          <div className="atlas-panel rounded-3xl p-3 sm:p-4">
            <div className="grid grid-cols-1 items-end gap-2.5 md:grid-cols-2 lg:grid-cols-12">
              {/* Quick Search (Country / City / State) */}
              <div className="relative lg:col-span-3">
                <label
                  htmlFor="atlas-search"
                  className="font-mono-hud mb-1 block text-[10px] font-bold text-[#5B708D] uppercase"
                >
                  Search Country, City or State
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#0B56E8]"
                    aria-hidden="true"
                  />
                  <input
                    id="atlas-search"
                    type="search"
                    value={searchQuery}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => window.setTimeout(() => setSearchFocused(false), 160)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchFocused(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchResults.length > 0) {
                        e.preventDefault();
                        handleSelectDestination(searchResults[0]);
                      }
                    }}
                    placeholder="Bali, Ladakh, Emirate, Thailand…"
                    aria-label="Search destinations by country, city, or state"
                    className="w-full rounded-2xl border border-[#DCE5F2] bg-[#F4F7FC] py-2.5 pr-3 pl-9 text-xs font-semibold text-[#091933] placeholder:text-[#5B708D] focus-visible:border-[#0B56E8] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#0B56E8]/20"
                  />
                </div>
                {searchFocused && searchQuery.trim().length > 0 && (
                  <div
                    role="listbox"
                    aria-label="Globe search results"
                    className="absolute right-0 bottom-full left-0 z-50 mb-2 overflow-hidden rounded-2xl border border-[#DCE5F2] bg-white shadow-2xl"
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((dest) => (
                        <button
                          key={dest.slug}
                          type="button"
                          role="option"
                          aria-selected={selectedDestination?.slug === dest.slug}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectDestination(dest);
                          }}
                          className="flex w-full items-center justify-between gap-2 border-b border-[#DCE5F2]/60 px-3.5 py-2.5 text-left text-xs transition-colors last:border-b-0 hover:bg-[#F4F7FC]"
                        >
                          <span className="font-bold text-[#091933]">{dest.name}</span>
                          <span className="font-mono-hud text-[10px] text-[#5B708D]">
                            {dest.stateOrProvince} · {dest.country}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-3.5 py-2.5 text-xs text-[#5B708D]">
                        No direct pin matches &ldquo;{searchQuery}&rdquo; — request any global
                        destination in{' '}
                        <Link href={planJourneyHref} className="font-semibold text-[#0B56E8] underline">
                          Plan Your Journey
                        </Link>
                        .
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Departure City (Worldwide) */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="atlas-origin"
                  className="font-mono-hud mb-1 block text-[10px] font-bold text-[#5B708D] uppercase"
                >
                  Departure City
                </label>
                <select
                  id="atlas-origin"
                  value={originCity.city}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full rounded-2xl border border-[#DCE5F2] bg-[#F4F7FC] px-3 py-2.5 text-xs font-semibold text-[#091933] focus-visible:border-[#0B56E8] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#0B56E8]/20"
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

              {/* Destination Selector */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="atlas-destination"
                  className="font-mono-hud mb-1 block text-[10px] font-bold text-[#5B708D] uppercase"
                >
                  Destination
                </label>
                <select
                  id="atlas-destination"
                  value={selection.destinationSlug || ''}
                  onChange={(e) => selectDestinationBySlug(e.target.value || null)}
                  className="w-full rounded-2xl border border-[#DCE5F2] bg-[#F4F7FC] px-3 py-2.5 text-xs font-semibold text-[#091933] focus-visible:border-[#0B56E8] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#0B56E8]/20"
                >
                  <option value="">Global View (All 14)</option>
                  <optgroup label="International (10)">
                    {ATLAS_DESTINATIONS.filter((d) => d.region === 'International').map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name} ({d.country})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="India States & UTs (4)">
                    {ATLAS_DESTINATIONS.filter((d) => d.region === 'India').map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name} ({d.stateOrProvince})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Full Service Dropdown */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="atlas-service"
                  className="font-mono-hud mb-1 block text-[10px] font-bold text-[#5B708D] uppercase"
                >
                  Service
                </label>
                <select
                  id="atlas-service"
                  value={selection.service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-2xl border border-[#DCE5F2] bg-[#F4F7FC] px-3 py-2.5 text-xs font-semibold text-[#091933] focus-visible:border-[#0B56E8] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#0B56E8]/20"
                >
                  {SERVICE_OPTIONS.map((svc) => (
                    <option key={svc} value={svc}>
                      {svc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Travellers */}
              <div className="lg:col-span-1">
                <label
                  htmlFor="atlas-travellers"
                  className="font-mono-hud mb-1 block text-[10px] font-bold text-[#5B708D] uppercase"
                >
                  Guests
                </label>
                <div className="flex items-center justify-between rounded-2xl border border-[#DCE5F2] bg-[#F4F7FC] px-1.5 py-1.5">
                  <button
                    type="button"
                    onClick={() => setTravellers(selection.travellers - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-[#091933] shadow-2xs hover:text-[#0B56E8]"
                    aria-label="Decrease travellers"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span
                    id="atlas-travellers"
                    className="font-mono-hud flex items-center gap-0.5 text-xs font-bold text-[#091933]"
                  >
                    <Users className="h-3 w-3 text-[#0B56E8]" aria-hidden="true" />
                    {selection.travellers}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTravellers(selection.travellers + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-[#091933] shadow-2xs hover:text-[#0B56E8]"
                    aria-label="Increase travellers"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Primary Booking CTA */}
              <div className="lg:col-span-2">
                <Link
                  href={planJourneyHref}
                  className="btn-kinetic w-full py-3 text-xs sm:text-sm"
                >
                  <span>Plan Your Journey</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM REGION FILTERS, ZOOM CONTROLS & 14-DESTINATION RAIL */}
        <div className="relative z-30 mt-3 flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Filter destinations by region"
            >
              {REGION_FILTERS.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setRegionFilter(region)}
                  className={`atlas-pill rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                    selection.regionFilter === region ? 'atlas-pill-active' : ''
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {viewMode === '3d' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleZoom(-0.75)}
                    className="atlas-pill rounded-full p-2"
                    aria-label="Zoom in on globe"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleZoom(0.75)}
                    className="atlas-pill rounded-full p-2"
                    aria-label="Zoom out from globe"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleResetGlobalView}
                className="atlas-pill flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[#0B56E8]" aria-hidden="true" />
                <span>Return to Global View</span>
              </button>
            </div>
          </div>

          {/* 14-Destination Keyboard-Accessible Selector Rail */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {visibleDestinations.map((dest) => {
              const isSelected = selectedDestination?.slug === dest.slug;
              return (
                <button
                  key={dest.slug}
                  type="button"
                  onClick={() => handleSelectDestination(dest)}
                  className={`atlas-pill shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold ${
                    isSelected ? 'atlas-pill-active' : ''
                  }`}
                >
                  {dest.name}
                </button>
              );
            })}
          </div>

          {/* Live Coordinate Readout & Honest Attribution */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DCE5F2] pt-2 text-[11px] text-[#3B4F6B]">
            <div className="font-mono-hud flex items-center gap-2 font-semibold text-[#091933]">
              <span
                className={`h-2 w-2 rounded-full ${
                  atlasReady || viewMode === '2d' ? 'bg-[#0B56E8]' : 'bg-[#F5A623] animate-pulse'
                }`}
              />
              <span>{activeCoordsReadout}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#5B708D]">
              <Info className="h-3 w-3 shrink-0 text-[#0B56E8]" aria-hidden="true" />
              <span>
                Boundaries: Natural Earth 1:50m (Public Domain) via world-atlas (ISC). 3D A350:
                amvlab (CC BY 4.0). Aircraft flight route is illustrative.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
