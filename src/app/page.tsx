import type { Metadata } from 'next';
import { DesignerBookingHero } from '@/components/home/DesignerBookingHero';
import { DestinationPortalsSection } from '@/components/portals/DestinationPortalsSection';
import { ServicesBentoSection } from '@/components/home/ServicesBentoSection';
import { TripProcessTimeline } from '@/components/home/TripProcessTimeline';
import { DestinationCollectionsSection } from '@/components/home/DestinationCollectionsSection';
import { GlobalHubsSection } from '@/components/home/GlobalHubsSection';
import {
  ConciergeFloatingTrigger,
  FastTrackConciergeSection,
} from '@/components/home/FastTrackConciergeSection';
import { PartnersAndStoriesSection } from '@/components/home/PartnersAndStoriesSection';
import { FinalCtaBanner } from '@/components/home/FinalCtaBanner';
import { SITE } from '@/data/site';

export const metadata: Metadata = {
  title: 'EzyQuick Travel Solutions — International Corporate & Leisure Travel',
  description:
    'Discover EzyQuick Travel Solutions operating through New Delhi and Dubai. Explore 14 curated destinations and 9 corporate, medical, and leisure travel services.',
  alternates: {
    canonical: `${SITE.url}/`,
  },
  openGraph: {
    title: 'EzyQuick Travel Solutions — Travel the World, Without the Planning Stress',
    description:
      'Flights, curated stays, visas, and corporate travel arranged end-to-end by reachable travel desks in New Delhi and Dubai.',
    url: `${SITE.url}/`,
  },
};

export default function HomePage() {
  return (
    <main>
      {/* HERO: Hand-Crafted Dribbble-Style Photographic Booking Hero (Zero Globe) */}
      <DesignerBookingHero />

      {/* 2.5D FOREGROUND-MASKED HORIZON-EXPANSION DESTINATION PORTALS */}
      <DestinationPortalsSection />

      {/* SECTION 1: Asymmetric 9-Service Bento Grid (B2B & B2C Split) */}
      <ServicesBentoSection />

      {/* SECTION 2: Scroll-Linked Trip Process (Origin -> Visa -> Flight -> Stay) */}
      <TripProcessTimeline />

      {/* SECTION 3: Destination Collections & Wanderlust Showcase */}
      <DestinationCollectionsSection />

      {/* SECTION 4: Global Hubs (New Delhi & Dubai Live IST/GST) & Trust Metrics */}
      <GlobalHubsSection />

      {/* SECTION 5: "Unlock Your Custom Offer" — High-Converting Fast-Track Concierge */}
      <FastTrackConciergeSection />

      {/* SECTION 6: Partner Network Marquee & Representative Desk Stories */}
      <PartnersAndStoriesSection />

      {/* SECTION 7A: Cinematic Travel CTA Banner (Section 7B Oversized Footer in RootLayout) */}
      <FinalCtaBanner />

      {/* Reusable Floating Fast-Track Concierge Trigger & Slide-Over Drawer */}
      <ConciergeFloatingTrigger />
    </main>
  );
}
