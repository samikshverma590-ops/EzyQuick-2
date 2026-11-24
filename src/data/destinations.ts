import { assetPath } from '@/lib/asset-path';

export interface Destination {
  slug: string;
  name: string;
  country: string;
  region: 'India' | 'International';
  subregion: string;
  coordinates: string;
  featuredOnHome: boolean;
  tagline: string;
  shortDescription: string;
  editorialIntro: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  experiences: { title: string; detail: string }[];
  planningInfo: {
    idealStyles: string[];
    suggestedWindow: string;
    typicalDuration: string;
    visaAdvisory: string;
  };
  specialNote?: string;
  relatedSlugs: string[];
}

export const DESTINATIONS: Destination[] = [
  // ================= INTERNATIONAL (10) =================
  {
    slug: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'International',
    subregion: 'Middle East',
    coordinates: '25.2048° N, 55.2708° E',
    featuredOnHome: true,
    tagline: 'Skyline ambition framed by desert quiet and Gulf coastlines.',
    shortDescription:
      'Our Gulf gateway—effortless for luxury family holidays, executive trips, winter sun escapes, and MICE gatherings.',
    editorialIntro:
      'Few cities shift as effortlessly between architectural grandeur, coastal leisure, and golden desert horizon as Dubai. With an EzyQuick office right in Dubai Silicon Oasis, we help families, couples, and corporate travellers pair smart hotel neighbourhoods, curated desert and marina experiences, flights, and organised UAE visa guidance into one clear itinerary.',
    image: assetPath('/images/destinations/dubai.jpg'),
    imageAlt: 'Dubai skyline and illuminated avenues at golden hour',
    highlights: [
      'Downtown skyline views, architectural landmarks, and waterfront promenades',
      'Private desert conservation drives and evening dune dining',
      'Palm & Jumeirah beachfront resorts tailored for families and couples',
      'Old Dubai heritage creeks, spice souks, and cultural museums',
    ],
    experiences: [
      { title: 'Family & multi-generational stays', detail: 'Spacious beachfront resorts, theme-park access, and seamless private airport transfers.' },
      { title: 'Desert & architectural contrast', detail: 'Balance contemporary galleries and marina dining with an unhurried sunset desert escape.' },
      { title: 'Executive & MICE hospitality', detail: 'Well-connected business hotels, conference venues, and group logistics supported locally.' },
    ],
    planningInfo: {
      idealStyles: ['Family', 'Luxury', 'Honeymoon', 'Corporate & MICE'],
      suggestedWindow: 'October to April for mild coastal weather; year-round for indoor attractions and business',
      typicalDuration: '4 to 6 nights (often paired with Abu Dhabi)',
      visaAdvisory: 'UAE entry requirements vary by nationality; we provide clear tourist and business visa documentation guidance.',
    },
    specialNote: 'Ask our team about the proposed "Free Dubai Visa for a Kid" family promotion and its current eligibility terms.',
    relatedSlugs: ['abu-dhabi', 'singapore', 'bali'],
  },
  {
    slug: 'abu-dhabi',
    name: 'Abu Dhabi',
    country: 'United Arab Emirates',
    region: 'International',
    subregion: 'Middle East',
    coordinates: '24.4539° N, 54.3773° E',
    featuredOnHome: true,
    tagline: 'Cultural serenity, luminous domes, and calm island resorts.',
    shortDescription:
      'Saadiyat’s museums, Yas Island family adventures, tranquil mangrove coastlines, and architectural beauty.',
    editorialIntro:
      'Abu Dhabi moves with a gentler, deeply cultural cadence. From the luminous marble courtyards of Sheikh Zayed Grand Mosque and Saadiyat Island’s art district to tranquil island beaches and family attractions on Yas Island, it shines both as a standalone retreat and as a refined companion to Dubai.',
    image: assetPath('/images/destinations/abu-dhabi.jpg'),
    imageAlt: 'Sheikh Zayed Grand Mosque in Abu Dhabi reflected in dusk water',
    highlights: [
      'Sheikh Zayed Grand Mosque and Saadiyat Cultural District',
      'Saadiyat Island white-sand beachfront resorts',
      'Yas Island family entertainment and waterfront marinas',
      'Empty Quarter desert sanctuaries south of the capital',
    ],
    experiences: [
      { title: 'Art, architecture & quiet beaches', detail: 'Combine museum mornings on Saadiyat with calm coastal afternoons.' },
      { title: 'Twin-emirate itineraries', detail: 'Effortlessly pair Abu Dhabi with Dubai via private chauffeur transfers.' },
      { title: 'Family island holidays', detail: 'Curate Yas Island stays with balanced pacing for children and adults.' },
    ],
    planningInfo: {
      idealStyles: ['Luxury', 'Family', 'Culture', 'Corporate'],
      suggestedWindow: 'October to April for pleasant outdoor and desert temperatures',
      typicalDuration: '3 to 5 nights standalone, or 2 nights paired with Dubai',
      visaAdvisory: 'UAE visa rules depend on passport nationality; EzyQuick provides organised documentation checklists.',
    },
    relatedSlugs: ['dubai', 'almaty', 'singapore'],
  },
  {
    slug: 'phu-quoc',
    name: 'Phu Quoc',
    country: 'Vietnam',
    region: 'International',
    subregion: 'Southeast Asia',
    coordinates: '10.2899° N, 103.9840° E',
    featuredOnHome: true,
    tagline: 'Emerald bays, tropical island quiet, and sunlit coastal horizons.',
    shortDescription:
      'Vietnam’s premier southern island—unhurried resorts, sunset coastlines, night markets, and island-hopping.',
    editorialIntro:
      'Set in the warm waters off Vietnam’s southern coast, Phu Quoc combines lush national-park hills with sweeping sunset beaches and contemporary oceanfront resorts. Whether visited as a restful island escape or paired with mainland Vietnam, it offers rare tropical calm with approachable flight routing from India and the Gulf.',
    image: assetPath('/images/destinations/phu-quoc.jpg'),
    imageAlt: 'Emerald coastal waters and dramatic Vietnamese seascape',
    highlights: [
      'Sunset beachfront resorts along Long Beach and Khem Beach',
      'Southern archipelago boat excursions and clear-water snorkelling',
      'Scenic coastal cable-car crossings and vibrant night markets',
      'National park forested trails and quiet fishing villages',
    ],
    experiences: [
      { title: 'Honeymoon & barefoot luxury', detail: 'Private pool villas and serene oceanfront sunsets designed for unhurried rest.' },
      { title: 'Family tropical escapes', detail: 'Resorts with calm waters, island cable-car views, and kid-friendly sightseeing.' },
      { title: 'Vietnam multi-stop pairing', detail: 'Easily combine Phu Quoc with Ho Chi Minh City or Hanoi in one custom plan.' },
    ],
    planningInfo: {
      idealStyles: ['Honeymoon', 'Family', 'Luxury', 'Island Escape'],
      suggestedWindow: 'November to April for dry skies and calm seas',
      typicalDuration: '4 to 6 nights (or 7–9 nights combined with mainland Vietnam)',
      visaAdvisory: 'Entry and visa-exemption rules depend on routing and passport nationality; we share up-to-date guidance before booking.',
    },
    relatedSlugs: ['phuket', 'krabi', 'bali'],
  },
  {
    slug: 'phuket',
    name: 'Phuket',
    country: 'Thailand',
    region: 'International',
    subregion: 'Southeast Asia',
    coordinates: '7.8804° N, 98.3923° E',
    featuredOnHome: true,
    tagline: 'Andaman coves, limestone horizons, and vibrant island hospitality.',
    shortDescription:
      'Thailand’s iconic island gateway—cliffside resorts, Andaman boat days, Old Town heritage, and sunset beaches.',
    editorialIntro:
      'Phuket rewards travellers who look beyond the obvious. Pair serene west-coast bay resorts with long-tail explorations across Phang Nga’s limestone karsts, pastel Sino-Portuguese shophouses in Old Phuket Town, and world-class hospitality for families, groups, and couples alike.',
    image: assetPath('/images/destinations/phuket.jpg'),
    imageAlt: 'Turquoise Andaman bay and forested coastline in Phuket, Thailand',
    highlights: [
      'Andaman island-hopping across Phi Phi and Phang Nga Bay',
      'Quiet coves like Kata Noi, Kamala, and Bang Tao alongside lively beaches',
      'Historic Old Phuket Town architecture and culinary strolls',
      'Cliffside sunset lounges and restorative Thai wellness spas',
    ],
    experiences: [
      { title: 'Phuket & Krabi dual-coast journey', detail: 'Pair Phuket’s resort variety with Krabi’s dramatic limestone sanctuaries.' },
      { title: 'Group & milestone celebrations', detail: 'Coordinated villas, private boat charters, and smooth airport logistics.' },
      { title: 'Family coastal escapes', detail: 'Carefully matched beachfront stays with gentle sightseeing days.' },
    ],
    planningInfo: {
      idealStyles: ['Family', 'Honeymoon', 'Group', 'Luxury'],
      suggestedWindow: 'November to April for calm Andaman Sea conditions',
      typicalDuration: '4 to 6 nights (ideal combined with Krabi)',
      visaAdvisory: 'Thailand entry policies vary by nationality and travel dates; our desk provides current documentation guidance.',
    },
    relatedSlugs: ['krabi', 'phu-quoc', 'bali'],
  },
  {
    slug: 'krabi',
    name: 'Krabi',
    country: 'Thailand',
    region: 'International',
    subregion: 'Southeast Asia',
    coordinates: '8.0863° N, 98.9063° E',
    featuredOnHome: false,
    tagline: 'Towering limestone cliffs rising straight from emerald sea.',
    shortDescription:
      'Railay’s dramatic sea cliffs, quiet tropical lagoons, Four Islands boat trails, and laid-back coastal stays.',
    editorialIntro:
      'More intimate and visually dramatic than busier coastal hubs, Krabi is defined by sheer limestone towers, turquoise coves reachable only by boat, and quiet sunset beaches. It pairs naturally with Phuket or stands alone as a restorative Andaman retreat.',
    image: assetPath('/images/destinations/krabi.jpg'),
    imageAlt: 'Traditional long-tail boat framed by Krabi limestone cliffs and clear water',
    highlights: [
      'Railay Peninsula and Phra Nang Cave Beach framed by vertical karst cliffs',
      'Hong Islands and Four Islands turquoise lagoon excursions',
      'Quiet resort stretches in Tubkaek and Klong Muang',
      'Emerald Pool rainforest trails and coastal sunset viewpoints',
    ],
    experiences: [
      { title: 'Honeymoon coastal seclusion', detail: 'Boutique beachfront sanctuaries facing dramatic offshore karst silhouettes.' },
      { title: 'Soft adventure on water', detail: 'Private boat days, sea kayaking through mangroves, and scenic coastal viewpoints.' },
    ],
    planningInfo: {
      idealStyles: ['Honeymoon', 'Adventure', 'Family', 'Relaxation'],
      suggestedWindow: 'November to April for sunny skies and clear water visibility',
      typicalDuration: '3 to 5 nights (often combined with Phuket)',
      visaAdvisory: 'Thailand entry guidelines vary by nationality; EzyQuick assists with clear pre-departure checklists.',
    },
    relatedSlugs: ['phuket', 'phu-quoc', 'andaman-nicobar'],
  },
  {
    slug: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'International',
    subregion: 'Southeast Asia',
    coordinates: '8.4095° S, 115.1889° E',
    featuredOnHome: true,
    tagline: 'Terraced jungle mist, cliffside temples, and deeply restorative craft.',
    shortDescription:
      'Ubud’s emerald valleys, Uluwatu ocean cliffs, Seminyak dining, and private pool villas crafted for slow days.',
    editorialIntro:
      'Bali’s magnetism comes from contrast: misty river valleys and artisan villages in Ubud give way to dramatic Indian Ocean surf cliffs in Uluwatu and breezy beachfront neighbourhoods along the coast. We structure Bali itineraries cleanly by region so you spend your time experiencing the island rather than sitting in cross-island traffic.',
    image: assetPath('/images/destinations/bali.jpg'),
    imageAlt: 'Lush Balinese terraced hills and tranquil tropical landscape',
    highlights: [
      'Ubud jungle villas, rice terraces, and Balinese craft studios',
      'Uluwatu clifftop temples and sunset ocean panoramas',
      'Nusa Dua and Jimbaran calm coastal family resorts',
      'Nusa Penida coastal viewpoints and restorative spa traditions',
    ],
    experiences: [
      { title: 'Two-chapter honeymoon stays', detail: 'Split your journey between an Ubud rainforest villa and an oceanfront sanctuary.' },
      { title: 'Multi-generational family villas', detail: 'Private multi-bedroom stays paired with vetted local drivers and flexible daily pacing.' },
      { title: 'Wellness & creative retreats', detail: 'Thoughtfully chosen hideaways focused on calm surroundings and warm hospitality.' },
    ],
    planningInfo: {
      idealStyles: ['Honeymoon', 'Luxury', 'Family', 'Wellness'],
      suggestedWindow: 'April to October for dry sunny days; shoulder months offer lush greenery',
      typicalDuration: '5 to 8 nights across two distinct regions',
      visaAdvisory: 'Indonesian entry and e-VOA guidance provided clearly according to your passport nationality.',
    },
    relatedSlugs: ['phu-quoc', 'phuket', 'sri-lanka'],
  },
  {
    slug: 'sri-lanka',
    name: 'Sri Lanka',
    country: 'Sri Lanka',
    region: 'International',
    subregion: 'South Asia',
    coordinates: '7.8731° N, 80.7718° E',
    featuredOnHome: false,
    tagline: 'Highland tea country, ancient rock fortresses, and golden southern shores.',
    shortDescription:
      'Compact, extraordinarily diverse—combining misty hill trains, wildlife national parks, Galle Fort, and beach stays.',
    editorialIntro:
      'Few islands pack so many worlds into effortless driving distances. Within a single week in Sri Lanka, you can climb misty tea estates in Ella and Nuwara Eliya, experience elephant-rich national parks, stroll the Dutch-era ramparts of Galle Fort, and unwind along the southern Indian Ocean coast.',
    image: assetPath('/images/destinations/sri-lanka.jpg'),
    imageAlt: 'Misty highland hills and iconic railway viaduct in Sri Lanka',
    highlights: [
      'Cultural Triangle landmarks including Sigiriya and Kandy',
      'Scenic highland hill-country estates in Nuwara Eliya and Ella',
      'Yala and Udawalawe wildlife safaris',
      'Historic Galle Fort and golden southern coastal retreats in Bentota & Mirissa',
    ],
    experiences: [
      { title: 'Private chauffeur-guided circuits', detail: 'Travel comfortably from highlands to coastline at your own unhurried pace.' },
      { title: 'Family nature & heritage escapes', detail: 'Blend gentle wildlife encounters, train journeys, and calm beach days.' },
    ],
    planningInfo: {
      idealStyles: ['Family', 'Honeymoon', 'Culture', 'Nature'],
      suggestedWindow: 'December to April (south & west coasts); May to September (east coast & cultural heartland)',
      typicalDuration: '5 to 8 nights',
      visaAdvisory: 'Sri Lanka ETA / entry requirements guided cleanly prior to departure.',
    },
    relatedSlugs: ['kerala', 'bali', 'malaysia'],
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'International',
    subregion: 'Southeast Asia',
    coordinates: '1.3521° N, 103.8198° E',
    featuredOnHome: false,
    tagline: 'Botanical architecture, Michelin street craft, and effortless urban elegance.',
    shortDescription:
      'A crisp, luminous city-state uniting futuristic gardens, heritage quarters, family attractions, and executive ease.',
    editorialIntro:
      'Singapore turns urban travel into pure ease. Architectural cloud-forest domes, Marina Bay waterfront walks, Sentosa resort islands, and vibrant Peranakan and hawker culinary quarters sit minutes apart—making Singapore equally compelling for short family breaks, luxury stopovers, and international corporate conferences.',
    image: assetPath('/images/destinations/singapore.jpg'),
    imageAlt: 'Singapore Marina skyline and botanical gardens at twilight',
    highlights: [
      'Gardens by the Bay conservatories and Marina Bay skyline',
      'Sentosa Island coastal resorts and family attractions',
      'Historic heritage districts of Kampong Glam, Chinatown, and Joo Chiat',
      'World-class convention hotels and seamless transit infrastructure',
    ],
    experiences: [
      { title: 'Family city-and-island breaks', detail: 'Pair Marina Bay stays with Sentosa leisure days and guided neighbourhood walks.' },
      { title: 'Twin-centre Southeast Asia trips', detail: 'Combine Singapore seamlessly with Malaysia or Bali.' },
    ],
    planningInfo: {
      idealStyles: ['Family', 'Corporate & MICE', 'Luxury', 'City Break'],
      suggestedWindow: 'Year-round tropical destination',
      typicalDuration: '3 to 5 nights',
      visaAdvisory: 'Singapore visa documentation guidance provided well ahead of departure dates.',
    },
    relatedSlugs: ['malaysia', 'dubai', 'bali'],
  },
  {
    slug: 'malaysia',
    name: 'Malaysia',
    country: 'Malaysia',
    region: 'International',
    subregion: 'Southeast Asia',
    coordinates: '3.1390° N, 101.6869° E',
    featuredOnHome: false,
    tagline: 'Towering city skylines, cool tea highlands, and emerald island archipelagos.',
    shortDescription:
      'Kuala Lumpur’s vibrant energy paired with Langkawi beaches, Penang heritage cuisine, and misty highland retreats.',
    editorialIntro:
      'Malaysia offers remarkable variety within short flights from India and the UAE. Start beneath Kuala Lumpur’s iconic skyline, wander George Town’s UNESCO-listed heritage lanes in Penang, or unwind among ancient rainforests and calm coves on Langkawi.',
    image: assetPath('/images/destinations/malaysia.jpg'),
    imageAlt: 'Kuala Lumpur architectural skyline glowing at dusk in Malaysia',
    highlights: [
      'Kuala Lumpur skyline architecture, dining, and shopping districts',
      'Langkawi rainforest resorts, mangroves, and Andaman coves',
      'Penang colonial heritage quarters and celebrated street food',
      'Cameron Highlands and Genting cool-climate escapes',
    ],
    experiences: [
      { title: 'City + island family itineraries', detail: 'Combine Kuala Lumpur’s energy with relaxed coastal nights in Langkawi.' },
      { title: 'Corporate & incentive programmes', detail: 'Strong business hospitality paired with varied team sightseeing options.' },
    ],
    planningInfo: {
      idealStyles: ['Family', 'Group', 'Corporate', 'City & Beach'],
      suggestedWindow: 'November to April for west-coast islands (Langkawi, Penang); year-round for Kuala Lumpur',
      typicalDuration: '4 to 7 nights',
      visaAdvisory: 'Malaysia digital arrival and entry requirements guided according to current passport rules.',
    },
    relatedSlugs: ['singapore', 'phuket', 'bali'],
  },
  {
    slug: 'almaty',
    name: 'Almaty',
    country: 'Kazakhstan',
    region: 'International',
    subregion: 'Central Asia',
    coordinates: '43.2220° N, 76.8512° E',
    featuredOnHome: false,
    tagline: 'Snow-crowned Tien Shan peaks rising directly above leafy boulevards.',
    shortDescription:
      'A fresh, close-range alpine escape—mountain lakes, ski slopes, dramatic canyons, and lively café culture.',
    editorialIntro:
      'Framed by the soaring snow-dusted Tien Shan mountains, Almaty feels refreshingly unexpected yet remarkably accessible on short direct flights from India and Dubai. Within an hour of the city’s tree-lined avenues and vibrant culinary scene lie turquoise alpine lakes, ski ridges at Shymbulak, and vast red-rock canyons.',
    image: assetPath('/images/destinations/almaty.jpg'),
    imageAlt: 'Alpine mountain lake and snow-dusted peaks near Almaty, Kazakhstan',
    highlights: [
      'Shymbulak mountain resort and Medeu high-altitude valley',
      'Big Almaty Lake, Kolsai Lakes, and Kaindy’s alpine landscapes',
      'Charyn Canyon dramatic desert-rock formations',
      'Almaty’s leafy boulevards, Green Bazaar, and contemporary cafés',
    ],
    experiences: [
      { title: 'Short-haul alpine breaks', detail: 'Ideal 4-to-5-night mountain getaway without long-haul flight fatigue.' },
      { title: 'Four-season visual contrast', detail: 'Snow sports in winter, wildflowers and crisp lake hikes in summer, golden valleys in autumn.' },
    ],
    planningInfo: {
      idealStyles: ['Adventure', 'Family', 'Group', 'Scenic Escape'],
      suggestedWindow: 'May to October for alpine lakes & canyons; December to March for snow and Shymbulak',
      typicalDuration: '4 to 6 nights',
      visaAdvisory: 'Kazakhstan entry rules vary by nationality; we verify current guidance before confirming flights.',
    },
    relatedSlugs: ['ladakh', 'dubai', 'abu-dhabi'],
  },

  // ================= INDIA (4) =================
  {
    slug: 'kerala',
    name: 'Kerala',
    country: 'India',
    region: 'India',
    subregion: 'South India',
    coordinates: '9.4981° N, 76.3388° E',
    featuredOnHome: true,
    tagline: 'Emerald backwaters, misty tea slopes, and coastal stillness.',
    shortDescription:
      'Alleppey waterways, Munnar high ranges, Fort Kochi heritage, and restorative coastal sanctuaries.',
    editorialIntro:
      'Kerala slows the clock effortlessly. Drift past palm-lined canals aboard a private Alleppey houseboat, wake to cool mist over Munnar’s rolling tea gardens, wander Fort Kochi’s spice-trade lanes, and conclude beside the Arabian Sea—all arranged with trusted local drivers and handpicked heritage or boutique stays.',
    image: assetPath('/images/destinations/kerala.jpg'),
    imageAlt: 'Tranquil palm-fringed Kerala backwaters under soft golden light',
    highlights: [
      'Alleppey and Kumarakom serene backwater cruises and lakeside resorts',
      'Munnar tea estates and cool Western Ghats viewpoints',
      'Fort Kochi historic architecture, art cafés, and harbour evenings',
      'Kovalam, Varkala, and Marari restorative coastal stays',
    ],
    experiences: [
      { title: 'Honeymoons & slow retreats', detail: 'Private pool villas in Kumarakom paired with boutique tea-estate stays.' },
      { title: 'Multi-generational family circuits', detail: 'Gentle driving distances, comfortable hotels, and flexible sightseeing.' },
    ],
    planningInfo: {
      idealStyles: ['Honeymoon', 'Family', 'Wellness', 'Luxury'],
      suggestedWindow: 'September to March for pleasant dry weather; June to August for lush monsoon retreats',
      typicalDuration: '5 to 7 nights',
      visaAdvisory: 'Domestic Indian travel (international visitors require valid Indian entry documentation).',
    },
    relatedSlugs: ['goa', 'sri-lanka', 'andaman-nicobar'],
  },
  {
    slug: 'goa',
    name: 'Goa',
    country: 'India',
    region: 'India',
    subregion: 'West India',
    coordinates: '15.2993° N, 74.1240° E',
    featuredOnHome: false,
    tagline: 'Sun-warmed beaches, Indo-Portuguese heritage, and effortless coastal rhythm.',
    shortDescription:
      'Serene South Goa resorts, vibrant North Goa dining, Fontainhas heritage walks, and corporate coastal offsites.',
    editorialIntro:
      'Goa is whatever pace you choose to set. South Goa invites quiet beachfront resort mornings beneath swaying palms, while North Goa blends boutique villas, creative dining, and heritage Latin Quarter walks in Fontainhas. We match the neighbourhood and property style cleanly to your group.',
    image: assetPath('/images/destinations/goa.jpg'),
    imageAlt: 'Golden shoreline and palm trees along the coast of Goa, India',
    highlights: [
      'Wide, serene beachfront resorts across South Goa',
      'Fontainhas heritage quarter, churches, and riverside sunsets',
      'Boutique culinary and design-forward stays in North Goa',
      'Well-equipped beachfront venues for leadership offsites and celebrations',
    ],
    experiences: [
      { title: 'Weekend & extended family escapes', detail: 'Direct flight coordination and beachfront stays tailored for relaxation.' },
      { title: 'Corporate offsites & MICE', detail: 'Conference-ready resorts with coordinated group arrivals and transfers.' },
    ],
    planningInfo: {
      idealStyles: ['Family', 'Luxury', 'Group', 'Corporate Offsite'],
      suggestedWindow: 'November to February for sunny beach season; monsoon months for green quiet stays',
      typicalDuration: '3 to 5 nights',
      visaAdvisory: 'Domestic Indian travel.',
    },
    relatedSlugs: ['kerala', 'andaman-nicobar', 'phuket'],
  },
  {
    slug: 'andaman-nicobar',
    name: 'Andaman & Nicobar',
    country: 'India',
    region: 'India',
    subregion: 'Bay of Bengal',
    coordinates: '11.7401° N, 92.6586° E',
    featuredOnHome: false,
    tagline: 'White coral sands, translucent reefs, and unhurried island horizons.',
    shortDescription:
      'Swaraj Dweep (Havelock), Shaheed Dweep (Neil), luminous reef waters, and peaceful forest-fringed shores.',
    editorialIntro:
      'Far out in the clear waters of the Bay of Bengal, the Andaman Islands offer India’s purest tropical coastline. From Radhanagar’s luminous sunset crescent on Havelock to quiet coral coves on Neil Island, we coordinate flights into Port Blair, inter-island ferry timings, and beachfront resorts so every connection stays effortless.',
    image: assetPath('/images/destinations/andaman-nicobar.jpg'),
    imageAlt: 'Crystal-clear turquoise tropical island shoreline',
    highlights: [
      'Radhanagar Beach and serene resort stays on Havelock (Swaraj Dweep)',
      'Unspoiled coral bays and slow island rhythms on Neil (Shaheed Dweep)',
      'Guided reef snorkelling and clear-water diving excursions',
      'Historic Port Blair landmarks and smooth inter-island ferry logistics',
    ],
    experiences: [
      { title: 'Honeymoon island sanctuaries', detail: 'Intimate beachfront cottages with seamless private transfers and ferry scheduling.' },
      { title: 'Family marine exploration', detail: 'Calm swimming beaches, glass-bottom boat outings, and relaxed daily itineraries.' },
    ],
    planningInfo: {
      idealStyles: ['Honeymoon', 'Family', 'Island Escape', 'Adventure'],
      suggestedWindow: 'October to May for calm seas and clear underwater visibility',
      typicalDuration: '5 to 7 nights across Port Blair, Havelock, and Neil',
      visaAdvisory: 'Domestic Indian travel; local island ferry tickets and permits coordinated in sequence.',
    },
    relatedSlugs: ['kerala', 'goa', 'krabi'],
  },
  {
    slug: 'ladakh',
    name: 'Ladakh',
    country: 'India',
    region: 'India',
    subregion: 'Himalayan India',
    coordinates: '34.1526° N, 77.5771° E',
    featuredOnHome: true,
    tagline: 'High-altitude silence, sunlit monasteries, and sapphire mountain lakes.',
    shortDescription:
      'Leh’s historic valleys, Nubra’s silver dunes, Pangong Lake, and thoughtfully acclimatised Himalayan journeys.',
    editorialIntro:
      'Ladakh is a landscape of monumental scale and stillness. Because high-altitude travel rewards smart pacing, EzyQuick structures Ladakh itineraries with proper acclimatisation in Leh, reliable local vehicles, comfortable boutique camps and hotels, and realistic driving windows across Nubra Valley and Pangong Lake.',
    image: assetPath('/images/destinations/ladakh.jpg'),
    imageAlt: 'High-altitude Himalayan peaks and clear alpine lake in Ladakh',
    highlights: [
      'Leh historic palaces, markets, and riverside monasteries like Thiksey & Hemis',
      'Khardung La mountain pass descending into Nubra Valley’s dunes',
      'Pangong Tso’s ever-shifting cobalt and turquoise alpine waters',
      'Clear high-altitude night skies and boutique valley retreats',
    ],
    experiences: [
      { title: 'Sensibly paced Himalayan circuits', detail: 'Built around gradual acclimatisation so every traveller enjoys the altitude safely and comfortably.' },
      { title: 'Private overland photography journeys', detail: 'Dedicated local drivers, curated scenic stops, and comfortable valley stays.' },
    ],
    planningInfo: {
      idealStyles: ['Adventure', 'Scenic', 'Group', 'Photography'],
      suggestedWindow: 'May to September for open high passes and clear alpine lakes',
      typicalDuration: '6 to 8 nights including acclimatisation days in Leh',
      visaAdvisory: 'Domestic Indian travel; required inner-line valley permits coordinated as part of trip planning.',
    },
    relatedSlugs: ['almaty', 'kerala', 'goa'],
  },
];

export const FEATURED_HOME_DESTINATIONS = DESTINATIONS.filter((d) => d.featuredOnHome);
export const INDIA_DESTINATIONS = DESTINATIONS.filter((d) => d.region === 'India');
export const INTERNATIONAL_DESTINATIONS = DESTINATIONS.filter((d) => d.region === 'International');

export function getDestinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
