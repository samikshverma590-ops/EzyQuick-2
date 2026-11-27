'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
} from 'lucide-react';
import {
  DESK_OPTIONS,
  DESTINATION_OPTIONS,
  enquirySchema,
  formatEnquiryBrief,
  SERVICE_OPTIONS,
  type EnquiryPayload,
} from '@/lib/enquiry-schema';
import { buildSafeMailtoUrl, buildSafeWhatsAppUrl, SITE } from '@/data/site';
import { useJourneySelection } from '@/lib/journey-selection';

interface JourneyEnquiryFormProps {
  defaultService?: (typeof SERVICE_OPTIONS)[number];
  defaultDestination?: string;
  defaultDesk?: 'delhi' | 'dubai';
}

interface FormState {
  preferredDesk: 'delhi' | 'dubai';
  serviceType: (typeof SERVICE_OPTIONS)[number];
  fullName: string;
  email: string;
  mobile: string;
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
  website: string;
}

export function JourneyEnquiryForm({
  defaultService,
  defaultDestination,
  defaultDesk,
}: JourneyEnquiryFormProps) {
  const { selection, originHub, selectedDestination } = useJourneySelection();

  const resolvedService: (typeof SERVICE_OPTIONS)[number] =
    defaultService ??
    ((SERVICE_OPTIONS as readonly string[]).includes(selection.service)
      ? (selection.service as (typeof SERVICE_OPTIONS)[number])
      : 'Leisure Travel');

  const resolvedDesk: 'delhi' | 'dubai' = defaultDesk ?? originHub.id;
  const resolvedDest = defaultDestination ?? selectedDestination?.name ?? '';

  const [form, setForm] = useState<FormState>({
    preferredDesk: resolvedDesk,
    serviceType: resolvedService,
    fullName: '',
    email: '',
    mobile: '',
    originCity: originHub.city,
    destination: resolvedDest,
    departureDate: '',
    returnDate: '',
    travellers: String(selection.travellers || 2),
    companyName: '',
    travelFrequency: 'One-time trip',
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

  // Also read optional URL query params on client mount (?service=...&destination=...&desk=...&travellers=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qService = params.get('service');
    const qDest = params.get('destination');
    const qDesk = params.get('desk');
    const qTravellers = params.get('travellers');
    const parsedTravellers = qTravellers ? Number.parseInt(qTravellers, 10) : NaN;

    if (!qService && !qDest && !qDesk && !qTravellers) return;

    setForm((prev) => ({
      ...prev,
      serviceType:
        qService && (SERVICE_OPTIONS as readonly string[]).includes(qService)
          ? (qService as (typeof SERVICE_OPTIONS)[number])
          : prev.serviceType,
      destination: qDest || prev.destination,
      preferredDesk: qDesk === 'dubai' ? 'dubai' : qDesk === 'delhi' ? 'delhi' : prev.preferredDesk,
      originCity:
        qDesk === 'dubai' ? 'Dubai' : qDesk === 'delhi' ? 'New Delhi' : prev.originCity,
      travellers:
        Number.isFinite(parsedTravellers) && parsedTravellers >= 1 && parsedTravellers <= 500
          ? String(parsedTravellers)
          : prev.travellers,
    }));
  }, []);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'delivered' | 'static_ready' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [validatedData, setValidatedData] = useState<EnquiryPayload | null>(null);
  const [copied, setCopied] = useState(false);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setFieldErrors({});
    setStatusMessage('');

    const parsed = enquirySchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || 'form');
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setStatus('error');
      setStatusMessage('Please review the highlighted fields before continuing.');
      return;
    }

    setValidatedData(parsed.data);

    // Optional public serverless endpoint (never stores private secrets in NEXT_PUBLIC_)
    const endpoint = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT;
    if (!endpoint) {
      // Static GitHub Pages mode: NEVER fake a server delivery
      setStatus('static_ready');
      setStatusMessage(
        'Your travel brief is validated and formatted below. Because this site is hosted statically without an automated mail backend configured, choose WhatsApp, Email, or Copy Brief below to send it directly to our travel desk.'
      );
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        setStatus('error');
        setStatusMessage(
          'Our automated enquiry endpoint returned an error. Please use WhatsApp or Email below so your brief reaches us immediately.'
        );
        return;
      }

      setStatus('delivered');
      setStatusMessage(
        'Your travel enquiry has been delivered to the EzyQuick travel desk. An advisor will respond shortly.'
      );
    } catch {
      setStatus('error');
      setStatusMessage(
        'A network error prevented automated submission. You can send your brief directly via WhatsApp or Email below.'
      );
    }
  }

  const formattedBrief = validatedData ? formatEnquiryBrief(validatedData) : '';
  const waPayload = buildSafeWhatsAppUrl(formattedBrief);
  const mailPayload = buildSafeMailtoUrl(
    validatedData
      ? `[EzyQuick Enquiry] ${validatedData.serviceType} — ${validatedData.destination}`
      : 'EzyQuick Travel Enquiry',
    formattedBrief
  );

  const handleCopyBrief = async () => {
    if (!formattedBrief || typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(formattedBrief);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback ignored safely
    }
  };

  const isCorporate = form.serviceType === 'Corporate Travel' || form.serviceType === 'MICE Services';
  const isLeisure = form.serviceType === 'Leisure Travel';
  const isVisa = form.serviceType === 'Visa Services';
  const isFlights = form.serviceType === 'Air Tickets';
  const isHotels = form.serviceType === 'Hotel Bookings';
  const isMedical = form.serviceType === 'Medical Travel';
  const isForex = form.serviceType === 'Forex Services';

  const inputCls =
    'w-full rounded-xl border border-[#0C1E3A]/18 bg-white px-3.5 py-3 text-sm text-[#0C1E3A] placeholder:text-[#647896] focus-visible:border-[#0059FD] focus-visible:ring-2 focus-visible:ring-[#0059FD]/25';
  const labelCls = 'mb-1.5 block text-xs font-bold tracking-wide text-[#0C1E3A] uppercase';

  if (status === 'delivered' || status === 'static_ready') {
    return (
      <div
        className="rounded-3xl border border-[#0C1E3A]/15 bg-[#FFFFFF] p-6 sm:p-8"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className={`mt-0.5 h-6 w-6 shrink-0 ${
              status === 'delivered' ? 'text-emerald-600' : 'text-[#0059FD]'
            }`}
            aria-hidden="true"
          />
          <div>
            <h3 className="font-display text-2xl font-bold text-[#0C1E3A]">
              {status === 'delivered'
                ? 'Enquiry Delivered'
                : 'Brief Validated — Choose Dispatch Channel'}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#475B78]">{statusMessage}</p>
          </div>
        </div>

        {(waPayload.truncated || mailPayload.truncated) && (
          <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-900">
            Your notes were very detailed, so the quick URL preview was safely shortened to avoid
            app truncation. Use <strong>Copy Full Brief</strong> below to paste every word cleanly.
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={waPayload.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-kinetic px-5 py-3 text-sm"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>Continue via WhatsApp</span>
          </a>
          <a href={mailPayload.url} className="btn-outline-kinetic px-5 py-3 text-sm">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>Open in Email ({SITE.email})</span>
          </a>
          <button
            type="button"
            onClick={handleCopyBrief}
            className="atlas-pill inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <span>Copied Brief</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#0059FD]" aria-hidden="true" />
                <span>Copy Full Brief</span>
              </>
            )}
          </button>
        </div>

        <pre className="font-mono-hud mt-5 max-h-56 overflow-auto rounded-2xl border border-[#0C1E3A]/10 bg-[#F4F7FC] p-4 text-xs leading-relaxed text-[#0C1E3A] whitespace-pre-wrap">
          {formattedBrief}
        </pre>

        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 text-xs font-semibold text-[#475B78] underline hover:text-[#0C1E3A]"
        >
          Edit enquiry details
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF] p-6 shadow-[0_24px_60px_-20px_rgba(22,19,16,0.12)] sm:p-8 lg:p-10"
    >
      {/* Privacy Warning Banner */}
      <div className="mb-7 flex items-start gap-3 rounded-2xl border border-[#174A9C]/20 bg-[#174A9C]/6 p-4 text-xs leading-relaxed text-[#0C1E3A]">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#174A9C]" aria-hidden="true" />
        <p>
          <strong>Privacy notice:</strong> Never enter passport numbers, payment-card details, or
          clinical medical records in this public form. Share only broad travel requirements.
        </p>
      </div>

      {status === 'error' && statusMessage && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2.5 rounded-2xl border border-red-600/30 bg-red-50 p-4 text-sm text-red-900"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Honeypot anti-spam field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      {/* Preferred Office Desk Selector (India vs Dubai) */}
      <fieldset className="mb-6">
        <legend className={labelCls}>Preferred EzyQuick Desk *</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {DESK_OPTIONS.map((desk) => {
            const active = form.preferredDesk === desk.id;
            return (
              <label
                key={desk.id}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-xs font-semibold transition-[border-color,background-color,color] ${
                  active
                    ? 'border-[#0059FD] bg-[#0059FD]/8 text-[#0C1E3A]'
                    : 'border-[#0C1E3A]/15 bg-white text-[#475B78] hover:border-[#0C1E3A]/35'
                }`}
              >
                <input
                  type="radio"
                  name="preferredDesk"
                  value={desk.id}
                  checked={active}
                  onChange={() => update('preferredDesk', desk.id)}
                  className="accent-[#0059FD]"
                />
                <span>{desk.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Service Type */}
        <div>
          <label htmlFor="serviceType" className={labelCls}>
            Travel Service *
          </label>
          <select
            id="serviceType"
            value={form.serviceType}
            onChange={(e) =>
              update('serviceType', e.target.value as (typeof SERVICE_OPTIONS)[number])
            }
            className={inputCls}
            required
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className={labelCls}>
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            placeholder="Your full name"
            className={inputCls}
            required
          />
          {fieldErrors.fullName && (
            <p className="mt-1 text-xs font-medium text-red-700">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelCls}>
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@company.com"
            className={inputCls}
            required
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs font-medium text-red-700">{fieldErrors.email}</p>
          )}
        </div>

        {/* Mobile / WhatsApp */}
        <div>
          <label htmlFor="mobile" className={labelCls}>
            Phone / WhatsApp Number *
          </label>
          <input
            id="mobile"
            type="tel"
            value={form.mobile}
            onChange={(e) => update('mobile', e.target.value)}
            placeholder="+91 or +971 ..."
            className={inputCls}
            required
          />
          {fieldErrors.mobile && (
            <p className="mt-1 text-xs font-medium text-red-700">{fieldErrors.mobile}</p>
          )}
        </div>

        {/* Origin City */}
        <div>
          <label htmlFor="originCity" className={labelCls}>
            Departure City *
          </label>
          <input
            id="originCity"
            type="text"
            value={form.originCity}
            onChange={(e) => update('originCity', e.target.value)}
            placeholder="e.g. New Delhi, Mumbai, Dubai"
            className={inputCls}
            required
          />
          {fieldErrors.originCity && (
            <p className="mt-1 text-xs font-medium text-red-700">{fieldErrors.originCity}</p>
          )}
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="destination" className={labelCls}>
            Destination *
          </label>
          <input
            id="destination"
            list="ezyquick-destination-options"
            value={form.destination}
            onChange={(e) => update('destination', e.target.value)}
            placeholder="Select or type destination"
            className={inputCls}
            required
          />
          <datalist id="ezyquick-destination-options">
            {DESTINATION_OPTIONS.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
          {fieldErrors.destination && (
            <p className="mt-1 text-xs font-medium text-red-700">{fieldErrors.destination}</p>
          )}
        </div>

        {/* Dates & Travellers */}
        <div>
          <label htmlFor="departureDate" className={labelCls}>
            Departure Date
          </label>
          <input
            id="departureDate"
            type="date"
            value={form.departureDate}
            onChange={(e) => update('departureDate', e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="returnDate" className={labelCls}>
            Return Date
          </label>
          <input
            id="returnDate"
            type="date"
            value={form.returnDate}
            onChange={(e) => update('returnDate', e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="travellers" className={labelCls}>
            Number of Travellers *
          </label>
          <input
            id="travellers"
            type="text"
            value={form.travellers}
            onChange={(e) => update('travellers', e.target.value)}
            placeholder="e.g. 2 Adults, 1 Child or 15 Delegates"
            className={inputCls}
            required
          />
          {fieldErrors.travellers && (
            <p className="mt-1 text-xs font-medium text-red-700">{fieldErrors.travellers}</p>
          )}
        </div>

        {/* Conditional Fields by Service */}
        {isCorporate && (
          <>
            <div>
              <label htmlFor="companyName" className={labelCls}>
                Company / Organisation Name
              </label>
              <input
                id="companyName"
                type="text"
                value={form.companyName}
                onChange={(e) => update('companyName', e.target.value)}
                placeholder="Organisation name"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="travelFrequency" className={labelCls}>
                Travel Frequency
              </label>
              <select
                id="travelFrequency"
                value={form.travelFrequency}
                onChange={(e) => update('travelFrequency', e.target.value)}
                className={inputCls}
              >
                <option value="One-time trip">One-time trip / event</option>
                <option value="Monthly recurring">Monthly recurring</option>
                <option value="Weekly executive travel">Weekly executive travel</option>
              </select>
            </div>
          </>
        )}

        {isLeisure && (
          <>
            <div>
              <label htmlFor="holidayType" className={labelCls}>
                Holiday Style
              </label>
              <select
                id="holidayType"
                value={form.holidayType}
                onChange={(e) => update('holidayType', e.target.value)}
                className={inputCls}
              >
                <option value="Family">Family Holiday</option>
                <option value="Honeymoon">Honeymoon / Couple</option>
                <option value="Group">Group / Friends</option>
                <option value="Luxury">Luxury / Boutique</option>
                <option value="Adventure">Adventure / Scenic</option>
              </select>
            </div>
            <div>
              <label htmlFor="budgetRange" className={labelCls}>
                Optional Comfort / Budget Range
              </label>
              <input
                id="budgetRange"
                type="text"
                value={form.budgetRange}
                onChange={(e) => update('budgetRange', e.target.value)}
                placeholder="Optional preference"
                className={inputCls}
              />
            </div>
          </>
        )}

        {isVisa && (
          <>
            <div>
              <label htmlFor="visaCategory" className={labelCls}>
                Visa Category
              </label>
              <select
                id="visaCategory"
                value={form.visaCategory}
                onChange={(e) => update('visaCategory', e.target.value)}
                className={inputCls}
              >
                <option value="Tourist">Tourist</option>
                <option value="Business">Business</option>
                <option value="Family Visit">Family Visit</option>
                <option value="Transit">Transit</option>
              </select>
            </div>
            <div>
              <label htmlFor="nationality" className={labelCls}>
                Passport Nationality (Country Only)
              </label>
              <input
                id="nationality"
                type="text"
                value={form.nationality}
                onChange={(e) => update('nationality', e.target.value)}
                placeholder="e.g. Indian, UAE Resident"
                className={inputCls}
              />
            </div>
          </>
        )}

        {isFlights && (
          <>
            <div>
              <label htmlFor="tripType" className={labelCls}>
                Trip Type
              </label>
              <select
                id="tripType"
                value={form.tripType}
                onChange={(e) => update('tripType', e.target.value)}
                className={inputCls}
              >
                <option value="Round trip">Round trip</option>
                <option value="One way">One way</option>
                <option value="Multi-city">Multi-city</option>
              </select>
            </div>
            <div>
              <label htmlFor="cabinClass" className={labelCls}>
                Cabin Class
              </label>
              <select
                id="cabinClass"
                value={form.cabinClass}
                onChange={(e) => update('cabinClass', e.target.value)}
                className={inputCls}
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First">First</option>
              </select>
            </div>
          </>
        )}

        {isHotels && (
          <div>
            <label htmlFor="hotelCategory" className={labelCls}>
              Preferred Hotel Category
            </label>
            <select
              id="hotelCategory"
              value={form.hotelCategory}
              onChange={(e) => update('hotelCategory', e.target.value)}
              className={inputCls}
            >
              <option value="3 Star">3 Star / Value</option>
              <option value="4 Star">4 Star / Executive</option>
              <option value="5 Star / Luxury">5 Star / Luxury Resort</option>
              <option value="Serviced / Extended Stay">Serviced / Extended Stay</option>
            </select>
          </div>
        )}

        {isMedical && (
          <div>
            <label htmlFor="attendants" className={labelCls}>
              Accompanying Family / Attendants
            </label>
            <input
              id="attendants"
              type="text"
              value={form.attendants}
              onChange={(e) => update('attendants', e.target.value)}
              placeholder="e.g. 1 attendant"
              className={inputCls}
            />
          </div>
        )}

        {isForex && (
          <div>
            <label htmlFor="currencyNeed" className={labelCls}>
              Destination Currency Needed
            </label>
            <input
              id="currencyNeed"
              type="text"
              value={form.currencyNeed}
              onChange={(e) => update('currencyNeed', e.target.value)}
              placeholder="e.g. AED, USD, THB, SGD"
              className={inputCls}
            />
          </div>
        )}
      </div>

      {/* Additional Requirements */}
      <div className="mt-5">
        <label htmlFor="specialRequirements" className={labelCls}>
          Additional Requirements or Preferences
        </label>
        <textarea
          id="specialRequirements"
          rows={4}
          value={form.specialRequirements}
          onChange={(e) => update('specialRequirements', e.target.value)}
          placeholder="Tell us about your preferred timing, hotel neighbourhood, flight flexibility, or group needs (no passport numbers or medical records)."
          className={inputCls}
        />
      </div>

      {/* Consent & Privacy */}
      <div className="mt-5">
        <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-[#475B78]">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => update('consent', e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#0059FD]"
            required
          />
          <span>
            I authorise EzyQuick Travel Solutions to contact me via phone, WhatsApp, or email
            regarding this travel enquiry. *
          </span>
        </label>
        {fieldErrors.consent && (
          <p className="mt-1 text-xs font-medium text-red-700">{fieldErrors.consent}</p>
        )}
        <p className="mt-2.5 text-[11px] leading-relaxed text-[#647896]">{SITE.privacyNotice}</p>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-kinetic px-7 py-3.5 text-sm disabled:opacity-60"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          <span>{status === 'submitting' ? 'Validating Brief…' : 'Review & Send Enquiry'}</span>
        </button>

        <p className="font-mono-hud text-[11px] text-[#647896]">
          Direct desk: {SITE.email}
        </p>
      </div>
    </form>
  );
}
