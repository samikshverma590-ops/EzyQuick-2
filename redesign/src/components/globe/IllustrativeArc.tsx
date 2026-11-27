'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGreatCircleArc, GLOBE_RADIUS } from '@/lib/geo';

interface IllustrativeArcProps {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  reducedMotion: boolean;
}

/**
 * Renders an elevated great-circle illustrative geographic connection arc
 * in Electric Cobalt (#0059FD) + Sky Cyan (#6EC8FF) with a Solar Gold (#FDBC03) pulse.
 * Uses frame-rate-independent delta motion and cleans up GPU geometries on unmount.
 */
export function IllustrativeArc({ from, to, reducedMotion }: IllustrativeArcProps) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  const { curve, tubeGeo, glowGeo } = useMemo(() => {
    const pts = createGreatCircleArc(from, to, GLOBE_RADIUS + 0.015, 76);
    const c = new THREE.CatmullRomCurve3(pts);
    return {
      curve: c,
      tubeGeo: new THREE.TubeGeometry(c, 76, 0.008, 10, false),
      glowGeo: new THREE.TubeGeometry(c, 76, 0.019, 8, false),
    };
  }, [from, to]);

  useEffect(() => {
    progressRef.current = 0;
    return () => {
      tubeGeo.dispose();
      glowGeo.dispose();
    };
  }, [tubeGeo, glowGeo]);

  useFrame((_, delta) => {
    if (!pulseRef.current) return;
    if (reducedMotion) {
      pulseRef.current.position.copy(curve.getPointAt(0.5));
      return;
    }
    progressRef.current = (progressRef.current + Math.min(delta, 0.05) * 0.34) % 1;
    pulseRef.current.position.copy(curve.getPointAt(progressRef.current));
  });

  return (
    <group raycast={() => null}>
      {/* Core Electric Cobalt + Sky Cyan route arc */}
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color="#0059FD"
          emissive="#6EC8FF"
          emissiveIntensity={0.65}
          roughness={0.25}
        />
      </mesh>

      {/* Soft Sky Cyan outer sheath */}
      <mesh geometry={glowGeo}>
        <meshBasicMaterial color="#6EC8FF" transparent opacity={0.28} depthWrite={false} />
      </mesh>

      {/* Sparing Solar Gold travelling beacon */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial
          color="#FDBC03"
          emissive="#FDBC03"
          emissiveIntensity={1.1}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
