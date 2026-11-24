import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Calendar, Compass, FileCheck2, Sparkles } from 'lucide-react';
import { DESTINATIONS, getDestinationBySlug } from '@/data/destinations';
import { EnquiryForm } from '@/components/EnquiryForm';
import { SITE } from '@/data/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) return { title: 'Destination Not Found' };

  return {
    title: `${dest.name}, ${dest.country} — Custom Travel Planning`,
    description: `${dest.shortDescription} Custom itineraries, flights, hotels, and visa guidance coordinated by EzyQuick.`,
    alternates: { canonical: `/destinations/${dest.slug}` },
  };
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) notFound();

  const related = dest.relatedSlugs
    .map((s) => getDestinationBySlug(s))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: `${SITE.url}/destinations` },
      {
        '@type': 'ListItem',
        position: 3,
        name: dest.name,
        item: `${SITE.url}/destinations/${dest.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Full-Bleed Destination Hero */}
      <section className="relative min-h-[78svh] flex flex-col justify-end bg-[var(--color-bg-dark)] text-white pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={dest.image}
            alt={dest.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(8,20,38,0.58) 0%, rgba(8,20,38,0.22) 45%, rgba(8,20,38,0.88) 100%)',
            }}
          />
        </div>

        <div className="site-container relative z-10 space-y-5">
          <nav aria-label="Breadcrumb" className="text-xs text-white/75">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/destinations" className="hover:text-white">
              Destinations
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{dest.name}</span>
          </nav>

          <p className="t-meta text-[var(--color-brand-secondary)]">
            {dest.region} · {dest.country} · {dest.coordinates}
          </p>
          <h1 className="t-hero text-white">{dest.name}</h1>
          <p className="text-lg sm:text-xl text-white/88 max-w-2xl leading-relaxed">
            {dest.tagline}
          </p>

          <div className="pt-2">
            <a href="#destination-enquiry" className="btn-ezy btn-light">
              <span>Plan a {dest.name} journey</span>
              <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Editorial Intro + Highlights */}
      <section className="bg-[var(--color-bg-primary)] py-[var(--section-space)] border-b border-[var(--color-border)]">
        <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-6">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">Editorial Overview</p>
            <h2 className="t-display text-[var(--color-text-primary)]">
              Shaping your time in {dest.name}.
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
              {dest.editorialIntro}
            </p>
            {dest.specialNote && (
              <div className="bg-white border-l-4 border-[var(--color-brand-primary)] p-5 text-sm text-[var(--color-text-primary)]">
                {dest.specialNote}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white border border-[var(--color-border)] p-6 sm:p-8 space-y-5">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">Key Highlights</p>
            <ul className="space-y-4">
              {dest.highlights.map((item, idx) => (
                <li
                  key={item}
                  className="flex items-start gap-4 pb-4 border-b border-[var(--color-border)] last:border-b-0 last:pb-0 text-sm text-[var(--color-text-secondary)]"
                >
                  <span className="t-meta text-[var(--color-brand-primary-ink)] mt-0.5">
                    0{idx + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Experiences & Practical Planning Information */}
      <section className="bg-white py-[var(--section-space)] border-b border-[var(--color-border)]">
        <div className="site-container space-y-14">
          <div className="space-y-6">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">Curated Experiences</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dest.experiences.map((exp) => (
                <article
                  key={exp.title}
                  className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] p-6 space-y-3"
                >
                  <h3 className="font-display text-2xl sm:text-3xl text-[var(--color-text-primary)]">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {exp.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4 border-t border-[var(--color-border)]">
            <div className="space-y-2">
              <p className="t-meta text-[var(--color-brand-primary-ink)] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Ideal Travel Styles</span>
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {dest.planningInfo.idealStyles.join(', ')}
              </p>
            </div>
            <div className="space-y-2">
              <p className="t-meta text-[var(--color-brand-primary-ink)] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Suggested Window</span>
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {dest.planningInfo.suggestedWindow}
              </p>
            </div>
            <div className="space-y-2">
              <p className="t-meta text-[var(--color-brand-primary-ink)] flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Typical Pacing</span>
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {dest.planningInfo.typicalDuration}
              </p>
            </div>
            <div className="space-y-2">
              <p className="t-meta text-[var(--color-brand-primary-ink)] flex items-center gap-1.5">
                <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Entry &amp; Visa Note</span>
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {dest.planningInfo.visaAdvisory}
              </p>
            </div>
          </div>

          <p className="text-xs text-[var(--color-text-muted)]">
            Note: EzyQuick prepares custom quotations tailored to your exact travel dates. Live
            airline fares, hotel availability, and visa rules are verified at the time of enquiry.
          </p>
        </div>
      </section>

      {/* Pre-filled Destination Enquiry */}
      <section
        id="destination-enquiry"
        className="bg-[var(--color-bg-secondary)] py-[var(--section-space)] border-b border-[var(--color-border)]"
      >
        <div className="site-container max-w-4xl space-y-8">
          <div className="space-y-3">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">
              Enquire for {dest.name}
            </p>
            <h2 className="t-display text-[var(--color-text-primary)]">
              Let’s plan your {dest.name} itinerary.
            </h2>
          </div>
          <EnquiryForm
            defaultService="Leisure Travel"
            defaultDestination={`${dest.name} (${dest.country})`}
            compactHeading
          />
        </div>
      </section>

      {/* Related Destinations */}
      {related.length > 0 && (
        <section className="bg-[var(--color-bg-primary)] py-[var(--section-space-tight)]">
          <div className="site-container space-y-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="t-title text-[var(--color-text-primary)]">
                Continue exploring
              </h2>
              <Link href="/destinations" className="editorial-link text-sm">
                <span>All 14 destinations</span>
                <ArrowUpRight className="link-arrow h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/destinations/${item.slug}`}
                  className="group bg-white border border-[var(--color-border)] overflow-hidden"
                >
                  <div className="media-frame relative aspect-[16/10] w-full bg-[var(--color-bg-dark)]">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">{item.country}</p>
                      <h3 className="font-display text-2xl text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary-ink)]">
                        {item.name}
                      </h3>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[var(--color-brand-primary-ink)]" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
