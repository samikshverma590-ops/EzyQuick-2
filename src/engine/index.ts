import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScroll, resetScroll, startScroll, stopScroll } from './scroll';
import { initReveals } from './reveal';
import { playEnter, playLeave } from './transition';
import { ease, prefersReducedMotion } from './env';

export { onScroll, scrollState, scrollToTarget, stopScroll, startScroll } from './scroll';
export { ease, isTouch, isMobile, prefersReducedMotion } from './env';

export type PageFn = (page: { intro: gsap.core.Timeline; path: string }) => void | (() => void);

const pageFns = new Set<PageFn>();
const cleanups: (() => void)[] = [];
let ctx: gsap.Context | null = null;
let intro: gsap.core.Timeline | null = null;
let ready = false;
let booted = false;

export function onPage(fn: PageFn): () => void {
  pageFns.add(fn);
  if (ready) runPageFn(fn);
  return () => {
    pageFns.delete(fn);
  };
}

function runPageFn(fn: PageFn) {
  ctx?.add(() => {
    const cleanupFn = fn({ intro: intro!, path: window.location.pathname });
    if (typeof cleanupFn === 'function') cleanups.push(cleanupFn);
  });
}

export function syncFlags() {
  const cl = document.documentElement.classList;
  cl.add('js', 'is-booted');
  cl.toggle('motion', !prefersReducedMotion());
}

function initPage() {
  syncFlags();
  ctx = gsap.context(() => {
    intro = initReveals(document);
  });
  ready = true;
  pageFns.forEach(runPageFn);
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

async function runIntroCurtain() {
  const loader = document.getElementById('brand-intro');
  if (!loader) return;

  if (prefersReducedMotion()) {
    loader.hidden = true;
    document.documentElement.classList.add('is-loaded');
    return;
  }

  // Wait briefly for web fonts (capped at 750ms so LCP stays blazing fast!)
  const fontWait = Promise.race([
    document.fonts.ready,
    new Promise((r) => setTimeout(r, 750)),
  ]);
  const minFloor = new Promise((r) => setTimeout(r, 650));

  const bar = loader.querySelector<HTMLElement>('[data-intro-bar]');
  if (bar) {
    gsap.to(bar, { scaleX: 1, duration: 0.72, ease: ease.glide });
  }

  await Promise.all([fontWait, minFloor]);

  await gsap
    .timeline()
    .to(loader.querySelectorAll('[data-intro-out]'), {
      yPercent: -24,
      autoAlpha: 0,
      duration: 0.36,
      stagger: 0.04,
      ease: ease.soft,
    })
    .to(
      loader,
      {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.68,
        ease: ease.lock,
      },
      '-=0.16'
    );

  loader.hidden = true;
  document.documentElement.classList.add('is-loaded');
}

export async function boot() {
  if (booted) return;
  booted = true;
  syncFlags();
  initScroll();
  initPage();
  await runIntroCurtain();
  intro?.play();
}

export async function leave() {
  stopScroll();
  await playLeave();
}

export function cleanup() {
  if (!ready) return;
  ready = false;
  cleanups.splice(0).forEach((fn) => fn());
  ctx?.revert();
  ctx = null;
}

export async function enter({ transition = true, scrollTop = true } = {}) {
  if (!booted) return;
  cleanup();
  if (scrollTop) resetScroll();
  initPage();
  if (transition) await playEnter();
  startScroll();
  intro?.play();
}
