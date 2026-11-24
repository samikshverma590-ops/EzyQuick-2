# EzyQuick — Component & Motion Library Research

**Research Date:** November 24, 2026  
**Libraries Audited Live:** 21st.dev, React Bits, Aceternity UI, Magic UI, Codrops, GSAP 3 + ScrollTrigger + SplitText, Motion for React, Lenis.

---

## 1. Component & Motion Pattern Evaluation (16 Inspected Demos)

| # | Component / Pattern | Source Library | Preview / Docs URL | Source Code | Dependencies | Licence | Appropriate EzyQuick Use Case | Required Modification & Verdict |
|---|---|---|---|---|---|---|---|---|
| 1 | **Scroll Gallery (Full-Viewport Sticky Wipe)** | 21st.dev (`@soralabs`) | `https://21st.dev/@soralabs/components/scroll-gallery` | Inspectable React/TSX | React, Tailwind | MIT / Community | Pinned destination storytelling chapter | **ADAPT (GSAP):** Rebuild cleanly on GSAP ScrollTrigger + `clip-path` so it shares the single GSAP ticker with Lenis and degrades cleanly on reduced motion. |
| 2 | **Video / Image Scroll Hero Expansion** | 21st.dev (`@isaiahbjork`) | `https://21st.dev/@isaiahbjork/components/video-scroll-hero` | Inspectable React/TSX | React, Tailwind | MIT / Community | Scroll-driven hero / editorial frame expansion | **ADAPT (GSAP):** Use for the signature editorial frame expansion beneath the hero; avoid 25% tiny hero start so LCP stays ≤ 2.5s and first frame is immediately commanding. |
| 3 | **Hero Gallery Scroll Animation** | 21st.dev (`@youcefbnm`) | `https://21st.dev/@youcefbnm/components/hero-gallery-scroll-animation` | Inspectable React/TSX | Motion / Tailwind | MIT / Community | Multi-image editorial destination spread | **REJECT AS-IS:** Too grid-dense for luxury calm; borrow only the scroll-linked parallax depth offset. |
| 4 | **Footer with Big Wordmark** | 21st.dev | `https://21st.dev/community/components/s/navigation-menu` | Inspectable React/TSX | React, Tailwind | MIT / Community | Architectural footer composition | **ADAPT:** Combine EzyQuick's official unmodified logo (on crisp white plate) with oversized architectural wordmark/coordinates and Delhi + Dubai office blocks. |
| 5 | **Scroll Reveal (Word/Line Scrub)** | React Bits | `https://reactbits.dev/text-animations/scroll-reveal` | Open source TSX | GSAP + ScrollTrigger | MIT + Commons | Editorial brand manifesto text reveal | **ADAPT (GSAP SplitText):** Native GSAP `SplitText` + `ScrollTrigger` gives accessible screen-reader text without blur-filter GPU jank on large blocks. |
| 6 | **Scroll Float** | React Bits | `https://reactbits.dev/text-animations/scroll-float` | Open source TSX | GSAP + ScrollTrigger | MIT + Commons | Section display headline entrance | **ADAPT:** Remove bouncy scale-stretch (`elastic.out`) and replace with luxury `"glide & lock"` `expo.out` masked line reveal. |
| 7 | **Split Text** | React Bits | `https://reactbits.dev/text-animations/split-text` | Open source TSX | GSAP SplitText | MIT + Commons | Hero & chapter titles | **SELECT (Core Engine):** Implemented natively in `src/engine/reveal.ts` via GSAP `SplitText` with `mask: 'lines'` and `autoSplit: true`. |
| 8 | **True Focus / Variable Proximity** | React Bits | `https://reactbits.dev/text-animations/scroll-reveal` | Open source TSX | Motion / React | MIT + Commons | Tech-style playful hover text | **REJECT:** Reads like a developer portfolio gimmick; clashes with luxury international travel credibility. |
| 9 | **Sticky Scroll Reveal** | Aceternity UI | `https://ui.aceternity.com/components/sticky-scroll-reveal` | Open source TSX | `motion/react`, Tailwind | MIT | Destination storytelling & 9-service interactive preview | **ADAPT:** Replace internal scrollable box (bad UX/scroll-jacking) with CSS `position: sticky` viewport stage synced to page scroll via ScrollTrigger. |
| 10 | **Parallax Scroll** | Aceternity UI | `https://ui.aceternity.com/components/parallax-scroll` | Open source TSX | `motion/react` | MIT | Asymmetric destination gallery | **ADAPT (GSAP):** Drive vertical image parallax via GSAP ScrollTrigger (`data-parallax`) so one engine owns all scroll transforms. |
| 11 | **Hero Parallax / Container Scroll 3D** | Aceternity UI | `https://ui.aceternity.com/components/container-scroll-animation` | Open source TSX | `motion/react` | MIT | SaaS product mockups | **REJECT:** 3D tilted SaaS browser frames are off-brand for luxury hospitality. |
| 12 | **Text Animate (SlideUp / BlurIn)** | Magic UI | `https://magicui.design/docs/components/text-animate` | Open source TSX | `motion/react` | MIT | Modal, tab, and form feedback animations | **ADAPT (Motion):** Use `motion/react` strictly for interactive UI state changes (accordions, mobile menu, conditional form fields, service filter tabs)—never competing with GSAP on scroll elements. |
| 13 | **Blur Fade** | Magic UI | `https://magicui.design/docs/components/blur-fade` | Open source TSX | `motion/react` | MIT | Subtle staggered card transitions on filter change | **ADAPT (No Blur Filter):** Use opacity + subtle `y: 16px` via `motion/react` `AnimatePresence` without heavy `filter: blur()` for 60fps mobile smoothness. |
| 14 | **Clip-Path Image Wipes & Hover Preview Lists** | Codrops | `https://tympanus.net/codrops/` | Open source tutorials | GSAP + CSS `clip-path` | MIT | 9-Service Interactive Dossier + Destination cards | **SELECT & AUTHOR CUSTOM:** Build custom split-screen 9-service interactive index where hovering/focusing a service smoothly clip-wipes the editorial photograph. |
| 15 | **GSAP 3 + ScrollTrigger + SplitText** | GSAP (GreenSock) | `https://gsap.com/docs/v3/Plugins/ScrollTrigger/` | Official NPM (`gsap`) | None (zero deps) | Standard Free (all plugins free in GSAP 3.13+) | Primary Scroll, Hero, Horizontal Atlas, SVG Route, Page Transitions | **SELECTED PRIMARY ENGINE.** |
| 16 | **Lenis Smooth Scroll** | Darkroom Engineering | `https://lenis.dev/` | Official NPM (`lenis`) | None | MIT | Silky desktop smooth scrolling synced to `gsap.ticker` | **SELECTED (Tested & Accessible):** Auto-disabled when `prefers-reduced-motion: reduce` is active; synced directly into `gsap.ticker` with `ScrollTrigger.update()`. |

---

## 2. Final Animation Architecture (Zero Competing Systems)

To honor Project Rule #8, #9, #10, and #11:

1. **Single Scroll Clock (`GSAP 3` + `ScrollTrigger` + `SplitText` + `Lenis`):**
   - `Lenis` runs exclusively inside `gsap.ticker.add(...)` and calls `ScrollTrigger.update()`.
   - Owns all scroll-scrubbed timelines: Hero intro & ambient drift, Expanding Editorial Frame, Horizontal Destination Atlas, SVG Meridian Route (`stroke-dashoffset`), Pinned Destination Chapters, Masked Image Reveals (`data-reveal`), SplitText lines (`data-split`), and Curtain Page Transitions.
2. **Interactive React UI Engine (`motion` / `motion/react`):**
   - Strictly isolated to interactive state transitions (never placed on GSAP-animated elements!):
     - Mobile full-screen navigation overlay & stagger
     - Service/Destination filter tabs (`layoutId` indicator)
     - FAQ Accordion expand/collapse (`AnimatePresence`)
     - Conditional fields in the Plan Your Journey enquiry form & submission states
3. **CSS Micro-Interactions:**
   - Primary CTAs: Pointer-directional fill-flood (`clip-path` / transform sweep) + travelling arrow.
   - Nav links: Crisp underline draw + subtle letter roll (`@media (hover: hover)` + `:focus-visible`).
   - All reduced-motion paths verified via `@media (prefers-reduced-motion: reduce)` and `prefersReducedMotion()` guards in JS.
