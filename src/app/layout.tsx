import type { Metadata, Viewport } from 'next';
import Image from 'next/image';
import { instrumentSerif, manrope } from './fonts';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppDock } from '@/components/WhatsAppDock';
import { MotionEngine } from '@/engine/next';
import { OFFICES, SITE } from '@/data/site';
import { SERVICES } from '@/data/services';
import { assetPath } from '@/lib/asset-path';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#081426',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'EzyQuick | Travel Made Easy — New Delhi & Dubai Travel Desk',
    template: '%s | EzyQuick',
  },
  description:
    'Thoughtfully coordinated corporate, medical, and leisure travel, visa documentation guidance, air tickets, hotel bookings, forex, travel insurance, and MICE services across New Delhi and Dubai.',
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE.url,
    siteName: SITE.brandName,
    title: 'EzyQuick | Travel Beyond the Ordinary',
    description:
      'One point of contact for holidays, corporate trips, medical travel coordination, visas, flights, and stays across India, Dubai, and international destinations.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EzyQuick | Travel Beyond the Ordinary',
    description:
      'Corporate, medical, and leisure travel coordinated through New Delhi and Dubai.',
  },
  icons: {
    icon: assetPath('/brand/ezyquick-logo.png'),
    apple: assetPath('/brand/ezyquick-logo.png'),
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: SITE.legalName,
  alternateName: SITE.brandName,
  url: SITE.url,
  logo: `${SITE.url}${SITE.logoPath}`,
  email: SITE.email,
  telephone: OFFICES[0].phoneDisplay,
  slogan: `${SITE.tagline} · ${SITE.secondaryTagline}`,
  location: OFFICES.map((office) => ({
    '@type': 'Place',
    name: `${SITE.brandName} — ${office.label}`,
    telephone: office.phoneDisplay,
    address: {
      '@type': 'PostalAddress',
      streetAddress: office.addressLines.join(' '),
      addressLocality: office.city,
      addressCountry: office.country,
    },
  })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'EzyQuick Travel Services',
    itemListElement: SERVICES.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.name,
        description: service.tagline,
        url: `${SITE.url}/services/${service.slug}`,
      },
    })),
  },
};

const PREPAINT_FLAGS_SCRIPT = `
try {
  var cl = document.documentElement.classList;
  cl.add('js');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cl.add('motion');
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_FLAGS_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        {/* Fast Tasteful Brand Entrance (Official Unmodified Logo on Crisp White) */}
        <div id="brand-intro" role="status" aria-label="Loading EzyQuick">
          <div data-intro-out className="flex flex-col items-center gap-4 px-6">
            <Image
              src={assetPath(SITE.logoPath)}
              alt={SITE.logoAlt}
              width={220}
              height={88}
              priority
              className="h-auto w-[180px] sm:w-[220px] object-contain"
              style={{ filter: 'none' }}
            />
            <span className="t-meta text-[var(--color-text-muted)]">
              {SITE.corridorLabel}
            </span>
          </div>
          <div
            data-intro-out
            className="w-44 h-[2px] bg-[var(--color-border)] overflow-hidden"
            aria-hidden="true"
          >
            <div
              data-intro-bar
              className="h-full w-full origin-left scale-x-0"
              style={{
                background:
                  'linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-secondary))',
              }}
            />
          </div>
        </div>

        {/* Fast Restrained Route Transition Curtain */}
        <div id="route-curtain" aria-hidden="true">
          <div className="curtain-panel">
            <div className="curtain-meridian" />
          </div>
        </div>

        <Header />

        <main id="main" tabIndex={-1}>
          {children}
        </main>

        <Footer />
        <WhatsAppDock />
        <MotionEngine />
      </body>
    </html>
  );
}
