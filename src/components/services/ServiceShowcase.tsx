'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SERVICES, type TravelService } from '@/data/services';

const CATEGORIES = [
  'All',
  'Corporate & Institutional',
  'Leisure & Holidays',
  'Core Travel Support',
] as const;

export function ServiceShowcase() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');

  const items: TravelService[] =
    category === 'All' ? SERVICES : SERVICES.filter((s) => s.category === category);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter travel services">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`atlas-pill rounded-full px-4 py-2 text-xs font-semibold ${
              category === cat ? 'atlas-pill-active' : ''
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((service) => (
          <article key={service.slug} className="studio-card flex flex-col overflow-hidden rounded-3xl">
            <Link href={`/services/${service.slug}/`} className="img-frame relative block aspect-[16/10]">
              <img
                src={service.image}
                alt={service.imageAlt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span className="font-mono-hud absolute top-3 left-3 rounded-full bg-[#0C1E3A]/85 px-3 py-1 text-[10px] font-semibold text-[#FFFFFF]">
                {service.index} · {service.shortLabel}
              </span>
            </Link>

            <div className="flex flex-1 flex-col p-6">
              <span className="font-mono-hud text-[10px] font-semibold tracking-wider text-[#0059FD] uppercase">
                {service.category}
              </span>
              <h3 className="font-display mt-1 text-2xl font-bold text-[#0C1E3A]">
                <Link href={`/services/${service.slug}/`} className="hover:text-[#0059FD]">
                  {service.name}
                </Link>
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#475B78]">
                {service.summary}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-[#0C1E3A]/10 pt-4">
                <Link
                  href={`/services/${service.slug}/`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0C1E3A] hover:text-[#0059FD]"
                >
                  <span>Service details</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <Link
                  href={`/plan-your-journey/?service=${encodeURIComponent(service.name)}`}
                  className="rounded-full bg-[#DCE8F8] px-3.5 py-1.5 text-xs font-semibold text-[#0C1E3A] transition-colors hover:bg-[#0059FD] hover:text-white"
                >
                  {service.ctaLabel}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
