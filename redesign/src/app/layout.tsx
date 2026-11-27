import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { JourneySelectionProvider } from '@/lib/journey-selection';
import { SITE } from '@/data/site';
import { buildTravelAgencyJsonLd } from '@/lib/structured-data';
import '@/styles/globals.css';

export const viewport: Viewport = {
  themeColor: '#F4F7FC',
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'EzyQuick Global Atlas — International Corporate & Leisure Travel',
    template: '%s | EzyQuick',
  },
  description:
    'International travel services operating through New Delhi and Dubai. Explore 9 travel disciplines and 14 verified destinations on the interactive EzyQuick Global Atlas.',
  openGraph: {
    type: 'website',
    siteName: SITE.legalName,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = buildTravelAgencyJsonLd();

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`}>
      <body className="min-h-screen bg-[#F4F7FC] text-[#0C1E3A] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <JourneySelectionProvider>
          <SiteHeader />
          <div id="main-content">{children}</div>
          <SiteFooter />
        </JourneySelectionProvider>
      </body>
    </html>
  );
}
