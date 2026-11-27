import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ServiceShowcase } from '@/components/services/ServiceShowcase';
import { SITE } from '@/data/site';
import { buildBreadcrumbJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Travel Services — Corporate, Medical, Leisure, Visas, Flights & MICE',
  description:
    'Explore all nine EzyQuick travel services: Corporate Travel, Medical Travel, Leisure Holidays, Visa Services, Air Tickets, Hotel Bookings, Forex, Travel Insurance, and MICE.',
  alternates: { canonical: `${SITE.url}/services/` },
  openGraph: {
    title: 'Nine Travel Services | EzyQuick',
    description:
      'Complete corporate, medical, and leisure travel coordination from New Delhi and Dubai.',
    url: `${SITE.url}/services/`,
  },
};

export default function ServicesPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services/' },
  ]);

  return (
    <main className="pt-28 pb-24 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-[#0C1E3A]/12 pb-10 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="font-mono-hud text-xs font-semibold tracking-wider text-[#0059FD] uppercase">
              Nine Travel Disciplines
            </p>
            <h1 className="font-display mt-2 text-4xl font-extrabold leading-[0.98] text-[#0C1E3A] sm:text-6xl">
              Travel Services built for both business and leisure.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#475B78] sm:text-base">
              Every service is coordinated by our New Delhi and Dubai desks with clear pre-booking
              proposals, organised documentation checklists, and single-point human support.
            </p>
          </div>
          <Link href="/plan-your-journey/" className="btn-kinetic self-start px-6 py-3 text-sm lg:self-auto">
            <span>Start an Enquiry</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ServiceShowcase />
      </div>
    </main>
  );
}
