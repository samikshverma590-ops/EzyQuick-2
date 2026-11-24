import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { BrandIntroExpand } from '@/components/home/BrandIntroExpand';
import { DestinationAtlas } from '@/components/home/DestinationAtlas';
import { ServicesDossier } from '@/components/home/ServicesDossier';
import { ApproachMeridian } from '@/components/home/ApproachMeridian';
import { DestinationStorytelling } from '@/components/home/DestinationStorytelling';
import { ExecutiveChapter } from '@/components/home/ExecutiveChapter';
import { WhyAndStories } from '@/components/home/WhyAndStories';
import { JourneyEnquiryBand } from '@/components/home/JourneyEnquiryBand';

export const metadata: Metadata = {
  title: 'EzyQuick | Travel Beyond the Ordinary — New Delhi & Dubai',
  description:
    'From holidays and business trips to medical travel coordination, visas, flights, hotels, forex, travel insurance, and MICE — EzyQuick brings your travel arrangements together through one desk.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandIntroExpand />
      <DestinationAtlas />
      <ServicesDossier />
      <ApproachMeridian />
      <DestinationStorytelling />
      <ExecutiveChapter />
      <WhyAndStories />
      <JourneyEnquiryBand />
    </>
  );
}
