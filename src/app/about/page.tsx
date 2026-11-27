import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { JOURNEY_STAGES, OFFICES, SITE, WHY_EZYQUICK_PILLARS } from '@/data/site';
import { SERVICES } from '@/data/services';
import { buildBreadcrumbJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'About EzyQuick — New Delhi & Dubai Travel Solutions',
  description:
    'Learn about EzyQuick Travel Solutions, our operating offices in New Delhi and Dubai, our four-stage travel approach, and our nine corporate and leisure travel services.',
  alternates: { canonical: `${SITE.url}/about/` },
  openGraph: {
    title: 'About EzyQuick Travel Solutions',
    description:
      'Coordinated corporate, medical, and leisure travel from New Delhi, India and Dubai, UAE.',
    url: `${SITE.url}/about/`,
  },
};

export default function AboutPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about/' },
  ]);

  return (
    <main className="pt-28 pb-24 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <div className="max-w-3xl">
          <p className="font-mono-hud text-xs font-semibold tracking-wider text-[#0059FD] uppercase">
            About EzyQuick Travel Solutions
          </p>
          <h1 className="font-display mt-2 text-4xl font-extrabold leading-[0.98] text-[#0C1E3A] sm:text-6xl">
            One reachable travel desk across New Delhi and Dubai.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[#475B78]">
            EzyQuick Travel Solutions coordinates domestic and international travel for individuals,
            families, and businesses. Operating through our offices in Ranjit Nagar, New Delhi and
            IFZA Properties, Dubai Silicon Oasis, we bring nine travel disciplines together under
            one accountable team.
          </p>
        </div>

        {/* Operating Hubs */}
        <section className="mt-14 grid gap-6 md:grid-cols-2" aria-label="Operating offices">
          {OFFICES.map((office) => (
            <div
              key={office.id}
              className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-7 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-hud text-xs font-semibold text-[#0059FD] uppercase">
                  {office.label}
                </span>
                <span className="font-mono-hud rounded-full bg-[#0C1E3A] px-3 py-1 text-xs font-bold text-[#FFFFFF]">
                  {office.code}
                </span>
              </div>
              <h2 className="font-display mt-2 text-2xl font-bold text-[#0C1E3A]">
                {office.city}, {office.country}
              </h2>
              <p className="mt-1 text-sm font-medium text-[#174A9C]">{office.role}</p>
              <p className="mt-4 flex items-start gap-2 text-sm text-[#475B78]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0059FD]" aria-hidden="true" />
                <span>{office.addressLines.join(' ')}</span>
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#0C1E3A]/10 pt-4 text-xs">
                <a
                  href={office.phoneHref}
                  className="inline-flex items-center gap-1.5 font-bold text-[#0C1E3A] hover:text-[#0059FD]"
                >
                  <Phone className="h-3.5 w-3.5 text-[#0059FD]" aria-hidden="true" />
                  {office.phoneDisplay}
                </a>
                <span className="font-mono-hud text-[#647896]">{office.timezone}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Pillars */}
        <section className="mt-16" aria-labelledby="about-pillars">
          <h2 id="about-pillars" className="font-display text-3xl font-extrabold text-[#0C1E3A]">
            Our Approach
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {WHY_EZYQUICK_PILLARS.map((pillar) => (
              <div
                key={pillar.index}
                className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-6"
              >
                <span className="font-mono-hud text-xs font-bold text-[#0059FD]">
                  {pillar.index}
                </span>
                <h3 className="font-display mt-2 text-xl font-bold text-[#0C1E3A]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475B78]">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4 Stages */}
        <section className="mt-16" aria-labelledby="about-stages">
          <h2 id="about-stages" className="font-display text-3xl font-extrabold text-[#0C1E3A]">
            Discover, Plan, Prepare, Travel
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY_STAGES.map((stage) => (
              <div
                key={stage.index}
                className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-6"
              >
                <span className="font-mono-hud text-xl font-bold text-[#0059FD]">{stage.index}</span>
                <h3 className="font-display mt-3 text-xl font-bold text-[#0C1E3A]">{stage.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#475B78]">{stage.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Transparency Statement */}
        <section className="mt-16 rounded-3xl border border-[#174A9C]/25 bg-[#174A9C]/8 p-7">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#174A9C]" aria-hidden="true" />
            <div>
              <h2 className="font-display text-xl font-bold text-[#0C1E3A]">
                Commitment to Honest Communication
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#475B78]">
                EzyQuick does not publish speculative live airfares, unverified promotional offers,
                fabricated customer reviews, or guaranteed embassy/medical outcomes. All quotations
                and documentation checklists are verified directly against your travel dates before
                booking.
              </p>
            </div>
          </div>
        </section>

        {/* Nine Services Quick Links */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[#0C1E3A]/12 pt-10">
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}/`}
                className="atlas-pill rounded-full px-3.5 py-1.5 text-xs font-semibold"
              >
                {s.name}
              </Link>
            ))}
          </div>
          <Link href="/plan-your-journey/" className="btn-kinetic px-6 py-3 text-sm">
            <span>Plan Your Journey</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
