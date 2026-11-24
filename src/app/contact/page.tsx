import type { Metadata } from 'next';
import Link from 'next/link';
import { JourneyEnquiryBand } from '@/components/home/JourneyEnquiryBand';
import { SITE } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact EzyQuick — Plan Your Journey | New Delhi & Dubai Offices',
  description:
    'Contact EzyQuick Travel Solutions in New Delhi (+91 8527729449) or Dubai (+971 589658819), email info@ezyquick.in, or submit a tailored travel enquiry online.',
};

export default function ContactPage() {
  return (
    <div className="pt-28 sm:pt-36 bg-[var(--color-bg-primary)]">
      <div className="site-container pb-4 space-y-6">
        <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-text-muted)]">
          <Link href="/" className="hover:text-[var(--color-brand-primary-ink)]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-text-primary)] font-medium">Contact</span>
        </nav>

        <header className="max-w-3xl space-y-4">
          <p className="t-meta text-[var(--color-brand-primary-ink)]">
            {SITE.corridorLabel} · Direct Human Desk
          </p>
          <h1 className="t-hero text-[var(--color-text-primary)]">
            Where would you like to go next?
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
            Tell us about your upcoming holiday, corporate schedule, medical travel logistics, or
            visa and flight needs. Every enquiry is handled directly by our travel desk.
          </p>
        </header>
      </div>

      <JourneyEnquiryBand />
    </div>
  );
}
