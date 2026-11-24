# EzyQuick — Visual & Automated QA Testing Report

**Date:** November 24, 2026  
**Build Tested:** Production Next.js 16.4.6 (`npm run build && next start`)  
**Browser Engine:** Real Headless Google Chrome via Playwright + `axe-core` WCAG 2.2 AA suite.

---

## 1. Automated Verification Summary (Pass 2 — Final)

| Check | Result | Evidence |
|---|---|---|
| **TypeScript (`tsc --noEmit`)** | **PASS (0 errors)** | Clean compile across all 35 routes |
| **Next.js Production Build** | **PASS (35/35 routes, 0 warnings)** | Static + SSG + Dynamic `/api/enquiry` + `/opengraph-image` |
| **Console Errors** | **0** | Inspected across homepage, desktop, tablet, mobile, and inner pages |
| **Failed Network Requests (4xx/5xx)** | **0** | Every local image, font, CSS chunk, and JS chunk loaded HTTP 200 |
| **Horizontal Overflow (`1440px`)** | **None (`false`)** | `scrollWidth <= innerWidth` |
| **Horizontal Overflow (`1280px`)** | **None (`false`)** | `scrollWidth <= innerWidth` |
| **Horizontal Overflow (`768px`)** | **None (`false`)** | `scrollWidth <= innerWidth` |
| **Horizontal Overflow (`390px`)** | **None (`false`)** | `scrollWidth <= innerWidth` |
| **Horizontal Overflow (`375px`)** | **None (`false`)** | `scrollWidth <= innerWidth` |
| **Accessibility (`axe-core` WCAG 2.2 AA)** | **PASS — 0 Violations (29/29 passes)** | Verified on live rendered DOM (`violations: []`) |
| **Reduced Motion (`prefers-reduced-motion: reduce`)** | **PASS — 0 Hidden Text (`141/141` visible)** | Brand intro auto-hidden (`loaderHidden: true`); native scroll active |
| **All 9 Service Routes (`/services/[slug]`)** | **PASS (9/9 HTTP 200)** | Corporate, Medical, Leisure, Visa, Air Tickets, Hotels, Forex, Insurance, MICE |
| **All 14 Destination Routes (`/destinations/[slug]`)** | **PASS (14/14 HTTP 200)** | Dubai, Abu Dhabi, Phuket, Krabi, Phu Quoc, Bali, Sri Lanka, Singapore, Malaysia, Almaty, Kerala, Goa, Andaman & Nicobar, Ladakh |
| **SEO Routes (`/sitemap.xml`, `/robots.txt`, `/opengraph-image`, 404)** | **PASS** | `/sitemap.xml` 200, `/robots.txt` 200, invalid URL returns HTTP 404 |
| **Enquiry API (`POST /api/enquiry`)** | **PASS** | Invalid payload rejected `400`; valid synthetic payload accepted `201` with reference ID (`EZQ-YYYYMMDD-XXXXXX`) & honest delivery status; synthetic test row deleted after check |

---

## 2. Issues Found During Visual QA & Fixed Before Sign-Off

1. **Next.js 16 + Tailwind CSS v4 Turbopack Loader (Caught in Pass 0):**
   - *Symptom:* Tailwind utilities were uncompiled after customizing `next.config.ts`.
   - *Fix:* Added the official `@tailwindcss/turbopack` CSS rule to `next.config.ts` and rebuilt cleanly.
2. **Storytelling Stage Image Crossfade Flash & Inactive Chapter Contrast (Caught in Pass 1):**
   - *Symptom:* `AnimatePresence mode="wait"` briefly exposed dark background during rapid scroll transitions, and `lg:opacity-45` on inactive chapters triggered 8 `axe-core` color-contrast nodes.
   - *Fix:* Converted both `DestinationStorytelling.tsx` and `ServicesDossier.tsx` to permanently mounted layered crossfades (`opacity` + subtle `scale` transitions) and replaced dimmed inactive chapter text with a full-contrast active cobalt left rule (`border-l-[var(--color-brand-primary)]`). Re-verified **0 `axe-core` violations** and instant photography crossfades in Pass 2.

---

## 3. Archived Visual Verification Screenshots

Saved in `docs/research/qa-screenshots/`:
- `desktop-1440-hero.png` — Desktop 1440px first-frame hero composition
- `desktop-1440-intro-expand.png` — Horizontal Destination Atlas (1440px)
- `desktop-1440-services.png` — Sticky Destination Journal stage (1440px)
- `desktop-1440-executive-why.png` — Plan Your Journey & Verified Offices (1440px)
- `desktop-1440-enquiry-footer.png` — Architectural Light Footer with Unmodified Logo (1440px)
- `desktop-1440-destination-dubai.png` — Dynamic Destination Detail Template (`/destinations/dubai`)
- `desktop-1440-service-corporate.png` — Dynamic Service Detail Template (`/services/corporate-travel`)
- `mobile_390-hero.png` — Deliberate Mobile 390px Hero Composition
- `mobile_390-menu.png` — Accessible Mobile Full-Screen Navigation Overlay
