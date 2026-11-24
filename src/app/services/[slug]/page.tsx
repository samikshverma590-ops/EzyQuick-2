import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Info } from 'lucide-react';
import { SERVICES, getServiceBySlug } from '@/data/services';
import { DESTINATIONS } from '@/data/destinations';
import { FaqAccordion } from '@/components/FaqAccordion';
import { EnquiryForm } from '@/components/EnquiryForm';
import { SITE } from '@/data/site';
import type { SERVICE_OPTIONS } from '@/lib/enquiry-schema';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.name} — EzyQuick Travel Desk`,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = service.relatedSlugs
    .map((s) => getServiceBySlug(s))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE.url}/services` },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.name,
        item: `${SITE.url}/services/${service.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Full-Bleed Service Hero */}
      <section className="relative min-h-[76svh] flex flex-col justify-end bg-[var(--color-bg-dark)] text-white pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(8,20,38,0.62) 0%, rgba(8,20,38,0.3) 44%, rgba(8,20,38,0.9) 100%)',
            }}
          />
        </div>

        <div className="site-container relative z-10 space-y-5">
          <nav aria-label="Breadcrumb" className="text-xs text-white/75">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-white">
              Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{service.name}</span>
          </nav>

          <p className="t-meta text-[var(--color-brand-secondary)]">
            {service.index} · {service.category}
          </p>
          <h1 className="t-hero text-white max-w-[16ch]">{service.name}</h1>
          <p className="text-lg sm:text-xl text-white/88 max-w-2xl leading-relaxed">
            {service.tagline}
          </p>

          <div className="pt-2 flex flex-wrap gap-3.5">
            <a href="#service-enquiry" className="btn-ezy btn-light">
              <span>{service.ctaLabel}</span>
              <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </a>
            <Link href="/services" className="btn-ezy btn-outline-light">
              <span>All nine services</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Intro + Transparency Notice */}
      <section className="bg-[var(--color-bg-primary)] py-[var(--section-space)] border-b border-[var(--color-border)]">
        <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 space-y-5">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">Overview</p>
            <h2 className="t-display text-[var(--color-text-primary)]">{service.headline}</h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
              {service.editorialIntro}
            </p>
            {service.transparencyNote && (
              <div className="flex items-start gap-3 bg-white border-l-4 border-[var(--color-brand-primary)] p-5 text-sm text-[var(--color-text-primary)]">
                <Info
                  className="h-5 w-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="leading-relaxed">{service.transparencyNote}</p>
              </div>
            )}
          </div>

          {/* Scope Ledger */}
          <div className="lg:col-span-6 bg-white border border-[var(--color-border)] p-6 sm:p-8 space-y-5">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">How We Can Help</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {service.scope.map((item, idx) => (
                <li
                  key={item}
                  className="border-t border-[var(--color-border)] pt-3.5 space-y-1"
                >
                  <span className="t-meta text-[var(--color-brand-primary-ink)]">
                    0{idx + 1}
                  </span>
                  <p className="text-sm font-medium text-[var(--color-text-primary)] leading-snug">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits & 4-Step Process */}
      <section className="bg-white py-[var(--section-space)] border-b border-[var(--color-border)]">
        <div className="site-container space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.benefits.map((b) => (
              <article
                key={b.title}
                className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] p-6 space-y-3"
              >
                <h3 className="font-display text-2xl sm:text-3xl text-[var(--color-text-primary)]">
                  {b.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {b.detail}
                </p>
              </article>
            ))}
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <p className="t-meta text-[var(--color-brand-primary-ink)]">How It Works</p>
              <h2 className="t-title text-[var(--color-text-primary)]">
                Clear steps from first message to confirmation.
              </h2>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {service.processSteps.map((s) => (
                <li
                  key={s.step}
                  className="border-t-2 border-[var(--color-brand-primary)] pt-4 space-y-2"
                >
                  <span className="t-meta text-[var(--color-brand-primary-ink)]">{s.step}</span>
                  <p className="font-display text-2xl leading-snug text-[var(--color-text-primary)]">
                    {s.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Leisure Travel Special: Quick Destination Showcase */}
      {service.slug === 'leisure-travel' && (
        <section className="bg-[var(--color-bg-secondary)] py-[var(--section-space-tight)] border-b border-[var(--color-border)]">
          <div className="site-container space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="t-meta text-[var(--color-brand-primary-ink)]">
                  India &amp; International
                </p>
                <h2 className="t-title text-[var(--color-text-primary)]">
                  All 14 advertised holiday destinations.
                </h2>
              </div>
              <Link href="/destinations" className="editorial-link text-sm">
                <span>Open interactive destination atlas</span>
                <ArrowUpRight className="link-arrow h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {DESTINATIONS.map((d) => (
                <Link
                  key={d.slug}
                  href={`/destinations/${d.slug}`}
                  className="bg-white border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-ink)] transition-colors"
                >
                  {d.name} <span className="text-xs text-[var(--color-text-muted)]">· {d.country}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="bg-[var(--color-bg-primary)] py-[var(--section-space)] border-b border-[var(--color-border)]">
        <div className="site-container max-w-4xl space-y-8">
          <div className="space-y-2">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">Questions Answered</p>
            <h2 className="t-title text-[var(--color-text-primary)]">
              Common questions about {service.name}.
            </h2>
          </div>
          <FaqAccordion items={service.faqs} />
        </div>
      </section>

      {/* Pre-Selected Service Enquiry */}
      <section
        id="service-enquiry"
        className="bg-[var(--color-bg-secondary)] py-[var(--section-space)] border-b border-[var(--color-border)]"
      >
        <div className="site-container max-w-4xl space-y-8">
          <div className="space-y-2">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">Start an Enquiry</p>
            <h2 className="t-display text-[var(--color-text-primary)]">
              Request {service.name} assistance.
            </h2>
          </div>
          <EnquiryForm
            defaultService={service.name as (typeof SERVICE_OPTIONS)[number]}
            compactHeading
          />
        </div>
      </section>

      {/* Related Services */}
      <section className="bg-[var(--color-bg-primary)] py-[var(--section-space-tight)]">
        <div className="site-container space-y-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="t-title text-[var(--color-text-primary)]">Related services</h2>
            <Link href="/services" className="editorial-link text-sm">
              <span>All 9 services</span>
              <ArrowUpRight className="link-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="group bg-white border border-[var(--color-border)] p-6 space-y-3 hover:border-[var(--color-brand-primary)] transition-colors"
              >
                <span className="t-meta text-[var(--color-brand-primary-ink)]">
                  {item.index} · {item.shortLabel}
                </span>
                <h3 className="font-display text-3xl text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary-ink)]">
                  {item.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{item.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
