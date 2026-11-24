import { assetPath } from '@/lib/asset-path';

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface TravelService {
  slug: string;
  index: string;
  category: 'Executive & Institutional' | 'Personal & Holidays' | 'Core Travel Support';
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
    category: 'Executive & Institutional',
    shortLabel: 'Business',
    name: 'Corporate Travel',
    headline: 'Business travel organised with quiet precision.',
    tagline: 'Centralised travel coordination for modern companies and leadership teams.',
    summary:
      'Domestic and international executive trips, recurring business routes, hotel stays, visa documentation guidance, and responsive itinerary adjustments through one desk.',
    editorialIntro:
      'Corporate schedules rarely stay static. EzyQuick supports growing companies, founders, and travel coordinators with structured air routing, well-located business hotels, airport transfers, and single-point communication across India, the UAE, and international business hubs.',
    image: assetPath('/images/services/corporate-travel.jpg'),
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
      'Dedicated travel desk point of contact',
    ],
    benefits: [
      {
        title: 'Centralised coordination',
        detail: 'Consolidate flights, hotels, visas, and transfers with one responsive desk instead of managing multiple bookings separately.',
      },
      {
        title: 'Options shaped to policy',
        detail: 'We present clear itinerary choices aligned with your company schedule, routing preferences, and travel class guidelines.',
      },
      {
        title: 'India & UAE corridor fluency',
        detail: 'With offices in New Delhi and Dubai Silicon Oasis, we support both domestic Indian business routes and Gulf/international travel.',
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
        answer: 'Yes. We assist both one-time leadership trips and organisations that require recurring weekly or monthly domestic and international travel coordination.',
      },
      {
        question: 'Do you coordinate visas and hotels alongside business flights?',
        answer: 'Yes. Corporate travel enquiries can combine air tickets, hotel bookings, business visa documentation guidance, and travel insurance assistance in a single brief.',
      },
      {
        question: 'How quickly can we start a corporate enquiry?',
        answer: 'Use our Plan Your Journey form with Corporate Travel selected, email info@ezyquick.in, or reach our Delhi or Dubai desks directly on WhatsApp.',
      },
    ],
    relatedSlugs: ['mice-services', 'air-tickets', 'hotel-bookings'],
  },
  {
    slug: 'medical-travel',
    index: '02',
    category: 'Executive & Institutional',
    shortLabel: 'Care',
    name: 'Medical Travel',
    headline: 'Thoughtful travel coordination when health comes first.',
    tagline: 'Travel, accommodation, and local logistics assistance for patients and accompanying family members.',
    summary:
      'Dedicated travel support for patients and attendants travelling domestically or abroad for healthcare—covering flights, nearby stays, airport transfers, and medical visa documentation guidance.',
    editorialIntro:
      'Travelling for medical care places enough emotional demand on patients and their families without the added weight of logistics. EzyQuick focuses strictly on practical, compassionate travel coordination: convenient flights, comfortable accommodation near preferred hospitals, airport pick-ups, and clear checklists for medical travel documentation.',
    image: assetPath('/images/services/medical-travel.jpg'),
    imageAlt: 'Calm medical consultation and healthcare coordination setting',
    ctaLabel: 'Request medical travel assistance',
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
        detail: 'Every travel detail—routing, layover comfort, and proximity to care centres—is planned around the traveller and accompanying family.',
      },
      {
        title: 'Calm, practical communication',
        detail: 'One dedicated point of contact helps coordinate tickets, accommodation, and local transfers without unnecessary complexity.',
      },
      {
        title: 'Privacy-first enquiry handling',
        detail: 'We only request broad travel details during enquiry. Please do not submit detailed medical records or passport numbers through our public web form.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Share your departure city, destination, broad timing, and number of attendants.' },
      { step: '02', detail: 'Discuss preferred hospital area and accommodation comfort needs.' },
      { step: '03', detail: 'Review suitable flight, stay, and airport transfer arrangements.' },
      { step: '04', detail: 'Coordinate departure and local logistics with our travel desk.' },
    ],
    transparencyNote:
      'Important notice: EzyQuick provides travel, accommodation, visa documentation guidance, and ground-logistics coordination only. EzyQuick does not provide medical advice, clinical diagnosis, hospital treatment, or guarantees regarding medical outcomes.',
    faqs: [
      {
        question: 'Does EzyQuick provide medical advice or choose medical treatments?',
        answer: 'No. EzyQuick is a travel-services business. We provide travel, accommodation, visa documentation guidance, and local transport coordination for patients and accompanying family members; all clinical decisions remain between the patient and their healthcare providers.',
      },
      {
        question: 'Can you arrange accommodation for family members travelling with a patient?',
        answer: 'Yes. We help explore hotels and longer-stay accommodation options near the patient’s preferred healthcare area for both patients and attendants.',
      },
      {
        question: 'Should I attach medical reports or passport copies to the enquiry form?',
        answer: 'No. For your privacy, please share only broad travel preferences in the public enquiry form. Never enter passport numbers or sensitive medical records online.',
      },
    ],
    relatedSlugs: ['visa-services', 'hotel-bookings', 'air-tickets'],
  },
  {
    slug: 'leisure-travel',
    index: '03',
    category: 'Personal & Holidays',
    shortLabel: 'Holidays',
    name: 'Leisure Travel',
    headline: 'Extraordinary journeys shaped around how you like to travel.',
    tagline: 'Custom domestic and international holidays across India, the UAE, Southeast Asia, and beyond.',
    summary:
      'Family holidays, honeymoons, group tours, adventure trips, luxury escapes, sightseeing, and custom itineraries across Kerala, Goa, Andaman, Ladakh, Dubai, Abu Dhabi, Thailand, Vietnam, Bali, Sri Lanka, Singapore, Malaysia, and Almaty.',
    editorialIntro:
      'A memorable holiday feels unhurried from the first conversation. Whether you are planning a multi-generational family getaway to Dubai, a quiet honeymoon in Kerala or Bali, an island escape to Phu Quoc or Krabi, or a high-altitude journey through Ladakh, we design tailored itineraries around your pace, dates, and travel style.',
    image: assetPath('/images/services/leisure-travel.jpg'),
    imageAlt: 'Sunlit coastal shoreline for bespoke leisure travel',
    ctaLabel: 'Plan my holiday',
    scope: [
      'Family holidays tailored across generations',
      'Honeymoon and romantic escapes',
      'Curated group tours and milestone trips',
      'Mountain and coastal adventure trips',
      'Luxury holidays and boutique resort stays',
      'Private sightseeing and local experiences',
      'Custom end-to-end domestic and international itineraries',
      'Combined flight, hotel, transfer, and visa coordination',
    ],
    benefits: [
      {
        title: 'Tailored around your rhythm',
        detail: 'Instead of forcing your dates into a rigid template, we outline an itinerary calibrated to your companions, pace, and budget preferences.',
      },
      {
        title: 'India & international destination depth',
        detail: 'Explore Kerala, Goa, Andaman & Nicobar, and Ladakh domestically, alongside Dubai, Abu Dhabi, Phuket, Krabi, Phu Quoc, Bali, Sri Lanka, Singapore, Malaysia, and Almaty.',
      },
      {
        title: 'Single-contact clarity',
        detail: 'Flights, handpicked stays, sightseeing transfers, and visa guidance sit inside one coordinated plan.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Tell us your preferred destinations, travel style, and group composition.' },
      { step: '02', detail: 'Share target dates, departure city, and approximate comfort range.' },
      { step: '03', detail: 'Review a custom suggested itinerary and clear quotation.' },
      { step: '04', detail: 'Confirm the arrangements that suit you and prepare to travel.' },
    ],
    transparencyNote:
      'All destinations and holiday ideas presented on this site are custom-planned upon enquiry. Availability and quotations are confirmed specifically for your travel dates before booking.',
    faqs: [
      {
        question: 'Are your leisure itineraries fixed group packages or customisable?',
        answer: 'We specialise in custom itineraries tailored to your dates, travellers, and holiday type—covering family holidays, honeymoons, luxury stays, adventure trips, and private or group tours.',
      },
      {
        question: 'Can you include flights, hotels, sightseeing, and visa guidance together?',
        answer: 'Yes. We coordinate the full travel chain so your flight arrival times, hotel check-ins, transfers, and visa timelines align smoothly.',
      },
      {
        question: 'Which domestic and international destinations do you frequently plan?',
        answer: 'In India we highlight Kerala, Goa, Andaman & Nicobar, and Ladakh. Internationally we feature Dubai, Abu Dhabi, Phuket, Krabi, Phu Quoc, Bali, Sri Lanka, Singapore, Malaysia, and Almaty.',
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
    headline: 'Organised visa guidance with clarity at every step.',
    tagline: 'Documentation checklists, application form guidance, and appointment coordination for international travel.',
    summary:
      'Structured documentation support for tourist, business, transit, and family visit visas—plus enquiry information on our proposed "Free Dubai Visa for a Kid" family promotion.',
    editorialIntro:
      'International visa preparation is easiest when every requirement is sequenced clearly in advance. EzyQuick guides travellers through category selection, document checklists, application form review, and appointment coordination so submissions are thorough and well-organised.',
    image: assetPath('/images/services/visa-services.jpg'),
    imageAlt: 'International travel gateway and documentation preparation',
    ctaLabel: 'Get visa guidance',
    scope: [
      'Tourist visa documentation assistance',
      'Business visa application guidance',
      'Transit visa checklist support',
      'Family visit visa guidance',
      'Application form review and preparation guidance',
      'Country-specific documentation checklists',
      'Appointment scheduling coordination where applicable',
    ],
    benefits: [
      {
        title: 'Clear, structured checklists',
        detail: 'Know what supporting documents to assemble before starting your application so avoidable delays are minimised.',
      },
      {
        title: 'Aligned with your itinerary',
        detail: 'Coordinate flight reservations, hotel bookings, and travel insurance alongside your visa preparation timeline.',
      },
      {
        title: 'Dubai family enquiry promotion',
        detail: 'Travelling to Dubai with family? Ask our team about the proposed "Free Dubai Visa for a Kid" promotion and its current eligibility terms.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Share your nationality, destination country, visa category, and expected travel window.' },
      { step: '02', detail: 'Receive guidance on the relevant documentation checklist for your travel purpose.' },
      { step: '03', detail: 'Prepare your application materials with structured form guidance.' },
      { step: '04', detail: 'Coordinate submission or appointment steps through the appropriate official channel.' },
    ],
    transparencyNote:
      'Important notice: EzyQuick provides visa documentation guidance and application assistance only. Visa approval, processing timelines, and entry decisions rest solely with the relevant embassy, consulate, or immigration authority and cannot be guaranteed. Please do not enter passport numbers into our public enquiry form.',
    faqs: [
      {
        question: 'Can EzyQuick guarantee visa approval?',
        answer: 'No travel agency can guarantee visa approval. Final visa decisions and processing timelines are made exclusively by the relevant embassy, consulate, or immigration authority. Our role is to help you prepare clear, complete documentation.',
      },
      {
        question: 'What is the "Free Dubai Visa for a Kid" family promotion?',
        answer: 'It is a proposed family travel promotion for eligible Dubai itineraries. Contact our team with your travel dates and family composition so we can confirm current availability and eligibility terms.',
      },
      {
        question: 'Should I type my passport number in the website form?',
        answer: 'No. Never submit passport numbers or identity scans through our public enquiry form. Our advisor will guide you on secure next steps once we respond.',
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
    headline: 'Fly further with routing shaped around your schedule.',
    tagline: 'Personalised domestic and international flight booking support for individuals, families, and groups.',
    summary:
      'One-way, return, multi-city, corporate, and group air ticket coordination with clear itinerary options and quotations reviewed before confirmation.',
    editorialIntro:
      'The right flight balances schedule convenience, sensible connection buffers, baggage allowances, and fare flexibility. Instead of sifting through dozens of confusing fare rules alone, tell EzyQuick your route and cabin preference and review curated flight options directly.',
    image: assetPath('/images/services/air-tickets.jpg'),
    imageAlt: 'Commercial aircraft wing gliding above soft golden clouds',
    ctaLabel: 'Request a flight quote',
    scope: [
      'Domestic flight reservations across India',
      'International flight bookings worldwide',
      'One-way and round-trip air tickets',
      'Multi-city and open-jaw itinerary routing',
      'Group and family flight coordination',
      'Corporate and executive cabin bookings (Economy to First Class)',
      'Date-change, rerouting, and cancellation assistance',
    ],
    benefits: [
      {
        title: 'Human routing judgement',
        detail: 'We consider layover comfort, baggage rules, and schedule reliability rather than surfacing stripped-down fares with hidden trade-offs.',
      },
      {
        title: 'Clear quotations before ticketing',
        detail: 'Review full route timing and fare conditions before confirming any booking.',
      },
      {
        title: 'Support when schedules shift',
        detail: 'If your departure date moves or a meeting extends, reach the same travel desk to explore rebooking options.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Share departure city, destination, dates, and trip type (one-way, return, or multi-city).' },
      { step: '02', detail: 'Confirm passenger count, cabin class, and any airline or timing preferences.' },
      { step: '03', detail: 'Review curated routing options and clear fare quotations.' },
      { step: '04', detail: 'Approve your preferred flight itinerary for ticketing.' },
    ],
    transparencyNote:
      'Flight availability and airline fares change continuously until tickets are issued. We do not display speculative live fares on this site; all quotations are checked live at the time of enquiry.',
    faqs: [
      {
        question: 'Can you coordinate multi-city international routes?',
        answer: 'Yes. Multi-city and stopover itineraries—such as combining India, Dubai, and Southeast Asia—are a core part of our flight desk.',
      },
      {
        question: 'Do you assist with group flight enquiries for families or corporate teams?',
        answer: 'Yes. Share your estimated group size and dates and we will coordinate suitable flight options together.',
      },
      {
        question: 'Why are live ticket prices not listed on the page?',
        answer: 'Airfares fluctuate dynamically by seat inventory and timing. Checking routes directly against your exact dates ensures you receive accurate, current options rather than outdated estimates.',
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
    headline: 'Handpicked stays chosen for location, comfort, and calm.',
    tagline: 'Domestic and international accommodation coordination across city hotels, boutique properties, and resorts.',
    summary:
      'Business hotels, luxury and boutique escapes, family resorts, group blocks, and long-stay accommodation arranged to match your itinerary and budget range.',
    editorialIntro:
      'Where you stay shapes the entire pace of a trip. Whether you need a quiet business hotel near a conference district, a beachfront resort for a family holiday, or a comfortable extended stay during a medical visit, we narrow the options to properties that genuinely fit your priorities.',
    image: assetPath('/images/services/hotel-bookings.jpg'),
    imageAlt: 'Refined architectural luxury hotel lobby and courtyard',
    ctaLabel: 'Find my stay',
    scope: [
      'Domestic hotel reservations across India',
      'International hotel and resort bookings',
      'Luxury and boutique hotel curation',
      'Business-district executive hotels',
      'Family-friendly resorts and interconnected room requests',
      'Value-conscious 3-star and 4-star stays',
      'Group room blocks and corporate stay coordination',
      'Extended and long-stay accommodation arrangements',
    ],
    benefits: [
      {
        title: 'Matched to travel purpose',
        detail: 'Location, room configuration, breakfast inclusions, and cancellation flexibility are aligned with why you are travelling.',
      },
      {
        title: 'Synchronised with your flights',
        detail: 'Check-in timing, late arrivals, and airport transfers are planned together so arrival feels effortless.',
      },
      {
        title: 'Transparent option comparisons',
        detail: 'Review curated property recommendations with clear room categories before confirming.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Share your destination city, check-in/check-out dates, and room count.' },
      { step: '02', detail: 'Indicate preferred hotel category, neighbourhood, and approximate nightly range.' },
      { step: '03', detail: 'Review tailored stay recommendations suited to your guests.' },
      { step: '04', detail: 'Confirm your preferred property and booking details.' },
    ],
    transparencyNote:
      'Room availability and nightly rates depend on travel dates and seasonal demand. We verify current options upon enquiry rather than quoting unverified live inventory.',
    faqs: [
      {
        question: 'Can you help find hotels for both leisure resorts and business trips?',
        answer: 'Yes. We coordinate accommodation across leisure resorts, boutique hotels, central business properties, family stays, and longer-term arrangements.',
      },
      {
        question: 'Can I book a hotel without booking a full holiday package?',
        answer: 'Yes. You can enquire for standalone hotel reservations or pair them with air tickets, transfers, and sightseeing.',
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
    headline: 'Foreign exchange assistance sorted before you board.',
    tagline: 'Practical currency preparation guidance for outbound leisure, business, and medical travellers.',
    summary:
      'Coordinated foreign exchange assistance to help you prepare destination currency needs smoothly alongside your flights, visas, and international itinerary.',
    editorialIntro:
      'Preparing foreign currency at the last minute at an airport counter rarely delivers peace of mind. EzyQuick assists international travellers in planning their currency requirements in advance as part of pre-departure preparation.',
    image: assetPath('/images/services/forex-services.jpg'),
    imageAlt: 'International currency and financial preparation desk',
    ctaLabel: 'Enquire about forex assistance',
    scope: [
      'Pre-departure foreign currency requirement planning',
      'Outbound leisure and business travel forex assistance',
      'Multi-destination currency preparation guidance',
      'Documentation checklist guidance for authorised foreign exchange transactions',
      'Coordinated preparation alongside international ticketing and visa timelines',
    ],
    benefits: [
      {
        title: 'Handled before departure day',
        detail: 'Plan destination currency requirements calmly alongside your flights and documentation instead of rushing at departure terminals.',
      },
      {
        title: 'Clear documentation guidance',
        detail: 'We explain standard KYC and travel-document requirements needed to process foreign exchange through authorised channels.',
      },
      {
        title: 'One travel desk',
        detail: 'Coordinate forex assistance within the same enquiry as your flights, hotels, and international itinerary.',
      },
    ],
    processSteps: [
      { step: '01', detail: 'Share your destination countries, travel dates, and approximate foreign currency needs.' },
      { step: '02', detail: 'Receive guidance on available forex assistance options and standard documentation required.' },
      { step: '03', detail: 'Review current applicable terms before proceeding.' },
      { step: '04', detail: 'Complete your pre-departure currency preparation ahead of travel.' },
    ],
    transparencyNote:
      'Important notice: Foreign exchange rates fluctuate continuously and transactions are subject to applicable regulatory guidelines and documentation checks. EzyQuick does not publish live or guaranteed exchange rates on this website.',
    faqs: [
      {
        question: 'Do you list live exchange rates on your website?',
        answer: 'No. Exchange rates change continuously with market conditions. Reach out with your currency requirement and travel timing so our team can share current guidance.',
      },
      {
        question: 'Can forex assistance be combined with my holiday or corporate travel enquiry?',
        answer: 'Yes. Simply mention foreign exchange support in your Plan Your Journey request or select Forex Services directly.',
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
    headline: 'Explore travel protection for greater peace of mind.',
    tagline: 'Guidance on suitable travel insurance options aligned with your destination and trip duration.',
    summary:
      'Pre-departure assistance to help you review travel insurance options suited to domestic or international leisure, corporate, senior, or student journeys.',
    editorialIntro:
      'Unexpected flight disruptions, lost baggage, or unforeseen emergencies abroad can derail an otherwise well-planned journey—and several destinations require proof of travel insurance during visa application. EzyQuick helps you explore suitable travel insurance options aligned with your itinerary.',
    image: assetPath('/images/services/travel-insurance.jpg'),
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
        title: 'Aligned with visa & trip timelines',
        detail: 'Ensure policy dates correspond cleanly to your departure, transit, and return schedule.',
      },
      {
        title: 'Tailored to traveller profile',
        detail: 'Review options suited for solo travellers, families, corporate executives, or group itineraries.',
      },
      {
        title: 'Transparent pre-purchase review',
        detail: 'Review official policy wordings, exclusions, and coverage schedules before making any selection.',
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
        answer: 'Certain destinations require proof of travel medical insurance as part of the visa application checklist, while others strongly recommend it. We align your guidance with your destination.',
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
    category: 'Executive & Institutional',
    shortLabel: 'Events',
    name: 'MICE Services',
    headline: 'Meetings, incentives, conferences, and corporate events—orchestrated end to end.',
    tagline: 'Coordinated group travel, venue sourcing support, and delegation logistics across India, Dubai, and international destinations.',
    summary:
      'Structured group air travel, hotel room blocks, conference venue coordination, incentive itineraries, and on-ground transport for corporate teams and dealer delegations.',
    editorialIntro:
      'Moving a leadership team, sales force, or international conference delegation requires disciplined logistics behind a memorable guest experience. EzyQuick coordinates MICE travel across India, Dubai, Abu Dhabi, Southeast Asia, and beyond—bringing group flights, room blocks, transfers, and event scheduling into one coherent plan.',
    image: assetPath('/images/services/mice-services.jpg'),
    imageAlt: 'Architectural international conference hall and corporate gathering',
    ctaLabel: 'Plan a MICE programme',
    scope: [
      'Corporate meetings and leadership offsites',
      'Incentive travel programmes for high-performing teams and partners',
      'Conference and exhibition delegation travel',
      'Group air ticket coordination from multiple origin cities',
      'Hotel room blocks and venue-adjacent accommodation',
      'Group visa documentation guidance for international delegations',
      'Coach transfers, airport meets, and curated group sightseeing',
    ],
    benefits: [
      {
        title: 'Multi-city arrival coordination',
        detail: 'Synchronise travellers arriving from Delhi, Mumbai, Bengaluru, Dubai, or international hubs into one unified schedule.',
      },
      {
        title: 'Gulf & Asian destination strength',
        detail: 'Ideal for Dubai, Abu Dhabi, Goa, Kerala, Phuket, Bali, Singapore, Malaysia, and Almaty corporate offsites and incentive programmes.',
      },
      {
        title: 'Single executive point of contact',
        detail: 'Streamlined communication from initial programme scoping through final delegation return.',
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
        answer: 'MICE stands for Meetings, Incentives, Conferences, and Exhibitions—covering corporate offsites, leadership summits, dealer incentive trips, and event delegation travel.',
      },
      {
        question: 'Can EzyQuick coordinate delegations departing from multiple cities?',
        answer: 'Yes. We regularly coordinate multi-origin flight arrivals, shared airport transfers, and unified hotel room blocks for corporate groups.',
      },
      {
        question: 'Are Dubai and Abu Dhabi suitable for corporate incentive travel?',
        answer: 'Yes. With our Dubai office in Silicon Oasis and India office in New Delhi, UAE corporate summits and incentive programmes are a natural strength.',
      },
    ],
    relatedSlugs: ['corporate-travel', 'hotel-bookings', 'air-tickets'],
  },
];

export function getServiceBySlug(slug: string): TravelService | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
