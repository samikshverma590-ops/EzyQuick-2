'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { OFFICES, SITE } from '@/data/site';
import { assetPath } from '@/lib/asset-path';
import { useJourneySelection } from '@/lib/journey-selection';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface HubClockState {
  delhiTime: string;
  dubaiTime: string;
  delhiOpen: boolean;
  dubaiOpen: boolean;
}

function readLiveHubClocks(): HubClockState {
  const now = new Date();
  const fmt = (tz: string) =>
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(now);

  const hourInTz = (tz: string) => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      hour12: false,
    }).formatToParts(now);
    const h = Number(parts.find((p) => p.type === 'hour')?.value ?? '12');
    return Number.isFinite(h) ? h : 12;
  };

  const delHour = hourInTz('Asia/Kolkata');
  const dxbHour = hourInTz('Asia/Dubai');

  return {
    delhiTime: fmt('Asia/Kolkata'),
    dubaiTime: fmt('Asia/Dubai'),
    delhiOpen: delHour >= 9 && delHour < 21,
    dubaiOpen: dxbHour >= 9 && dxbHour < 21,
  };
}

const TRUST_METRICS = [
  { value: 2, suffix: '', label: 'Active Travel Desks', detail: 'New Delhi HQ & Dubai Hub' },
  { value: 9, suffix: '', label: 'Core Travel Verticals', detail: 'Corporate, MICE, Medical & Leisure' },
  { value: 14, suffix: '', label: 'Verified Corridors', detail: 'India, Gulf, SE & Central Asia' },
  { value: 24, suffix: '/7', label: 'Advisor Continuity', detail: 'Direct WhatsApp & Desk Escalation' },
] as const;

const HUB_VISUALS: Record<'delhi' | 'dubai', { image: string; alt: string; badge: string }> = {
  delhi: {
    image: assetPath('/assets/images/editorial/executive-lounge.jpg'),
    alt: 'Executive travel desk atmosphere representing EzyQuick New Delhi HQ',
    badge: 'India HQ · IST',
  },
  dubai: {
    image: assetPath('/assets/images/editorial/story-dubai-dusk.jpg'),
    alt: 'Dubai skyline at dusk representing EzyQuick UAE Silicon Oasis Hub',
    badge: 'UAE Hub · GST',
  },
};

export function GlobalHubsSection() {
  const reducedMotion = useReducedMotion();
  const { openConcierge } = useJourneySelection();
  const [clocks, setClocks] = useState<HubClockState | null>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  // Hydration-safe client-only live IST & GST clocks
  useEffect(() => {
    setClocks(readLiveHubClocks());
    const id = window.setInterval(() => setClocks(readLiveHubClocks()), 30000);
    return () => window.clearInterval(id);
  }, []);

  // One-time GSAP ScrollTrigger counter reveal
  useEffect(() => {
    const container = metricsRef.current;
    if (!container || reducedMotion) return;

    const ctx = gsap.context(() => {
      const els = container.querySelectorAll<HTMLElement>('[data-counter-target]');
      els.forEach((el) => {
        const target = Number(el.dataset.counterTarget || '0');
        const suffix = el.dataset.counterSuffix || '';
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 82%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.val)}${suffix}`;
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="global-hubs"
      className="bg-[#1B494B] px-4 py-20 text-[#FFFFFF] sm:px-8 lg:py-28"
      aria-labelledby="hubs-heading"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-mono-hud text-xs font-semibold tracking-[0.2em] text-[#F5A623] uppercase">
              Dual-Hub Operations · New Delhi &amp; Dubai
            </p>
            <h2
              id="hubs-heading"
              className="font-display mt-2.5 text-4xl font-extrabold leading-[1.02] text-white sm:text-5xl"
            >
              Two physical offices. Zero call-centre queues.
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[#DCE5F2]/82 sm:text-base lg:col-span-5">
            Every corporate delegation, medical itinerary, and family holiday is backed by reachable
            advisors operating live across India (IST) and the UAE (GST).
          </p>
        </div>

        {/* Dual-Hub Split Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {OFFICES.map((office) => {
            const visual = HUB_VISUALS[office.id];
            const isDelhi = office.id === 'delhi';
            const liveTime = clocks
              ? isDelhi
                ? clocks.delhiTime
                : clocks.dubaiTime
              : office.timezone;
            const isActiveDesk = clocks ? (isDelhi ? clocks.delhiOpen : clocks.dubaiOpen) : true;

            return (
              <article
                key={office.id}
                className="group relative overflow-hidden rounded-3xl border border-[#DCE5F2]/16 bg-[#061124] shadow-[0_26px_64px_-22px_rgba(0,0,0,0.6)]"
              >
                {/* Architectural / Skyline Backdrop */}
                <div className="relative h-52 w-full overflow-hidden sm:h-60">
                  <img
                    src={visual.image}
                    alt={visual.alt}
                    width={720}
                    height={320}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061124] via-[#091933]/45 to-transparent" />

                  {/* Live Local Clock + Honest Desk Status */}
                  <div className="absolute top-4 right-4 left-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-hud rounded-full border border-[#DCE5F2]/24 bg-[#091933]/80 px-3 py-1 text-[11px] font-bold text-[#60A5FA] uppercase backdrop-blur-md">
                      {office.code} · {visual.badge}
                    </span>

                    <div className="font-mono-hud inline-flex items-center gap-2 rounded-full border border-[#DCE5F2]/22 bg-[#061124]/85 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isActiveDesk ? 'bg-emerald-400' : 'bg-[#F5A623]'
                        }`}
                      />
                      <span>{isActiveDesk ? 'Desk Active' : '24/7 Concierge'}</span>
                      <span className="text-[#DCE5F2]/40">|</span>
                      <Clock className="h-3 w-3 text-[#60A5FA]" aria-hidden="true" />
                      <span>{liveTime}</span>
                    </div>
                  </div>
                </div>

                {/* Verified Hub Details */}
                <div className="p-6 sm:p-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                      {office.city}{' '}
                      <span className="text-base font-medium text-[#60A5FA]">
                        ({isDelhi ? 'India HQ' : 'UAE Hub'})
                      </span>
                    </h3>
                    <span className="font-mono-hud text-xs text-[#DCE5F2]/65">
                      {office.coordinates}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm font-medium text-[#F5A623]">{office.role}</p>

                  <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-[#DCE5F2]/88">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#60A5FA]" aria-hidden="true" />
                    <span>{office.addressLines.join(' ')}</span>
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#DCE5F2]/14 pt-5">
                    <a
                      href={office.phoneHref}
                      className="portal-focus inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#0B56E8] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#083FA8]"
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Call {office.phoneDisplay}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        openConcierge({
                          origin: office.city,
                          offerTag: 'Corporate & Group Priority Desk',
                          mode: 'scroll',
                        })
                      }
                      className="portal-focus inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[#DCE5F2]/26 bg-white/5 px-4 py-2.5 text-xs font-semibold text-[#F4F7FC] transition-colors hover:border-[#F5A623] hover:text-[#F5A623]"
                    >
                      <span>Ask {office.code} Desk</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>

                    <a
                      href={SITE.emailHref}
                      className="portal-focus inline-flex items-center gap-1.5 text-xs font-semibold text-[#DCE5F2]/80 hover:text-white"
                    >
                      <Mail className="h-3.5 w-3.5 text-[#60A5FA]" aria-hidden="true" />
                      <span>{SITE.email}</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Animated Verifiable Trust Metrics */}
        <div
          ref={metricsRef}
          className="mt-8 grid grid-cols-2 gap-4 rounded-3xl border border-[#DCE5F2]/16 bg-[#083FA8]/22 p-6 sm:p-8 lg:grid-cols-4"
        >
          {TRUST_METRICS.map((metric) => (
            <div key={metric.label} className="flex flex-col">
              <span
                data-counter-target={metric.value}
                data-counter-suffix={metric.suffix}
                className="font-mono-hud text-3xl font-extrabold text-white sm:text-4xl"
              >
                {metric.value}
                {metric.suffix}
              </span>
              <span className="font-display mt-1.5 text-sm font-bold text-[#F5A623]">
                {metric.label}
              </span>
              <span className="mt-1 text-xs text-[#DCE5F2]/75">{metric.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
