import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getServiceBySlug } from '@/data/services';

export function ExecutiveChapter() {
  const corporate = getServiceBySlug('corporate-travel')!;
  const medical = getServiceBySlug('medical-travel')!;
  const mice = getServiceBySlug('mice-services')!;
  const pillars = [corporate, medical, mice];

  return (
    <section
      aria-labelledby="executive-heading"
      className="bg-[var(--color-bg-dark)] text-[var(--color-text-on-dark)] py-[var(--section-space)]"
    >
      <div className="site-container space-y-14">
        {/* Top Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7 space-y-4">
            <p className="t-meta text-[var(--color-brand-secondary)]">
              Corporate · Medical · MICE
            </p>
            <h2 id="executive-heading" data-split="lines" className="t-display text-white max-w-[16ch]">
              Built for business delegations, healthcare journeys, and global events.
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <p className="text-[var(--color-text-on-dark-muted)] text-base leading-relaxed">
              EzyQuick is more than a leisure planner. Companies, institutional teams, and
              families travelling for medical care rely on our New Delhi and Dubai desks for
              disciplined routing, accommodation proximity, visa documentation checklists, and
              calm coordination.
            </p>
            <Link href="/contact#enquiry" className="btn-ezy btn-light !min-h-[46px]">
              <span>Speak with our corporate &amp; care desk</span>
              <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Three Authoritative Dark Editorial Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pillars.map((service, idx) => (
            <article
              key={service.slug}
              data-reveal="up"
              data-delay={String(idx * 0.08)}
              className="group bg-[var(--color-bg-dark-elevated)] border border-[var(--color-border-dark)] flex flex-col justify-between overflow-hidden"
            >
              <div className="media-frame relative aspect-[16/10] w-full">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(8,20,38,0.12) 0%, rgba(16,32,57,0.88) 100%)',
                  }}
                />
                <span className="absolute top-4 left-4 t-meta text-[var(--color-brand-secondary)]">
                  {service.index} · {service.shortLabel}
                </span>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <h3 className="font-display text-3xl text-white">{service.name}</h3>
                  <p className="text-sm text-[var(--color-text-on-dark-muted)] leading-relaxed">
                    {service.summary}
                  </p>
                  <ul className="space-y-1.5 pt-2 border-t border-[var(--color-border-dark)] text-xs text-white/80">
                    {service.scope.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-brand-secondary)] shrink-0"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {service.slug === 'medical-travel' && (
                  <p className="text-[11px] text-[var(--color-text-on-dark-muted)]/90 border-l-2 border-[var(--color-brand-secondary)] pl-3">
                    Travel, accommodation, and logistics coordination only — not clinical advice or
                    medical treatment.
                  </p>
                )}

                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center justify-between pt-4 border-t border-[var(--color-border-dark)] text-sm font-semibold text-white group-hover:text-[var(--color-brand-secondary)] transition-colors"
                >
                  <span>Explore {service.name}</span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
