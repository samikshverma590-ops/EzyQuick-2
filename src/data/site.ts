import { assetPath } from '@/lib/asset-path';

export interface OfficeInfo {
  id: 'delhi' | 'dubai';
  label: string;
  city: string;
  country: string;
  coordinates: string;
  iata: string;
  addressLines: string[];
  phoneDisplay: string;
  phoneHref: string;
  timezone: string;
}

export interface ApproachChapter {
  index: string;
  code: string;
  title: string;
  summary: string;
  detail: string;
}

export const SITE = {
  brandName: 'EzyQuick',
  legalName: 'EzyQuick Travel Solutions',
  tagline: 'Travel Made Easy',
  secondaryTagline: 'Travel Beyond the Ordinary',
  url: 'https://ezyquick.in',
  email: 'info@ezyquick.in',
  emailHref: 'mailto:info@ezyquick.in',
  whatsappNumber: '+91 8527729449',
  whatsappDigits: '918527729449',
  logoPath: '/brand/ezyquick-logo.png',
  logoAlt: 'EzyQuick — Travel Made Easy',
  copyrightYear: 2026,
  heroHeadline: 'More world. Less to organise.',
  heroSubheadline:
    'From holidays and business trips to flights, stays and visa assistance, EzyQuick brings your travel arrangements together through one point of contact.',
  corridorLabel: 'DEL 28.65°N  ↔  DXB 25.12°N',
  googleReviewSearchUrl: 'https://www.google.com/search?q=EzyQuick+travel+reviews',
} as const;

export function buildWhatsAppUrl(message?: string): string {
  const defaultMsg = 'Hello EzyQuick, I would like to plan a journey.';
  return `https://wa.me/${SITE.whatsappDigits}?text=${encodeURIComponent(message || defaultMsg)}`;
}

export const OFFICES: OfficeInfo[] = [
  {
    id: 'delhi',
    label: 'India Office',
    city: 'New Delhi',
    country: 'India',
    coordinates: '28.6519° N, 77.1636° E',
    iata: 'DEL',
    addressLines: [
      'HN 3234, Shop Office No. 2,',
      'Ground Floor, Ranjit Nagar,',
      'Delhi - 110008, India',
    ],
    phoneDisplay: '+91 8527729449',
    phoneHref: 'tel:+918527729449',
    timezone: 'IST (UTC+5:30)',
  },
  {
    id: 'dubai',
    label: 'Dubai Office',
    city: 'Dubai',
    country: 'United Arab Emirates',
    coordinates: '25.1212° N, 55.3773° E',
    iata: 'DXB',
    addressLines: ['IFZA Properties,', 'Silicon Oasis,', 'Dubai, UAE'],
    phoneDisplay: '+971 589658819',
    phoneHref: 'tel:+971589658819',
    timezone: 'GST (UTC+4:00)',
  },
];

export const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const APPROACH_CHAPTERS: ApproachChapter[] = [
  {
    index: '01',
    code: 'BRIEF',
    title: 'Discover',
    summary: 'Tell us where you need to be, who is travelling, and what matters most.',
    detail:
      'Whether it is a family holiday, an executive delegation, or a medical travel itinerary, every arrangement begins with a direct conversation.',
  },
  {
    index: '02',
    code: 'ROUTE',
    title: 'Plan',
    summary: 'Flights, stays, ground transfers, and visa checklists assembled into one clear proposal.',
    detail:
      'We organise suitable routing, accommodation categories, and timing options for your review before anything is confirmed.',
  },
  {
    index: '03',
    code: 'READY',
    title: 'Prepare',
    summary: 'Documentation guidance, forex assistance, and travel insurance options coordinated in sequence.',
    detail:
      'Every supporting detail is organised through one point of contact so you are not juggling disconnected portals before departure.',
  },
  {
    index: '04',
    code: 'DEPART',
    title: 'Travel',
    summary: 'Depart with confirmed itineraries and accessible human support across Delhi and Dubai.',
    detail:
      'If plans shift or schedules change, you speak directly with the desk that built your itinerary.',
  },
];

export const WHY_EZYQUICK_PILLARS = [
  {
    index: '01',
    title: 'One desk for nine travel disciplines',
    description:
      'Corporate trips, medical travel coordination, leisure holidays, visas, air tickets, hotels, forex, travel insurance, and MICE handled under one roof.',
  },
  {
    index: '02',
    title: 'Two real hubs: Delhi and Dubai',
    description:
      'Reachable offices in Ranjit Nagar, New Delhi and IFZA Properties, Dubai Silicon Oasis supporting India, UAE, and international travellers.',
  },
  {
    index: '03',
    title: 'Clear communication before confirmation',
    description:
      'We share tailored options, itinerary outlines, and relevant documentation checklists transparently before you commit to bookings.',
  },
  {
    index: '04',
    title: 'Direct human access, not automated queues',
    description:
      'Start an enquiry online, write to info@ezyquick.in, or connect straight on WhatsApp with a travel advisor who tracks the whole journey.',
  },
] as const;

export const STORYTELLING_CHAPTERS = [
  {
    id: 'dubai',
    slug: 'dubai',
    region: 'United Arab Emirates',
    coordinates: '25.2048° N, 55.2708° E',
    title: 'Dubai between desert stillness and vertical light',
    caption:
      'From architectural avenues and marina evenings to family escapes and executive summits, Dubai is both our Gulf gateway and one of our most requested routes.',
    note: 'Ask about our proposed "Free Dubai Visa for a Kid" family promotion and its current eligibility terms.',
    image: assetPath('/images/editorial/story-dubai-dusk.jpg'),
    alt: 'Dubai skyline bathed in golden dusk light',
  },
  {
    id: 'kerala',
    slug: 'kerala',
    region: 'South India',
    coordinates: '9.4981° N, 76.3388° E',
    title: 'Kerala where mornings move at the pace of water',
    caption:
      'Backwater houseboats, tea-draped high ranges, and restorative coastal stays—thoughtfully paced for families, honeymooners, and unhurried private escapes.',
    note: 'Custom domestic itineraries pairing Munnar hills, Alleppey waterways, and coastal retreats.',
    image: assetPath('/images/editorial/story-kerala-dawn.jpg'),
    alt: 'Serene Kerala backwaters lined with palms at dawn',
  },
  {
    id: 'ladakh',
    slug: 'ladakh',
    region: 'Himalayan India',
    coordinates: '34.1526° N, 77.5771° E',
    title: 'Ladakh at the edge of high-altitude silence',
    caption:
      'High mountain passes, monastic valleys, and crystalline skies—structured with sensible acclimatisation pacing, reliable transfers, and comfortable stays.',
    note: 'Seasonal mountain journeys planned around road windows and comfortable daily travel distances.',
    image: assetPath('/images/editorial/story-ladakh-pass.jpg'),
    alt: 'Open mountain highway winding through dramatic Himalayan terrain',
  },
] as const;
