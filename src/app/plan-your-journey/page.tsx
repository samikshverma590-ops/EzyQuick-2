import type { Metadata } from 'next';
import { JourneyEnquiryForm } from '@/components/forms/JourneyEnquiryForm';
import { OFFICES, SITE } from '@/data/site';
import { buildBreadcrumbJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Plan Your Journey — Custom Travel & Corporate Enquiry',
  description:
    'Submit a tailored travel brief for leisure holidays, corporate travel, MICE, medical travel, visas, air tickets, hotels, forex, or travel insurance with EzyQuick New Delhi & Dubai.',
  alternates: { canonical: `${SITE.url}/plan-your-journey/` },
  openGraph: {
    title: 'Plan Your Journey | EzyQuick',
    description: 'Start a structured corporate or leisure travel enquiry with our New Delhi or Dubai desk.',
    url: `${SITE.url}/plan-your-journey/`,
  },
};

export default function PlanYourJourneyPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Plan Your Journey', path: '/plan-your-journey/' },
  ]);

  return (
    <main className="pt-28 pb-24 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="mx-auto max-w-[1040px] px-4 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="font-mono-hud text-xs font-semibold tracking-wider text-[#0059FD] uppercase">
            Journey Brief · B2B &amp; B2C
          </p>
          <h1 className="font-display mt-2 text-4xl font-extrabold leading-[0.98] text-[#0C1E3A] sm:text-6xl">
            Plan Your Journey.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#475B78]">
            Select your service and preferred desk (New Delhi or Dubai). Form fields adapt
            automatically for corporate, MICE, medical, visa, flight, hotel, forex, or holiday
            enquiries.
          </p>
        </div>

        <JourneyEnquiryForm />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {OFFICES.map((office) => (
            <div
              key={office.id}
              className="rounded-2xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-5 text-xs text-[#475B78]"
            >
              <strong className="font-display text-sm text-[#0C1E3A]">
                {office.label} ({office.code})
              </strong>
              <p className="mt-1">{office.addressLines.join(' ')}</p>
              <a
                href={office.phoneHref}
                className="mt-2 inline-block font-semibold text-[#0059FD] hover:underline"
              >
                {office.phoneDisplay}
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
