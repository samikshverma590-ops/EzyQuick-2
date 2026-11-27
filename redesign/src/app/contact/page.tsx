import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { JourneyEnquiryForm } from '@/components/forms/JourneyEnquiryForm';
import { buildSafeWhatsAppUrl, OFFICES, SITE } from '@/data/site';
import { buildBreadcrumbJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Contact EzyQuick — New Delhi & Dubai Offices',
  description:
    'Contact EzyQuick Travel Solutions in New Delhi (+91 8527729449), Dubai (+971 589658819), via WhatsApp, or email info@ezyquick.in.',
  alternates: { canonical: `${SITE.url}/contact/` },
  openGraph: {
    title: 'Contact EzyQuick — New Delhi & Dubai Travel Desks',
    description: 'Reach our India or UAE travel desks directly by phone, email, WhatsApp, or enquiry form.',
    url: `${SITE.url}/contact/`,
  },
};

export default function ContactPage() {
  const { url: whatsappUrl } = buildSafeWhatsAppUrl(
    'Hello EzyQuick, I would like to connect with a travel advisor.'
  );

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact/' },
  ]);

  return (
    <main className="pt-28 pb-24 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="max-w-3xl">
          <p className="font-mono-hud text-xs font-semibold tracking-wider text-[#0059FD] uppercase">
            Contact &amp; Operating Desks
          </p>
          <h1 className="font-display mt-2 text-4xl font-extrabold leading-[0.98] text-[#0C1E3A] sm:text-6xl">
            Speak directly with New Delhi or Dubai.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#475B78]">
            Choose your preferred office below, start a WhatsApp conversation, email{' '}
            <a href={SITE.emailHref} className="font-semibold text-[#0C1E3A] underline">
              {SITE.email}
            </a>
            , or send a structured journey brief.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          {/* Left: Verified Offices & Direct Channels */}
          <div className="space-y-5 lg:col-span-5">
            {OFFICES.map((office) => (
              <div
                key={office.id}
                className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-hud text-xs font-semibold text-[#0059FD] uppercase">
                    {office.label}
                  </span>
                  <span className="font-mono-hud rounded-full bg-[#0C1E3A] px-2.5 py-0.5 text-[10px] font-bold text-[#FFFFFF]">
                    {office.code}
                  </span>
                </div>
                <h2 className="font-display mt-2 text-2xl font-bold text-[#0C1E3A]">
                  {office.city}, {office.country}
                </h2>
                <p className="mt-2 flex items-start gap-2 text-sm text-[#475B78]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0059FD]" aria-hidden="true" />
                  <span>{office.addressLines.join(' ')}</span>
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#0C1E3A]/10 pt-4">
                  <a
                    href={office.phoneHref}
                    className="btn-kinetic px-4 py-2 text-xs"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{office.phoneDisplay}</span>
                  </a>
                  <span className="font-mono-hud text-[11px] text-[#647896]">
                    {office.coordinates}
                  </span>
                </div>
              </div>
            ))}

            {/* Direct Email & WhatsApp */}
            <div className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-6 space-y-3">
              <h2 className="font-display text-lg font-bold text-[#0C1E3A]">Direct Channels</h2>
              <a
                href={SITE.emailHref}
                className="flex items-center gap-2.5 text-sm font-semibold text-[#0C1E3A] hover:text-[#0059FD]"
              >
                <Mail className="h-4 w-4 text-[#0059FD]" aria-hidden="true" />
                {SITE.email}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm font-semibold text-[#0C1E3A] hover:text-[#0059FD]"
              >
                <MessageCircle className="h-4 w-4 text-[#0059FD]" aria-hidden="true" />
                WhatsApp: {SITE.whatsappNumber}
              </a>
            </div>

            {/* Anchored Privacy & Data-Retention Explanation */}
            <div
              id="privacy"
              className="rounded-3xl border border-[#174A9C]/25 bg-[#174A9C]/8 p-6"
            >
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#174A9C]" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-base font-bold text-[#0C1E3A]">
                    Privacy &amp; Data Handling
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-[#475B78]">{SITE.privacyNotice}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Structured Enquiry Form */}
          <div className="lg:col-span-7">
            <JourneyEnquiryForm />
          </div>
        </div>
      </div>
    </main>
  );
}
