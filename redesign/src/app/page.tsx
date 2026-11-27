import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Users,
} from 'lucide-react';
import { GlobalAtlasExperience } from '@/components/globe/GlobalAtlasExperience';
import { DestinationDirectory } from '@/components/destinations/DestinationDirectory';
import { ServiceShowcase } from '@/components/services/ServiceShowcase';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import {
  buildSafeWhatsAppUrl,
  JOURNEY_DISPATCHES,
  JOURNEY_STAGES,
  OFFICES,
  SITE,
  WHY_EZYQUICK_PILLARS,
} from '@/data/site';

export const metadata: Metadata = {
  title: 'EzyQuick Global Atlas — International Corporate & Leisure Travel',
  description:
    'Discover EzyQuick Travel Solutions operating through New Delhi and Dubai. Explore 14 verified destinations and 9 corporate, medical, and leisure travel services.',
  alternates: {
    canonical: `${SITE.url}/`,
  },
  openGraph: {
    title: 'EzyQuick Global Atlas — Your World. Better Connected.',
    description:
      'Interactive 3D travel atlas connecting New Delhi, Dubai, and 14 verified domestic and international destinations across 9 travel disciplines.',
    url: `${SITE.url}/`,
  },
};

export default function HomePage() {
  const { url: whatsappUrl } = buildSafeWhatsAppUrl(
    'Hello EzyQuick, I would like to plan a journey.'
  );

  return (
    <main>
      {/* SCENE 1 & SCENE 2: Opening + Interactive Explore the World (Sunlit 3D Global Atlas) */}
      <GlobalAtlasExperience mode="hero" />

      {/* SCENE 3: Destination Discovery — All 14 Verified Destinations */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:py-28" aria-labelledby="destinations-heading">
        <ScrollReveal>
          <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#0C1E3A]/12 pb-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="font-mono-hud text-xs font-semibold tracking-wider text-[#0059FD] uppercase">
                Destination Discovery · 14 Verified Places
              </p>
              <h2
                id="destinations-heading"
                className="font-display mt-2 text-4xl font-extrabold leading-[1.02] text-[#0C1E3A] sm:text-5xl"
              >
                Across India, the Gulf, and Asia.
              </h2>
            </div>
            <Link
              href="/destinations/"
              className="btn-outline-kinetic self-start px-5 py-2.5 text-xs lg:self-auto"
            >
              <span>Open Full Destinations Atlas</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        <DestinationDirectory />
      </section>

      {/* SCENE 4: Nine Travel Services */}
      <section
        className="border-y border-[#0C1E3A]/10 bg-[#DCE8F8]/65 px-4 py-20 sm:px-8 lg:py-28"
        aria-labelledby="services-heading"
      >
        <div className="mx-auto max-w-[1440px]">
          <ScrollReveal>
            <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#0C1E3A]/12 pb-8 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="font-mono-hud text-xs font-semibold tracking-wider text-[#0059FD] uppercase">
                  Nine Travel Disciplines
                </p>
                <h2
                  id="services-heading"
                  className="font-display mt-2 text-4xl font-extrabold leading-[1.02] text-[#0C1E3A] sm:text-5xl"
                >
                  Every stage of travel, coordinated under one desk.
                </h2>
              </div>
              <Link
                href="/services/"
                className="btn-outline-kinetic self-start px-5 py-2.5 text-xs lg:self-auto"
              >
                <span>View All 9 Services</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>

          <ServiceShowcase />
        </div>
      </section>

      {/* SCENE 5: Corporate & Specialist Travel (B2B Executive Focus — Warm Obsidian Contrast Band) */}
      <section
        className="bg-[#0C1E3A] px-4 py-20 text-[#F4F7FC] sm:px-8 lg:py-28"
        aria-labelledby="b2b-heading"
      >
        <div className="mx-auto max-w-[1440px]">
          <ScrollReveal>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="font-mono-hud text-xs font-semibold tracking-wider text-[#FDBC03] uppercase">
                  Corporate, MICE &amp; Medical Coordination
                </p>
                <h2
                  id="b2b-heading"
                  className="font-display mt-3 text-4xl font-extrabold leading-[1.02] text-[#FFFFFF] sm:text-5xl"
                >
                  Built for organisations and specialist itineraries.
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-sm leading-relaxed text-[#B7C9E2] sm:text-base">
                  EzyQuick is not solely a holiday agency. Our New Delhi and Dubai desks support
                  executive travel, corporate delegations, MICE programmes, and patient-and-family
                  medical travel logistics with direct advisor accountability.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                slug: 'corporate-travel',
                title: 'Corporate Travel',
                copy: 'Structured domestic and international business flights, business-district hotels, transfers, visa checklists, and agile schedule adjustments.',
                cta: 'Explore Corporate Travel',
              },
              {
                icon: Users,
                slug: 'mice-services',
                title: 'MICE Services',
                copy: 'Multi-origin group air arrivals, hotel room blocks, conference venue coordination, and incentive travel across India, Dubai, and Asia.',
                cta: 'Explore MICE Services',
              },
              {
                icon: HeartHandshake,
                slug: 'medical-travel',
                title: 'Medical Travel',
                copy: 'Practical flight, hospital-proximate stay, airport transfer, and medical visa documentation coordination for patients and families (travel logistics only).',
                cta: 'Explore Medical Travel',
              },
            ].map((item, idx) => (
              <ScrollReveal key={item.slug} delay={idx * 0.08}>
                <div className="flex h-full flex-col rounded-3xl border border-[#F4F7FC]/14 bg-[#13294B] p-7 transition-transform duration-300 hover:-translate-y-1 hover:border-[#FDBC03]/45">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0059FD]/18 text-[#FDBC03]">
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#FFFFFF]">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#B7C9E2]">{item.copy}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-[#F4F7FC]/12 pt-5">
                    <Link
                      href={`/services/${item.slug}/`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FDBC03] hover:text-[#FFFFFF]"
                    >
                      <span>{item.cta}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 6: The EzyQuick Journey (Discover -> Plan -> Prepare -> Travel) */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:py-28" aria-labelledby="journey-heading">
        <ScrollReveal>
          <div className="mb-12 max-w-2xl">
            <p className="font-mono-hud text-xs font-semibold tracking-wider text-[#0059FD] uppercase">
              How We Work
            </p>
            <h2
              id="journey-heading"
              className="font-display mt-2 text-4xl font-extrabold leading-[1.02] text-[#0C1E3A] sm:text-5xl"
            >
              Four clear stages from brief to departure.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {JOURNEY_STAGES.map((stage, idx) => (
            <ScrollReveal key={stage.index} delay={idx * 0.08}>
              <div className="studio-card flex h-full flex-col rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono-hud text-2xl font-bold text-[#0059FD]">
                    {stage.index}
                  </span>
                  <span className="font-mono-hud rounded-full bg-[#DCE8F8] px-2.5 py-1 text-[10px] font-semibold text-[#0C1E3A]">
                    {stage.code}
                  </span>
                </div>
                <h3 className="font-display mt-5 text-2xl font-bold text-[#0C1E3A]">
                  {stage.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-[#0C1E3A]">{stage.summary}</p>
                <p className="mt-3 flex-1 text-xs leading-relaxed text-[#475B78]">{stage.detail}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* SCENE 7: Why EzyQuick */}
      <section
        className="border-y border-[#0C1E3A]/10 bg-[#FFFFFF] px-4 py-20 sm:px-8 lg:py-28"
        aria-labelledby="why-heading"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ScrollReveal>
                <p className="font-mono-hud text-xs font-semibold tracking-wider text-[#0059FD] uppercase">
                  Why EzyQuick
                </p>
                <h2
                  id="why-heading"
                  className="font-display mt-2 text-4xl font-extrabold leading-[1.02] text-[#0C1E3A] sm:text-5xl"
                >
                  Real offices, real advisors, transparent coordination.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#475B78] sm:text-base">
                  Whether booking an individual air ticket, coordinating a corporate summit in
                  Dubai, or planning a multi-stop family holiday across Kerala or Bali, every
                  arrangement stays accountable to one reachable desk.
                </p>
                <div className="mt-6">
                  <Link href="/about/" className="btn-outline-kinetic px-5 py-2.5 text-xs">
                    <span>About EzyQuick</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
              {WHY_EZYQUICK_PILLARS.map((pillar, idx) => (
                <ScrollReveal key={pillar.index} delay={idx * 0.06}>
                  <div className="h-full rounded-3xl border border-[#0C1E3A]/12 bg-[#F4F7FC]/70 p-6">
                    <span className="font-mono-hud text-xs font-bold text-[#0059FD]">
                      {pillar.index}
                    </span>
                    <h3 className="font-display mt-2 text-xl font-bold text-[#0C1E3A]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#475B78]">
                      {pillar.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 8: Curated Journey Dispatches (Genuine Destination Stories — Zero Fabricated Reviews) */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:py-28" aria-labelledby="dispatches-heading">
        <ScrollReveal>
          <div className="mb-10 max-w-2xl">
            <p className="font-mono-hud text-xs font-semibold tracking-wider text-[#0059FD] uppercase">
              Curated Journey Dispatches
            </p>
            <h2
              id="dispatches-heading"
              className="font-display mt-2 text-4xl font-extrabold leading-[1.02] text-[#0C1E3A] sm:text-5xl"
            >
              Three signature corridors we plan year-round.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {JOURNEY_DISPATCHES.map((story, idx) => (
            <ScrollReveal key={story.slug} delay={idx * 0.08}>
              <article className="studio-card flex h-full flex-col overflow-hidden rounded-3xl">
                <Link href={`/destinations/${story.slug}/`} className="img-frame relative block aspect-[4/3]">
                  <img
                    src={story.image}
                    alt={story.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="font-mono-hud absolute bottom-3 left-3 rounded-full bg-[#0C1E3A]/85 px-3 py-1 text-[10px] font-semibold text-[#FFFFFF]">
                    {story.coordinates}
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-mono-hud text-[10px] font-semibold tracking-wider text-[#0059FD] uppercase">
                    {story.region}
                  </span>
                  <h3 className="font-display mt-1.5 text-2xl font-bold leading-snug text-[#0C1E3A]">
                    <Link href={`/destinations/${story.slug}/`} className="hover:text-[#0059FD]">
                      {story.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#475B78]">
                    {story.caption}
                  </p>
                  <Link
                    href={`/destinations/${story.slug}/`}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#0C1E3A] hover:text-[#0059FD]"
                  >
                    <span>Read destination guide</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* SCENE 9: Final Plan Your Journey Enquiry Band */}
      <section
        className="border-t border-[#0C1E3A]/10 bg-[#DCE8F8] px-4 py-20 sm:px-8 lg:py-24"
        aria-labelledby="final-cta-heading"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="rounded-[2rem] border border-[#0C1E3A]/12 bg-[#FFFFFF] p-8 shadow-[0_24px_60px_-20px_rgba(22,19,16,0.16)] sm:p-12 lg:p-16">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <p className="font-mono-hud text-xs font-semibold tracking-wider text-[#0059FD] uppercase">
                  Ready When You Are
                </p>
                <h2
                  id="final-cta-heading"
                  className="font-display mt-2 text-4xl font-extrabold leading-[0.98] text-[#0C1E3A] sm:text-5xl lg:text-6xl"
                >
                  Plan Your Journey with New Delhi &amp; Dubai.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#475B78] sm:text-base">
                  Share your dates, route, or corporate brief and connect directly with an EzyQuick
                  travel advisor.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href="/plan-your-journey/" className="btn-kinetic px-7 py-3.5 text-sm">
                    <span>Start Your Journey Brief</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-kinetic px-5 py-3.5 text-sm"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>WhatsApp ({SITE.whatsappNumber})</span>
                  </a>
                  <a
                    href={SITE.emailHref}
                    className="atlas-pill inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold"
                  >
                    <Mail className="h-4 w-4 text-[#0059FD]" aria-hidden="true" />
                    <span>{SITE.email}</span>
                  </a>
                </div>
              </div>

              <div className="space-y-4 lg:col-span-5">
                {OFFICES.map((office) => (
                  <div
                    key={office.id}
                    className="rounded-2xl border border-[#0C1E3A]/12 bg-[#F4F7FC]/75 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-[#0C1E3A]">
                        {office.label} · {office.city}
                      </h3>
                      <span className="font-mono-hud rounded-full bg-[#0C1E3A] px-2.5 py-0.5 text-[10px] font-bold text-[#FFFFFF]">
                        {office.code}
                      </span>
                    </div>
                    <p className="mt-2 flex items-start gap-2 text-xs text-[#475B78]">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0059FD]" aria-hidden="true" />
                      <span>{office.addressLines.join(' ')}</span>
                    </p>
                    <a
                      href={office.phoneHref}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#0C1E3A] hover:text-[#0059FD]"
                    >
                      <Phone className="h-3.5 w-3.5 text-[#0059FD]" aria-hidden="true" />
                      {office.phoneDisplay}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
