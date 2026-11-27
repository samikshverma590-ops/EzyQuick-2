import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, Clock, Compass, MapPin, ShieldCheck } from 'lucide-react';
import { DESTINATIONS, getDestinationBySlug } from '@/data/destinations';
import { SERVICES } from '@/data/services';
import { SITE } from '@/data/site';
import { buildBreadcrumbJsonLd } from '@/lib/structured-data';

export function generateStaticParams() {
  return DESTINATIONS.map((dest) => ({ slug: dest.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) return { title: 'Destination Not Found' };

  return {
    title: `${dest.name}, ${dest.country} — Travel Planning & Guide`,
    description: dest.shortDescription,
    alternates: { canonical: `${SITE.url}/destinations/${dest.slug}/` },
    openGraph: {
      title: `${dest.name} (${dest.country}) | EzyQuick`,
      description: dest.shortDescription,
      url: `${SITE.url}/destinations/${dest.slug}/`,
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) notFound();

  const relatedDestinations = dest.relatedSlugs
    .map((s) => getDestinationBySlug(s))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const coreServices = SERVICES.filter((s) =>
    ['leisure-travel', 'air-tickets', 'hotel-bookings', 'visa-services'].includes(s.slug)
  );

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations/' },
    { name: dest.name, path: `/destinations/${dest.slug}/` },
  ]);

  return (
    <main className="pt-28 pb-24 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <Link
          href="/destinations/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475B78] hover:text-[#0059FD]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to all 14 destinations</span>
        </Link>

        {/* Hero Composition */}
        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <span className="font-mono-hud text-xs font-semibold tracking-wider text-[#0059FD] uppercase">
              {dest.subregion} · {dest.country} · {dest.coordinates}
            </span>
            <h1 className="font-display mt-2 text-4xl font-extrabold leading-[0.96] text-[#0C1E3A] sm:text-6xl">
              {dest.name}
            </h1>
            <p className="font-display mt-4 text-xl font-bold text-[#174A9C]">{dest.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-[#475B78] sm:text-base">
              {dest.editorialIntro}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/plan-your-journey/?destination=${encodeURIComponent(dest.name)}`}
                className="btn-kinetic px-6 py-3 text-sm"
              >
                <span>Plan This Journey</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/contact/" className="btn-outline-kinetic px-5 py-3 text-sm">
                <span>Speak With an Advisor</span>
              </Link>
            </div>
          </div>

          <div className="img-frame rounded-3xl border border-[#0C1E3A]/12 shadow-xl lg:col-span-6">
            <img
              src={dest.image}
              alt={dest.imageAlt}
              className="aspect-[16/11] w-full object-cover"
            />
          </div>
        </div>

        {/* Highlights & Experiences */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <div className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-6 sm:p-8 lg:col-span-6">
            <h2 className="font-display text-2xl font-bold text-[#0C1E3A]">
              Verified Highlights
            </h2>
            <ul className="mt-5 space-y-3.5">
              {dest.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-[#0C1E3A]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0059FD]" aria-hidden="true" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 lg:col-span-6">
            <h2 className="font-display text-2xl font-bold text-[#0C1E3A]">
              Curated Ways to Experience {dest.name}
            </h2>
            {dest.experiences.map((exp) => (
              <div
                key={exp.title}
                className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-6"
              >
                <h3 className="font-display text-lg font-bold text-[#0C1E3A]">{exp.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475B78]">{exp.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Practical Planning Information */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-5">
            <Compass className="h-5 w-5 text-[#0059FD]" aria-hidden="true" />
            <h3 className="font-mono-hud mt-3 text-[11px] font-bold text-[#647896] uppercase">
              Ideal Travel Styles
            </h3>
            <p className="mt-1.5 text-sm font-semibold text-[#0C1E3A]">
              {dest.planningInfo.idealStyles.join(', ')}
            </p>
          </div>

          <div className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-5">
            <Calendar className="h-5 w-5 text-[#0059FD]" aria-hidden="true" />
            <h3 className="font-mono-hud mt-3 text-[11px] font-bold text-[#647896] uppercase">
              Suggested Window
            </h3>
            <p className="mt-1.5 text-sm text-[#0C1E3A]">{dest.planningInfo.suggestedWindow}</p>
          </div>

          <div className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-5">
            <Clock className="h-5 w-5 text-[#0059FD]" aria-hidden="true" />
            <h3 className="font-mono-hud mt-3 text-[11px] font-bold text-[#647896] uppercase">
              Typical Duration
            </h3>
            <p className="mt-1.5 text-sm text-[#0C1E3A]">{dest.planningInfo.typicalDuration}</p>
          </div>

          <div className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-5">
            <ShieldCheck className="h-5 w-5 text-[#174A9C]" aria-hidden="true" />
            <h3 className="font-mono-hud mt-3 text-[11px] font-bold text-[#647896] uppercase">
              Entry &amp; Documentation Note
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#475B78]">
              {dest.planningInfo.visaAdvisory}
            </p>
          </div>
        </div>

        {/* Supporting Services */}
        <div className="mt-16 border-t border-[#0C1E3A]/12 pt-12">
          <h2 className="font-display text-2xl font-bold text-[#0C1E3A]">
            Services Supporting Your {dest.name} Trip
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coreServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}/`}
                className="studio-card rounded-2xl p-5"
              >
                <span className="font-mono-hud text-[10px] font-semibold text-[#0059FD] uppercase">
                  {s.index} · {s.shortLabel}
                </span>
                <h3 className="font-display mt-1 text-lg font-bold text-[#0C1E3A]">{s.name}</h3>
                <p className="mt-2 text-xs text-[#475B78]">{s.tagline}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Related Destinations */}
        <div className="mt-16 border-t border-[#0C1E3A]/12 pt-12">
          <h2 className="font-display text-2xl font-bold text-[#0C1E3A]">
            Continue Exploring Nearby Routes
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {relatedDestinations.map((rel) => (
              <Link
                key={rel.slug}
                href={`/destinations/${rel.slug}/`}
                className="studio-card overflow-hidden rounded-3xl"
              >
                <div className="img-frame aspect-[16/10]">
                  <img
                    src={rel.image}
                    alt={rel.imageAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <span className="font-mono-hud text-[10px] text-[#0059FD] uppercase">
                    {rel.country}
                  </span>
                  <h3 className="font-display mt-0.5 text-xl font-bold text-[#0C1E3A]">
                    {rel.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#475B78]">{rel.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
