'use client';

import { useMemo } from 'react';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import countries110m from 'world-atlas/countries-110m.json';
import { ATLAS_DESTINATIONS, ATLAS_HUBS, type AtlasDestination, type AtlasHub } from '@/data/atlas';

interface FallbackAtlas2DProps {
  visibleDestinations: AtlasDestination[];
  originHub: AtlasHub;
  selectedDestination: AtlasDestination | null;
  selectedHub: AtlasHub | null;
  onSelectDestination: (dest: AtlasDestination) => void;
  onSelectHub: (hub: AtlasHub) => void;
  reason?: string;
}

const MIN_LNG = 26;
const MAX_LNG = 132;
const MAX_LAT = 55;
const MIN_LAT = -18;
const SVG_W = 1000;
const SVG_H = 620;

function project(lat: number, lng: number): [number, number] {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * SVG_W;
  const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * SVG_H;
  return [x, y];
}

function ringToPath(ring: number[][]): string {
  if (ring.length < 3) return '';
  for (let i = 1; i < ring.length; i++) {
    if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) return '';
  }
  return (
    ring
      .map(([lng, lat], idx) => {
        const [x, y] = project(lat, lng);
        return `${idx === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ') + ' Z'
  );
}

const LABEL_OFFSETS: Record<string, { dx: number; dy: number; anchor?: 'start' | 'end' }> = {
  dubai: { dx: 10, dy: -6, anchor: 'start' },
  'abu-dhabi': { dx: -10, dy: 14, anchor: 'end' },
  phuket: { dx: -10, dy: 4, anchor: 'end' },
  krabi: { dx: 10, dy: -6, anchor: 'start' },
  'phu-quoc': { dx: 10, dy: 4, anchor: 'start' },
  singapore: { dx: 10, dy: 12, anchor: 'start' },
  malaysia: { dx: -10, dy: 2, anchor: 'end' },
  kerala: { dx: -10, dy: 4, anchor: 'end' },
};

export function FallbackAtlas2D({
  visibleDestinations,
  originHub,
  selectedDestination,
  selectedHub,
  onSelectDestination,
  onSelectHub,
  reason,
}: FallbackAtlas2DProps) {
  const visibleSlugs = useMemo(
    () => new Set(visibleDestinations.map((d) => d.slug)),
    [visibleDestinations]
  );

  const landPaths = useMemo(() => {
    const topo = countries110m as unknown as Topology<{
      countries: GeometryCollection;
    }>;
    const countries = feature(topo, topo.objects.countries);
    const paths: string[] = [];

    const pushGeo = (g: GeoJSON.Geometry) => {
      if (g.type === 'Polygon') {
        for (const r of g.coordinates) {
          const p = ringToPath(r);
          if (p) paths.push(p);
        }
      } else if (g.type === 'MultiPolygon') {
        for (const poly of g.coordinates) {
          for (const r of poly) {
            const p = ringToPath(r);
            if (p) paths.push(p);
          }
        }
      }
    };

    for (const f of countries.features) {
      if (f.geometry) pushGeo(f.geometry);
    }
    return paths;
  }, []);

  const activeArc = useMemo(() => {
    if (selectedDestination) {
      if (originHub.id === 'dubai' && selectedDestination.slug === 'dubai') return null;
      const [x1, y1] = project(originHub.lat, originHub.lng);
      const [x2, y2] = project(selectedDestination.lat, selectedDestination.lng);
      const mx = (x1 + x2) / 2;
      const my = Math.min(y1, y2) - Math.hypot(x2 - x1, y2 - y1) * 0.22;
      return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
    }
    if (selectedHub) {
      const [x1, y1] = project(ATLAS_HUBS[0].lat, ATLAS_HUBS[0].lng);
      const [x2, y2] = project(ATLAS_HUBS[1].lat, ATLAS_HUBS[1].lng);
      return `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 48} ${x2} ${y2}`;
    }
    return null;
  }, [originHub, selectedDestination, selectedHub]);

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center p-2 sm:p-4"
      role="region"
      aria-label="Interactive 2D EzyQuick Global Atlas Map"
    >
      {reason && (
        <p className="font-mono-hud mb-2 rounded-full border border-[#DCE8F8] bg-white/95 px-3 py-1 text-[11px] font-medium text-[#0C1E3A] shadow-sm">
          {reason}
        </p>
      )}

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="h-auto max-h-[60vh] w-full max-w-4xl rounded-3xl border border-[#DCE8F8] bg-[#143A78] shadow-[0_22px_50px_-16px_rgba(12,30,58,0.24)]"
        role="img"
        aria-label="Geographic map showing EzyQuick hubs in New Delhi and Dubai and 14 travel destinations"
      >
        <defs>
          <radialGradient id="naturalOcean" cx="52%" cy="46%" r="68%">
            <stop offset="0%" stopColor="#1B4E9B" />
            <stop offset="100%" stopColor="#0C244A" />
          </radialGradient>
        </defs>

        <rect width={SVG_W} height={SVG_H} fill="url(#naturalOcean)" />

        {[30, 45, 60, 75, 90, 105, 120].map((lng) => {
          const [x] = project(0, lng);
          return (
            <line
              key={`lng-${lng}`}
              x1={x}
              y1={0}
              x2={x}
              y2={SVG_H}
              stroke="rgba(220,232,248,0.12)"
              strokeWidth="1"
            />
          );
        })}
        {[-15, 0, 15, 30, 45].map((lat) => {
          const [, y] = project(lat, 0);
          return (
            <line
              key={`lat-${lat}`}
              x1={0}
              y1={y}
              x2={SVG_W}
              y2={y}
              stroke="rgba(220,232,248,0.12)"
              strokeWidth="1"
            />
          );
        })}

        {/* Sculptural Cloud-Pearl continents matching 3D Cartographic Atlas */}
        <g fill="#EAF2FC" stroke="rgba(12,30,58,0.45)" strokeWidth="1">
          {landPaths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* Active Origin -> Destination Illustrative Route */}
        {activeArc && (
          <path
            d={activeArc}
            fill="none"
            stroke="#FDBC03"
            strokeWidth="3"
            strokeDasharray="7 5"
          />
        )}

        {/* 14 Verified Destinations */}
        {ATLAS_DESTINATIONS.map((dest) => {
          const [cx, cy] = project(dest.lat, dest.lng);
          const isSelected = selectedDestination?.slug === dest.slug;
          const dimmed = !visibleSlugs.has(dest.slug);
          const offset = LABEL_OFFSETS[dest.slug] || { dx: 9, dy: 4, anchor: 'start' };
          return (
            <g
              key={dest.slug}
              onClick={() => onSelectDestination(dest)}
              className="cursor-pointer"
              opacity={dimmed ? 0.25 : 1}
              role="button"
              tabIndex={0}
              aria-label={`Select destination ${dest.name}, ${dest.country}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectDestination(dest);
                }
              }}
            >
              {isSelected && (
                <circle cx={cx} cy={cy} r={14} fill="rgba(110,200,255,0.32)" stroke="#6EC8FF" strokeWidth="2" />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 6.5 : 4.8}
                fill={isSelected ? '#FDBC03' : dest.region === 'India' ? '#6EC8FF' : '#FFFFFF'}
                stroke="#0C1E3A"
                strokeWidth="1.6"
              />
              <text
                x={cx + offset.dx}
                y={cy + offset.dy}
                textAnchor={offset.anchor || 'start'}
                fill="#FFFFFF"
                stroke="#0C1E3A"
                strokeWidth="3"
                paintOrder="stroke"
                fontSize={isSelected ? '12.5' : '10.8'}
                fontWeight={isSelected ? '700' : '600'}
              >
                {dest.name}
              </text>
            </g>
          );
        })}

        {/* Principal Hubs: DEL & DXB */}
        {ATLAS_HUBS.map((hub) => {
          const [cx, cy] = project(hub.lat, hub.lng);
          const isSelected = selectedHub?.id === hub.id;
          return (
            <g
              key={hub.id}
              onClick={() => onSelectHub(hub)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Select EzyQuick hub ${hub.city}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectHub(hub);
                }
              }}
            >
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 15 : 11}
                fill="rgba(253,188,3,0.25)"
                stroke="#FDBC03"
                strokeWidth="2"
              />
              <circle cx={cx} cy={cy} r={5.5} fill="#FDBC03" stroke="#0C1E3A" strokeWidth="1.8" />
              <text
                x={cx}
                y={cy - 16}
                textAnchor="middle"
                fill="#FDBC03"
                stroke="#0C1E3A"
                strokeWidth="3.2"
                paintOrder="stroke"
                fontSize="11"
                fontWeight="700"
              >
                {hub.code} HUB
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
