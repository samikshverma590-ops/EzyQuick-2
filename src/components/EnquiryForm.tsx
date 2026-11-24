'use client';

import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import {
  DESTINATION_OPTIONS,
  SERVICE_OPTIONS,
  enquirySchema,
} from '@/lib/enquiry-schema';
import { buildWhatsAppUrl, SITE } from '@/data/site';
import { BASE_PATH } from '@/lib/asset-path';

interface EnquiryFormProps {
  defaultService?: (typeof SERVICE_OPTIONS)[number];
  defaultDestination?: string;
  compactHeading?: boolean;
}

interface FormState {
  fullName: string;
  email: string;
  mobile: string;
  serviceType: (typeof SERVICE_OPTIONS)[number];
  originCity: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  travellers: string;
  companyName: string;
  travelFrequency: string;
  holidayType: string;
  budgetRange: string;
  visaCategory: string;
  nationality: string;
  tripType: string;
  cabinClass: string;
  hotelCategory: string;
  attendants: string;
  currencyNeed: string;
  specialRequirements: string;
  consent: boolean;
  website: string; // honeypot
}

export function EnquiryForm({
  defaultService = 'Leisure Travel',
  defaultDestination = '',
  compactHeading = false,
}: EnquiryFormProps) {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    mobile: '',
    serviceType: defaultService,
    originCity: '',
    destination: defaultDestination,
    departureDate: '',
    returnDate: '',
    travellers: '2',
    companyName: '',
    travelFrequency: 'One-time',
    holidayType: 'Family',
    budgetRange: '',
    visaCategory: 'Tourist',
    nationality: '',
    tripType: 'Round trip',
    cabinClass: 'Economy',
    hotelCategory: '4 Star',
    attendants: '1',
    currencyNeed: '',
    specialRequirements: '',
    consent: false,
    website: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const whatsappSummary = [
    `Hello EzyQuick, I would like to enquire about ${form.serviceType}.`,
    form.fullName ? `Name: ${form.fullName}` : null,
    form.originCity ? `From: ${form.originCity}` : null,
    form.destination ? `Destination: ${form.destination}` : null,
    form.departureDate ? `Departure: ${form.departureDate}` : null,
    form.returnDate ? `Return: ${form.returnDate}` : null,
    form.travellers ? `Travellers: ${form.travellers}` : null,
    referenceId ? `Ref: ${referenceId}` : null,
  ]
    .filter(Boolean)
    .join(' | ');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setFieldErrors({});
    setServerMessage('');

    // Validate client-side first with shared Zod schema for instant accessible errors
    const localCheck = enquirySchema.safeParse(form);
    if (!localCheck.success) {
      const errs: Record<string, string> = {};
      for (const issue of localCheck.error.issues) {
        const key = String(issue.path[0] || 'form');
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setStatus('error');
      setServerMessage('Please review the highlighted fields before submitting.');
      return;
    }

    try {
      const res = await fetch(`${BASE_PATH}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.status === 404 || res.status === 405 || !contentType.includes('application/json')) {
        // Static hosting mode (e.g. GitHub Pages preview without server runtime): be 100% honest
        setStatus('success');
        setReferenceId('STATIC-PREVIEW');
        setServerMessage(
          'Your travel brief has been validated. Because this live preview is hosted statically on GitHub Pages without a mail server, tap Continue via WhatsApp or Email below to send it directly to our desk.'
        );
        return;
      }

      const json = await res.json();

      if (!res.ok || !json.ok) {
        setStatus('error');
        setServerMessage(json.message || 'Unable to submit enquiry right now.');
        if (json.fieldErrors) setFieldErrors(json.fieldErrors);
        return;
      }

      setStatus('success');
      setReferenceId(json.referenceId || '');
      setServerMessage(json.message || 'Enquiry received.');
    } catch {
      setStatus('error');
      setServerMessage(
        'A network error interrupted submission. Please try again or continue directly via WhatsApp.'
      );
    }
  }

  const inputBase =
    'w-full bg-white border border-[var(--color-border-strong)] px-3.5 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/75 rounded-[2px] transition-colors focus:border-[var(--color-brand-primary)] focus:outline-none';
  const labelBase =
    'block text-xs font-semibold tracking-[0.06em] uppercase text-[var(--color-text-secondary)] mb-2';

  return (
    <div className="bg-white border border-[var(--color-border)] p-6 sm:p-8 lg:p-10 shadow-[0_14px_45px_rgba(8,20,38,0.04)]">
      {!compactHeading && (
        <div className="mb-8 pb-6 border-b border-[var(--color-border)] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="t-meta text-[var(--color-brand-primary-ink)] mb-2">
              Journey Brief
            </p>
            <h3 className="t-title text-[var(--color-text-primary)]">
              Tell us about your travel plans.
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] max-w-xs">
            One point of contact across New Delhi &amp; Dubai. No automated quote spam.
          </p>
        </div>
      )}

      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          aria-live="polite"
          className="bg-[var(--color-success-bg)] border border-[var(--color-success)]/30 p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-start gap-3.5">
            <CheckCircle2
              className="h-6 w-6 text-[var(--color-success)] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="space-y-1.5">
              <p className="t-meta text-[var(--color-success)]">
                Reference {referenceId}
              </p>
              <h4 className="font-display text-2xl text-[var(--color-text-primary)]">
                Enquiry received by our desk.
              </h4>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {serverMessage}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={buildWhatsAppUrl(whatsappSummary)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ezy btn-primary"
            >
              <span>Continue via WhatsApp</span>
              <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                setReferenceId('');
              }}
              className="btn-ezy btn-outline"
            >
              <span>Send another enquiry</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Honeypot field hidden from real visitors */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="ezq-website">Leave empty</label>
            <input
              id="ezq-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => update('website', e.target.value)}
            />
          </div>

          {status === 'error' && serverMessage && (
            <div
              role="alert"
              className="flex items-start gap-3 bg-[var(--color-error-bg)] border border-[var(--color-error)]/30 p-4 text-sm text-[var(--color-error)]"
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{serverMessage}</span>
            </div>
          )}

          {/* Service Selector */}
          <div>
            <label htmlFor="ezq-service" className={labelBase}>
              Travel Service *
            </label>
            <select
              id="ezq-service"
              value={form.serviceType}
              onChange={(e) =>
                update('serviceType', e.target.value as (typeof SERVICE_OPTIONS)[number])
              }
              className={inputBase}
            >
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {fieldErrors.serviceType && (
              <p className="mt-1.5 text-xs text-[var(--color-error)]">{fieldErrors.serviceType}</p>
            )}
          </div>

          {/* Core Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="ezq-name" className={labelBase}>
                Full Name *
              </label>
              <input
                id="ezq-name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your full name"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                aria-invalid={!!fieldErrors.fullName}
                className={inputBase}
              />
              {fieldErrors.fullName && (
                <p className="mt-1.5 text-xs text-[var(--color-error)]">{fieldErrors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="ezq-email" className={labelBase}>
                Email Address *
              </label>
              <input
                id="ezq-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                aria-invalid={!!fieldErrors.email}
                className={inputBase}
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-[var(--color-error)]">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="ezq-mobile" className={labelBase}>
                Mobile / WhatsApp Number *
              </label>
              <input
                id="ezq-mobile"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+91 or +971 ..."
                value={form.mobile}
                onChange={(e) => update('mobile', e.target.value)}
                aria-invalid={!!fieldErrors.mobile}
                className={inputBase}
              />
              {fieldErrors.mobile && (
                <p className="mt-1.5 text-xs text-[var(--color-error)]">{fieldErrors.mobile}</p>
              )}
            </div>

            <div>
              <label htmlFor="ezq-origin" className={labelBase}>
                Origin / Departure City *
              </label>
              <input
                id="ezq-origin"
                type="text"
                required
                placeholder="e.g. New Delhi, Mumbai, Dubai"
                value={form.originCity}
                onChange={(e) => update('originCity', e.target.value)}
                aria-invalid={!!fieldErrors.originCity}
                className={inputBase}
              />
              {fieldErrors.originCity && (
                <p className="mt-1.5 text-xs text-[var(--color-error)]">{fieldErrors.originCity}</p>
              )}
            </div>
          </div>

          {/* Route & Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="sm:col-span-2">
              <label htmlFor="ezq-destination" className={labelBase}>
                Destination *
              </label>
              <input
                id="ezq-destination"
                list="ezq-destinations-list"
                type="text"
                required
                placeholder="Select or type destination"
                value={form.destination}
                onChange={(e) => update('destination', e.target.value)}
                aria-invalid={!!fieldErrors.destination}
                className={inputBase}
              />
              <datalist id="ezq-destinations-list">
                {DESTINATION_OPTIONS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
              {fieldErrors.destination && (
                <p className="mt-1.5 text-xs text-[var(--color-error)]">{fieldErrors.destination}</p>
              )}
            </div>

            <div>
              <label htmlFor="ezq-depart" className={labelBase}>
                Departure Date
              </label>
              <input
                id="ezq-depart"
                type="date"
                value={form.departureDate}
                onChange={(e) => update('departureDate', e.target.value)}
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="ezq-return" className={labelBase}>
                Return Date
              </label>
              <input
                id="ezq-return"
                type="date"
                value={form.returnDate}
                onChange={(e) => update('returnDate', e.target.value)}
                className={inputBase}
              />
            </div>
          </div>

          {/* Travellers + Conditional Context Fields (Motion AnimatePresence) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={form.serviceType}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] p-4 sm:p-5"
            >
              <div>
                <label htmlFor="ezq-travellers" className={labelBase}>
                  Number of Travellers *
                </label>
                <input
                  id="ezq-travellers"
                  type="number"
                  min={1}
                  max={500}
                  value={form.travellers}
                  onChange={(e) => update('travellers', e.target.value)}
                  className={inputBase}
                />
              </div>

              {(form.serviceType === 'Corporate Travel' || form.serviceType === 'MICE Services') && (
                <>
                  <div>
                    <label htmlFor="ezq-company" className={labelBase}>
                      Company / Organisation
                    </label>
                    <input
                      id="ezq-company"
                      type="text"
                      placeholder="Organisation name"
                      value={form.companyName}
                      onChange={(e) => update('companyName', e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label htmlFor="ezq-freq" className={labelBase}>
                      Travel Frequency
                    </label>
                    <select
                      id="ezq-freq"
                      value={form.travelFrequency}
                      onChange={(e) => update('travelFrequency', e.target.value)}
                      className={inputBase}
                    >
                      <option value="One-time">One-time / Single Event</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly / Ongoing</option>
                    </select>
                  </div>
                </>
              )}

              {form.serviceType === 'Leisure Travel' && (
                <>
                  <div>
                    <label htmlFor="ezq-holiday-type" className={labelBase}>
                      Holiday Style
                    </label>
                    <select
                      id="ezq-holiday-type"
                      value={form.holidayType}
                      onChange={(e) => update('holidayType', e.target.value)}
                      className={inputBase}
                    >
                      <option value="Family">Family Holiday</option>
                      <option value="Honeymoon">Honeymoon</option>
                      <option value="Luxury">Luxury Escape</option>
                      <option value="Group">Group Tour</option>
                      <option value="Adventure">Adventure Trip</option>
                      <option value="Custom">Custom Itinerary</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ezq-budget" className={labelBase}>
                      Approximate Budget Range
                    </label>
                    <input
                      id="ezq-budget"
                      type="text"
                      placeholder="Optional (e.g. Comfort / Luxury)"
                      value={form.budgetRange}
                      onChange={(e) => update('budgetRange', e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </>
              )}

              {form.serviceType === 'Visa Services' && (
                <>
                  <div>
                    <label htmlFor="ezq-visa-cat" className={labelBase}>
                      Visa Category
                    </label>
                    <select
                      id="ezq-visa-cat"
                      value={form.visaCategory}
                      onChange={(e) => update('visaCategory', e.target.value)}
                      className={inputBase}
                    >
                      <option value="Tourist">Tourist</option>
                      <option value="Business">Business</option>
                      <option value="Family Visit">Family Visit</option>
                      <option value="Transit">Transit</option>
                      <option value="Medical">Medical</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ezq-nationality" className={labelBase}>
                      Passport Nationality
                    </label>
                    <input
                      id="ezq-nationality"
                      type="text"
                      placeholder="e.g. Indian, UAE Resident"
                      value={form.nationality}
                      onChange={(e) => update('nationality', e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </>
              )}

              {form.serviceType === 'Air Tickets' && (
                <>
                  <div>
                    <label htmlFor="ezq-trip-type" className={labelBase}>
                      Trip Type
                    </label>
                    <select
                      id="ezq-trip-type"
                      value={form.tripType}
                      onChange={(e) => update('tripType', e.target.value)}
                      className={inputBase}
                    >
                      <option value="Round trip">Round trip</option>
                      <option value="One-way">One-way</option>
                      <option value="Multi-city">Multi-city</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ezq-cabin" className={labelBase}>
                      Preferred Cabin
                    </label>
                    <select
                      id="ezq-cabin"
                      value={form.cabinClass}
                      onChange={(e) => update('cabinClass', e.target.value)}
                      className={inputBase}
                    >
                      <option value="Economy">Economy</option>
                      <option value="Premium Economy">Premium Economy</option>
                      <option value="Business">Business</option>
                      <option value="First Class">First Class</option>
                    </select>
                  </div>
                </>
              )}

              {form.serviceType === 'Hotel Bookings' && (
                <>
                  <div>
                    <label htmlFor="ezq-hotel-cat" className={labelBase}>
                      Hotel Category
                    </label>
                    <select
                      id="ezq-hotel-cat"
                      value={form.hotelCategory}
                      onChange={(e) => update('hotelCategory', e.target.value)}
                      className={inputBase}
                    >
                      <option value="3 Star">3 Star / Comfort</option>
                      <option value="4 Star">4 Star / Upscale</option>
                      <option value="5 Star">5 Star / Luxury</option>
                      <option value="Boutique / Resort">Boutique / Resort</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ezq-hotel-budget" className={labelBase}>
                      Approximate Budget / Night
                    </label>
                    <input
                      id="ezq-hotel-budget"
                      type="text"
                      placeholder="Optional range"
                      value={form.budgetRange}
                      onChange={(e) => update('budgetRange', e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </>
              )}

              {form.serviceType === 'Medical Travel' && (
                <>
                  <div>
                    <label htmlFor="ezq-attendants" className={labelBase}>
                      Accompanying Attendants
                    </label>
                    <input
                      id="ezq-attendants"
                      type="number"
                      min={0}
                      max={10}
                      value={form.attendants}
                      onChange={(e) => update('attendants', e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label htmlFor="ezq-hospital-area" className={labelBase}>
                      Preferred Hospital / City
                    </label>
                    <input
                      id="ezq-hospital-area"
                      type="text"
                      placeholder="Optional (travel logistics only)"
                      value={form.budgetRange}
                      onChange={(e) => update('budgetRange', e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </>
              )}

              {(form.serviceType === 'Forex Services' || form.serviceType === 'Travel Insurance') && (
                <div className="sm:col-span-2">
                  <label htmlFor="ezq-currency" className={labelBase}>
                    {form.serviceType === 'Forex Services'
                      ? 'Destination Currency / Requirement'
                      : 'Traveller Age Group & Coverage Goal'}
                  </label>
                  <input
                    id="ezq-currency"
                    type="text"
                    placeholder={
                      form.serviceType === 'Forex Services'
                        ? 'e.g. AED, THB, USD, SGD'
                        : 'e.g. Family of 4, adults 35-40, Schengen/UAE visa'
                    }
                    value={form.currencyNeed}
                    onChange={(e) => update('currencyNeed', e.target.value)}
                    className={inputBase}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Special Requirements */}
          <div>
            <label htmlFor="ezq-notes" className={labelBase}>
              Special Requirements &amp; Preferences
            </label>
            <textarea
              id="ezq-notes"
              rows={3}
              placeholder="Share trip pace, hotel preferences, or questions. For your privacy, please do not enter passport numbers or medical records here."
              value={form.specialRequirements}
              onChange={(e) => update('specialRequirements', e.target.value)}
              className={`${inputBase} resize-y`}
            />
          </div>

          {/* Privacy & Contact Consent */}
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer text-sm text-[var(--color-text-secondary)]">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => update('consent', e.target.checked)}
                className="mt-1 h-4 w-4 accent-[var(--color-brand-primary)] shrink-0"
              />
              <span>
                I give permission for EzyQuick Travel Solutions to contact me via phone, email, or
                WhatsApp regarding this travel enquiry.
              </span>
            </label>
            {fieldErrors.consent && (
              <p className="text-xs text-[var(--color-error)]">{fieldErrors.consent}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-ezy btn-primary flex-1 disabled:opacity-60"
            >
              <span>{status === 'submitting' ? 'Sending enquiry…' : 'Submit Journey Enquiry'}</span>
              <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </button>
            <a
              href={buildWhatsAppUrl(whatsappSummary)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ezy btn-outline"
            >
              <span>Continue via WhatsApp</span>
              <ArrowUpRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <p className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] pt-1">
            <ShieldCheck className="h-4 w-4 text-[var(--color-brand-primary-ink)] shrink-0" aria-hidden="true" />
            <span>
              Privacy first: never share passport numbers or clinical medical records in web forms.
              Direct desk: {SITE.email}
            </span>
          </p>
        </form>
      )}
    </div>
  );
}
