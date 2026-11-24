import Image from 'next/image';
import { SITE } from '@/data/site';

interface BrandLogoProps {
  /** 'plain' sits directly on white/light surfaces; 'plate' adds a crisp white surface plate over dark photography */
  variant?: 'plain' | 'plate';
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { width: 138, height: 55 },
  md: { width: 168, height: 67 },
  lg: { width: 205, height: 82 },
} as const;

/**
 * Renders the official, unmodified EzyQuick logo asset (/brand/ezyquick-logo.png).
 * Per EZYQUICK_BRAND_AUDIT.md: never recolor, invert, crop, distort, or apply CSS filter.
 */
export function BrandLogo({
  variant = 'plain',
  size = 'md',
  priority = false,
  className = '',
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];

  if (variant === 'plate') {
    return (
      <span
        className={`inline-flex items-center bg-white px-3.5 py-2 shadow-[0_6px_24px_rgba(8,20,38,0.16)] rounded-[3px] ${className}`}
      >
        <Image
          src={SITE.logoPath}
          alt={SITE.logoAlt}
          width={dims.width}
          height={dims.height}
          priority={priority}
          className="h-auto w-auto max-h-[38px] sm:max-h-[44px] object-contain"
          style={{ filter: 'none' }}
        />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src={SITE.logoPath}
        alt={SITE.logoAlt}
        width={dims.width}
        height={dims.height}
        priority={priority}
        className="h-auto w-auto max-h-[42px] sm:max-h-[48px] object-contain"
        style={{ filter: 'none' }}
      />
    </span>
  );
}
