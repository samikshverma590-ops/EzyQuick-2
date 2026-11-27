import * as THREE from 'three';

export const GLOBE_RADIUS = 2.0;

/**
 * Converts geographic latitude & longitude (degrees) to a 3D Cartesian point
 * on a Three.js SphereGeometry whose UV seam sits at longitude ±180°.
 * Matches standard equirectangular projection (u = (lng + 180) / 360, v = (lat + 90) / 180).
 */
export function latLngToVector3(lat: number, lng: number, radius = GLOBE_RADIUS): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

/**
 * Generates smooth elevated great-circle arc points between two geographic coordinates.
 * Used strictly for illustrative geographic connections on demand.
 */
export function createGreatCircleArc(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  radius = GLOBE_RADIUS,
  segments = 72
): THREE.Vector3[] {
  const start = latLngToVector3(from.lat, from.lng, 1).normalize();
  const end = latLngToVector3(to.lat, to.lng, 1).normalize();

  const dot = THREE.MathUtils.clamp(start.dot(end), -1, 1);
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega);

  // Subtle altitude proportional to angular separation (keeps arcs refined, never cartoon-tall)
  const maxLift = THREE.MathUtils.clamp(omega * 0.22, 0.08, 0.42);
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    let dir: THREE.Vector3;

    if (sinOmega < 1e-4) {
      dir = start.clone().lerp(end, t).normalize();
    } else {
      const a = Math.sin((1 - t) * omega) / sinOmega;
      const b = Math.sin(t * omega) / sinOmega;
      dir = start
        .clone()
        .multiplyScalar(a)
        .add(end.clone().multiplyScalar(b))
        .normalize();
    }

    const elevation = Math.sin(Math.PI * t) * maxLift;
    points.push(dir.multiplyScalar(radius + 0.015 + elevation));
  }

  return points;
}

/**
 * Computes an optimal orbital camera position framing a target coordinate.
 */
export function cameraPositionForLatLng(
  lat: number,
  lng: number,
  distance = 4.65
): THREE.Vector3 {
  // Slight offset so the focused marker sits cleanly beside the HUD drawer on desktop
  return latLngToVector3(lat + 3.5, lng - 4, distance);
}

/**
 * Great-circle surface distance in kilometres (informational geographic context only).
 */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = THREE.MathUtils.degToRad(b.lat - a.lat);
  const dLng = THREE.MathUtils.degToRad(b.lng - a.lng);
  const lat1 = THREE.MathUtils.degToRad(a.lat);
  const lat2 = THREE.MathUtils.degToRad(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}
