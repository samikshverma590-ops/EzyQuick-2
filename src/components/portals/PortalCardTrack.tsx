'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import type { PortalDestination } from '@/data/destination-portals';

interface PortalCardTrackProps {
  portals: PortalDestination[];
  activeIndex: number;
  activePortal: PortalDestination;
  nextPortal: PortalDestination;
  isExpanded: boolean;
  reducedMotion: boolean;
  onCardClick: (index: number, cardRect: DOMRect) => void;
  onSelectActiveOnly: (index: number) => void;
  onPeekClick: () => void;
}

export function PortalCardTrack({
  portals,
  activeIndex,
  activePortal,
  nextPortal,
  isExpanded,
  reducedMotion,
  onCardClick,
  onSelectActiveOnly,
  onPeekClick,
}: PortalCardTrackProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const peekWrapRef = useRef<HTMLDivElement>(null);

  // Drag tracking refs (distinguishes intentional horizontal drag vs. card click)
  const dragStateRef = useRef({
    pointerDown: false,
    startX: 0,
    startScrollLeft: 0,
    dragged: false,
  });

  // Smoothly scroll active card into centered view in Browse Mode
  useEffect(() => {
    if (isExpanded) return;
    const rail = railRef.current;
    if (!rail) return;
    const activeCard = rail.querySelector<HTMLElement>(`[data-portal-idx="${activeIndex}"]`);
    if (!activeCard) return;

    const targetLeft =
      activeCard.offsetLeft - rail.clientWidth / 2 + activeCard.clientWidth / 2;

    if (reducedMotion) {
      rail.scrollLeft = Math.max(0, targetLeft);
    } else {
      rail.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth',
      });
    }
  }, [activeIndex, isExpanded, portals.length, reducedMotion]);

  // GSAP choreography for Browse <-> Expanded state on Layer 2 (cards, tagline, peeking right card)
  useEffect(() => {
    const trackWrap = trackWrapperRef.current;
    const taglineEl = taglineRef.current;
    const peekEl = peekWrapRef.current;

    if (reducedMotion) {
      if (trackWrap) {
        gsap.set(trackWrap, {
          opacity: isExpanded ? 0 : 1,
          xPercent: 0,
          pointerEvents: isExpanded ? 'none' : 'auto',
        });
      }
      if (taglineEl) {
        gsap.set(taglineEl, { opacity: isExpanded ? 1 : 0, y: 0 });
      }
      if (peekEl) {
        gsap.set(peekEl, {
          opacity: isExpanded ? 1 : 0,
          x: 0,
          pointerEvents: isExpanded ? 'auto' : 'none',
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (isExpanded) {
        if (trackWrap) {
          gsap.to(trackWrap, {
            xPercent: 28,
            opacity: 0,
            duration: 0.65,
            ease: 'power3.inOut',
            onStart: () => {
              trackWrap.style.pointerEvents = 'none';
            },
          });
        }
        if (taglineEl) {
          gsap.fromTo(
            taglineEl,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.58, delay: 0.22, ease: 'power3.out' }
          );
        }
        if (peekEl) {
          gsap.fromTo(
            peekEl,
            { opacity: 0, x: 72 },
            {
              opacity: 1,
              x: 0,
              duration: 0.68,
              delay: 0.22,
              ease: 'power3.out',
              onStart: () => {
                peekEl.style.pointerEvents = 'auto';
              },
            }
          );
        }
      } else {
        if (taglineEl) {
          gsap.to(taglineEl, { opacity: 0, y: -12, duration: 0.32, ease: 'power2.in' });
        }
        if (peekEl) {
          gsap.to(peekEl, {
            opacity: 0,
            x: 72,
            duration: 0.38,
            ease: 'power2.in',
            onComplete: () => {
              peekEl.style.pointerEvents = 'none';
            },
          });
        }
        if (trackWrap) {
          gsap.to(trackWrap, {
            xPercent: 0,
            opacity: 1,
            duration: 0.62,
            ease: 'power3.out',
            onStart: () => {
              trackWrap.style.pointerEvents = 'auto';
            },
          });
        }
      }
    });

    return () => ctx.revert();
  }, [isExpanded, activePortal.slug, reducedMotion]);

  // Safe horizontal mouse drag (never blocks vertical page scroll or clicks)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || isExpanded) return;
    const rail = railRef.current;
    if (!rail) return;
    dragStateRef.current = {
      pointerDown: true,
      startX: e.clientX,
      startScrollLeft: rail.scrollLeft,
      dragged: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state.pointerDown || isExpanded) return;
    const rail = railRef.current;
    if (!rail) return;
    const dx = e.clientX - state.startX;
    if (Math.abs(dx) > 8) {
      state.dragged = true;
    }
    if (state.dragged) {
      rail.scrollLeft = state.startScrollLeft - dx;
    }
  };

  const handlePointerUpOrLeave = () => {
    dragStateRef.current.pointerDown = false;
    window.setTimeout(() => {
      dragStateRef.current.dragged = false;
    }, 40);
  };

  // Horizontal-only trackpad wheel support (vertical wheel passes untouched to page scroll)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isExpanded) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.25 && railRef.current) {
      railRef.current.scrollLeft += e.deltaX;
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* EXPANDED HORIZON SPLIT TAGLINE (Cleanly framed in the upper horizon sky above the traveler's crown) */}
      <div
        ref={taglineRef}
        className="pointer-events-none absolute inset-x-0 top-[20%] flex flex-col items-center px-12 text-center opacity-0 sm:top-[13%] sm:px-20 lg:top-[7.5%] lg:px-24"
        aria-hidden={!isExpanded}
      >
        <p className="font-mono-hud mb-2 rounded-full border border-[#DCE5F2]/24 bg-[#091933]/62 px-3.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-[#60A5FA] uppercase backdrop-blur-md">
          {activePortal.detail.country} · {activePortal.detail.coordinates}
        </p>
        <h3 className="font-display max-w-4xl text-3xl leading-[1.02] tracking-tight text-white drop-shadow-[0_12px_32px_rgba(24,44,53,0.75)] sm:text-5xl lg:text-6xl">
          <span className="font-light text-[#F4F7FC]/92">{activePortal.taglineLight} </span>
          <strong className="font-extrabold text-white">{activePortal.taglineBold}</strong>
        </h3>
      </div>

      {/* BROWSE MODE HORIZONTAL CARD TRACK (Layer 2: cards visibly glide BEHIND Layer 3 foreground traveler) */}
      <div
        ref={trackWrapperRef}
        className="pointer-events-auto absolute inset-x-0 top-[15%] sm:top-[16%] lg:top-[15%]"
      >
        <div
          ref={railRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrLeave}
          onPointerLeave={handlePointerUpOrLeave}
          onWheel={handleWheel}
          className="portal-rail flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-[12vw] py-4 select-none sm:gap-6 sm:px-[18vw] lg:gap-7 lg:px-[24vw]"
          role="region"
          aria-label="Destination portal cards — drag, swipe, or select a card to expand"
        >
          {portals.map((portal, idx) => {
            const isActive = idx === activeIndex;
            const isNear =
              Math.abs(idx - activeIndex) <= 1 ||
              (activeIndex === 0 && idx === portals.length - 1) ||
              (activeIndex === portals.length - 1 && idx === 0);

            return (
              <button
                key={portal.slug}
                type="button"
                data-portal-idx={idx}
                onMouseEnter={() => {
                  if (!isExpanded && !dragStateRef.current.pointerDown) {
                    onSelectActiveOnly(idx);
                  }
                }}
                onFocus={() => {
                  if (!isExpanded) onSelectActiveOnly(idx);
                }}
                onClick={(e) => {
                  if (dragStateRef.current.dragged) {
                    e.preventDefault();
                    return;
                  }
                  const rect = e.currentTarget.getBoundingClientRect();
                  onCardClick(idx, rect);
                }}
                className={`portal-focus group relative h-[286px] w-[206px] shrink-0 snap-center overflow-hidden rounded-2xl border text-left transition-[transform,border-color,box-shadow] duration-300 sm:h-[332px] sm:w-[236px] lg:h-[364px] lg:w-[254px] ${
                  isActive
                    ? 'scale-[1.03] border-[#60A5FA]/75 shadow-[0_26px_60px_-14px_rgba(46,116,115,0.42)]'
                    : 'border-[#DCE5F2]/24 shadow-[0_22px_50px_-18px_rgba(24,44,53,0.65)] hover:scale-[1.02] hover:border-[#0B56E8]/75'
                }`}
                aria-label={`Expand ${portal.detail.name} (${portal.detail.country}) horizon view`}
              >
                {/* Horizon-Matched Card Photo */}
                <img
                  src={portal.detail.image}
                  alt={portal.detail.imageAlt}
                  width={320}
                  height={440}
                  loading={isNear ? 'eager' : 'lazy'}
                  draggable={false}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ objectPosition: portal.horizonObjectPosition }}
                />

                {/* Deep Atlas Navy / Obsidian Scrim */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#091933]/68 via-[#091933]/15 to-[#061124]/92" />

                {/* Top-Left Circular Destination Emblem Thumbnail + Index */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 overflow-hidden rounded-full border border-[#DCE5F2]/45 bg-[#091933]/70 shadow-md">
                    <img
                      src={portal.detail.image}
                      alt=""
                      width={40}
                      height={40}
                      loading={isNear ? 'eager' : 'lazy'}
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="font-mono-hud rounded-full border border-[#DCE5F2]/22 bg-[#091933]/65 px-2.5 py-0.5 text-[10px] font-semibold text-[#F4F7FC] backdrop-blur-sm">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Bottom Card Identity */}
                <div className="absolute inset-x-3.5 bottom-3.5">
                  <p className="font-mono-hud text-[9px] font-semibold tracking-[0.18em] text-[#60A5FA] uppercase">
                    {portal.regionBadge}
                  </p>
                  <h3 className="font-display mt-1 text-xl font-extrabold leading-[1.02] text-white uppercase sm:text-2xl">
                    {portal.cardTitle}
                  </h3>
                  <div className="mt-2.5 flex items-center justify-between border-t border-[#DCE5F2]/18 pt-2 text-[10px] font-semibold text-[#DCE5F2]">
                    <span className="font-mono-hud">{portal.peakSeason}</span>
                    <span className="inline-flex items-center gap-1 text-[#F5A623] transition-transform duration-200 group-hover:translate-x-0.5">
                      <span>Expand</span>
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* EXPANDED MODE: PEEKING NEXT-DESTINATION CARD (~14% sliver on right edge, never colliding with GSAP) */}
      <div
        ref={peekWrapRef}
        className="pointer-events-none absolute top-[34%] right-0 opacity-0 sm:top-[22%] lg:top-[19%]"
      >
        <button
          type="button"
          onClick={onPeekClick}
          aria-label={`Preview next destination: ${nextPortal.detail.name}`}
          className="portal-focus group relative block h-[196px] w-[50px] overflow-hidden rounded-l-2xl border border-r-0 border-[#DCE5F2]/32 bg-[#091933] text-left shadow-[-16px_22px_50px_rgba(24,44,53,0.68)] transition-[width,border-color] duration-300 hover:w-[68px] hover:border-[#F5A623] sm:h-[310px] sm:w-[116px] sm:hover:w-[144px] lg:h-[364px] lg:w-[196px] lg:hover:w-[228px]"
        >
          <img
            src={nextPortal.detail.image}
            alt={nextPortal.detail.imageAlt}
            width={240}
            height={364}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: nextPortal.horizonObjectPosition }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#091933]/85 via-[#091933]/35 to-transparent" />
          <div className="absolute inset-y-3.5 left-2.5 right-2.5 flex flex-col items-start justify-between sm:inset-y-4 sm:left-3.5">
            <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-[#F5A623]/75 sm:h-9 sm:w-9">
              <img
                src={nextPortal.detail.image}
                alt=""
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </span>
            <div className="hidden sm:block">
              <span className="font-mono-hud block text-[9px] font-semibold tracking-[0.18em] text-[#F5A623] uppercase">
                Next Portal
              </span>
              <span className="font-display mt-0.5 block text-lg font-extrabold leading-tight text-white uppercase">
                {nextPortal.detail.name}
              </span>
            </div>
            <span className="font-mono-hud [writing-mode:vertical-rl] rotate-180 text-[9px] font-bold tracking-[0.18em] text-white uppercase sm:hidden">
              Next · {nextPortal.detail.name}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
