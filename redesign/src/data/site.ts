import { assetPath } from '@/lib/asset-path';

export interface OfficeInfo {
  id: 'delhi' | 'dubai';
  code: 'DEL' | 'DXB';
  label: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  coordinates: string;
  addressLines: string[];
  phoneDisplay: string;
  phoneHref: string;
  whatsappDigits: string;
  timezone: string;
  role: string;
}

export interface JourneyStage {
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
  url: 'https://samikshverma590-ops.github.io/EzyQuick-2',
  productionDomain: 'https://ezyquick.in',
  email: 'info@ezyquick.in',
  emailHref: 'mailto:info@ezyquick.in',
  whatsappNumber: '+91 8527729449',
  whatsappDigits: '918527729449',
  logoPath: '/assets/brand/ezyquick-logo.png',
  logoAlt: 'EzyQuick — Travel Made Easy',
  copyrightYear: 2026,
  privacyNotice:
    'We collect only the contact and trip details you submit to prepare your travel proposal and respond via your chosen desk (New Delhi or Dubai). We do not sell your personal information. Please never enter passport numbers, payment-card details, or clinical medical records in this public form. Enquiries sent via WhatsApp or email are handled directly by our travel advisors for active trip coordination.',
} as const;

export const OFFICES: OfficeInfo[] = [
  {
    id: 'delhi',
    code: 'DEL',
    label: 'India Office',
    city: 'New Delhi',
    country: 'India',
    lat: 28.6519,
    lng: 77.1636,
    coordinates: '28.6519° N, 77.1636° E',
    addressLines: [
      'HN 3234, Shop Office No. 2,',
      'Ground Floor, Ranjit Nagar,',
      'Delhi - 110008, India',
    ],
    phoneDisplay: '+91 8527729449',
    phoneHref: 'tel:+918527729449',
    whatsappDigits: '918527729449',
    timezone: 'IST (UTC+5:30)',
    role: 'Primary India & South Asia Travel Desk',
  },
  {
    id: 'dubai',
    code: 'DXB',
    label: 'Dubai Office',
    city: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.1212,
    lng: 55.3773,
    coordinates: '25.1212° N, 55.3773° E',
    addressLines: ['IFZA Properties,', 'Silicon Oasis,', 'Dubai, UAE'],
    phoneDisplay: '+971 589658819',
    phoneHref: 'tel:+971589658819',
    whatsappDigits: '918527729449',
    timezone: 'GST (UTC+4:00)',
    role: 'Gulf & International Travel Coordination Desk',
  },
];

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services/' },
  { label: 'Destinations', href: '/destinations/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    index: '01',
    code: 'BRIEF',
    title: 'Discover',
    summary: 'Share where you need to be, who is travelling, and what matters most.',
    detail:
      'Whether coordinating a family holiday, an executive delegation, or a medical travel itinerary, every arrangement begins with a direct human conversation.',
  },
  {
    index: '02',
    code: 'ROUTE',
    title: 'Plan',
    summary: 'Flights, stays, ground transfers, and visa checklists assembled into one clear proposal.',
    detail:
      'We organise suitable routing, accommodation categories, and timing options for your review before any booking is confirmed.',
  },
  {
    index: '03',
    code: 'READY',
    title: 'Prepare',
    summary: 'Documentation guidance, forex assistance, and travel insurance options coordinated in sequence.',
    detail:
      'Supporting requirements are prepared through one point of contact so you are not juggling disconnected portals before departure.',
  },
  {
    index: '04',
    code: 'DEPART',
    title: 'Travel',
    summary: 'Depart with confirmed itineraries and accessible advisor support across New Delhi and Dubai.',
    detail:
      'If plans shift or schedules change, you speak directly with the travel desk that structured your journey.',
  },
];

export const WHY_EZYQUICK_PILLARS = [
  {
    index: '01',
    title: 'Nine travel disciplines under one desk',
    description:
      'Corporate trips, medical travel coordination, leisure holidays, visa guidance, air tickets, hotels, forex, travel insurance, and MICE handled together.',
  },
  {
    index: '02',
    title: 'Two active offices: New Delhi and Dubai',
    description:
      'Reachable teams in Ranjit Nagar, New Delhi and IFZA Properties, Dubai Silicon Oasis supporting India, UAE, and international travellers.',
  },
  {
    index: '03',
    title: 'Clear proposals before confirmation',
    description:
      'Tailored itinerary outlines, routing options, and relevant documentation checklists shared transparently before you commit to bookings.',
  },
  {
    index: '04',
    title: 'Direct human access across channels',
    description:
      'Submit a structured brief online, write to info@ezyquick.in, call Delhi or Dubai directly, or continue on WhatsApp with an advisor.',
  },
] as const;

/**
 * Curated Journey Dispatches — authentic destination inspiration used in Scene 8
 * (strictly zero fabricated customer reviews or ratings).
 */
export const JOURNEY_DISPATCHES = [
  {
    slug: 'dubai',
    region: 'United Arab Emirates',
    coordinates: '25.2048° N, 55.2708° E',
    title: 'Dubai between desert stillness and skyline geometry',
    caption:
      'From architectural avenues and marina evenings to family escapes and executive summits, Dubai is both our Gulf hub and one of our most requested routes.',
    image: assetPath('/assets/images/editorial/story-dubai-dusk.jpg'),
    alt: 'Dubai skyline bathed in golden dusk light',
  },
  {
    slug: 'kerala',
    region: 'South India',
    coordinates: '9.4981° N, 76.3388° E',
    title: 'Kerala where mornings move at the pace of water',
    caption:
      'Backwater houseboats, tea-draped high ranges, and calm coastal stays paced for families, honeymooners, and unhurried private escapes.',
    image: assetPath('/assets/images/editorial/story-kerala-dawn.jpg'),
    alt: 'Serene Kerala backwaters lined with palms at dawn',
  },
  {
    slug: 'ladakh',
    region: 'Himalayan India',
    coordinates: '34.1526° N, 77.5771° E',
    title: 'Ladakh at the edge of high-altitude silence',
    caption:
      'Mountain passes, monastic valleys, and clear skies structured with sensible acclimatisation pacing, reliable local transport, and comfortable stays.',
    image: assetPath('/assets/images/editorial/story-ladakh-pass.jpg'),
    alt: 'Open mountain highway winding through Himalayan terrain',
  },
] as const;

const MAX_URL_MESSAGE_CHARS = 1450;

export function buildSafeWhatsAppUrl(message: string): { url: string; truncated: boolean } {
  const defaultMsg = 'Hello EzyQuick, I would like to plan a journey.';
  const raw = (message || defaultMsg).trim();
  const truncated = raw.length > MAX_URL_MESSAGE_CHARS;
  const safeText = truncated
    ? `${raw.slice(0, MAX_URL_MESSAGE_CHARS - 52)}… [Full brief copied/shortened for WhatsApp]`
    : raw;

  return {
    url: `https://wa.me/${SITE.whatsappDigits}?text=${encodeURIComponent(safeText)}`,
    truncated,
  };
}

export function buildSafeMailtoUrl(
  subject: string,
  body: string
): { url: string; truncated: boolean } {
  const rawBody = body.trim();
  const truncated = rawBody.length > MAX_URL_MESSAGE_CHARS;
  const safeBody = truncated
    ? `${rawBody.slice(0, MAX_URL_MESSAGE_CHARS - 48)}… [Shortened for email URL; paste full brief]`
    : rawBody;

  return {
    url: `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(safeBody)}`,
    truncated,
  };
}
