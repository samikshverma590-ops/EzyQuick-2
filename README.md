# EzyQuick — Official Travel Website (Next.js App Router)

A bespoke **Cinematic Editorial Luxury Travel** web application for **EzyQuick Travel Solutions** (New Delhi & Dubai), grounded in pixel-verified colors from the official EzyQuick logo (`#0059FD` Cobalt + `#FDBC03` Solar Gold), driven by **GSAP 3 + ScrollTrigger + SplitText**, **Lenis** smooth scrolling on a single shared clock, and **Motion for React**.

---

## Key Features Implemented

- **Official Brand Identity Preservation:** Unmodified official logo (`/brand/ezyquick-logo.png`, `1600×640`) protected on crisp gallery-white plates whenever placed over dark imagery.
- **Complete Route Architecture (35 Pre-Rendered & Dynamic Routes):**
  - `/` — Full editorial homepage (Brand Entrance, Transparent-to-Solid Navigation, Full-Bleed Cinema Hero, Scroll-Driven Expanding Editorial Frame, Pinned Horizontal Destination Atlas, Split-Screen 9-Service Dossier, SVG Scroll-Drawn Meridian Approach, Sticky Destination Journal, Maritime Midnight Corporate/Medical/MICE Chapter, Honest Why EzyQuick & Traveller Stories, Live Conditional Enquiry Studio + Verified Delhi & Dubai Offices, Architectural Footer).
  - `/services` + all 9 dedicated `/services/[slug]` pages: Corporate Travel, Medical Travel, Leisure Travel, Visa Services, Air Tickets, Hotel Bookings, Forex Services, Travel Insurance, MICE Services.
  - `/destinations` + all 14 dedicated `/destinations/[slug]` pages: Dubai, Abu Dhabi, Phuket, Krabi, Phu Quoc, Bali, Sri Lanka, Singapore, Malaysia, Almaty, Kerala, Goa, Andaman & Nicobar, Ladakh.
  - `/about`, `/contact`, `/not-found`, `/sitemap.xml`, `/robots.txt`, and dynamic `/opengraph-image`.
- **Real Backend Enquiry Endpoint (`POST /api/enquiry`):**
  - Server-side Zod validation & HTML/control-character sanitization
  - Honeypot anti-spam trap + per-IP sliding-window rate limiting
  - Conditional form fields per travel service + WhatsApp Concierge handoff
  - Privacy-first handling (explicitly advises against submitting passport numbers or medical records)
  - Honest delivery reporting (live email dispatch via Resend when configured, or verified server persistence when credentials are not yet set).
- **Security, Accessibility & SEO:**
  - Strict CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, and `Referrer-Policy` headers in `next.config.ts`.
  - WCAG 2.2 AA contrast verified with `axe-core` (0 violations), skip-link navigation, keyboard-accessible overlays, and complete `prefers-reduced-motion` support.
  - `TravelAgency` & `BreadcrumbList` JSON-LD structured data, unique titles/descriptions, canonical URLs, XML sitemap, and `robots.txt`.

---

## Research & Design Documentation

- [`docs/research/EZYQUICK_BRAND_AUDIT.md`](./docs/research/EZYQUICK_BRAND_AUDIT.md) — Official logo pixel extraction & brand preservation rules
- [`docs/research/REFERENCE_RESEARCH.md`](./docs/research/REFERENCE_RESEARCH.md) — Live inspection of 12 luxury travel & Awwwards references
- [`docs/research/COMPONENT_RESEARCH.md`](./docs/research/COMPONENT_RESEARCH.md) — Evaluation of 16 component/motion libraries
- [`docs/research/DESIGN_DECISIONS.md`](./docs/research/DESIGN_DECISIONS.md) — Concept card, final color palette, typography, and architecture
- [`docs/research/QA_TESTING_REPORT.md`](./docs/research/QA_TESTING_REPORT.md) — Multi-viewport browser & accessibility verification results

---

## Local Setup & Development

### Prerequisites
- Node.js 20+ (tested on Node.js 22)
- npm 10+

### Run Locally
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open `http://localhost:3000`.

### Production Build & Start
```bash
npm run build
npm run start
```

---

## Deployment Instructions (Vercel / Node Host)

1. Push the repository to GitHub (`samikshverma590-ops/EzyQuick-2`).
2. Import the repository into **Vercel** (or any Node.js 20+ host supporting Next.js 16 App Router).
3. Configure the environment variables below in your host dashboard.
4. Deploy — all 35 static/SSG routes (`/` + 9 services + 14 destinations + `/about` + `/contact` + `/sitemap.xml` + `/robots.txt` + `/opengraph-image`) build automatically.

---

## External Credentials Still Required for Full Live Email Delivery

The website is fully functional out of the box, and WhatsApp Concierge (`+91 8527729449`) works immediately. To enable automated outbound email delivery to `info@ezyquick.in` from the **Plan Your Journey** form, add these server-side environment variables in your hosting provider (never commit secrets to Git):

| Variable | Purpose | Example |
|---|---|---|
| `RESEND_API_KEY` | Server-side Resend API key for transactional enquiry emails | `re_xxxxxxxxxxxxx` |
| `ENQUIRY_FROM_EMAIL` | Verified sender address on your domain (`ezyquick.in`) | `EzyQuick Website <enquiries@ezyquick.in>` |
| `ENQUIRY_TO_EMAIL` | Destination inbox for incoming enquiries | `info@ezyquick.in` |

*Optional future upgrades once approved by the business:* Verified client testimonials (once collected & approved), Google Business Profile API reviews, or a headless CMS (Sanity) if non-developers need to edit seasonal destination highlights.
