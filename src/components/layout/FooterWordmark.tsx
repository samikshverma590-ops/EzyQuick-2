'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Full-width edge-to-edge oversized EZYQUICK display wordmark for the Awwwards footer
 * with subtle GPU-composited scroll-reveal rise (disabled under prefers-reduced-motion).
 */
export function FooterWordmark() {
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        svg,
        { opacity: 0.2, yPercent: 18 },
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 92%',
            once: true,
          },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={wrapRef}
      className="w-full overflow-hidden border-t border-[#F4F7FC]/10 pt-6 pb-2 select-none"
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1200 205"
        className="block h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="ezyquickWordmarkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
            <stop offset="52%" stopColor="#F5A623" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#0B56E8" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <text
          x="600"
          y="174"
          textAnchor="middle"
          fill="url(#ezyquickWordmarkGrad)"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          fontWeight="800"
          fontSize="212"
          letterSpacing="-8"
        >
          EZYQUICK
        </text>
      </svg>
    </div>
  );
}
