import { assetPath } from '@/lib/asset-path';

export interface AtlasHub {
  id: 'delhi' | 'dubai';
  code: 'DEL' | 'DXB';
  label: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  address: string;
  phoneDisplay: string;
  phoneHref: string;
  timezone: string;
  role: string;
}

export type AtlasRegionFilter =
  | 'All'
  | 'India'
  | 'Middle East'
  | 'Southeast Asia'
  | 'South & Central Asia';

export interface AtlasDestination {
  slug: string;
  name: string;
  country: string;
  region: 'India' | 'International';
  subregion: Exclude<AtlasRegionFilter, 'All'>;
  lat: number;
  lng: number;
  preferredHub: 'delhi' | 'dubai';
  tagline: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  idealStyles: string[];
  suggestedWindow: string;
  typicalDuration: string;
}

export const ATLAS_HUBS: AtlasHub[] = [
  {
    id: 'delhi',
    code: 'DEL',
    label: 'India Hub',
    city: 'New Delhi',
    country: 'India',
    lat: 28.6519,
    lng: 77.1636,
    address: 'HN 3234, Shop Office No. 2, Ground Floor, Ranjit Nagar, Delhi - 110008, India',
    phoneDisplay: '+91 8527729449',
    phoneHref: 'tel:+918527729449',
    timezone: 'IST (UTC+5:30)',
    role: 'Primary India & South Asia Travel Desk',
  },
  {
    id: 'dubai',
    code: 'DXB',
    label: 'UAE Hub',
    city: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.1212,
    lng: 55.3773,
    address: 'IFZA Properties, Silicon Oasis, Dubai, UAE',
    phoneDisplay: '+971 589658819',
    phoneHref: 'tel:+971589658819',
    timezone: 'GST (UTC+4:00)',
    role: 'Gulf & International Travel Coordination Desk',
  },
];

/**
 * All 14 verified EzyQuick destinations with verified coordinates.
 * Unverified promotional claims are strictly omitted.
 */
export const ATLAS_DESTINATIONS: AtlasDestination[] = [
  {
    slug: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'International',
    subregion: 'Middle East',
    lat: 25.2048,
    lng: 55.2708,
    preferredHub: 'dubai',
    tagline: 'Skyline ambition framed by desert quiet and Gulf coastlines.',
    shortDescription:
      'Our Gulf gateway for family holidays, executive trips, winter sun escapes, and MICE gatherings.',
    image: assetPath('/assets/images/destinations/dubai.jpg'),
    imageAlt: 'Dubai skyline and illuminated avenues at golden hour',
    highlights: [
      'Downtown skyline views, architectural landmarks, and waterfront promenades',
      'Private desert conservation drives and evening dune dining',
      'Palm & Jumeirah beachfront resorts for families and couples',
    ],
    idealStyles: ['Family', 'Luxury', 'Honeymoon', 'Corporate & MICE'],
    suggestedWindow: 'October to April (year-round for business)',
    typicalDuration: '4 to 6 nights',
  },
  {
    slug: 'abu-dhabi',
    name: 'Abu Dhabi',
    country: 'United Arab Emirates',
    region: 'International',
    subregion: 'Middle East',
    lat: 24.4539,
    lng: 54.3773,
    preferredHub: 'dubai',
    tagline: 'Cultural serenity, luminous domes, and calm island resorts.',
    shortDescription:
      'Saadiyat museums, Yas Island family adventures, tranquil mangrove coastlines, and architectural beauty.',
    image: assetPath('/assets/images/destinations/abu-dhabi.jpg'),
    imageAlt: 'Sheikh Zayed Grand Mosque in Abu Dhabi reflected in dusk water',
    highlights: [
      'Sheikh Zayed Grand Mosque and Saadiyat Cultural District',
      'Saadiyat Island beachfront resorts and Yas Island entertainment',
      'Seamless twin-emirate pairing with Dubai',
    ],
    idealStyles: ['Culture', 'Family', 'Corporate', 'Luxury'],
    suggestedWindow: 'October to April',
    typicalDuration: '3 to 5 nights',
  },
  {
    slug: 'phu-quoc',
    name: 'Phu Quoc',
    country: 'Vietnam',
    region: 'International',
    subregion: 'Southeast Asia',
    lat: 10.2899,
    lng: 103.984,
    preferredHub: 'delhi',
    tagline: 'Emerald bays, tropical island quiet, and sunlit coastal horizons.',
    shortDescription:
      'Vietnam’s southern island—unhurried resorts, sunset coastlines, night markets, and island-hopping.',
    image: assetPath('/assets/images/destinations/phu-quoc.jpg'),
    imageAlt: 'Emerald coastal waters and dramatic Vietnamese seascape',
    highlights: [
      'Sunset beachfront resorts along Long Beach and Khem Beach',
      'Southern archipelago boat excursions and clear-water snorkelling',
      'Coastal cable-car crossings and vibrant night markets',
    ],
    idealStyles: ['Honeymoon', 'Family', 'Island Escape'],
    suggestedWindow: 'November to April',
    typicalDuration: '4 to 6 nights',
  },
  {
    slug: 'phuket',
    name: 'Phuket',
    country: 'Thailand',
    region: 'International',
    subregion: 'Southeast Asia',
    lat: 7.8804,
    lng: 98.3923,
    preferredHub: 'delhi',
    tagline: 'Andaman coves, limestone horizons, and vibrant island hospitality.',
    shortDescription:
      'Thailand’s island gateway—cliffside resorts, Andaman boat days, Old Town heritage, and sunset beaches.',
    image: assetPath('/assets/images/destinations/phuket.jpg'),
    imageAlt: 'Turquoise Andaman bay and forested coastline in Phuket, Thailand',
    highlights: [
      'Andaman island-hopping across Phi Phi and Phang Nga Bay',
      'Kata Noi, Kamala, and Bang Tao coastal stays',
      'Historic Old Phuket Town architecture and Thai wellness spas',
    ],
    idealStyles: ['Family', 'Honeymoon', 'Group'],
    suggestedWindow: 'November to April',
    typicalDuration: '4 to 6 nights',
  },
  {
    slug: 'krabi',
    name: 'Krabi',
    country: 'Thailand',
    region: 'International',
    subregion: 'Southeast Asia',
    lat: 8.0863,
    lng: 98.9063,
    preferredHub: 'delhi',
    tagline: 'Towering limestone cliffs rising straight from emerald sea.',
    shortDescription:
      'Railay’s dramatic sea cliffs, quiet tropical lagoons, Four Islands boat trails, and laid-back coastal stays.',
    image: assetPath('/assets/images/destinations/krabi.jpg'),
    imageAlt: 'Traditional long-tail boat framed by Krabi limestone cliffs and clear water',
    highlights: [
      'Railay Peninsula and Phra Nang Cave Beach limestone karsts',
      'Hong Islands and Four Islands lagoon excursions',
      'Quiet beachfront stretches in Tubkaek and Klong Muang',
    ],
    idealStyles: ['Honeymoon', 'Adventure', 'Relaxation'],
    suggestedWindow: 'November to April',
    typicalDuration: '3 to 5 nights',
  },
  {
    slug: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'International',
    subregion: 'Southeast Asia',
    lat: -8.4095,
    lng: 115.1889,
    preferredHub: 'delhi',
    tagline: 'Terraced jungle mist, cliffside temples, and deeply restorative craft.',
    shortDescription:
      'Ubud’s emerald valleys, Uluwatu ocean cliffs, coastal dining, and private pool villas for unhurried days.',
    image: assetPath('/assets/images/destinations/bali.jpg'),
    imageAlt: 'Lush Balinese terraced hills and tranquil tropical landscape',
    highlights: [
      'Ubud jungle villas, rice terraces, and artisan studios',
      'Uluwatu clifftop temples and sunset ocean panoramas',
      'Nusa Dua and Jimbaran calm coastal family resorts',
    ],
    idealStyles: ['Honeymoon', 'Family', 'Wellness'],
    suggestedWindow: 'April to October',
    typicalDuration: '5 to 8 nights',
  },
  {
    slug: 'sri-lanka',
    name: 'Sri Lanka',
    country: 'Sri Lanka',
    region: 'International',
    subregion: 'South & Central Asia',
    lat: 7.8731,
    lng: 80.7718,
    preferredHub: 'delhi',
    tagline: 'Highland tea country, ancient rock fortresses, and golden southern shores.',
    shortDescription:
      'Compact and diverse—combining misty hill trains, wildlife national parks, Galle Fort, and coastal stays.',
    image: assetPath('/assets/images/destinations/sri-lanka.jpg'),
    imageAlt: 'Misty highland hills and iconic railway viaduct in Sri Lanka',
    highlights: [
      'Cultural Triangle landmarks including Sigiriya and Kandy',
      'Scenic highland estates in Nuwara Eliya and Ella',
      'Galle Fort heritage ramparts and southern beaches',
    ],
    idealStyles: ['Family', 'Culture', 'Nature'],
    suggestedWindow: 'December to April (south/west); May to September (east)',
    typicalDuration: '5 to 8 nights',
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'International',
    subregion: 'Southeast Asia',
    lat: 1.3521,
    lng: 103.8198,
    preferredHub: 'delhi',
    tagline: 'Botanical architecture, culinary craft, and effortless urban ease.',
    shortDescription:
      'A crisp city-state uniting futuristic gardens, heritage quarters, family attractions, and executive hospitality.',
    image: assetPath('/assets/images/destinations/singapore.jpg'),
    imageAlt: 'Singapore Marina skyline and botanical gardens at twilight',
    highlights: [
      'Gardens by the Bay conservatories and Marina Bay skyline',
      'Sentosa Island resorts and family attractions',
      'World-class convention hotels and seamless transit',
    ],
    idealStyles: ['Family', 'Corporate & MICE', 'City Break'],
    suggestedWindow: 'Year-round',
    typicalDuration: '3 to 5 nights',
  },
  {
    slug: 'malaysia',
    name: 'Malaysia',
    country: 'Malaysia',
    region: 'International',
    subregion: 'Southeast Asia',
    lat: 3.139,
    lng: 101.6869,
    preferredHub: 'delhi',
    tagline: 'Towering city skylines, cool tea highlands, and emerald island archipelagos.',
    shortDescription:
      'Kuala Lumpur’s urban energy paired with Langkawi beaches, Penang heritage cuisine, and highland retreats.',
    image: assetPath('/assets/images/destinations/malaysia.jpg'),
    imageAlt: 'Kuala Lumpur architectural skyline glowing at dusk in Malaysia',
    highlights: [
      'Kuala Lumpur skyline architecture and dining districts',
      'Langkawi rainforest resorts and Andaman coves',
      'Penang UNESCO heritage lanes and Cameron Highlands',
    ],
    idealStyles: ['Family', 'Group', 'Corporate'],
    suggestedWindow: 'November to April (west-coast islands); year-round KL',
    typicalDuration: '4 to 7 nights',
  },
  {
    slug: 'almaty',
    name: 'Almaty',
    country: 'Kazakhstan',
    region: 'International',
    subregion: 'South & Central Asia',
    lat: 43.222,
    lng: 76.8512,
    preferredHub: 'dubai',
    tagline: 'Snow-crowned Tien Shan peaks rising directly above leafy boulevards.',
    shortDescription:
      'A close-range alpine escape—mountain lakes, ski slopes, dramatic canyons, and lively café culture.',
    image: assetPath('/assets/images/destinations/almaty.jpg'),
    imageAlt: 'Alpine mountain lake and snow-dusted peaks near Almaty, Kazakhstan',
    highlights: [
      'Shymbulak mountain resort and Medeu high-altitude valley',
      'Big Almaty Lake, Kolsai Lakes, and Charyn Canyon',
      'Leafy boulevards, Green Bazaar, and contemporary cafés',
    ],
    idealStyles: ['Adventure', 'Family', 'Scenic Escape'],
    suggestedWindow: 'May to October (lakes); December to March (snow)',
    typicalDuration: '4 to 6 nights',
  },
  {
    slug: 'kerala',
    name: 'Kerala',
    country: 'India',
    region: 'India',
    subregion: 'India',
    lat: 9.4981,
    lng: 76.3388,
    preferredHub: 'delhi',
    tagline: 'Emerald backwaters, misty tea slopes, and coastal stillness.',
    shortDescription:
      'Alleppey waterways, Munnar high ranges, Fort Kochi heritage, and restorative coastal sanctuaries.',
    image: assetPath('/assets/images/destinations/kerala.jpg'),
    imageAlt: 'Tranquil palm-fringed Kerala backwaters under soft golden light',
    highlights: [
      'Alleppey and Kumarakom serene backwater cruises',
      'Munnar tea estates and Western Ghats viewpoints',
      'Fort Kochi historic architecture and Arabian Sea beaches',
    ],
    idealStyles: ['Honeymoon', 'Family', 'Wellness'],
    suggestedWindow: 'September to March',
    typicalDuration: '5 to 7 nights',
  },
  {
    slug: 'goa',
    name: 'Goa',
    country: 'India',
    region: 'India',
    subregion: 'India',
    lat: 15.2993,
    lng: 74.124,
    preferredHub: 'delhi',
    tagline: 'Sun-warmed beaches, Indo-Portuguese heritage, and effortless coastal rhythm.',
    shortDescription:
      'Serene South Goa resorts, vibrant North Goa dining, Fontainhas heritage walks, and corporate coastal offsites.',
    image: assetPath('/assets/images/destinations/goa.jpg'),
    imageAlt: 'Golden shoreline and palm trees along the coast of Goa, India',
    highlights: [
      'Wide beachfront resorts across South Goa',
      'Fontainhas heritage quarter and riverside sunsets',
      'Conference-ready resorts for corporate offsites & MICE',
    ],
    idealStyles: ['Family', 'Group', 'Corporate Offsite'],
    suggestedWindow: 'November to February',
    typicalDuration: '3 to 5 nights',
  },
  {
    slug: 'andaman-nicobar',
    name: 'Andaman & Nicobar',
    country: 'India',
    region: 'India',
    subregion: 'India',
    lat: 11.7401,
    lng: 92.6586,
    preferredHub: 'delhi',
    tagline: 'White coral sands, translucent reefs, and unhurried island horizons.',
    shortDescription:
      'Swaraj Dweep (Havelock), Shaheed Dweep (Neil), luminous reef waters, and peaceful forest-fringed shores.',
    image: assetPath('/assets/images/destinations/andaman-nicobar.jpg'),
    imageAlt: 'Crystal-clear turquoise tropical island shoreline',
    highlights: [
      'Radhanagar Beach and serene stays on Havelock (Swaraj Dweep)',
      'Unspoiled coral bays on Neil (Shaheed Dweep)',
      'Coordinated Port Blair flights and inter-island ferry timings',
    ],
    idealStyles: ['Honeymoon', 'Family', 'Island Escape'],
    suggestedWindow: 'October to May',
    typicalDuration: '5 to 7 nights',
  },
  {
    slug: 'ladakh',
    name: 'Ladakh',
    country: 'India',
    region: 'India',
    subregion: 'India',
    lat: 34.1526,
    lng: 77.5771,
    preferredHub: 'delhi',
    tagline: 'High-altitude silence, sunlit monasteries, and sapphire mountain lakes.',
    shortDescription:
      'Leh’s historic valleys, Nubra’s silver dunes, Pangong Lake, and thoughtfully acclimatised Himalayan journeys.',
    image: assetPath('/assets/images/destinations/ladakh.jpg'),
    imageAlt: 'High-altitude Himalayan peaks and clear alpine lake in Ladakh',
    highlights: [
      'Leh palaces and riverside monasteries Thiksey & Hemis',
      'Khardung La pass descending into Nubra Valley',
      'Pangong Tso alpine waters with gradual acclimatisation pacing',
    ],
    idealStyles: ['Adventure', 'Scenic', 'Group'],
    suggestedWindow: 'May to September',
    typicalDuration: '6 to 8 nights',
  },
];

export const REGION_FILTERS: AtlasRegionFilter[] = [
  'All',
  'India',
  'Middle East',
  'Southeast Asia',
  'South & Central Asia',
];
