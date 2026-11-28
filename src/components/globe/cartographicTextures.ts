import * as THREE from 'three';
import { feature, mesh } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import countries50m from 'world-atlas/countries-50m.json';

export interface CartographicEarthTextures {
  albedoMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  dispose: () => void;
}

type Ring = number[][];

function drawRing(
  ctx: CanvasRenderingContext2D,
  ring: Ring,
  width: number,
  height: number,
  isFill: boolean
) {
  if (ring.length < 3) return;
  let wraps = false;
  for (let i = 1; i < ring.length; i++) {
    if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) {
      wraps = true;
      break;
    }
  }
  if (wraps) {
    // Skip antimeridian-wrapping rings on fill passes to prevent ocean streaks
    if (isFill) return;
    let prevX = ((ring[0][0] + 180) / 360) * width;
    let prevY = ((90 - ring[0][1]) / 180) * height;
    ctx.moveTo(prevX, prevY);
    for (let i = 1; i < ring.length; i++) {
      const x = ((ring[i][0] + 180) / 360) * width;
      const y = ((90 - ring[i][1]) / 180) * height;
      if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      prevX = x;
      prevY = y;
    }
    return;
  }

  const x0 = ((ring[0][0] + 180) / 360) * width;
  const y0 = ((90 - ring[0][1]) / 180) * height;
  ctx.moveTo(x0, y0);
  for (let i = 1; i < ring.length; i++) {
    const x = ((ring[i][0] + 180) / 360) * width;
    const y = ((90 - ring[i][1]) / 180) * height;
    ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function traceGeometry(
  ctx: CanvasRenderingContext2D,
  geometry: GeoJSON.Geometry,
  width: number,
  height: number,
  isFill: boolean
) {
  if (geometry.type === 'Polygon') {
    for (const ring of geometry.coordinates) drawRing(ctx, ring, width, height, isFill);
  } else if (geometry.type === 'MultiPolygon') {
    for (const poly of geometry.coordinates) {
      for (const ring of poly) drawRing(ctx, ring, width, height, isFill);
    }
  } else if (geometry.type === 'MultiLineString') {
    for (const line of geometry.coordinates) drawRing(ctx, line, width, height, false);
  } else if (geometry.type === 'LineString') {
    drawRing(ctx, geometry.coordinates, width, height, false);
  }
}

const COUNTRY_TONES = ['#FFFFFF', '#F3F7FD', '#E9F0FA', '#F7FAFE'] as const;

let cachedCountriesGeo: ReturnType<typeof feature> | null = null;
let cachedCountryBorders: ReturnType<typeof mesh> | null = null;

function getWorldVectorData() {
  if (!cachedCountriesGeo || !cachedCountryBorders) {
    const topo = countries50m as unknown as Topology<{
      countries: GeometryCollection;
      land: GeometryCollection;
    }>;
    cachedCountriesGeo = feature(topo, topo.objects.countries);
    cachedCountryBorders = mesh(topo, topo.objects.countries, (a, b) => a !== b);
  }
  return {
    countriesGeo: cachedCountriesGeo as GeoJSON.FeatureCollection,
    countryBorders: cachedCountryBorders,
  };
}

function normalizeIsoId(id: string | number | undefined | null): string {
  if (id === undefined || id === null) return '';
  return String(id).trim().padStart(3, '0');
}

function pickCountryTone(id: string | number | undefined): string {
  const num = Number.parseInt(String(id ?? '0'), 10);
  if (!Number.isFinite(num)) return COUNTRY_TONES[0];
  const idx = Math.abs((num * 7 + (num % 5) * 3) % COUNTRY_TONES.length);
  return COUNTRY_TONES[idx];
}

/**
 * Generates high-DPI sculptural cartographic Earth PBR textures from
 * Natural Earth 1:50m vector data (Public Domain) via world-atlas (ISC License),
 * styled in EzyQuick's Logo-Matched Royal Cobalt, Porcelain White & Solar Gold palette.
 */
export function buildCartographicEarthTextures(width = 2048): CartographicEarthTextures {
  const height = Math.round(width / 2);
  const { countriesGeo, countryBorders } = getWorldVectorData();

  const traceCountries = (ctx: CanvasRenderingContext2D, isFill: boolean) => {
    for (const f of countriesGeo.features) {
      if (f.geometry) traceGeometry(ctx, f.geometry, width, height, isFill);
    }
  };

  // 1. ALBEDO MAP — Luminous Royal Cobalt-Azure Oceans + Crisp Porcelain-White Multi-Tone Continents
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = width;
  albedoCanvas.height = height;
  const aCtx = albedoCanvas.getContext('2d')!;

  const oceanGrad = aCtx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#072052');
  oceanGrad.addColorStop(0.22, '#0B3E9E');
  oceanGrad.addColorStop(0.5, '#1360E2');
  oceanGrad.addColorStop(0.78, '#0B3E9E');
  oceanGrad.addColorStop(1, '#061A42');
  aCtx.fillStyle = oceanGrad;
  aCtx.fillRect(0, 0, width, height);

  // Subtle sky-white latitude/longitude cartographic graticule (15° intervals)
  aCtx.strokeStyle = 'rgba(186, 220, 255, 0.16)';
  aCtx.lineWidth = Math.max(0.75, width / 2048);
  aCtx.beginPath();
  for (let lng = -165; lng <= 180; lng += 15) {
    const x = ((lng + 180) / 360) * width;
    aCtx.moveTo(x, 0);
    aCtx.lineTo(x, height);
  }
  for (let lat = -75; lat <= 75; lat += 15) {
    const y = ((90 - lat) / 180) * height;
    aCtx.moveTo(0, y);
    aCtx.lineTo(width, y);
  }
  aCtx.stroke();

  // Soft Sky Azure coastal shallows glow beneath combined continental landmass
  aCtx.save();
  aCtx.beginPath();
  traceCountries(aCtx, true);
  aCtx.shadowColor = 'rgba(56, 189, 248, 0.52)';
  aCtx.shadowBlur = Math.max(9, width / 145);
  aCtx.fillStyle = '#F4F7FC';
  aCtx.fill('evenodd');
  aCtx.restore();

  // Subtle multi-tone crisp porcelain fill per country for clean geopolitical legibility
  for (const f of countriesGeo.features) {
    if (!f.geometry) continue;
    aCtx.beginPath();
    traceGeometry(aCtx, f.geometry, width, height, true);
    aCtx.fillStyle = pickCountryTone(f.id);
    aCtx.fill('evenodd');
  }

  // Crisp Midnight Sapphire coastline contour
  aCtx.beginPath();
  traceCountries(aCtx, false);
  aCtx.strokeStyle = 'rgba(9, 25, 51, 0.54)';
  aCtx.lineWidth = Math.max(0.95, width / 1500);
  aCtx.stroke();

  // Delicate Royal Cobalt geopolitical country borders
  aCtx.beginPath();
  traceGeometry(aCtx, countryBorders, width, height, false);
  aCtx.strokeStyle = 'rgba(11, 86, 232, 0.36)';
  aCtx.lineWidth = Math.max(0.75, width / 1900);
  aCtx.stroke();

  // 2. ROUGHNESS MAP (Satin reflective ocean ~0.46, crisp matte sculpted land ~0.92)
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const rCtx = roughCanvas.getContext('2d')!;
  rCtx.fillStyle = 'rgb(118, 118, 118)';
  rCtx.fillRect(0, 0, width, height);
  rCtx.beginPath();
  traceCountries(rCtx, true);
  rCtx.fillStyle = 'rgb(236, 236, 236)';
  rCtx.fill('evenodd');

  // 3. BUMP MAP (Subtle sculpted continental bevel catching studio key light)
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#000000';
  bCtx.fillRect(0, 0, width, height);
  bCtx.beginPath();
  traceCountries(bCtx, true);
  bCtx.fillStyle = '#d4d4d4';
  bCtx.fill('evenodd');

  const albedoMap = new THREE.CanvasTexture(albedoCanvas);
  albedoMap.colorSpace = THREE.SRGBColorSpace;
  albedoMap.anisotropy = 8;
  albedoMap.needsUpdate = true;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.anisotropy = 4;
  roughnessMap.needsUpdate = true;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.anisotropy = 4;
  bumpMap.needsUpdate = true;

  return {
    albedoMap,
    roughnessMap,
    bumpMap,
    dispose: () => {
      albedoMap.dispose();
      roughnessMap.dispose();
      bumpMap.dispose();
    },
  };
}

/**
 * Generates a lightweight transparent overlay texture that illuminates the active
 * departure country (Sky Azure) and selected destination country (EzyQuick Solar Gold)
 * using verified Natural Earth 1:50m ISO-3166 numeric polygons.
 */
export function buildSelectedCountryOverlayTexture(
  originCountryIso: string | null,
  selectedCountryIso: string | null,
  width = 2048
): THREE.CanvasTexture {
  const height = Math.round(width / 2);
  const { countriesGeo } = getWorldVectorData();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, width, height);

  const normOrigin = originCountryIso ? normalizeIsoId(originCountryIso) : '';
  const normSelected = selectedCountryIso ? normalizeIsoId(selectedCountryIso) : '';

  for (const f of countriesGeo.features) {
    if (!f.geometry) continue;
    const fId = normalizeIsoId(f.id);
    if (!fId) continue;

    if (normSelected && fId === normSelected) {
      ctx.save();
      ctx.beginPath();
      traceGeometry(ctx, f.geometry, width, height, true);
      ctx.fillStyle = 'rgba(252, 180, 0, 0.78)';
      ctx.shadowColor = 'rgba(252, 180, 0, 0.6)';
      ctx.shadowBlur = Math.max(8, width / 180);
      ctx.fill('evenodd');
      ctx.restore();

      ctx.beginPath();
      traceGeometry(ctx, f.geometry, width, height, false);
      ctx.strokeStyle = 'rgba(9, 25, 51, 0.92)';
      ctx.lineWidth = Math.max(1.5, width / 1100);
      ctx.stroke();
    } else if (normOrigin && fId === normOrigin) {
      ctx.save();
      ctx.beginPath();
      traceGeometry(ctx, f.geometry, width, height, true);
      ctx.fillStyle = 'rgba(96, 165, 250, 0.54)';
      ctx.fill('evenodd');
      ctx.restore();

      ctx.beginPath();
      traceGeometry(ctx, f.geometry, width, height, false);
      ctx.strokeStyle = 'rgba(11, 86, 232, 0.92)';
      ctx.lineWidth = Math.max(1.25, width / 1300);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
