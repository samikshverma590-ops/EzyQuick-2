'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { NAV_LINKS, OFFICES, SITE, buildWhatsAppUrl } from '@/data/site';
import { onScroll, startScroll, stopScroll } from '@/engine';

const DARK_HERO_PREFIXES = ['/', '/services/', '/destinations/'];

function hasDarkHero(pathname: string): boolean {
  if (pathname === '/') return true;
  if (pathname === '/services' || pathname === '/destinations') return false;
  return DARK_HERO_PREFIXES.some((prefix) => prefix !== '/' && pathname.startsWith(prefix));
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const overDarkHero = hasDarkHero(pathname) && !scrolled && !menuOpen;

  useEffect(() => {
    const off = onScroll(({ y }) => {
      setScrolled(y > 44);
    });
    return off;
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock background scroll & trap Escape when mobile menu is open
  useEffect(() => {
    if (!menuOpen) {
      startScroll();
      return;
    }
    stopScroll();
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      startScroll();
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[50] transition-[background-color,border-color,backdrop-filter,padding] duration-300 ${
          overDarkHero
            ? 'bg-gradient-to-b from-[#081426]/65 to-transparent border-b border-transparent py-4'
            : 'bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] py-3 shadow-[0_1px_18px_rgba(8,20,38,0.04)]'
        }`}
      >
        <div className="site-container flex items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="EzyQuick home"
            className="shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--color-brand-primary)]"
          >
            <BrandLogo variant={overDarkHero ? 'plate' : 'plain'} size="md" priority />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-9"
          >
            {NAV_LINKS.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`nav-link ${
                    overDarkHero
                      ? 'nav-link-on-dark text-white hover:text-[var(--color-brand-secondary)]'
                      : 'text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary-ink)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <span
              className={`hidden xl:inline-block t-meta ${
                overDarkHero ? 'text-white/75' : 'text-[var(--color-text-muted)]'
              }`}
            >
              DEL · DXB
            </span>
            <Link
              href="/contact#enquiry"
              className={`btn-ezy ${overDarkHero ? 'btn-light' : 'btn-primary'} !min-h-[44px] !px-5 !py-2.5`}
            >
              <span>Plan Your Journey</span>
              <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-2.5">
            <Link
              href="/contact#enquiry"
              className={`inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-[2px] transition-colors ${
                overDarkHero
                  ? 'bg-white text-[var(--color-bg-dark)]'
                  : 'bg-[var(--color-bg-dark)] text-white'
              }`}
            >
              <span>Plan</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
              className={`inline-flex items-center justify-center h-11 w-11 rounded-[2px] border transition-colors ${
                overDarkHero
                  ? 'border-white/35 bg-[#081426]/40 text-white'
                  : 'border-[var(--color-border)] bg-white text-[var(--color-text-primary)]'
              }`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay (Motion for React) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[70] flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-y-auto"
          >
            <div className="site-container flex items-center justify-between py-4 border-b border-[var(--color-border)] bg-white">
              <Link href="/" onClick={() => setMenuOpen(false)} aria-label="EzyQuick home">
                <BrandLogo variant="plain" size="sm" />
              </Link>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  menuBtnRef.current?.focus();
                }}
                aria-label="Close navigation menu"
                className="inline-flex items-center justify-center h-11 w-11 rounded-[2px] border border-[var(--color-border)] bg-white text-[var(--color-text-primary)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="site-container flex-1 flex flex-col justify-between py-8 gap-10">
              <nav aria-label="Mobile primary navigation" className="flex flex-col">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-4xl py-3.5 border-b border-[var(--color-border)] flex items-center justify-between"
                >
                  <span>Home</span>
                  <span className="t-meta text-[var(--color-text-muted)]">00</span>
                </Link>
                {NAV_LINKS.map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * (idx + 1), duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="font-display text-4xl py-3.5 border-b border-[var(--color-border)] flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <span className="t-meta text-[var(--color-brand-primary-ink)]">
                        0{idx + 1}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact#enquiry"
                    onClick={() => setMenuOpen(false)}
                    className="btn-ezy btn-primary w-full"
                  >
                    <span>Plan Your Journey</span>
                    <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ezy btn-outline w-full"
                  >
                    <span>WhatsApp Concierge</span>
                    <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
                  {OFFICES.map((office) => (
                    <div key={office.id} className="space-y-1">
                      <p className="t-meta text-[var(--color-brand-primary-ink)]">
                        {office.label} · {office.iata}
                      </p>
                      <a
                        href={office.phoneHref}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] tabular-nums"
                      >
                        <Phone className="h-3.5 w-3.5 text-[var(--color-brand-primary)]" aria-hidden="true" />
                        {office.phoneDisplay}
                      </a>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {SITE.email} · {SITE.corridorLabel}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
