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

export const DESTINATION_OPTIONS = [
  'Dubai (UAE)',
  'Abu Dhabi (UAE)',
  'Phuket (Thailand)',
  'Krabi (Thailand)',
  'Phu Quoc (Vietnam)',
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
    .min(7, 'Please enter a valid mobile or WhatsApp number.')
    .max(28, 'Phone number appears too long.')
    .regex(/^[+0-9\s()-]+$/, 'Phone number may contain digits, +, spaces, hyphens, or parentheses.')
    .transform(sanitizeText),
  serviceType: z.enum(SERVICE_OPTIONS, {
    message: 'Please select a travel service.',
  }),
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
  // Conditional fields
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
  specialRequirements: cleanOptional(1000),
  consent: z.literal(true, {
    message: 'Please confirm permission for EzyQuick to contact you about this enquiry.',
  }),
  // Honeypot anti-spam trap (must remain empty)
  website: z.string().max(0).optional(),
});

export type EnquiryPayload = z.infer<typeof enquirySchema>;
