import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ease, prefersReducedMotion, isTouch } from './env';

gsap.registerPlugin(ScrollTrigger, SplitText);

const splitDurations = { lines: 1.05, words: 0.95, chars: 0.85 } as const;
const splitStaggers = { lines: 0.075, words: 0.032, chars: 0.016 } as const;

function splitTween(el: HTMLElement, isIntro: boolean) {
  const kind = (el.dataset.split || 'lines') as keyof typeof splitDurations;
  const delay = parseFloat(el.dataset.delay || '0');
  const tracker = {
    tween: undefined as gsap.core.Tween | undefined,
    done: false,
    requested: false,
  };

  SplitText.create(el, {
    type: kind === 'lines' ? 'lines' : `lines,${kind}`,
    mask: 'lines',
    autoSplit: true,
    linesClass: 'split-line',
    onSplit(self) {
      gsap.set(el, { visibility: 'visible' });
      if (tracker.done) return;
      const targets =
        kind === 'lines' ? self.lines : kind === 'words' ? self.words : self.chars;
      tracker.tween = gsap.from(targets, {
        yPercent: 108,
        duration: splitDurations[kind],
        stagger: splitStaggers[kind],
        ease: ease.glide,
        delay,
        paused: isIntro && !tracker.requested,
        onComplete: () => {
          tracker.done = true;
        },
        scrollTrigger: isIntro
          ? undefined
          : { trigger: el, start: 'top 88%', once: true },
      });
      return tracker.tween;
    },
  });

  return () => {
    tracker.requested = true;
    tracker.tween?.play();
  };
}

function blockTween(el: HTMLElement, isIntro: boolean) {
  const kind = el.dataset.reveal || 'up';
  const delay = parseFloat(el.dataset.delay || '0');

  const from: gsap.TweenVars =
    kind === 'fade'
      ? { autoAlpha: 0 }
      : kind === 'clip'
        ? { clipPath: 'inset(100% 0% 0% 0%)', autoAlpha: 1 }
        : kind === 'scale'
          ? { scale: 1.08, clipPath: 'inset(8% 8% 8% 8%)', autoAlpha: 1 }
          : { y: 36, autoAlpha: 0 };

  const to: gsap.TweenVars =
    kind === 'clip' || kind === 'scale'
      ? { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }
      : {};

  gsap.set(el, { visibility: 'visible' });
  return gsap.fromTo(el, from, {
    ...to,
    y: 0,
    autoAlpha: 1,
    duration: kind === 'fade' ? 0.85 : 1.1,
    ease: ease.glide,
    delay,
    paused: isIntro,
    scrollTrigger: isIntro
      ? undefined
      : { trigger: el, start: 'top 90%', once: true },
  });
}

export function initReveals(root: ParentNode = document) {
  const intro = gsap.timeline({ paused: true });

  if (prefersReducedMotion()) {
    root.querySelectorAll<HTMLElement>('[data-split], [data-reveal]').forEach((el) => {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    });
    return intro;
  }

  root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const isIntro = el.hasAttribute('data-intro');
    const play = splitTween(el, isIntro);
    if (isIntro) intro.add(play, 0.04);
  });

  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const isIntro = el.hasAttribute('data-intro');
    const tween = blockTween(el, isIntro);
    if (isIntro) intro.add(() => tween.play(), 0.06);
  });

  root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax || '0.12');
    gsap.fromTo(
      el,
      { yPercent: -amount * 100 },
      {
        yPercent: amount * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });

  if (!isTouch()) {
    root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic || '0.24');
      const qx = gsap.quickTo(el, 'x', { duration: 0.55, ease: ease.soft });
      const qy = gsap.quickTo(el, 'y', { duration: 0.55, ease: ease.soft });
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * strength);
        qy((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const onLeave = () => {
        qx(0);
        qy(0);
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
    });
  }

  return intro;
}
