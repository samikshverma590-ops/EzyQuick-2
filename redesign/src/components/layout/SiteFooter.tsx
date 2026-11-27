import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { buildSafeWhatsAppUrl, NAV_LINKS, OFFICES, SITE } from '@/data/site';
import { SERVICES } from '@/data/services';
import { DESTINATIONS } from '@/data/destinations';
import { assetPath } from '@/lib/asset-path';

export function SiteFooter() {
  const { url: whatsappUrl } = buildSafeWhatsAppUrl(
    'Hello EzyQuick, I would like to discuss a travel enquiry.'
  );

  return (
    <footer className="bg-[#0C1E3A] text-[#F4F7FC]" aria-label="Site footer">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:py-20">
        {/* Top Row: Brand & Direct Action */}
        <div className="flex flex-col justify-between gap-8 border-b border-[#F4F7FC]/12 pb-12 lg:flex-row lg:items-end">
          <div className="max-w-lg">
            <div className="inline-flex rounded-xl bg-white px-3.5 py-2 shadow-lg">
              <img
                src={assetPath(SITE.logoPath)}
                alt={SITE.logoAlt}
                className="h-9 w-auto"
                width={180}
                height={72}
              />
            </div>
            <p className="font-display mt-5 text-3xl font-bold leading-tight text-[#FFFFFF] sm:text-4xl">
              {SITE.secondaryTagline}.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#B7C9E2]">
              International travel coordination for corporate teams, families, and individual
              travellers from our offices in New Delhi and Dubai.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/plan-your-journey/"
              className="btn-kinetic px-6 py-3 text-sm"
            >
              <span>Plan Your Journey</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#F4F7FC]/25 px-5 py-3 text-sm font-semibold text-[#FFFFFF] transition-colors hover:border-[#FDBC03] hover:text-[#FDBC03]"
            >
              <MessageCircle className="h-4 w-4 text-[#FDBC03]" aria-hidden="true" />
              <span>WhatsApp Desk</span>
            </a>
          </div>
        </div>

        {/* Middle Grid: Offices + Navigation + Services + Destinations */}
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Verified Offices (DEL & DXB) */}
          <div className="space-y-5 lg:col-span-4">
            <h2 className="font-mono-hud text-xs font-semibold tracking-wider text-[#FDBC03] uppercase">
              Operating Hubs
            </h2>
            <div className="space-y-4">
              {OFFICES.map((office) => (
                <div
                  key={office.id}
                  className="rounded-2xl border border-[#F4F7FC]/12 bg-[#13294B] p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold text-[#FFFFFF]">
                      {office.label} · {office.city}
                    </span>
                    <span className="font-mono-hud rounded-full bg-[#0059FD]/20 px-2 py-0.5 text-[10px] font-bold text-[#FDBC03]">
                      {office.code}
                    </span>
                  </div>
                  <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-[#B7C9E2]">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0059FD]" aria-hidden="true" />
                    <span>{office.addressLines.join(' ')}</span>
                  </p>
                  <a
                    href={office.phoneHref}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#FFFFFF] hover:text-[#FDBC03]"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#0059FD]" aria-hidden="true" />
                    {office.phoneDisplay}
                  </a>
                </div>
              ))}
              <a
                href={SITE.emailHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#FFFFFF] hover:text-[#FDBC03]"
              >
                <Mail className="h-4 w-4 text-[#0059FD]" aria-hidden="true" />
                {SITE.email}
              </a>
            </div>
          </div>

          {/* Primary Navigation */}
          <div className="lg:col-span-2">
            <h2 className="font-mono-hud text-xs font-semibold tracking-wider text-[#FDBC03] uppercase">
              Company
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#DCE8F8] transition-colors hover:text-[#FFFFFF]">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/plan-your-journey/"
                  className="font-semibold text-[#FDBC03] transition-colors hover:text-[#FFFFFF]"
                >
                  Plan Your Journey
                </Link>
              </li>
            </ul>
          </div>

          {/* All 9 Services */}
          <div className="lg:col-span-3">
            <h2 className="font-mono-hud text-xs font-semibold tracking-wider text-[#FDBC03] uppercase">
              Services (9)
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}/`}
                    className="text-[#DCE8F8] transition-colors hover:text-[#FFFFFF]"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* All 14 Destinations */}
          <div className="lg:col-span-3">
            <h2 className="font-mono-hud text-xs font-semibold tracking-wider text-[#FDBC03] uppercase">
              Destinations (14)
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              {DESTINATIONS.map((dest) => (
                <li key={dest.slug}>
                  <Link
                    href={`/destinations/${dest.slug}/`}
                    className="text-[#DCE8F8] transition-colors hover:text-[#FFFFFF]"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Privacy Strip */}
        <div className="flex flex-col justify-between gap-3 border-t border-[#F4F7FC]/12 pt-6 text-xs text-[#93A8C7] sm:flex-row sm:items-center">
          <p>© {SITE.copyrightYear} {SITE.legalName}. All rights reserved.</p>
          <p>
            New Delhi (DEL) &amp; Dubai (DXB) ·{' '}
            <Link href="/contact/#privacy" className="underline hover:text-[#FFFFFF]">
              Privacy &amp; Data Handling
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
