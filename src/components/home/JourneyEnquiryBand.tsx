import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { EnquiryForm } from '@/components/EnquiryForm';
import { OFFICES, SITE, buildWhatsAppUrl } from '@/data/site';

export function JourneyEnquiryBand() {
  return (
    <section
      id="enquiry"
      aria-labelledby="plan-journey-heading"
      className="bg-[var(--color-bg-primary)] py-[var(--section-space)]"
    >
      <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left: Direct Human Access + Verified Delhi & Dubai Offices */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">
              Plan Your Journey
            </p>
            <h2
              id="plan-journey-heading"
              data-split="lines"
              className="t-display text-[var(--color-text-primary)]"
            >
              Start a conversation with our desk.
            </h2>
            <p className="text-[var(--color-text-secondary)] text-base leading-relaxed">
              Share your destination, travel dates, and preferences—or reach our New Delhi and
              Dubai offices directly by phone, email, or WhatsApp.
            </p>
          </div>

          {/* Direct Email & WhatsApp Strip */}
          <div className="bg-white border border-[var(--color-border)] p-6 space-y-4">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
              <div>
                <p className="t-meta text-[var(--color-text-muted)]">Email Desk</p>
                <a
                  href={SITE.emailHref}
                  className="inline-flex items-center gap-2 text-base font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary-ink)] mt-1"
                >
                  <Mail className="h-4 w-4 text-[var(--color-brand-primary)]" aria-hidden="true" />
                  <span>{SITE.email}</span>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="t-meta text-[var(--color-text-muted)]">WhatsApp Concierge</p>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary-ink)] mt-1 tabular-nums"
                >
                  <MessageCircle className="h-4 w-4 text-[#0D7C56]" aria-hidden="true" />
                  <span>{SITE.whatsappNumber}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Verified Delhi & Dubai Office Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {OFFICES.map((office) => (
              <article
                key={office.id}
                className="bg-white border border-[var(--color-border)] p-6 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="t-meta text-[var(--color-brand-primary-ink)] flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{office.label}</span>
                  </p>
                  <span className="text-xs font-semibold text-[var(--color-text-muted)] tabular-nums">
                    {office.iata} · {office.timezone}
                  </span>
                </div>
                <address className="not-italic text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {office.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <a
                  href={office.phoneHref}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary-ink)] tabular-nums pt-1"
                >
                  <Phone className="h-3.5 w-3.5 text-[var(--color-brand-primary)]" aria-hidden="true" />
                  <span>{office.phoneDisplay}</span>
                </a>
              </article>
            ))}
          </div>
        </div>

        {/* Right: Conditional Journey Enquiry Studio */}
        <div className="lg:col-span-7">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
