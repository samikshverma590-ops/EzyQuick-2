import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { getServiceBySlug, SERVICES } from '@/data/services';
import { SITE } from '@/data/site';
import { FaqAccordion } from '@/components/services/FaqAccordion';
import { buildBreadcrumbJsonLd } from '@/lib/structured-data';

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.name} — ${service.shortLabel}`,
    description: service.summary,
    alternates: { canonical: `${SITE.url}/services/${service.slug}/` },
    openGraph: {
      title: `${service.name} | EzyQuick`,
      description: service.summary,
      url: `${SITE.url}/services/${service.slug}/`,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = service.relatedSlugs
    .map((s) => getServiceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services/' },
    { name: service.name, path: `/services/${service.slug}/` },
  ]);

  return (
    <main className="pt-28 pb-24 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <Link
          href="/services/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475B78] hover:text-[#0059FD]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to all 9 services</span>
        </Link>

        {/* Hero Split */}
        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <span className="font-mono-hud text-xs font-semibold tracking-wider text-[#0059FD] uppercase">
              {service.index} · {service.category}
            </span>
            <h1 className="font-display mt-2 text-4xl font-extrabold leading-[0.98] text-[#0C1E3A] sm:text-5xl">
              {service.name}
            </h1>
            <p className="font-display mt-4 text-xl font-bold text-[#174A9C]">{service.headline}</p>
            <p className="mt-4 text-sm leading-relaxed text-[#475B78] sm:text-base">
              {service.editorialIntro}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/plan-your-journey/?service=${encodeURIComponent(service.name)}`}
                className="btn-kinetic px-6 py-3 text-sm"
              >
                <span>{service.ctaLabel}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/contact/" className="btn-outline-kinetic px-5 py-3 text-sm">
                <span>Contact Delhi or Dubai Desk</span>
              </Link>
            </div>
          </div>

          <div className="img-frame rounded-3xl border border-[#0C1E3A]/12 shadow-xl lg:col-span-6">
            <img
              src={service.image}
              alt={service.imageAlt}
              className="aspect-[16/11] w-full object-cover"
            />
          </div>
        </div>

        {/* Mandatory Transparency Notice */}
        {service.transparencyNote && (
          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-[#174A9C]/25 bg-[#174A9C]/8 p-5 text-sm leading-relaxed text-[#0C1E3A]">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#174A9C]" aria-hidden="true" />
            <p>{service.transparencyNote}</p>
          </div>
        )}

        {/* Scope & Benefits */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <div className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-6 sm:p-8 lg:col-span-6">
            <h2 className="font-display text-2xl font-bold text-[#0C1E3A]">What We Coordinate</h2>
            <ul className="mt-5 space-y-3">
              {service.scope.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#0C1E3A]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0059FD]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 lg:col-span-6">
            <h2 className="font-display text-2xl font-bold text-[#0C1E3A]">Key Strengths</h2>
            {service.benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-6"
              >
                <h3 className="font-display text-lg font-bold text-[#0C1E3A]">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475B78]">{b.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Step Process */}
        <div className="mt-14">
          <h2 className="font-display text-2xl font-bold text-[#0C1E3A] sm:text-3xl">
            How {service.name} Works
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {service.processSteps.map((p) => (
              <div
                key={p.step}
                className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-5"
              >
                <span className="font-mono-hud text-xl font-bold text-[#0059FD]">{p.step}</span>
                <p className="mt-3 text-sm leading-relaxed text-[#0C1E3A]">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        {service.faqs.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display mb-5 text-2xl font-bold text-[#0C1E3A] sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <FaqAccordion items={service.faqs} />
          </div>
        )}

        {/* Related Services */}
        <div className="mt-16 border-t border-[#0C1E3A]/12 pt-12">
          <h2 className="font-display text-2xl font-bold text-[#0C1E3A]">Related Services</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/services/${rel.slug}/`}
                className="studio-card flex flex-col rounded-3xl p-6"
              >
                <span className="font-mono-hud text-[10px] font-semibold text-[#0059FD] uppercase">
                  {rel.index} · {rel.shortLabel}
                </span>
                <h3 className="font-display mt-1 text-xl font-bold text-[#0C1E3A]">{rel.name}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-[#475B78]">{rel.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0C1E3A]">
                  View service <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
