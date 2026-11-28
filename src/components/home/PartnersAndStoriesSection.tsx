'use client';

import Link from 'next/link';
import { ArrowRight, Building2, Clock, FileCheck2, Globe2, Palmtree, ShieldCheck } from 'lucide-react';
import { useJourneySelection } from '@/lib/journey-selection';

const MARQUEE_ROW_ONE = [
  'Global Full-Service Airlines',
  '5-Star Luxury Hospitality Partners',
  'MICE & Conference Venues',
  'Verified B2B Corporate Desks',
  'Authorized Visa Advisory Channels',
  'Multi-Currency Forex Networks',
  'Executive Airport Transfers',
  'Comprehensive Travel Insurance',
] as const;

const MARQUEE_ROW_TWO = [
  'New Delhi (DEL) Travel Desk',
  'Dubai Silicon Oasis (DXB) Hub',
  'Private Villa & Resort Contracting',
  'Multi-Origin Delegation Logistics',
  'Medical Travel Coordination',
  'Express Documentation Checklists',
  '24/7 Schedule Re-Protection',
  'Direct Consolidator Air Inventory',
] as const;

const DESK_STORIES = [
  {
    id: 'corp-dxb-summit',
    audience: 'Corporate Travel Manager Brief',
    badge: 'B2B · DEL ↔ DXB',
    icon: Building2,
    title: '22-Executive Dubai Leadership Summit Coordinated in One Thread',
    summary:
      'Multi-origin arrivals from New Delhi, Mumbai, and Bengaluru aligned into one business-district hotel block with private airport transfers, UAE business visa checklists, and live flight re-protection from our Dubai desk.',
    highlights: ['Single consolidated proposal', 'Zero visa bottleneck', 'On-ground DXB support'],
    destination: 'Dubai',
    service: 'MICE Services',
    offerTag: 'Corporate & Group Priority Desk',
  },
  {
    id: 'leisure-bali-family',
    audience: 'Leisure Family Journey Brief',
    badge: 'B2C · Luxury Escape',
    icon: Palmtree,
    title: 'Multi-Generational Bali Villa & Uluwatu Cliff Escape Without 20 Tabs',
    summary:
      'Paired a quiet Ubud rainforest pool villa with coastal resort nights, pre-checked Indonesian e-VOA guidance, sensible family flight layovers, and dedicated private local transfers—quoted swiftly in one clear outline.',
    highlights: ['Unlisted resort inventory', 'e-VOA checklist handled', 'Private local pacing'],
    destination: 'Bali',
    service: 'Leisure Travel',
    offerTag: 'Unlisted Hotel & Flight Desk Rates',
  },
  {
    id: 'visa-singapore-fast',
    audience: 'Executive & Family Visa Brief',
    badge: 'Speed · Docs + Flights',
    icon: FileCheck2,
    title: 'Rapid Singapore & Malaysia Twin-Centre Turnaround for Tight Dates',
    summary:
      'When corporate schedules leave days instead of weeks, our New Delhi desk sequences visa documentation checklists, refundable routing options, forex travel cards, and insurance in parallel so departures stay stress-free.',
    highlights: ['Parallel doc & flight prep', 'Forex + insurance bundled', 'Direct advisor WhatsApp'],
    destination: 'Singapore',
    service: 'Visa Services',
    offerTag: 'Fast-Track Visa + Zero-Stress Bundling',
  },
] as const;

export function PartnersAndStoriesSection() {
  const { openConcierge } = useJourneySelection();

  return (
    <section
      id="partners-and-stories"
      className="overflow-hidden border-t border-[#DCE5F2]/70 bg-[#EEF1EC] py-20 lg:py-28"
      aria-labelledby="partners-heading"
    >
      {/* Part A: Dual-Row GPU-Accelerated Partner Network Marquee */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono-hud text-xs font-semibold tracking-[0.18em] text-[#0B56E8] uppercase">
              Trusted Ecosystem &amp; Capabilities
            </p>
            <h2
              id="partners-heading"
              className="font-display mt-2 text-3xl font-extrabold leading-tight text-[#091933] sm:text-4xl"
            >
              Connected across airlines, hospitality &amp; enterprise mobility.
            </h2>
          </div>
          <span className="font-mono-hud inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#5B708D]">
            <Globe2 className="h-3.5 w-3.5 text-[#0B56E8]" aria-hidden="true" />
            Hover ticker to pause
          </span>
        </div>
      </div>

      {/* Dual-Row Marquee Tracks (pure transform translate3d; pauses on hover; stops under reduced-motion) */}
      <div className="space-y-3 py-2" aria-label="EzyQuick travel partner network categories">
        <div className="marquee-viewport relative flex overflow-hidden">
          <div className="marquee-track marquee-left flex shrink-0 items-center gap-3 pr-3">
            {[...MARQUEE_ROW_ONE, ...MARQUEE_ROW_ONE].map((item, idx) => (
              <span
                key={`r1-${idx}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#DCE5F2] bg-[#F4F7FC] px-4 py-2 text-xs font-bold text-[#091933]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#0B56E8]" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="marquee-viewport relative flex overflow-hidden">
          <div className="marquee-track marquee-right flex shrink-0 items-center gap-3 pr-3">
            {[...MARQUEE_ROW_TWO, ...MARQUEE_ROW_TWO].map((item, idx) => (
              <span
                key={`r2-${idx}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#DCE5F2] bg-white px-4 py-2 text-xs font-semibold text-[#083FA8]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#F5A623]" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Part B: Representative Leisure & Corporate Desk Case Stories */}
      <div className="mx-auto mt-16 max-w-[1440px] px-4 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 border-t border-[#DCE5F2] pt-14 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="font-mono-hud text-xs font-semibold tracking-[0.18em] text-[#0B56E8] uppercase">
              Representative Desk Stories · Leisure &amp; Corporate
            </p>
            <h3 className="font-display mt-2 text-3xl font-extrabold leading-[1.04] text-[#091933] sm:text-4xl">
              Built for speed of quote, smooth visas &amp; DEL–DXB continuity.
            </h3>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-[#5B708D]">
            Representative EzyQuick coordination briefs illustrating how our New Delhi and Dubai
            desks handle B2B and B2C itineraries (we never publish fabricated customer quotes).
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {DESK_STORIES.map((story) => {
            const Icon = story.icon;
            return (
              <article
                key={story.id}
                className="studio-card flex h-full flex-col justify-between rounded-3xl p-6 sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F4F7FC] text-[#0B56E8]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono-hud rounded-full bg-[#091933] px-3 py-1 text-[10px] font-bold text-[#F5A623] uppercase">
                      {story.badge}
                    </span>
                  </div>

                  <p className="font-mono-hud mt-4 text-[10px] font-bold tracking-wider text-[#0B56E8] uppercase">
                    {story.audience}
                  </p>
                  <h4 className="font-display mt-1.5 text-xl font-extrabold leading-snug text-[#091933]">
                    {story.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-[#3B4F6B]">{story.summary}</p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {story.highlights.map((item) => (
                      <li
                        key={item}
                        className="inline-flex items-center gap-1 rounded-full bg-[#F4F7FC] px-2.5 py-1 text-[11px] font-semibold text-[#091933]"
                      >
                        <ShieldCheck className="h-3 w-3 text-[#0B56E8]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex items-center justify-between gap-2 border-t border-[#DCE5F2] pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      openConcierge({
                        destination: story.destination,
                        service: story.service,
                        offerTag: story.offerTag,
                        mode: 'scroll',
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B56E8] hover:text-[#091933]"
                  >
                    <span>Plan Similar Itinerary</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <span className="font-mono-hud inline-flex items-center gap-1 text-[10px] font-semibold text-[#5B708D]">
                    <Clock className="h-3 w-3 text-[#0B56E8]" aria-hidden="true" />
                    Fast Desk Quote
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <Link href="/about/" className="btn-outline-kinetic px-5 py-2.5 text-xs">
            <span>Meet EzyQuick New Delhi &amp; Dubai</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
