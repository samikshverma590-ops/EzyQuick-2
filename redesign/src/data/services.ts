import { assetPath } from '@/lib/asset-path';

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface TravelService {
  slug: string;
  index: string;
  category: 'Corporate & Institutional' | 'Leisure & Holidays' | 'Core Travel Support';
  shortLabel: string;
  name: string;
  headline: string;
  tagline: string;
  summary: string;
  editorialIntro: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  scope: string[];
  benefits: { title: string; detail: string }[];
  processSteps: { step: string; detail: string }[];
  transparencyNote?: string;
  faqs: ServiceFAQ[];
  relatedSlugs: string[];
}

export const SERVICES: TravelService[] = [
  {
    slug: 'corporate-travel',
    index: '01',
    category: 'Corporate & Institutional',
    shortLabel: 'Business',
    name: 'Corporate Travel',
    headline: 'Business travel coordinated with speed and clarity.',
    tagline: 'Centralised travel management for leadership teams, founders, and growing organisations.',
    summary:
      'Domestic and international executive trips, recurring business corridors, business-district stays, visa documentation checklists, and responsive schedule adjustments through one desk.',
    editorialIntro:
      'Corporate itineraries rarely stay static. EzyQuick supports companies, founders, and travel coordinators with structured air routing, well-located business hotels, airport transfers, and direct single-point communication across New Delhi, Dubai, and international hubs.',
    image: assetPath('/assets/images/services/corporate-travel.jpg'),
    imageAlt: 'Modern architectural corporate lounge for business travellers',
    ctaLabel: 'Discuss corporate travel',
    scope: [
      'Domestic and international corporate flight coordination',
      'Business-district hotel selection and flexible stay options',
      'Executive airport transfers and ground logistics',
      'Business visa documentation guidance and checklist support',
      'Multi-city itineraries for leadership and sales delegations',
      'Itinerary change and rescheduling assistance',
      'Group and off-site travel arrangements',
      'Dedicated advisor point of contact across Delhi and Dubai',
    ],
    benefits: [
      {
        title: 'Centralised coordination',
        detail: 'Consolidate flights, hotels, visas, and transfers with one responsive desk instead of managing disconnected bookings.',
      },
      {
        title: 'Aligned to company policy',
        detail: 'Clear itinerary options matched to your schedules, routing preferences, and travel class guidelines.',
      },
      {
        title: 'India and UAE corridor fluency',
        detail: 'Active offices in Ranjit Nagar, New Delhi and Dubai Silicon Oasis support both domestic Indian routes and Gulf/international trips.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Share your company travel profile, destinations, and upcoming dates.' },
      { step: '02', detail: 'Review tailored flight, hotel, and ground-coordination options.' },
      { step: '03', detail: 'Approve preferred itineraries and traveller details.' },
      { step: '04', detail: 'Receive organised confirmations and ongoing schedule support.' },
    ],
    faqs: [
      {
        question: 'Can EzyQuick handle both one-off executive trips and recurring company travel?',
        answer: 'Yes. We assist both one-time leadership trips and organisations requiring recurring weekly or monthly domestic and international travel coordination.',
      },
      {
        question: 'Do you coordinate visas and hotels alongside business flights?',
        answer: 'Yes. Corporate travel enquiries can combine air tickets, hotel bookings, business visa documentation guidance, and travel insurance options in one brief.',
      },
      {
        question: 'How quickly can we start a corporate enquiry?',
        answer: 'Use our Plan Your Journey page with Corporate Travel selected, email info@ezyquick.in, or call our New Delhi or Dubai office directly.',
      },
    ],
    relatedSlugs: ['mice-services', 'air-tickets', 'hotel-bookings'],
  },
  {
    slug: 'medical-travel',
    index: '02',
    category: 'Corporate & Institutional',
    shortLabel: 'Care',
    name: 'Medical Travel',
    headline: 'Practical travel coordination when health comes first.',
    tagline: 'Flight, accommodation, and local logistics support for patients and accompanying family members.',
    summary:
      'Dedicated travel arrangements for patients and attendants travelling domestically or internationally for healthcare, covering flights, hospital-proximate stays, airport transfers, and medical visa documentation checklists.',
    editorialIntro:
      'Travelling for healthcare already places heavy demands on patients and families. EzyQuick focuses strictly on practical, attentive travel logistics: convenient flight connections, comfortable stays near your preferred hospital area, reliable airport pick-ups, and clear checklists for medical travel documentation.',
    image: assetPath('/assets/images/services/medical-travel.jpg'),
    imageAlt: 'Calm medical consultation and healthcare coordination setting',
    ctaLabel: 'Request medical travel support',
    scope: [
      'Patient and accompanying family flight coordination',
      'Hospital-proximate hotel and serviced-stay arrangements',
      'Medical visa documentation guidance and checklist support',
      'Airport transfer and local ground transport coordination',
      'Flexible date-change assistance when recovery timelines shift',
      'Attendant and extended-stay accommodation planning',
      'Clear pre-departure travel communication for families',
    ],
    benefits: [
      {
        title: 'Patient and attendant focus',
        detail: 'Routing, layover comfort, and proximity to care centres are planned around the traveller and accompanying family.',
      },
      {
        title: 'Calm, single-desk communication',
        detail: 'One dedicated travel advisor coordinates tickets, nearby accommodation, and local transfers without unnecessary friction.',
      },
      {
        title: 'Privacy-first enquiry handling',
        detail: 'We request only broad travel preferences in our public enquiry form. Never submit clinical records or passport numbers online.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Share your departure city, destination, broad timing, and number of attendants.' },
      { step: '02', detail: 'Discuss preferred hospital area and accommodation comfort requirements.' },
      { step: '03', detail: 'Review suitable flight, stay, and airport transfer options.' },
      { step: '04', detail: 'Coordinate departure and local logistics with our travel desk.' },
    ],
    transparencyNote:
      'Important notice: EzyQuick provides travel, accommodation, visa documentation guidance, and ground-logistics coordination only. EzyQuick does not provide medical advice, clinical diagnosis, hospital treatment, or guarantees regarding medical outcomes.',
    faqs: [
      {
        question: 'Does EzyQuick provide medical advice or choose medical treatments?',
        answer: 'No. EzyQuick is a travel-services company. We provide travel, accommodation, visa documentation guidance, and local transport coordination; all clinical decisions remain between the patient and their healthcare providers.',
      },
      {
        question: 'Can you arrange accommodation for family members travelling with a patient?',
        answer: 'Yes. We help explore hotels and longer-stay accommodation options near your preferred healthcare area for both patients and attendants.',
      },
      {
        question: 'Should I attach medical reports or passport copies to the enquiry form?',
        answer: 'No. For your privacy, share only broad travel preferences in our public form. Never enter passport numbers or clinical medical records online.',
      },
    ],
    relatedSlugs: ['visa-services', 'hotel-bookings', 'air-tickets'],
  },
  {
    slug: 'leisure-travel',
    index: '03',
    category: 'Leisure & Holidays',
    shortLabel: 'Holidays',
    name: 'Leisure Travel',
    headline: 'Custom holidays shaped around how you like to travel.',
    tagline: 'Tailored domestic and international itineraries across India, the UAE, Southeast Asia, and Central Asia.',
    summary:
      'Family holidays, honeymoons, group tours, mountain and coastal escapes, and custom itineraries across Kerala, Goa, Andaman, Ladakh, Dubai, Abu Dhabi, Phuket, Krabi, Phu Quoc, Bali, Sri Lanka, Singapore, Malaysia, and Almaty.',
    editorialIntro:
      'A memorable holiday starts with an itinerary paced for your companions, not a rigid template. Whether you are planning a multi-generational family trip to Dubai, a honeymoon in Kerala or Bali, an island escape to Phu Quoc or Krabi, or an alpine journey through Ladakh or Almaty, we assemble flights, stays, sightseeing, and visa guidance into one clear plan.',
    image: assetPath('/assets/images/services/leisure-travel.jpg'),
    imageAlt: 'Sunlit coastal shoreline for bespoke leisure travel',
    ctaLabel: 'Plan my holiday',
    scope: [
      'Family holidays tailored across age groups',
      'Honeymoon and private coastal or hill escapes',
      'Curated group tours and milestone celebrations',
      'Mountain and island adventure itineraries',
      'Boutique resort and city hotel curation',
      'Private sightseeing and airport transfers',
      'Combined flight, stay, transfer, and visa coordination',
    ],
    benefits: [
      {
        title: 'Tailored to your pace',
        detail: 'Every itinerary is structured around your dates, companions, preferred comfort level, and travel style.',
      },
      {
        title: '14 verified destination specialities',
        detail: 'Explore Kerala, Goa, Andaman & Nicobar, and Ladakh in India alongside Dubai, Abu Dhabi, Phuket, Krabi, Phu Quoc, Bali, Sri Lanka, Singapore, Malaysia, and Almaty.',
      },
      {
        title: 'Single-contact clarity',
        detail: 'Flights, handpicked stays, local transfers, and documentation timelines stay synchronised under one advisor.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Tell us your preferred destinations, travel style, and group size.' },
      { step: '02', detail: 'Share target dates, departure city, and approximate comfort range.' },
      { step: '03', detail: 'Review a custom suggested itinerary and transparent quotation.' },
      { step: '04', detail: 'Confirm your preferred arrangements and prepare to depart.' },
    ],
    transparencyNote:
      'All destinations and holiday ideas on this site are custom-planned upon enquiry. Availability and quotations are checked specifically for your travel dates before booking.',
    faqs: [
      {
        question: 'Are your leisure itineraries fixed group packages or customisable?',
        answer: 'We specialise in custom itineraries tailored to your dates, travellers, and holiday style across family trips, honeymoons, group tours, and scenic escapes.',
      },
      {
        question: 'Can you include flights, hotels, sightseeing, and visa guidance together?',
        answer: 'Yes. We coordinate the full travel chain so arrival times, hotel check-ins, transfers, and visa timelines align smoothly.',
      },
      {
        question: 'Which domestic and international destinations do you plan most frequently?',
        answer: 'In India we feature Kerala, Goa, Andaman & Nicobar, and Ladakh. Internationally we feature Dubai, Abu Dhabi, Phuket, Krabi, Phu Quoc, Bali, Sri Lanka, Singapore, Malaysia, and Almaty.',
      },
    ],
    relatedSlugs: ['hotel-bookings', 'visa-services', 'air-tickets'],
  },
  {
    slug: 'visa-services',
    index: '04',
    category: 'Core Travel Support',
    shortLabel: 'Documents',
    name: 'Visa Services',
    headline: 'Structured visa documentation guidance at every step.',
    tagline: 'Country-specific checklists, application form review, and appointment coordination for international travel.',
    summary:
      'Organised documentation support for tourist, business, transit, and family visit visas aligned with your flights, stays, and travel timeline.',
    editorialIntro:
      'International visa preparation is far calmer when every requirement is sequenced clearly in advance. EzyQuick guides travellers through category selection, country-specific document checklists, application form review, and appointment scheduling where applicable so submissions are thorough and well-prepared.',
    image: assetPath('/assets/images/services/visa-services.jpg'),
    imageAlt: 'International travel gateway and documentation preparation',
    ctaLabel: 'Request visa guidance',
    scope: [
      'Tourist visa documentation assistance',
      'Business visa application guidance',
      'Transit visa checklist support',
      'Family visit visa guidance',
      'Application form review and preparation guidance',
      'Country-specific supporting document checklists',
      'Appointment scheduling coordination where applicable',
    ],
    benefits: [
      {
        title: 'Clear, structured checklists',
        detail: 'Know exactly what supporting documents to assemble before starting your application.',
      },
      {
        title: 'Aligned with your travel dates',
        detail: 'Coordinate flight itineraries, hotel confirmations, and travel insurance options alongside your visa timeline.',
      },
      {
        title: 'Privacy-first handling',
        detail: 'We never ask for passport numbers or identity scans in our public web form.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Share your nationality, destination country, visa category, and expected travel window.' },
      { step: '02', detail: 'Receive guidance on the relevant documentation checklist for your travel purpose.' },
      { step: '03', detail: 'Prepare your application materials with structured form review.' },
      { step: '04', detail: 'Coordinate submission or appointment steps through the appropriate official channel.' },
    ],
    transparencyNote:
      'Important notice: EzyQuick provides visa documentation guidance and application assistance only. Visa approval, processing timelines, and entry decisions rest solely with the relevant embassy, consulate, or immigration authority and cannot be guaranteed. Never enter passport numbers into our public enquiry form.',
    faqs: [
      {
        question: 'Can EzyQuick guarantee visa approval?',
        answer: 'No travel agency can guarantee visa approval. Final visa decisions and processing timelines are made exclusively by the relevant embassy, consulate, or immigration authority. Our role is to help you prepare clear, complete documentation.',
      },
      {
        question: 'Should I type my passport number in the website enquiry form?',
        answer: 'No. Never submit passport numbers or identity scans through our public enquiry form. Our advisor will guide you on appropriate next steps once we respond.',
      },
    ],
    relatedSlugs: ['air-tickets', 'travel-insurance', 'leisure-travel'],
  },
  {
    slug: 'air-tickets',
    index: '05',
    category: 'Core Travel Support',
    shortLabel: 'Flights',
    name: 'Air Tickets',
    headline: 'Flight routing shaped around your real schedule.',
    tagline: 'Domestic and international flight booking support for individuals, families, corporate teams, and groups.',
    summary:
      'One-way, return, multi-city, executive cabin, and group air ticket coordination with clear fare rules and quotations reviewed before ticketing.',
    editorialIntro:
      'The right flight balances schedule reliability, sensible connection buffers, baggage allowances, and fare flexibility. Instead of sorting through dozens of restrictive fare rules alone, share your route and cabin preference with EzyQuick and review curated routing options directly.',
    image: assetPath('/assets/images/services/air-tickets.jpg'),
    imageAlt: 'Commercial aircraft wing gliding above sunlit clouds',
    ctaLabel: 'Request a flight quote',
    scope: [
      'Domestic flight reservations across India',
      'International flight bookings worldwide',
      'One-way and round-trip air tickets',
      'Multi-city and stopover itinerary routing',
      'Group and family flight coordination',
      'Executive and corporate cabin bookings',
      'Date-change, rerouting, and cancellation assistance',
    ],
    benefits: [
      {
        title: 'Human routing judgement',
        detail: 'We weigh layover comfort, baggage rules, and schedule timing rather than surfacing stripped-down fares with hidden trade-offs.',
      },
      {
        title: 'Clear quotations before ticketing',
        detail: 'Review full route timing and fare conditions before approving any ticket issuance.',
      },
      {
        title: 'Direct support when plans change',
        detail: 'If a meeting extends or travel dates shift, reach the same advisor desk to explore rebooking options.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Share departure city, destination, dates, and trip type (one-way, return, or multi-city).' },
      { step: '02', detail: 'Confirm traveller count, cabin preference, and timing priorities.' },
      { step: '03', detail: 'Review curated routing options and clear fare quotations.' },
      { step: '04', detail: 'Approve your preferred flight itinerary for ticketing.' },
    ],
    transparencyNote:
      'Flight availability and airline fares change continuously until tickets are issued. We do not display speculative live fares on this website; all quotations are checked live at the time of enquiry.',
    faqs: [
      {
        question: 'Can you coordinate multi-city international routes?',
        answer: 'Yes. Multi-city and stopover itineraries combining India, the UAE, and Southeast or Central Asia are a core part of our air desk.',
      },
      {
        question: 'Why are live ticket prices not listed on the page?',
        answer: 'Airfares fluctuate dynamically by seat inventory and timing. Checking routes directly against your exact dates ensures you receive accurate current options.',
      },
    ],
    relatedSlugs: ['hotel-bookings', 'visa-services', 'corporate-travel'],
  },
  {
    slug: 'hotel-bookings',
    index: '06',
    category: 'Core Travel Support',
    shortLabel: 'Stays',
    name: 'Hotel Bookings',
    headline: 'Handpicked stays chosen for location and comfort.',
    tagline: 'Domestic and international accommodation coordination across city hotels, boutique properties, and resorts.',
    summary:
      'Business hotels, beachfront resorts, family stays, group room blocks, and extended-stay accommodation matched to your itinerary and comfort range.',
    editorialIntro:
      'Where you stay defines the rhythm of your trip. Whether you need a quiet business hotel near a conference district, a beachfront resort for a family holiday, or a comfortable extended stay during a medical visit, we narrow the field to properties that fit your actual priorities.',
    image: assetPath('/assets/images/services/hotel-bookings.jpg'),
    imageAlt: 'Refined architectural luxury hotel lobby and courtyard',
    ctaLabel: 'Find my stay',
    scope: [
      'Domestic hotel reservations across India',
      'International hotel and resort bookings',
      'Boutique and luxury resort curation',
      'Business-district executive hotels',
      'Family resorts and interconnected room requests',
      'Value-conscious 3-star and 4-star stays',
      'Group room blocks and corporate stay coordination',
      'Extended and long-stay accommodation arrangements',
    ],
    benefits: [
      {
        title: 'Matched to travel purpose',
        detail: 'Neighbourhood, room configuration, meal plans, and cancellation flexibility aligned with why you are travelling.',
      },
      {
        title: 'Synchronised with your flights',
        detail: 'Check-in timing, late arrivals, and airport transfers planned together.',
      },
      {
        title: 'Clear property comparisons',
        detail: 'Review curated stay recommendations and room categories before confirming.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Share your destination city, check-in/check-out dates, and room count.' },
      { step: '02', detail: 'Indicate preferred hotel category, neighbourhood, and approximate nightly range.' },
      { step: '03', detail: 'Review tailored stay recommendations suited to your group.' },
      { step: '04', detail: 'Confirm your preferred property and booking details.' },
    ],
    transparencyNote:
      'Room availability and nightly rates depend on travel dates and seasonal demand. We verify current options upon enquiry rather than quoting unverified live inventory.',
    faqs: [
      {
        question: 'Can I book a hotel without booking a full holiday package?',
        answer: 'Yes. You can enquire for standalone hotel reservations or pair them with air tickets, transfers, and sightseeing.',
      },
      {
        question: 'Do you coordinate room blocks for corporate teams or family groups?',
        answer: 'Yes. Share your room count, dates, and preferred area and we will coordinate suitable group stay options.',
      },
    ],
    relatedSlugs: ['air-tickets', 'leisure-travel', 'corporate-travel'],
  },
  {
    slug: 'forex-services',
    index: '07',
    category: 'Core Travel Support',
    shortLabel: 'Currency',
    name: 'Forex Services',
    headline: 'Foreign exchange assistance prepared before departure.',
    tagline: 'Practical currency preparation guidance for outbound leisure, business, and medical travellers.',
    summary:
      'Pre-departure foreign exchange assistance to help organise destination currency requirements alongside your international flights and itinerary.',
    editorialIntro:
      'Sorting foreign currency at an airport counter rarely delivers peace of mind. EzyQuick assists outbound travellers in planning destination currency requirements ahead of departure as part of coordinated trip preparation.',
    image: assetPath('/assets/images/services/forex-services.jpg'),
    imageAlt: 'International currency and financial preparation desk',
    ctaLabel: 'Enquire about forex assistance',
    scope: [
      'Pre-departure foreign currency requirement planning',
      'Outbound leisure and business travel forex assistance',
      'Multi-destination currency preparation guidance',
      'Standard documentation checklist guidance for authorised foreign exchange transactions',
      'Coordinated preparation alongside international ticketing and visa timelines',
    ],
    benefits: [
      {
        title: 'Sorted before departure day',
        detail: 'Plan destination currency requirements calmly alongside your flights and documents instead of rushing at terminals.',
      },
      {
        title: 'Clear documentation guidance',
        detail: 'We explain standard KYC and travel-document requirements for authorised foreign exchange channels.',
      },
      {
        title: 'One travel desk',
        detail: 'Combine forex assistance within the same brief as your flights, hotels, and international itinerary.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Share your destination countries, travel dates, and approximate currency requirements.' },
      { step: '02', detail: 'Receive guidance on available forex assistance options and standard documentation required.' },
      { step: '03', detail: 'Review current applicable terms before proceeding.' },
      { step: '04', detail: 'Complete pre-departure currency preparation ahead of travel.' },
    ],
    transparencyNote:
      'Important notice: Foreign exchange rates fluctuate continuously and transactions are subject to applicable regulatory guidelines and documentation checks. EzyQuick does not publish live or guaranteed exchange rates on this website.',
    faqs: [
      {
        question: 'Do you publish live exchange rates on your website?',
        answer: 'No. Exchange rates move continuously with market conditions. Share your destination and travel timing so our team can provide current guidance.',
      },
      {
        question: 'Can forex assistance be combined with my holiday or corporate trip enquiry?',
        answer: 'Yes. Mention foreign exchange support in your Plan Your Journey request or select Forex Services directly.',
      },
    ],
    relatedSlugs: ['travel-insurance', 'visa-services', 'air-tickets'],
  },
  {
    slug: 'travel-insurance',
    index: '08',
    category: 'Core Travel Support',
    shortLabel: 'Protection',
    name: 'Travel Insurance',
    headline: 'Explore travel protection aligned with your itinerary.',
    tagline: 'Guidance on suitable travel insurance options matched to your destination and trip duration.',
    summary:
      'Pre-departure assistance to review travel insurance options for domestic or international leisure, corporate, family, senior, or student journeys.',
    editorialIntro:
      'Unexpected flight disruptions, baggage delays, or unforeseen emergencies abroad can disrupt even a carefully planned trip, and several destinations require proof of travel insurance for visa submission. EzyQuick helps you review suitable travel insurance options aligned with your dates.',
    image: assetPath('/assets/images/services/travel-insurance.jpg'),
    imageAlt: 'Calm pre-departure travel planning and policy review desk',
    ctaLabel: 'Explore insurance options',
    scope: [
      'Single-trip international travel insurance guidance',
      'Multi-trip business travel protection options',
      'Family and senior traveller insurance enquiry assistance',
      'Visa-aligned travel insurance documentation support',
      'Pre-departure review of trip dates and destination coverage scope',
    ],
    benefits: [
      {
        title: 'Aligned with visa and trip dates',
        detail: 'Ensure policy dates correspond cleanly to your departure, transit, and return schedule.',
      },
      {
        title: 'Matched to traveller profile',
        detail: 'Review options suited for solo travellers, families, corporate executives, or group itineraries.',
      },
      {
        title: 'Transparent pre-purchase review',
        detail: 'Review official policy wordings, exclusions, and coverage schedules before selecting.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Share your destination, travel dates, and traveller age brackets.' },
      { step: '02', detail: 'Indicate whether insurance is also required for a specific visa checklist.' },
      { step: '03', detail: 'Review relevant travel insurance options and official policy terms.' },
      { step: '04', detail: 'Confirm your preferred cover prior to departure.' },
    ],
    transparencyNote:
      'Important notice: Policy benefits, limits, exclusions, and claims are governed strictly by the issuing insurer’s official policy wording. EzyQuick assists travellers in exploring options and does not underwrite insurance policies or guarantee specific claim outcomes.',
    faqs: [
      {
        question: 'Is travel insurance required for international visas?',
        answer: 'Certain destinations require proof of travel medical insurance as part of the visa checklist, while others strongly recommend it. We align guidance with your destination.',
      },
      {
        question: 'Do you quote fixed insurance prices online?',
        answer: 'No. Premiums depend on destination, trip duration, traveller ages, and coverage tier. Share your dates and we will help you review appropriate options.',
      },
    ],
    relatedSlugs: ['visa-services', 'forex-services', 'medical-travel'],
  },
  {
    slug: 'mice-services',
    index: '09',
    category: 'Corporate & Institutional',
    shortLabel: 'Events',
    name: 'MICE Services',
    headline: 'Meetings, incentives, conferences, and corporate events orchestrated end to end.',
    tagline: 'Coordinated group travel, venue sourcing support, and delegation logistics across India, Dubai, and international destinations.',
    summary:
      'Structured group air travel, hotel room blocks, conference venue coordination, incentive itineraries, and on-ground transport for corporate teams and delegations.',
    editorialIntro:
      'Moving a leadership team, sales force, or international conference delegation demands disciplined logistics behind a memorable guest experience. EzyQuick coordinates MICE travel across India, Dubai, Abu Dhabi, Southeast Asia, and beyond, uniting group flights, room blocks, transfers, and programme scheduling under one desk.',
    image: assetPath('/assets/images/services/mice-services.jpg'),
    imageAlt: 'Architectural international conference hall and corporate gathering',
    ctaLabel: 'Plan a MICE programme',
    scope: [
      'Corporate meetings and leadership offsites',
      'Incentive travel programmes for teams and partners',
      'Conference and exhibition delegation travel',
      'Multi-origin group air ticket coordination',
      'Hotel room blocks and venue-adjacent accommodation',
      'Group visa documentation guidance for international delegations',
      'Coach transfers, airport meets, and curated group excursions',
    ],
    benefits: [
      {
        title: 'Multi-city arrival synchronisation',
        detail: 'Coordinate delegates arriving from Indian cities, Dubai, or international hubs into one unified arrival schedule.',
      },
      {
        title: 'India and Gulf destination fluency',
        detail: 'Well suited for Dubai, Abu Dhabi, Goa, Kerala, Phuket, Bali, Singapore, Malaysia, and Almaty corporate offsites and incentive programmes.',
      },
      {
        title: 'Single executive contact',
        detail: 'Clear communication from initial scoping through final delegation return.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Share your event purpose, approximate headcount, origin cities, and target window.' },
      { step: '02', detail: 'Discuss preferred destination options, hotel standards, and meeting requirements.' },
      { step: '03', detail: 'Review a structured group travel and logistics proposal.' },
      { step: '04', detail: 'Coordinate group bookings, visa timelines, and arrival schedules.' },
    ],
    faqs: [
      {
        question: 'What does MICE stand for?',
        answer: 'MICE stands for Meetings, Incentives, Conferences, and Exhibitions, covering corporate offsites, leadership summits, dealer incentive trips, and event delegation travel.',
      },
      {
        question: 'Can EzyQuick coordinate delegations departing from multiple cities?',
        answer: 'Yes. We coordinate multi-origin flight arrivals, shared airport transfers, and unified hotel room blocks for corporate groups.',
      },
    ],
    relatedSlugs: ['corporate-travel', 'hotel-bookings', 'air-tickets'],
  },
];

export function getServiceBySlug(slug: string): TravelService | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
