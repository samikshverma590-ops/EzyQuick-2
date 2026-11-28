'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGreatCircleArc, GLOBE_RADIUS } from '@/lib/geo';
import type { FlightTelemetry } from './Airplane3D';

interface IllustrativeArcProps {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  reducedMotion: boolean;
  telemetryRef?: React.MutableRefObject<FlightTelemetry | null>;
}

/**
 * Progressively revealed illustrative great-circle connection arc synchronised with
 * the 3D aircraft flight choreography, styled in Ocean Teal (#0B56E8) & Champagne Gold (#F5A623).
 */
export function IllustrativeArc({
  from,
  to,
  reducedMotion,
  telemetryRef,
}: IllustrativeArcProps) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const pulseClockRef = useRef(0);

  const { curve, tubeGeo, glowGeo, totalTubeCount, totalGlowCount } = useMemo(() => {
    const pts = createGreatCircleArc(from, to, GLOBE_RADIUS + 0.016, 76);
    const c = new THREE.CatmullRomCurve3(pts);
    const tGeo = new THREE.TubeGeometry(c, 76, 0.0078, 10, false);
    const gGeo = new THREE.TubeGeometry(c, 76, 0.018, 8, false);
    return {
      curve: c,
      tubeGeo: tGeo,
      glowGeo: gGeo,
      totalTubeCount: tGeo.index ? tGeo.index.count : tGeo.attributes.position.count,
      totalGlowCount: gGeo.index ? gGeo.index.count : gGeo.attributes.position.count,
    };
  }, [from, to]);

  useEffect(() => {
    pulseClockRef.current = 0;
    return () => {
      tubeGeo.dispose();
      glowGeo.dispose();
    };
  }, [tubeGeo, glowGeo]);

  useFrame((_, delta) => {
    const reveal = reducedMotion
      ? 1
      : THREE.MathUtils.clamp(telemetryRef?.current?.routeReveal ?? 1, 0.04, 1);

    tubeGeo.setDrawRange(0, Math.floor(totalTubeCount * reveal));
    glowGeo.setDrawRange(0, Math.floor(totalGlowCount * reveal));

    if (!pulseRef.current) return;
    if (reducedMotion) {
      pulseRef.current.position.copy(curve.getPointAt(0.5));
      return;
    }
    pulseClockRef.current = (pulseClockRef.current + Math.min(delta, 0.05) * 0.24) % 1;
    const beaconPos = Math.min(reveal, pulseClockRef.current);
    pulseRef.current.position.copy(curve.getPointAt(Math.max(0.01, beaconPos)));
  });

  return (
    <group raycast={() => null}>
      {/* Core Champagne Gold & Warm Teal Route Arc */}
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color="#F5A623"
          emissive="#F5A623"
          emissiveIntensity={0.52}
          roughness={0.28}
        />
      </mesh>

      {/* Soft Ocean Teal Outer Halo */}
      <mesh geometry={glowGeo}>
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.26} depthWrite={false} />
      </mesh>

      {/* Restrained Champagne Gold Beacon */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.024, 16, 16]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#F5A623"
          emissiveIntensity={1.0}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
