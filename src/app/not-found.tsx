import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[75svh] items-center justify-center px-4 pt-28 pb-20">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#0B56E8]/15 text-[#0B56E8]">
          <Compass className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="font-mono-hud text-xs font-semibold tracking-widest text-[#0B56E8] uppercase">
          404 · Off the Atlas
        </p>
        <h1 className="font-display mt-2 text-4xl font-extrabold text-[#091933] sm:text-5xl">
          This route isn’t on our map.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#3B4F6B]">
          Return to the EzyQuick Global Atlas or browse our nine travel services and 14 verified
          destinations.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-kinetic px-6 py-3 text-sm">
            <span>Return to Global Atlas</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/destinations/" className="btn-outline-kinetic px-5 py-3 text-sm">
            <span>Browse Destinations</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
