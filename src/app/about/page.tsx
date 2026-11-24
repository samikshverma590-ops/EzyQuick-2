import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { APPROACH_CHAPTERS, OFFICES, SITE, WHY_EZYQUICK_PILLARS } from '@/data/site';
import { assetPath } from '@/lib/asset-path';

export const metadata: Metadata = {
  title: 'About EzyQuick — Travel Made Easy Across New Delhi & Dubai',
  description:
    'Learn about EzyQuick Travel Solutions, our offices in New Delhi and Dubai Silicon Oasis, and our single-point approach across nine travel services.',
};

export default function AboutPage() {
  return (
    <div className="pt-28 sm:pt-36 bg-[var(--color-bg-primary)]">
      {/* Editorial Header */}
      <section className="site-container pb-[var(--section-space-tight)] space-y-10">
        <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-text-muted)]">
          <Link href="/" className="hover:text-[var(--color-brand-primary-ink)]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-text-primary)] font-medium">About</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">
              {SITE.legalName} · {SITE.corridorLabel}
            </p>
            <h1 className="t-hero text-[var(--color-text-primary)]">
              Travel Beyond the Ordinary, grounded in human care.
            </h1>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
              EzyQuick operates from New Delhi, India and Dubai Silicon Oasis, UAE—bringing
              leisure holidays, corporate itineraries, medical travel logistics, visas, flights,
              and accommodation together through one accountable desk.
            </p>
          </div>
        </div>

        <div className="relative aspect-[21/9] w-full overflow-hidden bg-[var(--color-bg-dark)]">
          <Image
            src={assetPath('/images/editorial/executive-lounge.jpg')}
            alt="Architectural international travel consultation lounge"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Why EzyQuick */}
      <section className="bg-white border-y border-[var(--color-border)] py-[var(--section-space)]">
        <div className="site-container space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">Our Operating Standard</p>
            <h2 className="t-display text-[var(--color-text-primary)]">
              Designed around clarity, not hype.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_EZYQUICK_PILLARS.map((item) => (
              <article
                key={item.index}
                className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] p-6 space-y-3"
              >
                <span className="t-meta text-[var(--color-brand-primary-ink)]">{item.index}</span>
                <h3 className="font-display text-2xl text-[var(--color-text-primary)]">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Offices & Ethical Honesty */}
      <section className="bg-[var(--color-bg-primary)] py-[var(--section-space)]">
        <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 space-y-6">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">Our Two Gateways</p>
            <h2 className="t-title sm:text-5xl text-[var(--color-text-primary)]">
              Reachable offices in Delhi and Dubai.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {OFFICES.map((office) => (
                <article
                  key={office.id}
                  className="bg-white border border-[var(--color-border)] p-6 space-y-3"
                >
                  <p className="t-meta text-[var(--color-brand-primary-ink)] flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{office.label}</span>
                  </p>
                  <address className="not-italic text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {office.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <a
                    href={office.phoneHref}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] tabular-nums"
                  >
                    <Phone className="h-3.5 w-3.5 text-[var(--color-brand-primary)]" aria-hidden="true" />
                    <span>{office.phoneDisplay}</span>
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-[var(--color-bg-dark)] text-white p-8 sm:p-10 space-y-6">
            <div className="flex items-center gap-2.5 text-[var(--color-brand-secondary)]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              <span className="t-meta">Transparency &amp; Responsibility</span>
            </div>
            <h3 className="font-display text-3xl sm:text-4xl">
              Clear boundaries build real trust.
            </h3>
            <ul className="space-y-3.5 text-sm text-[var(--color-text-on-dark-muted)] leading-relaxed">
              <li>
                • <strong className="text-white">Visas:</strong> We provide structured
                documentation checklists and application guidance. Final visa decisions rest solely
                with official embassies and immigration authorities.
              </li>
              <li>
                • <strong className="text-white">Medical Travel:</strong> We coordinate travel,
                stays, transfers, and logistics for patients and families—never clinical advice or
                medical treatment.
              </li>
              <li>
                • <strong className="text-white">Pricing &amp; Availability:</strong> Flights,
                hotels, forex, and insurance depend on real-time dates and underwriting rules. All
                quotations are confirmed directly upon enquiry.
              </li>
              <li>
                • <strong className="text-white">Privacy:</strong> We never ask for passport
                numbers or detailed clinical records in public enquiry forms.
              </li>
            </ul>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/contact#enquiry" className="btn-ezy btn-light">
                <span>Plan Your Journey</span>
                <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/services" className="btn-ezy btn-outline-light">
                <span>View all services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Chapters Compact Strip */}
      <section className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] py-[var(--section-space-tight)]">
        <div className="site-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {APPROACH_CHAPTERS.map((ch) => (
            <div key={ch.index} className="space-y-2">
              <p className="t-meta text-[var(--color-brand-primary-ink)]">
                {ch.index} · {ch.title}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">{ch.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
