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

/**
 * Generates high-DPI sculptural cartographic Earth PBR textures from
 * Natural Earth 1:50m vector data (Public Domain) via world-atlas (ISC License),
 * styled in EzyQuick's official Atlas Blue, Cloud White, and Sky Cyan palette.
 *
 * Surface tonal variation and coastal halo are subtle procedural visual shading
 * for cartographic legibility — not real elevation or bathymetry measurements.
 */
export function buildCartographicEarthTextures(width = 2048): CartographicEarthTextures {
  const height = Math.round(width / 2);

  const topo = countries50m as unknown as Topology<{
    countries: GeometryCollection;
    land: GeometryCollection;
  }>;

  const countriesGeo = feature(topo, topo.objects.countries);
  const countryBorders = mesh(topo, topo.objects.countries, (a, b) => a !== b);

  const traceCountries = (ctx: CanvasRenderingContext2D, isFill: boolean) => {
    for (const f of countriesGeo.features) {
      if (f.geometry) traceGeometry(ctx, f.geometry, width, height, isFill);
    }
  };

  // 1. ALBEDO MAP — Luminous Atlas Cobalt-Marine Ocean + Crisp Cloud-Pearl Sculpted Continents
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = width;
  albedoCanvas.height = height;
  const aCtx = albedoCanvas.getContext('2d')!;

  const oceanGrad = aCtx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#0B2447');
  oceanGrad.addColorStop(0.22, '#123A78');
  oceanGrad.addColorStop(0.5, '#174A9C');
  oceanGrad.addColorStop(0.78, '#123A78');
  oceanGrad.addColorStop(1, '#0A1F3E');
  aCtx.fillStyle = oceanGrad;
  aCtx.fillRect(0, 0, width, height);

  // Subtle latitude/longitude cartographic graticule (15° intervals)
  aCtx.strokeStyle = 'rgba(110, 200, 255, 0.14)';
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

  // Soft Sky Cyan coastal shallows glow + sculptural bright Cloud-Pearl landmasses
  aCtx.save();
  aCtx.beginPath();
  traceCountries(aCtx, true);
  aCtx.shadowColor = 'rgba(110, 200, 255, 0.52)';
  aCtx.shadowBlur = Math.max(9, width / 145);

  const landGrad = aCtx.createLinearGradient(0, 0, 0, height);
  landGrad.addColorStop(0, '#F7FAFF');
  landGrad.addColorStop(0.22, '#EAF2FC');
  landGrad.addColorStop(0.5, '#DCE8F8');
  landGrad.addColorStop(0.78, '#E6F0FB');
  landGrad.addColorStop(1, '#F7FAFF');
  aCtx.fillStyle = landGrad;
  aCtx.fill('evenodd');
  aCtx.restore();

  // Crisp Deep Atlas Navy coastline contour
  aCtx.beginPath();
  traceCountries(aCtx, false);
  aCtx.strokeStyle = 'rgba(12, 30, 58, 0.56)';
  aCtx.lineWidth = Math.max(0.95, width / 1500);
  aCtx.stroke();

  // Delicate Secondary Atlas Blue geopolitical country borders
  aCtx.beginPath();
  traceGeometry(aCtx, countryBorders, width, height, false);
  aCtx.strokeStyle = 'rgba(23, 74, 156, 0.28)';
  aCtx.lineWidth = Math.max(0.65, width / 2100);
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
