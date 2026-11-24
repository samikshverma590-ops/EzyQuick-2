import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SITE, WHY_EZYQUICK_PILLARS } from '@/data/site';

export function WhyAndStories() {
  return (
    <>
      {/* Section 10: Why EzyQuick (Real Business Value, Zero Fabricated Stats) */}
      <section
        aria-labelledby="why-ezyquick-heading"
        className="bg-[var(--color-bg-primary)] py-[var(--section-space)] border-b border-[var(--color-border)]"
      >
        <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-5">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">Why EzyQuick</p>
            <h2
              id="why-ezyquick-heading"
              data-split="lines"
              className="t-display text-[var(--color-text-primary)]"
            >
              Practical clarity over loud promises.
            </h2>
            <p className="text-[var(--color-text-secondary)] text-base leading-relaxed max-w-md">
              We do not hide behind call-centre queues or speculative bait pricing. You work with
              a dedicated travel desk operating across New Delhi and Dubai that treats every
              itinerary—holiday, business, or medical—with methodical care.
            </p>
            <div className="pt-2">
              <Link href="/about" className="btn-ezy btn-outline !min-h-[44px]">
                <span>More about how we work</span>
                <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_EZYQUICK_PILLARS.map((pillar, idx) => (
              <article
                key={pillar.index}
                data-reveal="up"
                data-delay={String(idx * 0.07)}
                className="bg-white border border-[var(--color-border)] p-6 sm:p-7 space-y-4"
              >
                <span className="t-meta text-[var(--color-brand-primary-ink)]">
                  {pillar.index}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl leading-snug text-[var(--color-text-primary)]">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 11: Traveller Stories (Strict Honesty — No Fabricated Reviews or Fake Stars) */}
      <section
        id="stories"
        aria-labelledby="traveller-stories-heading"
        className="bg-[var(--color-bg-secondary)] py-[var(--section-space-tight)] border-b border-[var(--color-border)]"
      >
        <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-3">
            <p className="t-meta text-[var(--color-brand-primary-ink)]">Traveller Stories</p>
            <h2
              id="traveller-stories-heading"
              className="t-title sm:text-[2.75rem] leading-[1.08] text-[var(--color-text-primary)]"
            >
              Verified stories only—never invented ratings.
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              We publish traveller feedback only once received directly and approved by our
              clients. Have you travelled with EzyQuick? Share your experience on Google or send
              us a note directly.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[var(--color-border)] p-6 space-y-3">
              <p className="t-meta text-[var(--color-text-muted)]">Our Truth Standard</p>
              <h3 className="font-display text-2xl text-[var(--color-text-primary)]">
                Your journey could be featured here.
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Genuine customer stories will appear in this archive once verified and approved for
                publication.
              </p>
            </div>

            <div className="bg-white border border-[var(--color-border)] p-6 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <p className="t-meta text-[var(--color-brand-primary-ink)]">Google Profile</p>
                <h3 className="font-display text-2xl text-[var(--color-text-primary)]">
                  Read or leave a review
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Find EzyQuick on Google to read public updates or share feedback from your trip.
                </p>
              </div>
              <a
                href={SITE.googleReviewSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link text-sm text-[var(--color-text-primary)] self-start"
              >
                <span>Find EzyQuick on Google</span>
                <ArrowUpRight className="link-arrow h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
