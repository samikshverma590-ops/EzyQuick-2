import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SITE } from '@/data/site';

export default function NotFound() {
  return (
    <section className="min-h-[80svh] bg-[var(--color-bg-primary)] pt-36 pb-24 flex items-center">
      <div className="site-container max-w-3xl space-y-6">
        <p className="t-meta text-[var(--color-brand-primary-ink)]">
          404 · Off-Route Coordinate · {SITE.corridorLabel}
        </p>
        <h1 className="t-hero text-[var(--color-text-primary)]">
          This route isn’t on our departure board.
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
          The page you are looking for may have moved or never existed. Return to our home desk,
          browse all nine travel services, or explore our curated destinations.
        </p>
        <div className="flex flex-wrap gap-3.5 pt-2">
          <Link href="/" className="btn-ezy btn-primary">
            <span>Return Home</span>
            <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/destinations" className="btn-ezy btn-outline">
            <span>Explore Destinations</span>
          </Link>
          <Link href="/contact" className="btn-ezy btn-outline">
            <span>Plan Your Journey</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
