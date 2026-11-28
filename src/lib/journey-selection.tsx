'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  ATLAS_DESTINATIONS,
  ATLAS_HUBS,
  INTERNATIONAL_ORIGINS,
  type AtlasDestination,
  type AtlasHub,
  type AtlasOriginCity,
  type AtlasRegionFilter,
} from '@/data/atlas';
import { SERVICE_OPTIONS } from '@/lib/enquiry-schema';

export type OriginHubName = string;

export type ConciergeGroupSize = 'Solo' | 'Couple' | 'Family' | 'Group / Corporate 8+';

export interface JourneySelection {
  origin: OriginHubName;
  destination: string | null;
  destinationSlug: string | null;
  service: (typeof SERVICE_OPTIONS)[number];
  travellers: number;
  regionFilter: AtlasRegionFilter;
  selectedHubId: 'delhi' | 'dubai' | null;
  conciergeOfferTag: string | null;
  conciergeGroupSize: ConciergeGroupSize;
}

export interface ConciergeOpenPatch {
  origin?: string;
  destination?: string | null;
  service?: string;
  offerTag?: string | null;
  groupSize?: ConciergeGroupSize;
  mode?: 'scroll' | 'drawer';
}

export interface JourneySelectionContextValue {
  selection: JourneySelection;
  originCity: AtlasOriginCity;
  originHub: AtlasHub;
  selectedDestination: AtlasDestination | null;
  selectedHub: AtlasHub | null;
  visibleDestinations: AtlasDestination[];
  conciergeDrawerOpen: boolean;
  setConciergeDrawerOpen: (open: boolean) => void;
  setConciergeOfferTag: (tag: string | null) => void;
  setConciergeGroupSize: (size: ConciergeGroupSize) => void;
  openConcierge: (patch?: ConciergeOpenPatch) => void;
  setOrigin: (origin: OriginHubName) => void;
  selectDestinationBySlug: (slug: string | null) => void;
  selectDestinationByName: (name: string | null) => void;
  selectHub: (hubId: 'delhi' | 'dubai' | null) => void;
  setService: (service: string) => void;
  setTravellers: (count: number) => void;
  setRegionFilter: (region: AtlasRegionFilter) => void;
  applySelectionPatch: (patch: Partial<{
    origin: string;
    destination: string | null;
    service: string;
    travellers: number;
  }>) => void;
  resetToGlobalView: () => void;
}

const DEFAULT_SELECTION: JourneySelection = {
  origin: 'New Delhi',
  destination: null,
  destinationSlug: null,
  service: 'Leisure Travel',
  travellers: 2,
  regionFilter: 'All',
  selectedHubId: null,
  conciergeOfferTag: 'Unlisted Hotel & Flight Desk Rates',
  conciergeGroupSize: 'Couple',
};

const JourneySelectionContext = createContext<JourneySelectionContextValue | null>(null);

function resolveDestinationByInput(input: string | null | undefined): AtlasDestination | null {
  if (!input) return null;
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;
  return (
    ATLAS_DESTINATIONS.find(
      (d) =>
        d.slug.toLowerCase() === normalized ||
        d.name.toLowerCase() === normalized ||
        `${d.name} (${d.country})`.toLowerCase() === normalized
    ) || null
  );
}

function resolveOriginCity(input: string | undefined): AtlasOriginCity {
  if (!input) return INTERNATIONAL_ORIGINS[0];
  const normalized = input.trim().toLowerCase();
  const exact = INTERNATIONAL_ORIGINS.find(
    (c) =>
      c.city.toLowerCase() === normalized ||
      c.id.toLowerCase() === normalized ||
      c.code.toLowerCase() === normalized
  );
  if (exact) return exact;
  if (normalized === 'uae') return INTERNATIONAL_ORIGINS[1];
  return INTERNATIONAL_ORIGINS[0];
}

function resolveOrigin(input: string | undefined): OriginHubName {
  return resolveOriginCity(input).city;
}

function resolveService(input: string | undefined): (typeof SERVICE_OPTIONS)[number] {
  if (!input) return 'Leisure Travel';
  const match = SERVICE_OPTIONS.find((s) => s.toLowerCase() === input.trim().toLowerCase());
  return match || 'Leisure Travel';
}

export function JourneySelectionProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<JourneySelection>(DEFAULT_SELECTION);
  const [conciergeDrawerOpen, setConciergeDrawerOpen] = useState(false);

  const setOrigin = useCallback((origin: OriginHubName) => {
    setSelection((prev) => ({
      ...prev,
      origin: resolveOrigin(origin),
    }));
  }, []);

  const selectDestinationBySlug = useCallback((slug: string | null) => {
    const dest = resolveDestinationByInput(slug);
    setSelection((prev) => ({
      ...prev,
      destination: dest ? dest.name : null,
      destinationSlug: dest ? dest.slug : null,
      selectedHubId: null,
    }));
  }, []);

  const selectDestinationByName = useCallback((name: string | null) => {
    const dest = resolveDestinationByInput(name);
    setSelection((prev) => ({
      ...prev,
      destination: dest ? dest.name : null,
      destinationSlug: dest ? dest.slug : null,
      selectedHubId: null,
    }));
  }, []);

  const selectHub = useCallback((hubId: 'delhi' | 'dubai' | null) => {
    setSelection((prev) => ({
      ...prev,
      selectedHubId: hubId,
      destination: null,
      destinationSlug: null,
      origin: hubId === 'dubai' ? 'Dubai' : hubId === 'delhi' ? 'New Delhi' : prev.origin,
    }));
  }, []);

  const setService = useCallback((service: string) => {
    setSelection((prev) => ({
      ...prev,
      service: resolveService(service),
    }));
  }, []);

  const setTravellers = useCallback((count: number) => {
    const clamped = Number.isFinite(count) ? Math.min(50, Math.max(1, Math.round(count))) : 2;
    setSelection((prev) => ({
      ...prev,
      travellers: clamped,
    }));
  }, []);

  const setConciergeOfferTag = useCallback((tag: string | null) => {
    setSelection((prev) => ({
      ...prev,
      conciergeOfferTag: tag,
    }));
  }, []);

  const setConciergeGroupSize = useCallback((size: ConciergeGroupSize) => {
    setSelection((prev) => ({
      ...prev,
      conciergeGroupSize: size,
    }));
  }, []);

  const openConcierge = useCallback((patch?: ConciergeOpenPatch) => {
    if (patch) {
      setSelection((prev) => {
        const nextOrigin = patch.origin !== undefined ? resolveOrigin(patch.origin) : prev.origin;
        const nextService =
          patch.service !== undefined ? resolveService(patch.service) : prev.service;
        const nextOffer =
          patch.offerTag !== undefined ? patch.offerTag : prev.conciergeOfferTag;
        const nextGroup =
          patch.groupSize !== undefined ? patch.groupSize : prev.conciergeGroupSize;

        if (patch.destination !== undefined) {
          const dest = resolveDestinationByInput(patch.destination);
          return {
            ...prev,
            origin: nextOrigin,
            service: nextService,
            conciergeOfferTag: nextOffer,
            conciergeGroupSize: nextGroup,
            destination: dest ? dest.name : patch.destination,
            destinationSlug: dest ? dest.slug : null,
            selectedHubId: null,
          };
        }

        return {
          ...prev,
          origin: nextOrigin,
          service: nextService,
          conciergeOfferTag: nextOffer,
          conciergeGroupSize: nextGroup,
        };
      });
    }

    if (patch?.mode === 'drawer') {
      setConciergeDrawerOpen(true);
      return;
    }

    if (typeof document !== 'undefined') {
      const target = document.getElementById('fast-track-concierge');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    setConciergeDrawerOpen(true);
  }, []);

  const setRegionFilter = useCallback((region: AtlasRegionFilter) => {
    setSelection((prev) => {
      const currentDest = prev.destinationSlug
        ? ATLAS_DESTINATIONS.find((d) => d.slug === prev.destinationSlug) || null
        : null;
      const keepDest =
        currentDest && (region === 'All' || currentDest.subregion === region);
      return {
        ...prev,
        regionFilter: region,
        selectedHubId: null,
        destination: keepDest ? currentDest.name : null,
        destinationSlug: keepDest ? currentDest.slug : null,
      };
    });
  }, []);

  const applySelectionPatch = useCallback(
    (
      patch: Partial<{
        origin: string;
        destination: string | null;
        service: string;
        travellers: number;
      }>
    ) => {
      setSelection((prev) => {
        const nextOrigin = patch.origin !== undefined ? resolveOrigin(patch.origin) : prev.origin;
        const nextService =
          patch.service !== undefined ? resolveService(patch.service) : prev.service;
        const nextTravellers =
          patch.travellers !== undefined && Number.isFinite(patch.travellers)
            ? Math.min(50, Math.max(1, Math.round(patch.travellers)))
            : prev.travellers;

        if (patch.destination !== undefined) {
          const dest = resolveDestinationByInput(patch.destination);
          return {
            ...prev,
            origin: nextOrigin,
            service: nextService,
            travellers: nextTravellers,
            destination: dest ? dest.name : null,
            destinationSlug: dest ? dest.slug : null,
            selectedHubId: null,
          };
        }

        return {
          ...prev,
          origin: nextOrigin,
          service: nextService,
          travellers: nextTravellers,
        };
      });
    },
    []
  );

  const resetToGlobalView = useCallback(() => {
    setSelection((prev) => ({
      ...prev,
      destination: null,
      destinationSlug: null,
      selectedHubId: null,
      regionFilter: 'All',
    }));
  }, []);

  const originCity = useMemo(() => resolveOriginCity(selection.origin), [selection.origin]);

  const originHub = useMemo(
    () => ATLAS_HUBS.find((h) => h.id === originCity.servicingDesk) || ATLAS_HUBS[0],
    [originCity.servicingDesk]
  );

  const selectedDestination = useMemo(
    () =>
      selection.destinationSlug
        ? ATLAS_DESTINATIONS.find((d) => d.slug === selection.destinationSlug) || null
        : null,
    [selection.destinationSlug]
  );

  const selectedHub = useMemo(
    () =>
      selection.selectedHubId
        ? ATLAS_HUBS.find((h) => h.id === selection.selectedHubId) || null
        : null,
    [selection.selectedHubId]
  );

  const visibleDestinations = useMemo(() => {
    if (selection.regionFilter === 'All') return ATLAS_DESTINATIONS;
    return ATLAS_DESTINATIONS.filter((d) => d.subregion === selection.regionFilter);
  }, [selection.regionFilter]);

  const value = useMemo<JourneySelectionContextValue>(
    () => ({
      selection,
      originCity,
      originHub,
      selectedDestination,
      selectedHub,
      visibleDestinations,
      conciergeDrawerOpen,
      setConciergeDrawerOpen,
      setConciergeOfferTag,
      setConciergeGroupSize,
      openConcierge,
      setOrigin,
      selectDestinationBySlug,
      selectDestinationByName,
      selectHub,
      setService,
      setTravellers,
      setRegionFilter,
      applySelectionPatch,
      resetToGlobalView,
    }),
    [
      selection,
      originCity,
      originHub,
      selectedDestination,
      selectedHub,
      visibleDestinations,
      conciergeDrawerOpen,
      setConciergeOfferTag,
      setConciergeGroupSize,
      openConcierge,
      setOrigin,
      selectDestinationBySlug,
      selectDestinationByName,
      selectHub,
      setService,
      setTravellers,
      setRegionFilter,
      applySelectionPatch,
      resetToGlobalView,
    ]
  );

  return (
    <JourneySelectionContext.Provider value={value}>
      {children}
    </JourneySelectionContext.Provider>
  );
}

export function useJourneySelection(): JourneySelectionContextValue {
  const ctx = useContext(JourneySelectionContext);
  if (!ctx) {
    throw new Error('useJourneySelection must be used within JourneySelectionProvider');
  }
  return ctx;
}
