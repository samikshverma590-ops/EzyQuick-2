import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './env';

gsap.registerPlugin(ScrollTrigger);

export type ScrollState = {
  y: number;
  velocity: number;
  progress: number;
};

let lenis: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
const listeners = new Set<(s: ScrollState) => void>();
const state: ScrollState = { y: 0, velocity: 0, progress: 0 };

function notify() {
  listeners.forEach((fn) => fn(state));
}

function nativeTick() {
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
  const nextY = window.scrollY;
  state.velocity = nextY - state.y;
  state.y = nextY;
  state.progress = max > 0 ? nextY / max : 0;
  notify();
}

export function initScroll() {
  if (typeof window === 'undefined') return;
  if (lenis) return;

  if (prefersReducedMotion()) {
    window.addEventListener('scroll', nativeTick, { passive: true });
    nativeTick();
    return;
  }

  lenis = new Lenis({
    lerp: 0.095,
    wheelMultiplier: 1,
    touchMultiplier: 1.15,
    anchors: true,
  });

  lenis.on('scroll', (instance: Lenis) => {
    state.y = instance.scroll;
    state.velocity = instance.velocity;
    state.progress = instance.limit > 0 ? instance.scroll / instance.limit : 0;
    ScrollTrigger.update();
    notify();
  });

  tickerCallback = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);
}

export function onScroll(fn: (s: ScrollState) => void): () => void {
  listeners.add(fn);
  fn(state);
  return () => {
    listeners.delete(fn);
  };
}

export const scrollState = () => state;
export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();

export function resetScroll() {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true });
  } else if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }
  state.y = 0;
  state.velocity = 0;
  state.progress = 0;
  notify();
}

export function scrollToTarget(target: string | HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.25,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'auto' });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: 'auto' });
  }
}
