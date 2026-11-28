'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, FileCheck2, Headphones, Plane, Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  {
    index: '01',
    routeLabel: 'ORIGIN',
    title: 'Tell Us Your Vibe (2 Mins)',
    description:
      'Share your destination, rough dates, traveller count, or corporate brief—no lengthy portals or 20 open tabs.',
    detail: 'DEL / DXB Desk Intake',
    icon: Compass,
  },
  {
    index: '02',
    routeLabel: 'CURATE',
    title: 'Rapid Curated Quote',
    description:
      'Receive hand-picked flight routings, verified hotel categories, and unpublished desk rates tailored to your brief.',
    detail: 'Human Advisor Proposal',
    icon: Sparkles,
  },
  {
    index: '03',
    routeLabel: 'VISA & DOCS',
    title: 'Visa, Forex & Docs Handled',
    description:
      'Zero paperwork stress—structured visa checklists, foreign exchange cards, and travel insurance coordinated in sequence.',
    detail: 'End-to-End Compliance',
    icon: FileCheck2,
  },
  {
    index: '04',
    routeLabel: 'STAY & FLY',
    title: 'Fly & 24/7 Dual-Hub Support',
    description:
      'Depart with confirmed itineraries backed live by reachable travel teams in New Delhi and Dubai whenever schedules shift.',
    detail: 'DEL · DXB Continuity',
    icon: Headphones,
  },
] as const;

export function TripProcessTimeline() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const planeMarkerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pathEl = svgPathRef.current;
    const planeEl = planeMarkerRef.current;
    if (!section) return;

    const nodes = section.querySelectorAll<HTMLElement>('[data-process-node]');
    const cards = section.querySelectorAll<HTMLElement>('[data-process-card]');

    if (reducedMotion) {
      if (pathEl) {
        pathEl.style.strokeDasharray = 'none';
        pathEl.style.strokeDashoffset = '0';
      }
      nodes.forEach((n) => n.setAttribute('data-lit', 'true'));
      return;
    }

    const ctx = gsap.context(() => {
      if (pathEl) {
        const len = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            end: 'bottom 68%',
            scrub: 0.65,
            onUpdate: (self) => {
              const p = self.progress;
              nodes.forEach((node, idx) => {
                const threshold = idx * 0.27;
                node.setAttribute('data-lit', p >= threshold ? 'true' : 'false');
              });
            },
          },
        });

        tl.to(pathEl, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0);
        if (planeEl) {
          tl.fromTo(
            planeEl,
            { xPercent: 0 },
            { xPercent: 840, ease: 'none', duration: 1 },
            0
          );
        }
      }

      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="trip-process"
      className="bg-white px-4 py-20 sm:px-8 lg:py-28"
      aria-labelledby="process-heading"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-12 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="font-mono-hud text-xs font-semibold tracking-[0.18em] text-[#0B56E8] uppercase">
              Origin → Visa → Flight → Stay
            </p>
            <h2
              id="process-heading"
              className="font-display mt-2.5 text-4xl font-extrabold leading-[1.02] text-[#091933] sm:text-5xl"
            >
              From brief to boarding pass—without friction.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#3B4F6B]">
            Watch how our advisors coordinate every moving part in sequence so you travel with
            clarity from first message to return landing.
          </p>
        </div>

        {/* Desktop Scroll-Linked SVG Flight Path Track */}
        <div className="relative mb-8 hidden lg:block" aria-hidden="true">
          <svg viewBox="0 0 1200 52" className="h-12 w-full overflow-visible">
            <defs>
              <linearGradient id="ezyquickFlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0B56E8" />
                <stop offset="65%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#F5A623" />
              </linearGradient>
            </defs>
            {/* Ghost Dashed Route Track */}
            <path
              d="M 48 26 C 220 4, 340 48, 420 26 C 560 6, 680 46, 780 26 C 920 6, 1020 44, 1152 26"
              fill="none"
              stroke="#DCE5F2"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
            {/* Scrubbed Progress Flight Stroke */}
            <path
              ref={svgPathRef}
              d="M 48 26 C 220 4, 340 48, 420 26 C 560 6, 680 46, 780 26 C 920 6, 1020 44, 1152 26"
              fill="none"
              stroke="url(#ezyquickFlightGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Moving Plane Node */}
          <div
            ref={planeMarkerRef}
            className="pointer-events-none absolute top-1/2 left-[3%] -translate-y-1/2"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#0B56E8] text-white shadow-[0_8px_20px_-4px_rgba(46,116,115,0.55)]">
              <Plane className="h-4 w-4 rotate-45" />
            </span>
          </div>
        </div>

        {/* 4 Editorial Milestone Cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.index}
                data-process-card
                className="studio-card relative flex h-full flex-col rounded-3xl p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      data-process-node
                      data-lit="false"
                      className="h-3 w-3 rounded-full bg-[#DCE5F2] ring-4 ring-[#DCE5F2]/40 transition-colors duration-300 data-[lit=true]:bg-[#F5A623] data-[lit=true]:ring-[#F5A623]/25"
                    />
                    <span className="font-mono-hud text-xl font-extrabold text-[#0B56E8]">
                      {step.index}
                    </span>
                  </div>
                  <span className="font-mono-hud rounded-full bg-[#F4F7FC] px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#083FA8] uppercase">
                    {step.routeLabel}
                  </span>
                </div>

                <div className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4F7FC] text-[#091933]">
                  <Icon className="h-5 w-5 text-[#0B56E8]" aria-hidden="true" />
                </div>

                <h3 className="font-display mt-4 text-xl font-extrabold leading-snug text-[#091933]">
                  {step.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#3B4F6B]">
                  {step.description}
                </p>

                <div className="font-mono-hud mt-5 border-t border-[#DCE5F2] pt-3.5 text-[11px] font-semibold text-[#083FA8]">
                  {step.detail}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
