import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import { DestinationDirectoryClient } from '@/components/DestinationDirectoryClient';

export const metadata: Metadata = {
  title: 'Destinations — India & International Travel Guides',
  description:
    'Explore 14 curated domestic and international destinations arranged by EzyQuick: Dubai, Abu Dhabi, Phuket, Krabi, Phu Quoc, Bali, Sri Lanka, Singapore, Malaysia, Almaty, Kerala, Goa, Andaman & Nicobar, and Ladakh.',
};

export default function DestinationsPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-[var(--section-space)] bg-[var(--color-bg-primary)]">
      <div className="site-container space-y-12">
        <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-text-muted)]">
          <Link href="/" className="hover:text-[var(--color-brand-primary-ink)]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-text-primary)] font-medium">Destinations</span>
        </nav>

        <header className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8 space-y-4">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">
              India &amp; International Atlas
            </p>
            <h1 className="t-hero text-[var(--color-text-primary)]">
              Fourteen places worth travelling for.
            </h1>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Every destination below is custom-planned upon enquiry around your dates, pace, and
              travellers—never locked into rigid off-the-shelf packages.
            </p>
            <Link href="/contact#enquiry" className="btn-ezy btn-primary !min-h-[44px]">
              <span>Request a custom itinerary</span>
              <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </header>

        <DestinationDirectoryClient destinations={DESTINATIONS} />
      </div>
    </div>
  );
}
