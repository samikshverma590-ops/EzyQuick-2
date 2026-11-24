import { gsap } from 'gsap';
import { ease, prefersReducedMotion } from './env';

function getCurtain(): HTMLElement | null {
  return document.getElementById('route-curtain');
}

export async function playLeave(): Promise<void> {
  const curtain = getCurtain();
  if (!curtain) return;
  const panel = curtain.querySelector<HTMLElement>('.curtain-panel');
  const line = curtain.querySelector<HTMLElement>('.curtain-meridian');
  if (!panel) return;

  if (prefersReducedMotion()) {
    await gsap
      .timeline()
      .set(curtain, { autoAlpha: 1 })
      .fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.16 });
    return;
  }

  await gsap
    .timeline()
    .set(curtain, { autoAlpha: 1 })
    .fromTo(
      panel,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.48, ease: ease.lock }
    )
    .fromTo(
      line,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.32, ease: ease.glide },
      '-=0.22'
    );
}

export async function playEnter(): Promise<void> {
  const curtain = getCurtain();
  if (!curtain) return;
  const panel = curtain.querySelector<HTMLElement>('.curtain-panel');
  if (!panel) return;

  if (prefersReducedMotion()) {
    await gsap
      .timeline()
      .to(panel, { opacity: 0, duration: 0.16 })
      .set(curtain, { autoAlpha: 0 });
    return;
  }

  await gsap
    .timeline()
    .to(panel, { yPercent: -100, duration: 0.56, ease: ease.lock })
    .set(curtain, { autoAlpha: 0 });
}
