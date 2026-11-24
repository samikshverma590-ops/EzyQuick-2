# EzyQuick — Website Reference Research & Comparison

**Research Date:** November 24, 2026  
**Methodology:** Live Chromium inspection (`1440×900` computed styles, typography, navigation, media, motion stack) + Awwwards SOTD / Immersive Garden / Dribbble luxury travel analysis.  
**Note on Access Limitations:** Direct programmatic requests to `awwwards.com/websites/travel/` and `blacktomato.com` returned HTTP 403 anti-bot responses; we did not bypass those gates and instead inspected 11 live accessible award-winning and luxury travel websites directly in Chromium alongside verified Awwwards SOTD metadata (`Travelshift`, `Tengile MalaMala`, `Workshop Hospitality`, `Travel Next Level`, `The Drake Hotel`) and Dribbble luxury travel case studies.

---

## 1. Live & Verified Website References (12 Distinct Studies)

### 1. Tengile MalaMala Collection *(Awwwards SOTD — Oct 2026)*
- **URL:** `https://www.malamala.com/` (Inspected live — HTTP 200)
- **Visual Style:** Cinematic editorial luxury hospitality; alabaster/stone ground (`rgb(245,238,233)`), deep botanical ink (`rgb(55,63,29)`), full-bleed photography & ambient video.
- **Hero Strategy:** Edge-to-edge full-screen hero with commanding `120px` display serif (`PP Fragment` — `"UNMATCHED ABUNDANCE"`), ultra-clean `34px` transparent top navigation (`About`, `Accommodation`, `Experiences`, `Conservation`, `ENQUIRE`).
- **Scroll & Hover Interactions:** Lenis smooth scroll + Next.js + fill-flood primary CTAs where the arrow chip transforms smoothly on hover; ambient motion stays alive at rest.
- **What Works for EzyQuick:** High-impact full-bleed hero, calm alabaster pacing between rich photography, tactile fill-flood CTA buttons, concise top nav with a prominent Enquire CTA.
- **Do Not Copy:** Safari-only botanical green palette or single-property structure.

### 2. Travelshift by Immersive Garden *(Awwwards SOTD)*
- **URL:** `https://immersive-g.com/projects/travelshift/` (Inspected live — HTTP 200)
- **Visual Style:** Minimal architectural neutral (`rgb(232,232,232)` ground, `#030303` ink), editorial serif (`PSTimes 56px`), WebGL canvas + Lenis smooth scroll.
- **Hero & Scroll Strategy:** Horizontal scroll-driven destination exploration with fluid navigation transitions (`60fps`), turning travel discovery into a seamless visual journey rather than paginated catalog cards.
- **What Works for EzyQuick:** Scroll-linked horizontal destination showcase on desktop (with clean native swipe on mobile) and continuous curtain/page transitions between routes.
- **Do Not Copy:** Heavy full-canvas WebGL that risks hiding text from crawlers or dropping mobile FPS.

### 3. Aman Resorts
- **URL:** `https://www.aman.com/` (Inspected live — HTTP 200)
- **Visual Style:** Ultra-restrained museum editorial (`#F3EEE7` warm stone, `#313131` charcoal, `Lyon Display` serif), generous negative space, `88px` structured top bar.
- **Section Structure:** Rhythmic alternation between full-bleed destination spreads and asymmetric two-column editorial essays with disciplined hairline dividers.
- **What Works for EzyQuick:** Whitespace discipline, destination storytelling chapters, uncluttered luxury credibility.
- **Do Not Copy:** Overly slow/sparse utility navigation that hides multi-service offerings (EzyQuick has 9 distinct services including Corporate & Medical).

### 4. Singita
- **URL:** `https://singita.com/` (Inspected live — HTTP 200)
- **Visual Style:** Editorial serif (`Cormorant` / `Morion` at `100px`) paired with clean geometric sans (`DM Sans`), `#F4F1EC` warm gallery ground, transparent `84px` header over full-bleed motion hero.
- **Hero Strategy:** Full-bleed filmic backdrop with serene poetic 3-word display headline (`"Place of Miracles"`).
- **What Works for EzyQuick:** High-contrast serif + crisp sans typographic hierarchy and transparent-to-solid header transition on scroll.
- **Do Not Copy:** Low-contrast grey body text (`#484848` on some warm panels).

### 5. Jacada Travel
- **URL:** `https://www.jacadatravel.com/` (Inspected live — HTTP 200)
- **Visual Style:** High-craft bespoke travel advisory; `110px` serif hero (`"Exceptional Journeys"`), geometric sans body (`CircularXX`), direct human phone/contact prominently anchored in top bar.
- **Conversion Strategy:** Balances dream-like destination photography with immediate human consultation cues (phone, enquiry button, transparent planning steps).
- **What Works for EzyQuick:** Combining editorial luxury aesthetics with immediate human access (WhatsApp, Delhi/Dubai phone numbers, clear 4-step planning process).
- **Do Not Copy:** Overly tall `124px` multi-row desktop header.

### 6. Belmond
- **URL:** `https://www.belmond.com/` (Inspected live — HTTP 200)
- **Visual Style:** Classic heritage hospitality (`Sebenta` serif + `Gotham` sans), crisp `50px` architectural header (`#EDEDEA`), clear categorical navigation (`Destinations`, `Hotels`, `Trains`, `Boats`, `Stories`).
- **What Works for EzyQuick:** Clean multi-category service taxonomy that keeps 9 diverse travel services effortless to browse without visual clutter.
- **Do Not Copy:** Conservative static transitions with minimal scroll choreography.

### 7. Pelorus Travel
- **URL:** `https://pelorusx.com/` (Inspected live — HTTP 200)
- **Visual Style:** Crisp white + dark cinema contrast, serif display (`Berlingske Serif`) paired with modern sans, video-led storytelling across 18 structured bands, dual-region presence (UK / US) with prominent `ENQUIRE` CTA.
- **What Works for EzyQuick:** Dual-hub international positioning (directly parallels EzyQuick's **Delhi + Dubai** offices) and authoritative framing for complex logistics (Corporate, MICE, Medical).
- **Do Not Copy:** Tiny `16px` H1 styling or overcrowded 18-section homepage length.

### 8. Explora
- **URL:** `https://www.explora.com/` (Inspected live — HTTP 200)
- **Visual Style:** Bold dark header (`#000000`) + pure white body contrast, geographic/route storytelling (`Travesia Atacama – Uyuni`), full-bleed environmental photography.
- **What Works for EzyQuick:** Route-and-coordinate visual language (origin-to-destination lines, elevation/distance/gateway clarity) and dramatic light/dark chapter pacing.
- **Do Not Copy:** Rigid black top bar that feels heavy above bright photography.

### 9. Workshop Hospitality *(Awwwards SOTD — Apr 2024)*
- **URL:** `https://www.workshophospitality.com/` (Inspected live — HTTP 200)
- **Visual Style:** Crisp architectural white (`#FFFFFF`) with sharp black ink (`#000000`), grotesk typography (`Forma DJR`), tactile intro animation, clean portfolio filtering, minimal 5-section homepage rhythm.
- **What Works for EzyQuick:** Clean architectural grid precision, restrained micro-interactions, and purposeful page-load choreography.
- **Do Not Copy:** Ultra-minimal navigation that hides primary conversion actions inside a hidden drawer on desktop.

### 10. Rosewood Hotels
- **URL:** `https://www.rosewoodhotels.com/` (Inspected live — HTTP 200)
- **Visual Style:** Warm ivory-white (`#FAFBF5`) + charcoal (`#212529`), cinematic video hero (`"WONDER IN A NEW LIGHT"`), destination-first sensory storytelling.
- **What Works for EzyQuick:** Editorial storytelling modules that pair large-format photography with concise, grounded cultural descriptions.
- **Do Not Copy:** Generic system-font body fallback.

### 11. Scott Dunn
- **URL:** `https://www.scottdunn.com/` (Inspected live — HTTP 200)
- **Visual Style:** Bespoke luxury tour operator; regional hub switching, transparent consultation promise, multi-audience trip-type architecture (family, honeymoon, luxury, group).
- **What Works for EzyQuick:** Structured enquiry form with conditional trip types and clear regional office accessibility (Delhi & Dubai).
- **Do Not Copy:** Tall `149px` cluttered navigation bar and conventional card grids.

### 12. Dribbble & Pinterest Editorial Travel Patterns *(Synthesized from Ronas IT, NexUX, Sk Nahid Hasan, Master Travel)*
- **Sources:** `dribbble.com/shots/26642095`, `26990968`, `27868321`, `26766878`, `27145127`
- **Observed Patterns:** High-contrast monochrome/neutral grounds where photography provides color; asymmetric 2-column and 3-column destination spreads; clean split-screen enquiry forms with direct office cards alongside inputs; editorial serif display headlines paired with airy sans body copy.
- **What Works for EzyQuick:** Asymmetric destination grids, split-screen interactive service showcase, and low-friction two-column enquiry layout.
- **Do Not Copy:** Concept-only Dribbble tropes (fake 5-star review widgets, fictional pricing badges, tiny unreadable `10px` grey labels, or decorative floating glass cards).

---

## 2. Reference Comparison & Scoring Matrix (1–10)

| Reference | Fit with EzyQuick | Visual Quality | Originality | Usability | Mobile Suitability | Performance | Accessibility | Implementation Feasibility | **Weighted Avg** |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Tengile MalaMala (SOTD)** | 9 | 10 | 9 | 9 | 9 | 9 | 9 | 9 | **9.1** |
| **Travelshift (Immersive Garden)** | 8 | 9 | 10 | 8 | 7 | 7 | 7 | 8 | **8.0** |
| **Singita** | 8 | 9 | 8 | 8 | 9 | 8 | 8 | 9 | **8.4** |
| **Jacada Travel** | 9 | 8 | 7 | 9 | 9 | 8 | 9 | 9 | **8.5** |
| **Pelorus Travel** | 9 | 8 | 8 | 8 | 8 | 8 | 8 | 9 | **8.3** |
| **Aman Resorts** | 7 | 9 | 8 | 8 | 9 | 9 | 9 | 9 | **8.5** |
| **Workshop Hospitality (SOTD)** | 7 | 9 | 9 | 8 | 9 | 9 | 8 | 9 | **8.5** |
| **Belmond** | 8 | 8 | 7 | 9 | 9 | 8 | 9 | 9 | **8.4** |
| **Explora** | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 9 | **8.1** |
| **Rosewood Hotels** | 7 | 8 | 7 | 8 | 8 | 8 | 8 | 9 | **7.9** |
| **Scott Dunn** | 8 | 7 | 6 | 9 | 8 | 8 | 9 | 9 | **8.0** |
| **Dribbble Editorial Concepts** | 7 | 8 | 7 | 6 | 7 | 9 | 6 | 9 | **7.4** |

---

## 3. Synthesis: Strategic Takeaways for EzyQuick

1. **Take Tengile MalaMala + Singita's hero craft & editorial pacing:** Full-bleed photography, oversized expressive display typography, clean light alabaster ground, and tactile fill-flood hover states.
2. **Take Travelshift's scroll-choreographed destination exploration:** Desktop horizontal scroll-scrubbed atlas powered by GSAP ScrollTrigger + Lenis, degrading cleanly to native horizontal snap-scroll on touch devices.
3. **Take Pelorus + Jacada's dual-hub commercial clarity:** Showcase Delhi + Dubai hubs transparently, balance leisure storytelling with an authoritative dark-chapter presentation for Corporate, Medical, and MICE travel, and keep WhatsApp + direct enquiry always one click away.
4. **Beat typical Awwwards sites on Accessibility & WPO:** Maintain WCAG 2.2 AA contrast across all light & dark states, `prefers-reduced-motion` full fallbacks, real server-rendered HTML text, and optimized responsive images without heavy WebGL bloat.
