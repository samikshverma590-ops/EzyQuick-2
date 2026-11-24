export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none), (pointer: coarse)').matches;

export const isMobile = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

/** Shared "Glide & Lock" easing vocabulary across GSAP timelines */
export const ease = {
  glide: 'expo.out',
  lock: 'expo.inOut',
  soft: 'power3.out',
} as const;
