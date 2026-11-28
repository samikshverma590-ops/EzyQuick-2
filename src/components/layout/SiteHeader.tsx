'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, Phone, X } from 'lucide-react';
import { NAV_LINKS, OFFICES, SITE } from '@/data/site';
import { assetPath } from '@/lib/asset-path';

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '';
    return pathname.startsWith(href.replace(/\/$/, ''));
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-[background-color,box-shadow,padding,border-color] duration-300 ${
        scrolled
          ? 'border-b border-[#DCE5F2]/70 bg-[#FFFFFF]/96 py-2.5 shadow-[0_8px_28px_-12px_rgba(24,44,53,0.14)] backdrop-blur-md'
          : 'border-b border-[#DCE5F2]/35 bg-[#FFFFFF]/92 py-3 backdrop-blur-md'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-[#091933] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-[#FFFFFF]"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8">
        {/* Official EzyQuick Logo unchanged — sits naturally on Warm White header */}
        <Link
          href="/"
          className="inline-flex items-center rounded-lg px-1 py-0.5 transition-transform hover:scale-[1.02]"
          aria-label="EzyQuick Home"
        >
          <img
            src={assetPath(SITE.logoPath)}
            alt={SITE.logoAlt}
            className="h-8 w-auto sm:h-9"
            width={180}
            height={72}
          />
        </Link>

        {/* Desktop Primary Navigation */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`nav-link-draw text-sm font-semibold transition-colors ${
                  active ? 'text-[#0054FC]' : 'text-[#091933] hover:text-[#0B56E8]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Prominent Plan Your Journey CTA + Mobile Menu Button */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/plan-your-journey/"
            className="btn-kinetic hidden px-5 py-2.5 text-xs sm:inline-flex sm:text-sm"
          >
            <span>Plan Your Journey</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="atlas-pill inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="overscroll-contain border-t border-[#DCE5F2] bg-white px-5 pb-7 pt-5 shadow-2xl lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`font-display flex min-h-[46px] items-center justify-between rounded-xl px-3.5 text-base font-bold ${
                    active
                      ? 'bg-[#0B56E8]/10 text-[#0B56E8]'
                      : 'text-[#091933] hover:bg-[#F4F7FC]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-4 w-4 opacity-60" aria-hidden="true" />
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 flex flex-col gap-3 border-t border-[#DCE5F2] pt-5">
            <Link
              href="/plan-your-journey/"
              className="btn-kinetic min-h-[48px] w-full px-5 py-3 text-sm"
            >
              <span>Plan Your Journey</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {OFFICES.map((office) => (
                <a
                  key={office.id}
                  href={office.phoneHref}
                  className="flex items-center gap-2 rounded-xl border border-[#DCE5F2] bg-[#F4F7FC] px-3 py-2.5 text-xs font-semibold text-[#091933]"
                >
                  <Phone className="h-3.5 w-3.5 text-[#0B56E8]" aria-hidden="true" />
                  <span>{office.code} Desk</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
