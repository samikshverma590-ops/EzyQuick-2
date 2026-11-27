import { z } from 'zod';

export const SERVICE_OPTIONS = [
  'Leisure Travel',
  'Corporate Travel',
  'Medical Travel',
  'Visa Services',
  'Air Tickets',
  'Hotel Bookings',
  'Forex Services',
  'Travel Insurance',
  'MICE Services',
] as const;

export const DESK_OPTIONS = [
  { id: 'delhi', label: 'New Delhi Desk (India · +91 8527729449)' },
  { id: 'dubai', label: 'Dubai Desk (UAE · +971 589658819)' },
] as const;

export const DESTINATION_OPTIONS = [
  'Dubai (UAE)',
  'Abu Dhabi (UAE)',
  'Phu Quoc (Vietnam)',
  'Phuket (Thailand)',
  'Krabi (Thailand)',
  'Bali (Indonesia)',
  'Sri Lanka',
  'Singapore',
  'Malaysia',
  'Almaty (Kazakhstan)',
  'Kerala (India)',
  'Goa (India)',
  'Andaman & Nicobar (India)',
  'Ladakh (India)',
  'Multiple / Other Destination',
] as const;

export function sanitizeText(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

const cleanOptional = (max = 160) =>
  z
    .string()
    .max(max)
    .optional()
    .transform((v) => (v ? sanitizeText(v) : undefined));

export const enquirySchema = z.object({
  preferredDesk: z.enum(['delhi', 'dubai'], {
    message: 'Please choose your preferred EzyQuick office desk.',
  }),
  serviceType: z.enum(SERVICE_OPTIONS, {
    message: 'Please select a travel service.',
  }),
  fullName: z
    .string()
    .min(2, 'Please enter your full name.')
    .max(100, 'Name must be 100 characters or fewer.')
    .transform(sanitizeText),
  email: z
    .string()
    .email('Please enter a valid email address.')
    .max(140)
    .transform((v) => sanitizeText(v).toLowerCase()),
  mobile: z
    .string()
    .min(7, 'Please enter a valid phone or WhatsApp number.')
    .max(28, 'Phone number appears too long.')
    .regex(/^[+0-9\s()-]+$/, 'Phone number may contain digits, +, spaces, hyphens, or parentheses.')
    .transform(sanitizeText),
  originCity: z
    .string()
    .min(2, 'Please enter your departure city.')
    .max(100)
    .transform(sanitizeText),
  destination: z
    .string()
    .min(2, 'Please select or enter a destination.')
    .max(120)
    .transform(sanitizeText),
  departureDate: cleanOptional(30),
  returnDate: cleanOptional(30),
  travellers: z
    .string()
    .min(1, 'Please specify number of travellers.')
    .max(20)
    .transform(sanitizeText),
  // Conditional B2B & B2C fields
  companyName: cleanOptional(120),
  travelFrequency: cleanOptional(40),
  holidayType: cleanOptional(40),
  budgetRange: cleanOptional(60),
  visaCategory: cleanOptional(40),
  nationality: cleanOptional(80),
  tripType: cleanOptional(40),
  cabinClass: cleanOptional(40),
  hotelCategory: cleanOptional(40),
  attendants: cleanOptional(20),
  currencyNeed: cleanOptional(80),
  specialRequirements: cleanOptional(1500),
  consent: z.literal(true, {
    message: 'Please confirm permission for EzyQuick to contact you regarding this enquiry.',
  }),
  website: z.string().max(0).optional(),
});

export type EnquiryPayload = z.infer<typeof enquirySchema>;

export function formatEnquiryBrief(data: EnquiryPayload): string {
  const deskLabel = data.preferredDesk === 'dubai' ? 'Dubai Desk (DXB)' : 'New Delhi Desk (DEL)';
  const isCorp = data.serviceType === 'Corporate Travel' || data.serviceType === 'MICE Services';
  const isLeisure = data.serviceType === 'Leisure Travel';
  const isVisa = data.serviceType === 'Visa Services';
  const isFlights = data.serviceType === 'Air Tickets';
  const isHotels = data.serviceType === 'Hotel Bookings';
  const isMedical = data.serviceType === 'Medical Travel';
  const isForex = data.serviceType === 'Forex Services';

  return [
    `EzyQuick Journey Brief (${deskLabel})`,
    `Service: ${data.serviceType}`,
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.mobile}`,
    `Route: ${data.originCity} -> ${data.destination}`,
    `Dates: ${data.departureDate || 'Flexible'} to ${data.returnDate || 'Flexible'}`,
    `Travellers: ${data.travellers}`,
    isCorp && data.companyName ? `Company: ${data.companyName}` : null,
    isCorp && data.travelFrequency ? `Frequency: ${data.travelFrequency}` : null,
    isLeisure && data.holidayType ? `Holiday Style: ${data.holidayType}` : null,
    isLeisure && data.budgetRange ? `Budget Range: ${data.budgetRange}` : null,
    isVisa && data.visaCategory ? `Visa Category: ${data.visaCategory}` : null,
    isVisa && data.nationality ? `Nationality: ${data.nationality}` : null,
    isFlights && data.tripType ? `Trip Type: ${data.tripType}` : null,
    isFlights && data.cabinClass ? `Cabin: ${data.cabinClass}` : null,
    isHotels && data.hotelCategory ? `Hotel Category: ${data.hotelCategory}` : null,
    isMedical && data.attendants ? `Attendants: ${data.attendants}` : null,
    isForex && data.currencyNeed ? `Currency Need: ${data.currencyNeed}` : null,
    data.specialRequirements ? `Notes: ${data.specialRequirements}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}
