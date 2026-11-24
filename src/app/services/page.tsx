import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '@/data/services';

export const metadata: Metadata = {
  title: 'Travel Services — Corporate, Medical, Leisure, Visas & More',
  description:
    'Explore all nine travel services coordinated by EzyQuick: Corporate Travel, Medical Travel, Leisure Travel, Visa Services, Air Tickets, Hotel Bookings, Forex Services, Travel Insurance, and MICE Services.',
};

export default function ServicesDirectoryPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-[var(--section-space)] bg-[var(--color-bg-primary)]">
      <div className="site-container space-y-14">
        <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-text-muted)]">
          <Link href="/" className="hover:text-[var(--color-brand-primary-ink)]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-text-primary)] font-medium">Services</span>
        </nav>

        <header className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-10 border-b border-[var(--color-border)]">
          <div className="lg:col-span-8 space-y-4">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">
              Nine Travel Disciplines · One Point of Contact
            </p>
            <h1 className="t-hero text-[var(--color-text-primary)]">
              Every service your journey requires.
            </h1>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Combine flights, hotels, visa guidance, and destination planning—or reach out for a
              single specialised service through our New Delhi and Dubai desks.
            </p>
            <Link href="/contact#enquiry" className="btn-ezy btn-primary !min-h-[44px]">
              <span>Plan Your Journey</span>
              <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group bg-white border border-[var(--color-border)] overflow-hidden flex flex-col justify-between"
            >
              <div className="media-frame relative aspect-[16/10] w-full bg-[var(--color-bg-dark)]">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute top-3.5 left-3.5 bg-white/95 text-[var(--color-brand-primary-ink)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] tabular-nums">
                  {service.index} · {service.shortLabel}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                <div className="space-y-2.5">
                  <p className="text-xs text-[var(--color-text-muted)]">{service.category}</p>
                  <h2 className="font-display text-3xl text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary-ink)] transition-colors">
                    {service.name}
                  </h2>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {service.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-brand-primary-ink)]">
                  <span>Explore service</span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
