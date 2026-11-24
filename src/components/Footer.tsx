import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { OFFICES, SITE, buildWhatsAppUrl } from '@/data/site';
import { SERVICES } from '@/data/services';
import { FEATURED_HOME_DESTINATIONS } from '@/data/destinations';

export function Footer() {
  const coreExplore = SERVICES.slice(0, 5);
  const supportServices = SERVICES.slice(5);

  return (
    <footer className="bg-white text-[var(--color-text-primary)] border-t border-[var(--color-border)]">
      <div className="site-container py-16 lg:py-20">
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-[var(--color-border)]">
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" aria-label="EzyQuick home" className="inline-block">
              <BrandLogo variant="plain" size="lg" />
            </Link>
            <p className="text-[var(--color-text-secondary)] max-w-sm leading-relaxed">
              Travel beyond the ordinary. Thoughtful corporate, medical, and leisure travel
              arrangements coordinated through one dedicated desk across New Delhi and Dubai.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/contact#enquiry" className="btn-ezy btn-primary !min-h-[44px] !px-5">
                <span>Plan Your Journey</span>
                <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ezy btn-outline !min-h-[44px] !px-5"
              >
                <span>WhatsApp</span>
                <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Services Columns */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            <div>
              <p className="t-meta text-[var(--color-brand-primary-ink)] mb-4">Travel Services</p>
              <ul className="space-y-2.5 text-sm">
                {coreExplore.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary-ink)] transition-colors"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="t-meta text-[var(--color-brand-primary-ink)] mb-4">Support &amp; Events</p>
              <ul className="space-y-2.5 text-sm">
                {supportServices.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary-ink)] transition-colors"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Featured Destinations */}
          <div className="lg:col-span-2">
            <p className="t-meta text-[var(--color-brand-primary-ink)] mb-4">Destinations</p>
            <ul className="space-y-2.5 text-sm">
              {FEATURED_HOME_DESTINATIONS.map((dest) => (
                <li key={dest.slug}>
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary-ink)] transition-colors"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/destinations"
                  className="inline-flex items-center gap-1 font-semibold text-[var(--color-brand-primary-ink)] hover:underline"
                >
                  <span>All 14 destinations</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Delhi & Dubai Offices */}
          <div className="lg:col-span-3 space-y-6">
            {OFFICES.map((office) => (
              <div key={office.id} className="space-y-1.5">
                <p className="t-meta text-[var(--color-brand-primary-ink)] flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {office.label} ({office.iata})
                  </span>
                </p>
                <address className="not-italic text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {office.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <a
                  href={office.phoneHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary-ink)] tabular-nums"
                >
                  <Phone className="h-3.5 w-3.5 text-[var(--color-brand-primary)]" aria-hidden="true" />
                  <span>{office.phoneDisplay}</span>
                </a>
              </div>
            ))}

            <div className="pt-2 border-t border-[var(--color-border)] space-y-1.5">
              <p className="t-meta text-[var(--color-brand-primary-ink)]">Direct Desk</p>
              <a
                href={SITE.emailHref}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary-ink)]"
              >
                <Mail className="h-3.5 w-3.5 text-[var(--color-brand-primary)]" aria-hidden="true" />
                <span>{SITE.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Gateway Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© {SITE.copyrightYear} {SITE.legalName}</span>
            <span>{SITE.brandName} · {SITE.tagline}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 tabular-nums">
            <span>{SITE.corridorLabel}</span>
            <Link href="/about" className="hover:text-[var(--color-text-primary)] transition-colors">
              About EzyQuick
            </Link>
            <Link href="/contact" className="hover:text-[var(--color-text-primary)] transition-colors">
              Contact &amp; Enquiry
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
