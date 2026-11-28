'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  FOREGROUND_TRAVELER_SRC,
  PORTAL_DESTINATIONS,
  type PortalDestination,
  type PortalTravelMode,
} from '@/data/destination-portals';
import { useJourneySelection } from '@/lib/journey-selection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PortalCardTrack } from './PortalCardTrack';
import { PortalTelemetryHud } from './PortalTelemetryHud';
import { PortalGalleryModal } from './PortalGalleryModal';

export function DestinationPortalsSection() {
  const reducedMotion = useReducedMotion();
  const { selection, originHub, selectDestinationBySlug } = useJourneySelection();

  const [activeMode, setActiveMode] = useState<PortalTravelMode>('all');
  const [activeSlug, setActiveSlug] = useState<string>(PORTAL_DESTINATIONS[0].slug);
  const [prevBgPortal, setPrevBgPortal] = useState<PortalDestination>(PORTAL_DESTINATIONS[0]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const bgParallaxRef = useRef<HTMLDivElement>(null);
  const activeBgRef = useRef<HTMLDivElement>(null);
  const fgParallaxRef = useRef<HTMLDivElement>(null);
  const expansionCardRectRef = useRef<DOMRect | null>(null);
  const activePortalRef = useRef<PortalDestination>(PORTAL_DESTINATIONS[0]);
  const lastSyncedGlobalSlugRef = useRef<string | null>(null);

  const filteredPortals = useMemo(() => {
    if (activeMode === 'all') return PORTAL_DESTINATIONS;
    const matches = PORTAL_DESTINATIONS.filter((p) => p.modes.includes(activeMode));
    return matches.length > 0 ? matches : PORTAL_DESTINATIONS;
  }, [activeMode]);

  const activeIndex = useMemo(() => {
    const idx = filteredPortals.findIndex((p) => p.slug === activeSlug);
    return idx >= 0 ? idx : 0;
  }, [filteredPortals, activeSlug]);

  const activePortal = filteredPortals[activeIndex] ?? PORTAL_DESTINATIONS[0];
  const nextPortal =
    filteredPortals[(activeIndex + 1) % filteredPortals.length] ?? PORTAL_DESTINATIONS[0];

  // Keep ref of currently displayed portal for clean crossfade previous-buffer handoff
  useEffect(() => {
    activePortalRef.current = activePortal;
  }, [activePortal]);

  // Sync only when the user genuinely changes destination in the Global Atlas hero above
  useEffect(() => {
    const incomingSlug = selection.destinationSlug;
    if (!incomingSlug || incomingSlug === lastSyncedGlobalSlugRef.current) return;
    lastSyncedGlobalSlugRef.current = incomingSlug;
    const matching = PORTAL_DESTINATIONS.find((p) => p.slug === incomingSlug);
    if (matching && matching.slug !== activePortalRef.current.slug) {
      setPrevBgPortal(activePortalRef.current);
      setActiveMode('all');
      setActiveSlug(matching.slug);
    }
  }, [selection.destinationSlug]);

  // Transition Layer 1 horizon backdrop + whole-scene atmosphere & foreground recession
  useEffect(() => {
    const bgEl = activeBgRef.current;
    const fgEl = fgParallaxRef.current;
    if (!bgEl) return;

    const cardRect = expansionCardRectRef.current;
    expansionCardRectRef.current = null;

    if (reducedMotion) {
      gsap.set(bgEl, { clipPath: 'inset(0px 0px 0px 0px round 0px)', opacity: 1, scale: 1 });
      if (fgEl) {
        gsap.set(fgEl, {
          scale: isExpanded ? 0.85 : 1,
          yPercent: isExpanded ? 9 : 0,
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (cardRect && sectionRef.current) {
        const secRect = sectionRef.current.getBoundingClientRect();
        const top = Math.max(0, cardRect.top - secRect.top);
        const left = Math.max(0, cardRect.left - secRect.left);
        const right = Math.max(0, secRect.right - cardRect.right);
        const bottom = Math.max(0, secRect.bottom - cardRect.bottom);

        gsap.fromTo(
          bgEl,
          {
            clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px round 18px)`,
            scale: 1.11,
            opacity: 1,
          },
          {
            clipPath: 'inset(0px 0px 0px 0px round 0px)',
            scale: 1.02,
            opacity: 1,
            duration: 0.92,
            ease: 'power3.inOut',
          }
        );
      } else {
        gsap.fromTo(
          bgEl,
          { opacity: 0, scale: 1.06, clipPath: 'inset(0px 0px 0px 0px round 0px)' },
          { opacity: 1, scale: 1.01, duration: 0.78, ease: 'power2.out' }
        );
      }

      // Smoothly recede & lower foreground traveler when expanded so the full panoramic view opens up
      if (fgEl) {
        gsap.to(fgEl, {
          scale: isExpanded ? 0.84 : 1,
          yPercent: isExpanded ? 9 : 0,
          duration: 0.85,
          ease: 'power3.inOut',
          transformOrigin: '50% 100%',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [activePortal.slug, isExpanded, reducedMotion]);

  // Opposing 2.5D pointer parallax on desktop (Layer 1 moves gently opposite to Layer 3 traveler)
  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const section = sectionRef.current;
    const bgLayer = bgParallaxRef.current;
    const fgLayer = fgParallaxRef.current;
    if (!section || !bgLayer || !fgLayer) return;

    const bgX = gsap.quickTo(bgLayer, 'x', { duration: 0.7, ease: 'power3.out' });
    const bgY = gsap.quickTo(bgLayer, 'y', { duration: 0.7, ease: 'power3.out' });
    const fgX = gsap.quickTo(fgLayer, 'x', { duration: 0.55, ease: 'power3.out' });

    const handleMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      bgX(normX * -9);
      bgY(normY * -5);
      fgX(normX * 7);
    };

    const handleLeave = () => {
      bgX(0);
      bgY(0);
      fgX(0);
    };

    section.addEventListener('pointermove', handleMove, { passive: true });
    section.addEventListener('pointerleave', handleLeave, { passive: true });
    return () => {
      section.removeEventListener('pointermove', handleMove);
      section.removeEventListener('pointerleave', handleLeave);
    };
  }, [reducedMotion]);

  const switchToPortal = useCallback(
    (portal: PortalDestination, syncGlobal = true) => {
      if (portal.slug !== activePortalRef.current.slug) {
        setPrevBgPortal(activePortalRef.current);
        setActiveSlug(portal.slug);
      }
      if (syncGlobal) {
        selectDestinationBySlug(portal.slug);
      }
    },
    [selectDestinationBySlug]
  );

  const handleCardClick = useCallback(
    (index: number, cardRect: DOMRect) => {
      const target = filteredPortals[index];
      if (!target) return;
      expansionCardRectRef.current = cardRect;
      switchToPortal(target, true);
      setIsExpanded(true);
    },
    [filteredPortals, switchToPortal]
  );

  const handleSelectActiveOnly = useCallback(
    (index: number) => {
      const target = filteredPortals[index];
      if (!target || target.slug === activePortalRef.current.slug) return;
      setPrevBgPortal(activePortalRef.current);
      setActiveSlug(target.slug);
    },
    [filteredPortals]
  );

  const handleSelectIndex = useCallback(
    (index: number) => {
      const target = filteredPortals[index];
      if (!target) return;
      switchToPortal(target, true);
    },
    [filteredPortals, switchToPortal]
  );

  const handlePrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + filteredPortals.length) % filteredPortals.length;
    const target = filteredPortals[prevIdx];
    if (target) switchToPortal(target, true);
  }, [activeIndex, filteredPortals, switchToPortal]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % filteredPortals.length;
    const target = filteredPortals[nextIdx];
    if (target) switchToPortal(target, true);
  }, [activeIndex, filteredPortals, switchToPortal]);

  const handleSelectMode = useCallback(
    (mode: PortalTravelMode) => {
      setActiveMode(mode);
      const nextList =
        mode === 'all'
          ? PORTAL_DESTINATIONS
          : PORTAL_DESTINATIONS.filter((p) => p.modes.includes(mode));
      if (nextList.length > 0 && !nextList.some((p) => p.slug === activePortalRef.current.slug)) {
        setPrevBgPortal(activePortalRef.current);
        setActiveSlug(nextList[0].slug);
      }
    },
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (galleryOpen) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'Escape' && isExpanded) {
      e.preventDefault();
      setIsExpanded(false);
    }
  };

  // Also close expanded view on global Escape when gallery is not open
  useEffect(() => {
    if (!isExpanded || galleryOpen) return;
    const onGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', onGlobalKey);
    return () => window.removeEventListener('keydown', onGlobalKey);
  }, [isExpanded, galleryOpen]);

  const planHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set('desk', originHub.id);
    params.set('destination', activePortal.detail.name);
    params.set('service', activePortal.recommendedService);
    params.set('travellers', String(selection.travellers || 2));
    return `/plan-your-journey/?${params.toString()}`;
  }, [originHub.id, activePortal, selection.travellers]);

  return (
    <section
      ref={sectionRef}
      id="destination-portals"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="EzyQuick Destination Portals — Interactive 2.5D Horizon Showcase"
      className="portal-focus relative min-h-[92svh] w-full overflow-hidden bg-[#091933] text-white lg:h-[100svh] lg:min-h-[760px] lg:max-h-[1020px]"
    >
      {/* LAYER 1 (z-10): Dynamic Full-Bleed Panoramic Horizon Backdrop */}
      <div
        ref={bgParallaxRef}
        className="pointer-events-none absolute -inset-4 z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Previous Horizon Buffer (prevents flashes during crossfade or clip-path expansion) */}
        <img
          src={prevBgPortal.detail.image}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover brightness-[0.88] saturate-[1.08]"
          style={{ objectPosition: prevBgPortal.horizonObjectPosition }}
        />

        {/* Active Expanding Horizon Layer */}
        <div ref={activeBgRef} className="absolute inset-0 will-change-[clip-path,transform,opacity]">
          <img
            src={activePortal.detail.image}
            alt={activePortal.detail.imageAlt}
            width={1920}
            height={1080}
            className="h-full w-full object-cover brightness-[0.94] saturate-[1.12] transition-[filter] duration-700"
            style={{ objectPosition: activePortal.horizonObjectPosition }}
          />
        </div>

        {/* Dynamic Destination Sky & Sunlight Atmosphere Bloom (transforms per selected destination) */}
        <div
          className="absolute inset-0 transition-[background] duration-1000"
          style={{ background: activePortal.atmosphere.skyBloom }}
        />

        {/* Drifting Volumetric Air & Horizon Mist Currents */}
        {!reducedMotion && (
          <>
            <div
              className="portal-air-drift-slow absolute -inset-x-1/4 top-[14%] h-[42%] rounded-full blur-3xl transition-colors duration-1000"
              style={{
                background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${activePortal.atmosphere.airMist}, transparent 72%)`,
              }}
            />
            <div
              className="portal-air-drift-reverse absolute -inset-x-1/4 top-[38%] h-[34%] rounded-full blur-3xl transition-colors duration-1000"
              style={{
                background: `radial-gradient(ellipse 55% 45% at 50% 50%, ${activePortal.atmosphere.airMist}, transparent 70%)`,
              }}
            />
          </>
        )}

        {/* Light Editorial Sky & Bottom HUD Scrim (keeps panoramic view bright & unobstructed) */}
        <div className="portal-horizon-scrim absolute inset-0" />
      </div>

      {/* LAYER 2 (z-20): Interactive Destination Portal Cards + Expanded Tagline + Peeking Next Card */}
      <PortalCardTrack
        portals={filteredPortals}
        activeIndex={activeIndex}
        activePortal={activePortal}
        nextPortal={nextPortal}
        isExpanded={isExpanded}
        reducedMotion={reducedMotion}
        onCardClick={handleCardClick}
        onSelectActiveOnly={handleSelectActiveOnly}
        onPeekClick={handleNext}
      />

      {/* LAYER 3 (z-30, pointer-events-none): Alpha-Masked Foreground Traveler (recedes smoothly on expand for full panoramic view) */}
      <div
        ref={fgParallaxRef}
        className="pointer-events-none absolute -inset-x-3 bottom-0 z-30 flex h-[48%] items-end justify-center will-change-transform sm:h-[64%] lg:h-[78%]"
        aria-hidden="true"
      >
        <img
          src={FOREGROUND_TRAVELER_SRC}
          alt=""
          width={1376}
          height={768}
          draggable={false}
          className="h-full w-full object-cover object-bottom drop-shadow-[0_18px_36px_rgba(9,25,51,0.52)]"
        />
        {/* Destination-matched ambient rim-light wash so traveler sits naturally inside the selected atmosphere */}
        <div
          className="absolute inset-0 mix-blend-soft-light transition-colors duration-1000"
          style={{
            background: `radial-gradient(ellipse 46% 52% at 50% 48%, ${activePortal.atmosphere.rimWash}, transparent 58%)`,
          }}
        />
        {/* Soft ground transition into HUD */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 transition-colors duration-1000 sm:h-28"
          style={{
            background: `linear-gradient(to top, ${activePortal.atmosphere.groundTint} 0%, transparent 100%)`,
          }}
        />
      </div>

      {/* LAYER 4 (z-40): Editorial Chrome, Travel-Mode Filter Circles & Synchronized 4-Column Telemetry HUD */}
      <PortalTelemetryHud
        portals={filteredPortals}
        activeIndex={activeIndex}
        activePortal={activePortal}
        isExpanded={isExpanded}
        activeMode={activeMode}
        originCode={originHub.code}
        planHref={planHref}
        reducedMotion={reducedMotion}
        onSelectMode={handleSelectMode}
        onSelectIndex={handleSelectIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onToggleExpand={() => setIsExpanded((prev) => !prev)}
        onOpenGallery={() => setGalleryOpen(true)}
      />

      {/* Accessible Circular Gallery Preview Modal */}
      <PortalGalleryModal
        portal={activePortal}
        open={galleryOpen}
        planHref={planHref}
        onClose={() => setGalleryOpen(false)}
      />
    </section>
  );
}
