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
  Users,
  X,
} from 'lucide-react';
import {
  ATLAS_DESTINATIONS,
  ATLAS_HUBS,
  REGION_FILTERS,
  type AtlasDestination,
  type AtlasHub,
} from '@/data/atlas';
import { SERVICE_OPTIONS } from '@/lib/enquiry-schema';
import { formatCoordinates, haversineKm } from '@/lib/geo';
import { useJourneySelection, type OriginHubName } from '@/lib/journey-selection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { FallbackAtlas2D } from './FallbackAtlas2D';

const GlobalAtlasCanvas = dynamic(
  () => import('./GlobalAtlasCanvas').then((m) => m.GlobalAtlasCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#DCE8F8] border-t-[#0059FD]" />
        <p className="font-mono-hud text-xs font-medium tracking-wider text-[#475B78] uppercase">
          Loading EzyQuick Global Atlas…
        </p>
      </div>
    ),
  }
);

interface GlobalAtlasExperienceProps {
  mode?: 'hero' | 'destinations';
}

export function GlobalAtlasExperience({ mode = 'hero' }: GlobalAtlasExperienceProps) {
  const reducedMotion = useReducedMotion();
  const device = useDeviceTier();

  const {
    selection,
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
  const [zoomEvent, setZoomEvent] = useState<{ delta: number; seq: number }>({ delta: 0, seq: 0 });
  const [resetCounter, setResetCounter] = useState(0);
  const [atlasReady, setAtlasReady] = useState(false);

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
    return null;
  }, [selectedDestination, selectedHub, device.isMobile]);

  const handleSelectDestination = (dest: AtlasDestination) => {
    setFollowFlight(false);
    selectDestinationBySlug(dest.slug);
  };

  const handleSelectHub = (hub: AtlasHub) => {
    setFollowFlight(false);
    selectHub(hub.id);
  };

  const handleResetGlobalView = () => {
    setFollowFlight(false);
    resetToGlobalView();
    setResetCounter((c) => c + 1);
  };

  const handleZoom = (delta: number) => {
    setFollowFlight(false);
    setZoomEvent((prev) => ({ delta, seq: prev.seq + 1 }));
  };

  const planJourneyHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set('desk', originHub.id);
    params.set('service', selection.service);
    if (selectedDestination) params.set('destination', selectedDestination.name);
    if (selection.travellers) params.set('travellers', String(selection.travellers));
    return `/plan-your-journey/?${params.toString()}`;
  }, [originHub.id, selection.service, selection.travellers, selectedDestination]);

  const activeCoordsReadout = selectedDestination
    ? `${selectedDestination.name.toUpperCase()} · ${formatCoordinates(selectedDestination.lat, selectedDestination.lng)}`
    : selectedHub
      ? `${selectedHub.code} OFFICE HUB · ${formatCoordinates(selectedHub.lat, selectedHub.lng)}`
      : `ORIGIN ${originHub.code} · DEL 28.6519° N ↔ DXB 25.1212° N`;

  const globeCanvasNode =
    viewMode === '3d' ? (
      <GlobalAtlasCanvas
        visibleDestinations={visibleDestinations}
        originHub={originHub}
        selectedDestination={selectedDestination}
        selectedHub={selectedHub}
        regionFilter={selection.regionFilter}
        focusTarget={focusTarget}
        followFlight={followFlight}
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
        originHub={originHub}
        selectedDestination={selectedDestination}
        selectedHub={selectedHub}
        onSelectDestination={handleSelectDestination}
        onSelectHub={handleSelectHub}
        reason="2D Interactive Atlas — Keyboard & Non-WebGL Parity"
      />
    );

  const isLocalDubaiMatch =
    originHub.id === 'dubai' && selectedDestination?.slug === 'dubai';

  return (
    <section
      id="global-atlas"
      className="atlas-hero-bg relative w-full overflow-hidden border-b border-[#DCE8F8] pt-20 sm:pt-24"
      aria-label="EzyQuick Global Atlas Interactive 3D Experience"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-4 pb-8 sm:px-8 lg:min-h-[calc(100svh-5rem)] lg:justify-between lg:pb-9">
        {/* TOP UTILITY BAR: Office Hub Focus + 3D/2D Mode Switch */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 pb-3">
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
                  <span className="h-2 w-2 rounded-full bg-[#FDBC03]" />
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
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Global View</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {viewMode === '3d' && !reducedMotion && (
              <button
                type="button"
                onClick={() => setFollowFlight((f) => !f)}
                className={`atlas-pill font-mono-hud flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                  followFlight ? 'atlas-pill-active' : ''
                }`}
                aria-pressed={followFlight}
              >
                <Plane
                  className={`h-3.5 w-3.5 ${followFlight ? 'text-[#FDBC03]' : 'text-[#0059FD]'}`}
                  aria-hidden="true"
                />
                <span>{followFlight ? 'Following Flight' : 'Follow Aircraft'}</span>
              </button>
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
                  <MapIcon className="h-3.5 w-3.5 text-[#0059FD]" aria-hidden="true" />
                  <span>2D Map</span>
                </>
              ) : (
                <>
                  <Globe className="h-3.5 w-3.5 text-[#0059FD]" aria-hidden="true" />
                  <span>3D Globe</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* MAIN STAGE: Single WebGL Canvas — full-bleed on desktop, cleanly stacked on mobile */}
        <div className="relative grid flex-1 grid-cols-1 items-center gap-6 lg:grid-cols-12">
          {/* LEFT: Crisp International Travel Hero & Structured Journey Selector */}
          <div
            className={`pointer-events-auto relative z-30 transition-[background-color,box-shadow,padding] duration-300 lg:col-span-4 ${
              followFlight
                ? 'lg:rounded-3xl lg:border lg:border-[#DCE8F8]/90 lg:bg-white/88 lg:p-5 lg:shadow-[0_18px_40px_-18px_rgba(12,30,58,0.18)] lg:backdrop-blur-md'
                : ''
            }`}
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DCE8F8] bg-white/95 px-3 py-1 text-xs font-semibold text-[#174A9C] shadow-xs">
              <Compass className="h-3.5 w-3.5 text-[#0059FD]" aria-hidden="true" />
              <span>New Delhi &amp; Dubai · International Travel Desk</span>
            </div>

            {mode === 'hero' ? (
              <h1 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-[#0C1E3A] sm:text-5xl lg:text-[3.05rem]">
                Your World.{' '}
                <span className="text-[#0059FD]">Better Connected.</span>
              </h1>
            ) : (
              <h1 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-[#0C1E3A] sm:text-5xl">
                Explore 14{' '}
                <span className="text-[#0059FD]">Verified Destinations.</span>
              </h1>
            )}

            <p className="mt-3.5 max-w-[350px] text-sm leading-relaxed text-[#475B78] sm:text-base">
              {mode === 'hero'
                ? 'Coordinated corporate, medical, and leisure travel across India, the UAE, and Asia — backed by reachable desks in New Delhi and Dubai.'
                : 'Rotate the 3D Earth, filter by region, or select any destination to view geographic highlights and start a custom itinerary.'}
            </p>

            {/* Structured Journey Selection Card (Shared state ready for Phase 2 vehicle sync) */}
            <div
              className="atlas-panel mt-5 rounded-2xl p-3.5 sm:p-4"
              aria-label="Interactive journey selection controls"
            >
              <div className="grid grid-cols-2 gap-2.5">
                {/* Origin Hub */}
                <div>
                  <label
                    htmlFor="atlas-origin"
                    className="font-mono-hud mb-1 block text-[10px] font-semibold text-[#647896] uppercase"
                  >
                    Origin Hub
                  </label>
                  <select
                    id="atlas-origin"
                    value={selection.origin}
                    onChange={(e) => setOrigin(e.target.value as OriginHubName)}
                    className="w-full rounded-xl border border-[#DCE8F8] bg-[#F4F7FC] px-2.5 py-2 text-xs font-semibold text-[#0C1E3A] focus-visible:border-[#0059FD] focus-visible:ring-2 focus-visible:ring-[#0059FD]/25"
                  >
                    <option value="New Delhi">New Delhi (DEL)</option>
                    <option value="Dubai">Dubai (DXB)</option>
                  </select>
                </div>

                {/* Destination Selector */}
                <div>
                  <label
                    htmlFor="atlas-destination"
                    className="font-mono-hud mb-1 block text-[10px] font-semibold text-[#647896] uppercase"
                  >
                    Destination
                  </label>
                  <select
                    id="atlas-destination"
                    value={selection.destinationSlug || ''}
                    onChange={(e) => selectDestinationBySlug(e.target.value || null)}
                    className="w-full rounded-xl border border-[#DCE8F8] bg-[#F4F7FC] px-2.5 py-2 text-xs font-semibold text-[#0C1E3A] focus-visible:border-[#0059FD] focus-visible:ring-2 focus-visible:ring-[#0059FD]/25"
                  >
                    <option value="">Global View (All 14)</option>
                    <optgroup label="International (10)">
                      {ATLAS_DESTINATIONS.filter((d) => d.region === 'International').map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.name} ({d.country})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="India Regional (4)">
                      {ATLAS_DESTINATIONS.filter((d) => d.region === 'India').map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.name} (India)
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Travel Service */}
                <div>
                  <label
                    htmlFor="atlas-service"
                    className="font-mono-hud mb-1 block text-[10px] font-semibold text-[#647896] uppercase"
                  >
                    Service
                  </label>
                  <select
                    id="atlas-service"
                    value={selection.service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE8F8] bg-[#F4F7FC] px-2.5 py-2 text-xs font-semibold text-[#0C1E3A] focus-visible:border-[#0059FD] focus-visible:ring-2 focus-visible:ring-[#0059FD]/25"
                  >
                    {SERVICE_OPTIONS.map((svc) => (
                      <option key={svc} value={svc}>
                        {svc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Travellers */}
                <div>
                  <label
                    htmlFor="atlas-travellers"
                    className="font-mono-hud mb-1 block text-[10px] font-semibold text-[#647896] uppercase"
                  >
                    Travellers
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-[#DCE8F8] bg-[#F4F7FC] px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => setTravellers(selection.travellers - 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[#0C1E3A] shadow-xs hover:text-[#0059FD]"
                      aria-label="Decrease travellers"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span
                      id="atlas-travellers"
                      className="font-mono-hud flex items-center gap-1 text-xs font-bold text-[#0C1E3A]"
                    >
                      <Users className="h-3 w-3 text-[#0059FD]" aria-hidden="true" />
                      {selection.travellers}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravellers(selection.travellers + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[#0C1E3A] shadow-xs hover:text-[#0059FD]"
                      aria-label="Increase travellers"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href={planJourneyHref} className="btn-kinetic px-6 py-3 text-sm">
                <span>Plan Your Journey</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              {mode === 'hero' ? (
                <button
                  type="button"
                  onClick={() => handleSelectDestination(ATLAS_DESTINATIONS[0])}
                  className="btn-outline-kinetic px-5 py-3 text-sm"
                >
                  <span>Explore the World</span>
                </button>
              ) : (
                <a href="#destination-directory" className="btn-outline-kinetic px-5 py-3 text-sm">
                  <span>Browse Full List</span>
                </a>
              )}
            </div>

            <p className="font-mono-hud mt-4 hidden text-[11px] text-[#647896] lg:block">
              Drag to rotate · Scroll or +/- to zoom · Click any marker
            </p>
          </div>

          {/* SINGLE ATLAS STAGE: 3D full-bleed on desktop; 2D neatly framed in center column so headline never collides */}
          <div
            className={
              viewMode === '3d'
                ? 'relative z-10 h-[370px] w-full sm:h-[460px] lg:absolute lg:inset-0 lg:z-10 lg:h-full'
                : 'relative z-20 flex w-full items-center justify-center lg:col-span-5'
            }
          >
            {globeCanvasNode}
          </div>

          {/* Desktop center spacer used only when 3D canvas is full-bleed */}
          {viewMode === '3d' && (
            <div
              className="hidden lg:pointer-events-none lg:col-span-5 lg:block lg:h-[600px]"
              aria-hidden="true"
            />
          )}

          {/* RIGHT: Crisp White Contextual Inspector Card (strictly z-40 above all 3D labels) */}
          <div className="relative z-40 lg:col-span-3">
            {selectedDestination ? (
              <aside className="atlas-panel w-full rounded-3xl p-4 sm:p-5" aria-live="polite">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono-hud rounded-full bg-[#DCE8F8] px-2 py-0.5 text-[10px] font-bold text-[#174A9C] uppercase">
                        {selectedDestination.region === 'India' ? 'Regional · India' : 'International'}
                      </span>
                      <span className="font-mono-hud text-[10px] font-semibold text-[#647896] uppercase">
                        {selectedDestination.country}
                      </span>
                    </div>
                    <h2 className="font-display mt-1 text-2xl font-extrabold text-[#0C1E3A]">
                      {selectedDestination.name}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetGlobalView}
                    className="rounded-full border border-[#DCE8F8] bg-[#F4F7FC] p-1.5 text-[#475B78] hover:border-[#0059FD] hover:text-[#0059FD]"
                    aria-label="Close destination panel and return to global view"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="img-frame relative mb-3 rounded-2xl border border-[#DCE8F8]">
                  <img
                    src={selectedDestination.image}
                    alt={selectedDestination.imageAlt}
                    width={420}
                    height={144}
                    className="h-36 w-full object-cover"
                    loading="lazy"
                  />
                  <span className="font-mono-hud absolute bottom-2 left-2 rounded-full bg-[#0C1E3A]/90 px-2.5 py-0.5 text-[10px] font-medium text-white">
                    {formatCoordinates(selectedDestination.lat, selectedDestination.lng)}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-[#475B78]">
                  {selectedDestination.shortDescription}
                </p>

                <ul className="mt-3 space-y-1.5 border-t border-[#DCE8F8] pt-3">
                  {selectedDestination.highlights.slice(0, 2).map((h) => (
                    <li key={h} className="flex items-start gap-2 text-xs text-[#0C1E3A]">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0059FD]" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Origin -> Destination Illustrative Route Context */}
                <div className="mt-3 rounded-2xl border border-[#DCE8F8] bg-[#F4F7FC] p-3 text-[11px] text-[#475B78]">
                  {isLocalDubaiMatch ? (
                    <>
                      <div className="font-mono-hud font-bold text-[#0C1E3A]">
                        DXB LOCAL HUB · DUBAI SILICON OASIS
                      </div>
                      <p className="mt-1 text-[10px] leading-snug">
                        Supported locally by our Dubai office. Switch Origin Hub to New Delhi to
                        preview the DEL → Dubai illustrative connection.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="font-mono-hud flex items-center justify-between font-bold text-[#0C1E3A]">
                        <span>
                          {originHub.code} → {selectedDestination.name.toUpperCase()}
                        </span>
                        <span className="text-[#0059FD]">
                          ~{haversineKm(originHub, selectedDestination).toLocaleString()} km
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] leading-snug">
                        Illustrative geographic route for {selection.service} ({selection.travellers}{' '}
                        {selection.travellers === 1 ? 'traveller' : 'travellers'}) — not a live
                        flight schedule or confirmed booking.
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href={`/destinations/${selectedDestination.slug}/`}
                    className="btn-kinetic w-full px-4 py-2.5 text-xs"
                  >
                    <span>Explore {selectedDestination.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link href={planJourneyHref} className="btn-outline-kinetic w-full px-4 py-2 text-xs">
                    <span>Plan This Journey</span>
                  </Link>
                </div>
              </aside>
            ) : selectedHub ? (
              <aside className="atlas-panel w-full rounded-3xl p-4 sm:p-5" aria-live="polite">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono-hud inline-flex items-center gap-1.5 rounded-full bg-[#FDBC03]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#0C1E3A] uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FDBC03]" />
                      EzyQuick Office Hub · {selectedHub.code}
                    </span>
                    <h2 className="font-display mt-1 text-2xl font-extrabold text-[#0C1E3A]">
                      {selectedHub.city}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetGlobalView}
                    className="rounded-full border border-[#DCE8F8] bg-[#F4F7FC] p-1.5 text-[#475B78] hover:border-[#0059FD] hover:text-[#0059FD]"
                    aria-label="Close hub card"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs font-semibold text-[#174A9C]">{selectedHub.role}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#475B78]">{selectedHub.address}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#DCE8F8] pt-3">
                  <div className="rounded-xl bg-[#F4F7FC] p-2.5">
                    <span className="font-mono-hud block text-[9px] text-[#647896]">COORDINATES</span>
                    <span className="font-mono-hud text-[10px] font-semibold text-[#0C1E3A]">
                      {formatCoordinates(selectedHub.lat, selectedHub.lng)}
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#F4F7FC] p-2.5">
                    <span className="font-mono-hud block text-[9px] text-[#647896]">TIMEZONE</span>
                    <span className="font-mono-hud text-[10px] font-semibold text-[#0C1E3A]">
                      {selectedHub.timezone}
                    </span>
                  </div>
                </div>

                <p className="mt-3 rounded-xl border border-[#DCE8F8] bg-[#F4F7FC] p-2.5 text-[10px] text-[#475B78]">
                  Physical EzyQuick office hub. Illustrative DEL ↔ DXB corridor shown — not a live
                  flight schedule.
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  <a href={selectedHub.phoneHref} className="btn-kinetic w-full px-4 py-2.5 text-xs">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Call {selectedHub.phoneDisplay}</span>
                  </a>
                  <Link
                    href={`/plan-your-journey/?desk=${selectedHub.id}`}
                    className="btn-outline-kinetic w-full px-4 py-2 text-xs"
                  >
                    <span>Enquire with {selectedHub.city} Desk</span>
                  </Link>
                </div>
              </aside>
            ) : (
              <div className="atlas-panel hidden rounded-3xl p-5 lg:block">
                <span className="font-mono-hud text-[10px] font-bold tracking-wider text-[#0059FD] uppercase">
                  Global Atlas Overview
                </span>
                <h2 className="font-display mt-1 text-xl font-extrabold text-[#0C1E3A]">
                  Two Offices. 14 Verified Destinations.
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-[#475B78]">
                  Select any marker on the globe or choose a destination from your journey controls
                  to inspect highlights and view an illustrative route from {originHub.city}.
                </p>

                {/* Marker Legend */}
                <div className="mt-4 space-y-2 border-t border-[#DCE8F8] pt-3 text-[11px] text-[#475B78]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FDBC03] ring-2 ring-[#0C1E3A]/15" />
                    <span>
                      <strong className="text-[#0C1E3A]">EzyQuick Hubs (2):</strong> New Delhi &amp;
                      Dubai offices
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full border-2 border-[#0059FD] bg-white" />
                    <span>
                      <strong className="text-[#0C1E3A]">International (10):</strong> UAE, Asia &amp;
                      Central Asia
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full border-2 border-[#0C1E3A] bg-[#6EC8FF]" />
                    <span>
                      <strong className="text-[#0C1E3A]">Regional (4):</strong> Kerala, Goa,
                      Andaman, Ladakh
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM CONTROL DECK: Region Hierarchy + Zoom + Reset + 14-Destination Rail */}
        <div className="relative z-30 mt-4 flex flex-col gap-3">
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
                <RotateCcw className="h-3.5 w-3.5 text-[#0059FD]" aria-hidden="true" />
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
                  className={`atlas-pill shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold ${
                    isSelected ? 'atlas-pill-active' : ''
                  }`}
                >
                  {dest.name}
                </button>
              );
            })}
          </div>

          {/* Live Coordinate Readout & Honest Attribution */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DCE8F8] pt-2.5 text-[11px] text-[#475B78]">
            <div className="font-mono-hud flex items-center gap-2 font-semibold text-[#0C1E3A]">
              <span
                className={`h-2 w-2 rounded-full ${
                  atlasReady || viewMode === '2d' ? 'bg-[#0059FD]' : 'bg-[#FDBC03] animate-pulse'
                }`}
              />
              <span>{activeCoordsReadout}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#647896]">
              <Info className="h-3 w-3 shrink-0 text-[#0059FD]" aria-hidden="true" />
              <span>
                Boundaries: Natural Earth 1:50m (Public Domain) via world-atlas (ISC). Surface
                shading is procedural visual shading. 3D aircraft route is illustrative.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
