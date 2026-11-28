'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Compass,
  Expand,
  Gem,
  Images,
  Mountain,
  Palmtree,
  X,
} from 'lucide-react';
import {
  PORTAL_TRAVEL_MODES,
  type PortalDestination,
  type PortalTravelMode,
} from '@/data/destination-portals';

interface PortalTelemetryHudProps {
  portals: PortalDestination[];
  activeIndex: number;
  activePortal: PortalDestination;
  isExpanded: boolean;
  activeMode: PortalTravelMode;
  originCode: 'DEL' | 'DXB';
  planHref: string;
  reducedMotion: boolean;
  onSelectMode: (mode: PortalTravelMode) => void;
  onSelectIndex: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleExpand: () => void;
  onOpenGallery: () => void;
}

const MODE_ICON_MAP = {
  all: Compass,
  leisure: Palmtree,
  adventure: Mountain,
  corporate: Briefcase,
  luxury: Gem,
} as const;

export function PortalTelemetryHud({
  portals,
  activeIndex,
  activePortal,
  isExpanded,
  activeMode,
  originCode,
  planHref,
  reducedMotion,
  onSelectMode,
  onSelectIndex,
  onPrev,
  onNext,
  onToggleExpand,
  onOpenGallery,
}: PortalTelemetryHudProps) {
  const titleBlockRef = useRef<HTMLDivElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);
  const profilePathRef = useRef<SVGPathElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  const flightDuration =
    originCode === 'DXB' ? activePortal.flightFromDxb : activePortal.flightFromDel;

  // Animate top-left stacked title + SVG route & climate sparklines on active destination change
  useEffect(() => {
    const titleEl = titleBlockRef.current;
    const routeEl = routePathRef.current;
    const profileEl = profilePathRef.current;
    const metricsEl = metricsRef.current;

    if (reducedMotion) {
      if (routeEl) {
        routeEl.style.strokeDasharray = 'none';
        routeEl.style.strokeDashoffset = '0';
      }
      if (profileEl) {
        profileEl.style.strokeDasharray = 'none';
        profileEl.style.strokeDashoffset = '0';
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (titleEl) {
        gsap.fromTo(
          titleEl,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.48, ease: 'power3.out' }
        );
      }

      if (routeEl) {
        const len = routeEl.getTotalLength();
        gsap.fromTo(
          routeEl,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' }
        );
      }

      if (profileEl) {
        const len = profileEl.getTotalLength();
        gsap.fromTo(
          profileEl,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 0.85, delay: 0.08, ease: 'power2.out' }
        );
      }

      if (metricsEl) {
        gsap.fromTo(
          metricsEl.querySelectorAll('[data-metric-roll]'),
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.42, stagger: 0.06, ease: 'power2.out' }
        );
      }
    });

    return () => ctx.revert();
  }, [activePortal.slug, isExpanded, originCode, reducedMotion]);

  const paddedIndex = String(activeIndex + 1).padStart(2, '0');
  const paddedTotal = String(portals.length).padStart(2, '0');

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-between p-4 sm:p-7 lg:p-10">
      {/* TOP BAR: Solar Gold Vertical Accent + Stacked Title (Left) & Close/Toggle (Right) */}
      <div className="flex items-start justify-between gap-4">
        <div className="pointer-events-auto flex items-stretch gap-3.5">
          {/* Signature Solar Gold Vertical Bar */}
          <span
            className="w-[3px] shrink-0 rounded-full bg-[#F5A623] shadow-[0_0_16px_rgba(198,161,107,0.55)]"
            aria-hidden="true"
          />
          <div ref={titleBlockRef}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-hud text-[10px] font-semibold tracking-[0.2em] text-[#60A5FA] uppercase">
                Destination Portals
              </span>
              <span className="text-[#DCE5F2]/35" aria-hidden="true">
                /
              </span>
              <span className="font-mono-hud text-[10px] font-semibold tracking-[0.16em] text-[#DCE5F2]/80 uppercase">
                {activePortal.regionBadge}
              </span>
            </div>
            <h2 className="font-display mt-1 text-2xl font-extrabold leading-[0.96] tracking-tight text-white uppercase sm:text-3xl lg:text-4xl">
              <span className="block">{activePortal.titleLines[0]}</span>
              <span className="block text-[#DCE5F2]/90">{activePortal.titleLines[1]}</span>
            </h2>
          </div>
        </div>

        {/* Top-Right: Minimalist Close / Expand Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          <span className="font-mono-hud hidden rounded-full border border-[#DCE5F2]/20 bg-[#091933]/65 px-3 py-1 text-[10px] font-semibold tracking-wider text-[#DCE5F2] uppercase backdrop-blur-md sm:inline-block">
            {isExpanded ? 'Horizon View · Esc to Browse' : 'Browse Portals · Click Card'}
          </span>
          <button
            type="button"
            onClick={onToggleExpand}
            className="portal-focus inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#DCE5F2]/28 bg-[#091933]/70 text-white backdrop-blur-md transition-[border-color,background-color,color,transform] duration-200 hover:scale-105 hover:border-[#F5A623] hover:text-[#F5A623]"
            aria-label={
              isExpanded
                ? `Collapse ${activePortal.detail.name} horizon view back to destination carousel`
                : `Expand ${activePortal.detail.name} into full-bleed horizon view`
            }
            title={isExpanded ? 'Collapse to Carousel (Esc)' : 'Expand Horizon View'}
          >
            {isExpanded ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Expand className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* LOWER HUD CLUSTER: Mid-Left Travel-Mode Filter Circles + Bottom 4-Column Telemetry Strip */}
      <div className="flex flex-col gap-4">
        {/* Mid-Left Circular Travel-Mode Filter Icons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="pointer-events-auto flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter destination portals by travel style"
          >
            {PORTAL_TRAVEL_MODES.map((mode) => {
              const Icon = MODE_ICON_MAP[mode.id];
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onSelectMode(mode.id)}
                  aria-pressed={isActive}
                  title={mode.label}
                  className={`portal-focus group inline-flex items-center gap-2 rounded-full border pr-3 pl-1.5 py-1 text-[11px] font-semibold backdrop-blur-md transition-[background-color,border-color,color,transform] duration-200 ${
                    isActive
                      ? 'border-[#F5A623] bg-[#091933]/85 text-white shadow-[0_8px_22px_-6px_rgba(198,161,107,0.45)]'
                      : 'border-[#DCE5F2]/22 bg-[#091933]/55 text-[#DCE5F2] hover:border-[#60A5FA] hover:text-white'
                  }`}
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                      isActive
                        ? 'bg-[#F5A623] text-[#091933]'
                        : 'bg-[#083FA8]/45 text-[#DCE5F2] group-hover:bg-[#0B56E8] group-hover:text-white'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-mono-hud tracking-wide uppercase">{mode.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Carousel Prev / Next Controls */}
          <div className="pointer-events-auto hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={onPrev}
              className="portal-focus inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DCE5F2]/24 bg-[#091933]/65 text-[#F4F7FC] backdrop-blur-md transition-colors hover:border-[#60A5FA] hover:bg-[#083FA8]/60 hover:text-white"
              aria-label="Previous destination portal"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="portal-focus inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DCE5F2]/24 bg-[#091933]/65 text-[#F4F7FC] backdrop-blur-md transition-colors hover:border-[#60A5FA] hover:bg-[#083FA8]/60 hover:text-white"
              aria-label="Next destination portal"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* BOTTOM 4-COLUMN SYNCHRONIZED TELEMETRY STRIP */}
        <div
          ref={metricsRef}
          className="pointer-events-auto grid grid-cols-2 items-center gap-3 rounded-2xl border border-[#DCE5F2]/18 bg-[#061124]/82 px-3.5 py-3 backdrop-blur-xl sm:gap-4 sm:px-5 sm:py-4 lg:grid-cols-12"
          aria-live="polite"
        >
          {/* Column 1: Animated SVG Route Silhouette + Primary Flight Metric */}
          <div className="flex items-center gap-3 lg:col-span-3">
            <svg
              viewBox="0 0 120 38"
              className="hidden h-9 w-24 shrink-0 sm:block"
              aria-hidden="true"
            >
              <path
                d={activePortal.routeSvgPath}
                fill="none"
                stroke="rgba(167, 185, 168, 0.22)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <path
                ref={routePathRef}
                d={activePortal.routeSvgPath}
                fill="none"
                stroke="#F5A623"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle
                cx={activePortal.routeOriginPoint[0]}
                cy={activePortal.routeOriginPoint[1]}
                r="2.8"
                fill="#60A5FA"
              />
              <circle
                cx={activePortal.routeDestPoint[0]}
                cy={activePortal.routeDestPoint[1]}
                r="3.2"
                fill="#F5A623"
              />
            </svg>
            <div className="min-w-0">
              <p className="font-mono-hud truncate text-[10px] font-semibold tracking-wider text-[#DCE5F2]/70 uppercase">
                Flight · {originCode}
              </p>
              <p
                data-metric-roll
                className="font-mono-hud mt-0.5 text-base font-bold text-white sm:text-lg"
              >
                {flightDuration}
              </p>
              <p className="font-mono-hud truncate text-[10px] text-[#60A5FA]">
                {activePortal.recommendedDays} Ideal
              </p>
            </div>
          </div>

          {/* Column 2: Animated SVG Season/Elevation Profile + Peak Window */}
          <div className="flex items-center gap-3 border-l border-[#DCE5F2]/12 pl-3 lg:col-span-3 lg:pl-4">
            <svg
              viewBox="0 0 120 38"
              className="hidden h-9 w-24 shrink-0 sm:block"
              aria-hidden="true"
            >
              <path
                d={activePortal.profileSvgPath}
                fill="none"
                stroke="rgba(220, 232, 248, 0.16)"
                strokeWidth="1.4"
              />
              <path
                ref={profilePathRef}
                d={activePortal.profileSvgPath}
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="min-w-0">
              <p className="font-mono-hud truncate text-[10px] font-semibold tracking-wider text-[#DCE5F2]/70 uppercase">
                Peak Season
              </p>
              <p
                data-metric-roll
                className="font-mono-hud mt-0.5 text-base font-bold text-white sm:text-lg"
              >
                {activePortal.peakSeason}
              </p>
              <p className="font-mono-hud truncate text-[10px] text-[#F5A623]">
                {activePortal.statusTag}
              </p>
            </div>
          </div>

          {/* Column 3: Circular 52px Destination Gallery Trigger */}
          <div className="flex items-center gap-3 border-t border-[#DCE5F2]/12 pt-2.5 lg:col-span-2 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
            <button
              type="button"
              onClick={onOpenGallery}
              className="portal-focus group relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full border-2 border-[#DCE5F2]/35 transition-[border-color,transform] duration-200 hover:scale-105 hover:border-[#0B56E8]"
              aria-label={`Open ${activePortal.detail.name} highlights and photo preview`}
            >
              <img
                src={activePortal.detail.image}
                alt={`${activePortal.detail.name} preview thumbnail`}
                width={52}
                height={52}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-[#091933]/45 opacity-0 transition-opacity group-hover:opacity-100">
                <Images className="h-4 w-4 text-white" aria-hidden="true" />
              </span>
            </button>
            <div className="min-w-0">
              <button
                type="button"
                onClick={onOpenGallery}
                className="portal-focus text-left text-xs font-semibold text-white transition-colors hover:text-[#60A5FA]"
              >
                Dossier Preview
              </button>
              <p className="font-mono-hud truncate text-[10px] text-[#DCE5F2]/65">
                {activePortal.detail.highlights.length} Highlights
              </p>
            </div>
          </div>

          {/* Column 4: Index Progress Track (01 — 08) + Action CTA */}
          <div className="flex flex-col justify-between gap-2.5 border-t border-[#DCE5F2]/12 pt-2.5 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono-hud text-xs font-bold text-white">
                {paddedIndex}{' '}
                <span className="font-normal text-[#DCE5F2]/45">— {paddedTotal}</span>
              </span>

              {/* Segment Progress Ticks */}
              <div
                className="flex flex-1 items-center gap-1"
                role="tablist"
                aria-label="Destination portal slides"
              >
                {portals.map((item, idx) => {
                  const selected = idx === activeIndex;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-label={`Jump to ${item.detail.name}`}
                      onClick={() => onSelectIndex(idx)}
                      className="portal-focus group flex h-4 flex-1 items-center"
                    >
                      <span
                        className={`block h-[3px] w-full rounded-full transition-[background-color,transform] duration-300 ${
                          selected
                            ? 'scale-y-125 bg-[#F5A623]'
                            : 'bg-[#DCE5F2]/25 group-hover:bg-[#60A5FA]/70'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={planHref}
                className="portal-focus inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#0B56E8] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_-8px_rgba(46,116,115,0.65)] transition-colors hover:bg-[#083FA8]"
              >
                <span>Plan This Trip</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                href={`/destinations/${activePortal.slug}/`}
                className="portal-focus inline-flex items-center justify-center rounded-full border border-[#DCE5F2]/25 bg-white/5 px-3.5 py-2 text-xs font-semibold text-[#F4F7FC] transition-colors hover:border-[#60A5FA] hover:text-[#60A5FA]"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
