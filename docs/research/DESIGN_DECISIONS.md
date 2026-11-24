# EzyQuick — Creative Direction, Concept & Design System Decisions

**Date:** November 24, 2026  
**Creative Direction:** **Cinematic Editorial Luxury Travel** — anchored to EzyQuick's real official logo (`#0059FD` Cobalt + `#FDBC03` Solar Gold) and its real Delhi ↔ Dubai two-gateway international advisory model.

---

## 1. Concept Exploration (Three Distinct Territories)

| Dimension | Concept A: **The Meridian Desk** *(Place & Process)* — **SELECTED** | Concept B: **Nine Chapters** *(Formal Editorial)* | Concept C: **The Cobalt Stamp** *(Identity/Artifact)* |
|---|---|---|---|
| **One-line Idea** | One calm international travel desk linking Delhi (`28.65°N`) and Dubai (`25.12°N`), where every journey—leisure, executive, or medical—unfolds along a continuous meridian route line into a tailored travel dossier. | The homepage is an unbound 9-chapter print monograph where each of EzyQuick's nine services gets a full-bleed spread. | Every destination and service is stamped like a bespoke passport folio with cobalt-blue ink impressions. |
| **Anchor Fact** | EzyQuick operates real offices in Delhi & Dubai as a single point of contact across 9 travel disciplines, represented by the official pin+plane logo. | EzyQuick offers 9 advertised services. | Travel involves visas and passports. |
| **Signature Moment** | Live scroll-driven expanding destination canvas + pinned horizontal Destination Atlas + SVG Meridian Route (`DISCOVER → PLAN → PREPARE → TRAVEL`) drawing in official `#0059FD` cobalt with `#FDBC03` gold beacons + split-stage 9-Service Dossier. | Full-viewport chapter snaps for all 9 services. | Interactive animated passport stamps on scroll. |
| **Scores (Orig / Fit / Feas / Port↓)** | **5 / 5 / 5 / 1** *(Best: uniquely anchored to Delhi↔Dubai + 9-service single-desk model)* | 3 / 4 / 3 / 4 *(Too long; risks burying destinations)* | 3 / 3 / 4 / 4 *(Feels kitschy/template for corporate & medical)* |

### Selected Concept Card
- **Idea:** One calm international travel desk bridging Delhi and Dubai, bringing holidays, executive trips, medical travel, visas, flights, and stays into a single orchestrated dossier.
- **Metaphor:** A private aviation concierge desk & architectural travel journal—clean latitude/longitude telemetry, museum-framed destination plates, and a continuous meridian thread from enquiry to arrival.
- **Signature Moment:** Coordinated multi-act scroll choreography: (1) Scroll-expanding cinematic frame, (2) Desktop horizontal scroll-controlled Destination Atlas, (3) Split-screen 9-Service Dossier with instant clip-path image plate transitions, and (4) Scroll-drawn SVG Meridian Route linking `DISCOVER → PLAN → PREPARE → TRAVEL`.
- **Emotion (First 3 Seconds):** Calm authority, sunlit international possibility, zero travel-portal noise.
- **Motion Verb:** **"Glide & lock"** — smooth directional travel (`expo.out` / `power3.out`), architectural `clip-path` mask wipes, and precise lock-in stops.
- **Screenshot Frame:** Full-bleed twilight/golden-hour hero framed by crisp architectural white brand plate holding the official unmodified EzyQuick logo, oversized `Instrument Serif` headline `"More world. Less to organise."`, and subtle `DEL 28.65°N ↔ DXB 25.12°N` gateway coordinates.

---

## 2. Final Color Palette (Derived from Official Logo Audit)

Every accent color derives directly from the opaque pixel audit of `EzyQuick_Logo_Transparent_Sticker.png` (`#0059FD` & `#FDBC03`), disciplined by a quiet architectural neutral foundation so the vibrant brand hues feel bespoke rather than loud.

| Token | Hex | Role | Contrast / Usage Rationale |
|---|---|---|---|
| `--color-brand-primary` | `#0059FD` | **Official EzyQuick Cobalt** | Exact sampled logo primary (`RGB 0,89,253`). Used surgically for SVG route strokes, active dots, interactive button flood fills, and focus rings. |
| `--color-brand-primary-ink` | `#0044C4` | **Deep Cobalt Ink** | Accessible text variant of official cobalt (`7.3:1` contrast on `#F7F6F2` and `#FFFFFF`, passes WCAG AA/AAA). |
| `--color-brand-secondary` | `#FDBC03` | **Official Solar Gold** | Exact sampled logo aircraft/suitcase gold (`RGB 253,188,3`). Used as refined beacons, dark-band eyebrows (`11.4:1` on `#081426`), and subtle highlights. |
| `--color-brand-secondary-ink` | `#8A6000` | **Burnished Gold Ink** | Accessible gold tone for small metadata on light paper (`5.1:1` on `#F7F6F2`). |
| `--color-bg-primary` | `#F7F6F2` | **Architectural Alabaster** | Cool-warm mineral paper ground. Distinct from generic AI cream+terracotta; lets destination photography breathe. |
| `--color-bg-secondary` | `#EFECE5` | **Limestone Wash** | Secondary tonal rhythm band for editorial callouts and process sections. |
| `--color-bg-surface` | `#FFFFFF` | **Gallery White** | Pure white cards, form inputs, and mandatory clean surface plate beneath the official unmodified logo. |
| `--color-bg-dark` | `#081426` | **Maritime Midnight** | Deep oceanic navy-ink for Hero base, Corporate/Medical/MICE Executive Chapter, and final CTA contrast band. |
| `--color-bg-dark-elevated` | `#102039` | **Midnight Slate** | Elevated cards/surfaces inside dark sections. |
| `--color-text-primary` | `#0D1829` | **Deep Ink** | Primary body & heading text on light surfaces (`16.5:1` contrast on `#F7F6F2`). |
| `--color-text-secondary` | `#4A5565` | **Mineral Slate** | Secondary prose & captions (`6.9:1` contrast on `#F7F6F2`). |
| `--color-text-on-dark` | `#F5F7FA` | **Alabaster Light** | Primary text on `#081426` (`17.1:1` contrast). |
| `--color-text-on-dark-muted` | `#B7C4D6` | **Horizon Mist** | Secondary text on `#081426` (`9.8:1` contrast). |
| `--color-border` | `#DFDDD5` | **Hairline Stone** | Subtle architectural dividers on light ground. |
| `--color-border-dark` | `rgba(245, 247, 250, 0.14)` | **Midnight Hairline** | Crisp architectural dividers on dark ground. |
| `--color-hover` | `#003EB3` | **Cobalt Press** | Interactive hover/active state for cobalt buttons. |
| `--color-success` | `#0E7C5B` | **Verified Emerald** | Enquiry confirmation & positive form feedback. |
| `--color-error` | `#C22E2E` | **Alert Crimson** | Accessible form validation errors. |

---

## 3. Final Typography System

- **Display Family:** `Instrument Serif` (via `next/font/google`, weights `400` regular + `400` italic)
  - **Evaluation vs. Official Logo:** EzyQuick's official logo is a bold, dynamic geometric italic sans-serif. Pairing it with a crisp, modern, razor-proportioned editorial serif (`Instrument Serif`) creates intentional tension—elevating the brand from a transactional ticket agency into an international luxury travel house—without competing against the logo's bold sans geometry.
- **Interface & Body Family:** `Manrope` (via `next/font/google`, weights `400, 500, 600, 700`)
  - **Evaluation:** Clean geometric-humanist sans with razor-sharp legibility at `12px`–`18px` and crisp `tabular-nums` for coordinates, step indices, and phone numbers. Mirrors the clean geometric DNA of the official `TRAVEL MADE EASY` tagline.

### Fluid Type Scale
- **Hero Display (`--text-hero`):** `clamp(3.25rem, 2rem + 5.2vw, 6.75rem)` · leading `0.98` · tracking `-0.03em`
- **Section Display (`--text-display`):** `clamp(2.25rem, 1.5rem + 3vw, 4.25rem)` · leading `1.04` · tracking `-0.025em`
- **Subhead (`--text-title`):** `clamp(1.5rem, 1.15rem + 1.2vw, 2.25rem)` · leading `1.15` · tracking `-0.02em`
- **Body Lead (`--text-lead`):** `clamp(1.0625rem, 1rem + 0.35vw, 1.25rem)` · leading `1.6`
- **Body (`--text-body`):** `clamp(0.975rem, 0.94rem + 0.15vw, 1.0625rem)` · leading `1.65` · max measure `65ch`
- **UI / Nav (`--text-ui`):** `0.875rem` (`14px`) · sentence case · weight `500`
- **Meta / Coordinates (`--text-meta`):** `0.75rem` (`12px`) · `font-variant-numeric: tabular-nums` · tracking `0.08em`

---

## 4. Genericness Test & Refinements

- **Test:** *"Would a generic AI prompt produce this exact site?"*
- **What we explicitly rejected & changed:**
  1. Rejected generic `#F4F1EA` cream + `#D97757` terracotta — grounded every accent in EzyQuick's verified `#0059FD` cobalt + `#FDBC03` solar gold.
  2. Rejected 9 identical icon boxes for services — built an interactive Split-Screen 9-Service Dossier with live image-plate transitions plus 9 full dedicated service routes.
  3. Rejected fake 5-star review cards & fabricated numbers — built an honest, transparent Traveller Stories & Google Review invitation panel aligned with EzyQuick's own truth policy.
  4. Rejected heavy decorative eyebrows above every heading and fake `→` arrows — used clean structural coordinates (`DEL 28.65°N ↔ DXB 25.12°N`) and restrained architectural indices only for genuine sequences (`01`–`04` Approach, `01`–`09` Services).

---

## 5. Technical Architecture Decisions

- **Framework:** Next.js App Router (TypeScript) + Tailwind CSS v4 + dedicated `src/styles/design-tokens.css`
- **Animation:** GSAP 3 (`ScrollTrigger`, `SplitText`) + Lenis (single shared `gsap.ticker` clock) + Motion (`motion/react`) strictly for React UI state transitions.
- **Photography:** Local curated high-resolution travel photography stored under `public/images/` (downloaded & verified from Unsplash free-license sources or generated cleanly — zero broken hotlinks, zero watermarked/copyrighted Pinterest/Dribbble scrapes), rendered via `next/image` with proper `sizes`, `alt`, and eager `priority` on hero LCP.
- **Enquiry Backend:** Real Next.js Route Handler (`POST /api/enquiry`) with `zod` schema validation, HTML/control-character input sanitization, honeypot spam trap, in-memory IP rate limiting, privacy-safe handling (explicitly blocks passport/medical record collection), optional SMTP/Resend server-side delivery via environment variables, plus durable local JSONL audit log fallback when SMTP env vars are not yet configured — transparently returning honest confirmation status to the client (never faking email delivery when SMTP isn't configured!).
- **Routes Built:**
  - `/` (14-section Cinematic Editorial Homepage)
  - `/services` + all 9 dedicated `/services/[slug]` pages (`corporate-travel`, `medical-travel`, `leisure-travel`, `visa-services`, `air-tickets`, `hotel-bookings`, `forex-services`, `travel-insurance`, `mice-services`)
  - `/destinations` + all 14 dedicated `/destinations/[slug]` pages (`kerala`, `goa`, `andaman-nicobar`, `ladakh`, `dubai`, `abu-dhabi`, `phuket`, `krabi`, `phu-quoc`, `bali`, `sri-lanka`, `singapore`, `malaysia`, `almaty`)
  - `/about` (Brand Story, Delhi & Dubai Offices, Ethical Travel Policy)
  - `/contact` (Full Conditional "Plan Your Journey" Enquiry Studio + Verified Delhi & Dubai Office Cards + Direct WhatsApp)
  - `/not-found` (Designed 404 carrying the Meridian Desk concept)
  - `/sitemap.xml`, `/robots.txt`, dynamic Open Graph image (`/opengraph-image`)
