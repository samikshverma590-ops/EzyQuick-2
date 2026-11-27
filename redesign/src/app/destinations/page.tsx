import type { Metadata } from 'next';
import { GlobalAtlasExperience } from '@/components/globe/GlobalAtlasExperience';
import { DestinationDirectory } from '@/components/destinations/DestinationDirectory';
import { SITE } from '@/data/site';
import { buildBreadcrumbJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Destinations — 14 Verified Places Across India, UAE & Asia',
  description:
    'Explore all 14 verified EzyQuick destinations on the interactive 3D Global Atlas or browse the full searchable directory covering Dubai, Abu Dhabi, Kerala, Goa, Ladakh, Bali, Thailand, Vietnam, Singapore, Malaysia, Sri Lanka, and Almaty.',
  alternates: { canonical: `${SITE.url}/destinations/` },
  openGraph: {
    title: '14 Verified Travel Destinations | EzyQuick Global Atlas',
    description:
      'Interactive 3D globe and searchable directory of all 14 domestic and international EzyQuick destinations.',
    url: `${SITE.url}/destinations/`,
  },
};

export default function DestinationsPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations/' },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <GlobalAtlasExperience mode="destinations" />

      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8" aria-labelledby="all-dest-heading">
        <div className="mb-10 max-w-2xl">
          <p className="font-mono-hud text-xs font-semibold tracking-wider text-[#0059FD] uppercase">
            Complete Directory · 14 Verified Destinations
          </p>
          <h2
            id="all-dest-heading"
            className="font-display mt-2 text-3xl font-extrabold text-[#0C1E3A] sm:text-5xl"
          >
            Search and filter every destination.
          </h2>
        </div>

        <DestinationDirectory />
      </section>
    </main>
  );
}
