import { getDestinationBySlug, type DestinationDetail } from '@/data/destinations';
import { assetPath } from '@/lib/asset-path';

export type PortalTravelMode = 'all' | 'leisure' | 'adventure' | 'corporate' | 'luxury';

export interface PortalAtmosphere {
  /** Radial sky & sunlight bloom behind the horizon */
  skyBloom: string;
  /** Soft translucent drifting air / mist / haze color */
  airMist: string;
  /** Subtle ambient rim-light cast onto the foreground traveler & stone promenade */
  rimWash: string;
  /** Bottom atmospheric ground blend */
  groundTint: string;
}

export interface PortalDestination {
  slug: string;
  detail: DestinationDetail;
  cardTitle: string;
  titleLines: [string, string];
  regionBadge: string;
  taglineLight: string;
  taglineBold: string;
  flightFromDel: string;
  flightFromDxb: string;
  recommendedDays: string;
  peakSeason: string;
  statusTag: string;
  horizonObjectPosition: string;
  modes: Exclude<PortalTravelMode, 'all'>[];
  recommendedService: string;
  /** Lightweight normalized SVG route curve (viewBox 0 0 120 38) */
  routeSvgPath: string;
  routeOriginPoint: [number, number];
  routeDestPoint: [number, number];
  /** Lightweight normalized SVG elevation/season profile curve (viewBox 0 0 120 38) */
  profileSvgPath: string;
  atmosphere: PortalAtmosphere;
}

export const FOREGROUND_TRAVELER_SRC = assetPath('/assets/images/portals/traveler-foreground.webp');

export const PORTAL_TRAVEL_MODES: {
  id: PortalTravelMode;
  label: string;
  shortLabel: string;
}[] = [
  { id: 'all', label: 'All Portals', shortLabel: 'All' },
  { id: 'leisure', label: 'Leisure Escapes', shortLabel: 'Leisure' },
  { id: 'adventure', label: 'Alpine & Adventure', shortLabel: 'Adventure' },
  { id: 'corporate', label: 'Corporate & MICE', shortLabel: 'Corporate' },
  { id: 'luxury', label: 'Luxury & Villas', shortLabel: 'Luxury' },
];

interface PortalSeed {
  slug: string;
  cardTitle: string;
  titleLines: [string, string];
  regionBadge: string;
  taglineLight: string;
  taglineBold: string;
  flightFromDel: string;
  flightFromDxb: string;
  recommendedDays: string;
  peakSeason: string;
  statusTag: string;
  horizonObjectPosition: string;
  modes: Exclude<PortalTravelMode, 'all'>[];
  recommendedService: string;
  routeSvgPath: string;
  routeOriginPoint: [number, number];
  routeDestPoint: [number, number];
  profileSvgPath: string;
  atmosphere: PortalAtmosphere;
}

const PORTAL_SEEDS: PortalSeed[] = [
  {
    slug: 'dubai',
    cardTitle: 'DUBAI SKYLINE',
    titleLines: ['DUBAI', 'SKYLINE'],
    regionBadge: 'UAE · MIDDLE EAST',
    taglineLight: 'Traverse the',
    taglineBold: 'Dunes',
    flightFromDel: '3h 45m',
    flightFromDxb: 'Local Hub',
    recommendedDays: '5 Days',
    peakSeason: 'Oct–Apr',
    statusTag: 'DXB Desk On-Site',
    horizonObjectPosition: '50% 48%',
    modes: ['luxury', 'corporate', 'leisure'],
    recommendedService: 'Corporate Travel',
    routeSvgPath: 'M 10 30 Q 56 4 110 18',
    routeOriginPoint: [10, 30],
    routeDestPoint: [110, 18],
    profileSvgPath: 'M 4 30 C 24 28, 34 10, 56 12 C 78 14, 92 22, 116 14',
    atmosphere: {
      skyBloom:
        'radial-gradient(ellipse 75% 55% at 62% 24%, rgba(252, 180, 0, 0.32) 0%, rgba(245, 130, 32, 0.14) 44%, transparent 76%)',
      airMist: 'rgba(255, 224, 168, 0.24)',
      rimWash: 'rgba(252, 180, 0, 0.20)',
      groundTint: 'rgba(24, 18, 12, 0.82)',
    },
  },
  {
    slug: 'bali',
    cardTitle: 'BALI SANCTUARY',
    titleLines: ['BALI', 'SANCTUARY'],
    regionBadge: 'INDONESIA · SE ASIA',
    taglineLight: 'Escape to',
    taglineBold: 'Island Calm',
    flightFromDel: '7h 30m',
    flightFromDxb: '9h 15m',
    recommendedDays: '6 Days',
    peakSeason: 'Apr–Oct',
    statusTag: 'e-VOA Guided',
    horizonObjectPosition: '50% 48%',
    modes: ['leisure', 'luxury'],
    recommendedService: 'Leisure Travel',
    routeSvgPath: 'M 10 14 Q 64 2 110 30',
    routeOriginPoint: [10, 14],
    routeDestPoint: [110, 30],
    profileSvgPath: 'M 4 28 C 20 26, 38 14, 58 10 C 78 6, 98 20, 116 24',
    atmosphere: {
      skyBloom:
        'radial-gradient(ellipse 78% 58% at 50% 22%, rgba(251, 191, 36, 0.26) 0%, rgba(56, 189, 248, 0.14) 48%, transparent 78%)',
      airMist: 'rgba(218, 247, 232, 0.24)',
      rimWash: 'rgba(251, 191, 36, 0.16)',
      groundTint: 'rgba(9, 25, 42, 0.82)',
    },
  },
  {
    slug: 'ladakh',
    cardTitle: 'LADAKH PASS',
    titleLines: ['LADAKH', 'PASS'],
    regionBadge: 'INDIA · HIMALAYAS',
    taglineLight: 'Ascend the',
    taglineBold: 'High Passes',
    flightFromDel: '1h 25m',
    flightFromDxb: '6h 10m',
    recommendedDays: '7 Days',
    peakSeason: 'May–Sep',
    statusTag: 'Permits Handled',
    horizonObjectPosition: '50% 46%',
    modes: ['adventure', 'leisure'],
    recommendedService: 'Leisure Travel',
    routeSvgPath: 'M 14 32 Q 58 8 106 10',
    routeOriginPoint: [14, 32],
    routeDestPoint: [106, 10],
    profileSvgPath: 'M 4 32 L 26 22 L 46 26 L 68 8 L 90 16 L 116 6',
    atmosphere: {
      skyBloom:
        'radial-gradient(ellipse 80% 58% at 52% 20%, rgba(56, 189, 248, 0.34) 0%, rgba(11, 86, 232, 0.18) 46%, transparent 78%)',
      airMist: 'rgba(219, 238, 255, 0.30)',
      rimWash: 'rgba(96, 165, 250, 0.22)',
      groundTint: 'rgba(7, 20, 43, 0.84)',
    },
  },
  {
    slug: 'phu-quoc',
    cardTitle: 'VIETNAM BAYS',
    titleLines: ['VIETNAM', 'BAYS'],
    regionBadge: 'PHU QUOC · VIETNAM',
    taglineLight: 'Drift Across',
    taglineBold: 'Emerald Bays',
    flightFromDel: '5h 15m',
    flightFromDxb: '8h 20m',
    recommendedDays: '5 Days',
    peakSeason: 'Nov–Apr',
    statusTag: 'Visa Guided',
    horizonObjectPosition: '50% 48%',
    modes: ['leisure', 'luxury'],
    recommendedService: 'Leisure Travel',
    routeSvgPath: 'M 10 20 Q 62 3 110 26',
    routeOriginPoint: [10, 20],
    routeDestPoint: [110, 26],
    profileSvgPath: 'M 4 24 C 24 14, 46 28, 66 16 C 86 6, 100 18, 116 14',
    atmosphere: {
      skyBloom:
        'radial-gradient(ellipse 76% 56% at 56% 24%, rgba(56, 189, 248, 0.28) 0%, rgba(251, 191, 36, 0.14) 50%, transparent 78%)',
      airMist: 'rgba(210, 242, 255, 0.26)',
      rimWash: 'rgba(56, 189, 248, 0.18)',
      groundTint: 'rgba(8, 24, 46, 0.82)',
    },
  },
  {
    slug: 'phuket',
    cardTitle: 'ANDAMAN CLIFFS',
    titleLines: ['ANDAMAN', 'CLIFFS'],
    regionBadge: 'PHUKET · THAILAND',
    taglineLight: 'Chart the',
    taglineBold: 'Limestone Coves',
    flightFromDel: '4h 30m',
    flightFromDxb: '6h 25m',
    recommendedDays: '5 Days',
    peakSeason: 'Nov–Apr',
    statusTag: 'Island Ready',
    horizonObjectPosition: '50% 48%',
    modes: ['leisure', 'adventure', 'luxury'],
    recommendedService: 'Leisure Travel',
    routeSvgPath: 'M 12 18 Q 58 4 108 28',
    routeOriginPoint: [12, 18],
    routeDestPoint: [108, 28],
    profileSvgPath: 'M 4 28 C 22 18, 40 24, 62 10 C 82 14, 96 8, 116 20',
    atmosphere: {
      skyBloom:
        'radial-gradient(ellipse 76% 56% at 48% 22%, rgba(56, 189, 248, 0.30) 0%, rgba(14, 165, 233, 0.15) 48%, transparent 78%)',
      airMist: 'rgba(205, 243, 255, 0.28)',
      rimWash: 'rgba(56, 189, 248, 0.20)',
      groundTint: 'rgba(7, 23, 45, 0.82)',
    },
  },
  {
    slug: 'kerala',
    cardTitle: 'KERALA BACKWATERS',
    titleLines: ['KERALA', 'BACKWATERS'],
    regionBadge: 'INDIA · MALABAR',
    taglineLight: 'Sail the',
    taglineBold: 'Still Canals',
    flightFromDel: '3h 15m',
    flightFromDxb: '4h 05m',
    recommendedDays: '6 Days',
    peakSeason: 'Sep–Mar',
    statusTag: 'Domestic India',
    horizonObjectPosition: '50% 50%',
    modes: ['leisure', 'luxury'],
    recommendedService: 'Leisure Travel',
    routeSvgPath: 'M 16 10 Q 52 16 102 30',
    routeOriginPoint: [16, 10],
    routeDestPoint: [102, 30],
    profileSvgPath: 'M 4 26 C 24 22, 44 12, 66 18 C 86 24, 100 12, 116 16',
    atmosphere: {
      skyBloom:
        'radial-gradient(ellipse 74% 55% at 54% 24%, rgba(251, 191, 36, 0.28) 0%, rgba(245, 158, 11, 0.14) 48%, transparent 76%)',
      airMist: 'rgba(255, 238, 198, 0.24)',
      rimWash: 'rgba(251, 191, 36, 0.18)',
      groundTint: 'rgba(11, 24, 38, 0.82)',
    },
  },
  {
    slug: 'almaty',
    cardTitle: 'TIEN SHAN PEAKS',
    titleLines: ['TIEN SHAN', 'PEAKS'],
    regionBadge: 'ALMATY · KAZAKHSTAN',
    taglineLight: 'Cross the',
    taglineBold: 'Alpine Ridges',
    flightFromDel: '3h 30m',
    flightFromDxb: '4h 30m',
    recommendedDays: '5 Days',
    peakSeason: 'May–Oct',
    statusTag: 'Short-Haul Alpine',
    horizonObjectPosition: '50% 45%',
    modes: ['adventure', 'leisure'],
    recommendedService: 'Leisure Travel',
    routeSvgPath: 'M 14 30 Q 60 6 108 12',
    routeOriginPoint: [14, 30],
    routeDestPoint: [108, 12],
    profileSvgPath: 'M 4 30 L 24 18 L 48 24 L 72 6 L 94 18 L 116 10',
    atmosphere: {
      skyBloom:
        'radial-gradient(ellipse 80% 56% at 50% 18%, rgba(147, 197, 253, 0.34) 0%, rgba(59, 130, 246, 0.16) 46%, transparent 78%)',
      airMist: 'rgba(232, 244, 255, 0.32)',
      rimWash: 'rgba(147, 197, 253, 0.22)',
      groundTint: 'rgba(8, 20, 42, 0.84)',
    },
  },
  {
    slug: 'singapore',
    cardTitle: 'MARINA HORIZON',
    titleLines: ['MARINA', 'HORIZON'],
    regionBadge: 'SINGAPORE · SE ASIA',
    taglineLight: 'Explore the',
    taglineBold: 'Skylines',
    flightFromDel: '5h 40m',
    flightFromDxb: '7h 20m',
    recommendedDays: '4 Days',
    peakSeason: 'Year-Round',
    statusTag: 'MICE & Family',
    horizonObjectPosition: '50% 48%',
    modes: ['corporate', 'luxury', 'leisure'],
    recommendedService: 'MICE Services',
    routeSvgPath: 'M 10 14 Q 62 4 110 28',
    routeOriginPoint: [10, 14],
    routeDestPoint: [110, 28],
    profileSvgPath: 'M 4 22 C 26 16, 46 18, 66 12 C 88 14, 102 10, 116 14',
    atmosphere: {
      skyBloom:
        'radial-gradient(ellipse 78% 58% at 54% 22%, rgba(0, 84, 252, 0.30) 0%, rgba(56, 189, 248, 0.18) 46%, transparent 78%)',
      airMist: 'rgba(191, 219, 254, 0.24)',
      rimWash: 'rgba(96, 165, 250, 0.22)',
      groundTint: 'rgba(6, 17, 36, 0.84)',
    },
  },
];

export const PORTAL_DESTINATIONS: PortalDestination[] = PORTAL_SEEDS.map((seed) => {
  const detail = getDestinationBySlug(seed.slug);
  if (!detail) {
    throw new Error(`Missing verified destination data for portal slug: ${seed.slug}`);
  }
  return {
    ...seed,
    detail,
  };
});
