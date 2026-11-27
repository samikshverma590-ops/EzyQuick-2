'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGreatCircleArc, GLOBE_RADIUS } from '@/lib/geo';

export interface FlightTelemetry {
  position: THREE.Vector3;
  tangent: THREE.Vector3;
  normal: THREE.Vector3;
  progress: number;
}

interface Airplane3DProps {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  reducedMotion: boolean;
  telemetryRef?: React.MutableRefObject<FlightTelemetry | null>;
}

/**
 * Sculpted 3D EzyQuick Commercial Jet built from smooth aerodynamic geometry
 * (LatheGeometry fuselage, swept airfoil wings with Cobalt winglets, twin turbofan nacelles,
 * Solar Gold tail accent, wingtip navigation beacons, and smooth spherical banking & pitch).
 */
export function Airplane3D({ from, to, reducedMotion, telemetryRef }: Airplane3DProps) {
  const aircraftGroupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0.48);

  const curve = useMemo(() => {
    const pts = createGreatCircleArc(from, to, GLOBE_RADIUS + 0.048, 96);
    return new THREE.CatmullRomCurve3(pts);
  }, [from, to]);

  // Smooth aerodynamic fuselage profile via LatheGeometry (aligned along +Z nose to -Z tail)
  const { fuselageGeo, wingGeo, tailFinGeo, horizStabGeo } = useMemo(() => {
    const profile: THREE.Vector2[] = [
      new THREE.Vector2(0.0, 0.148),
      new THREE.Vector2(0.011, 0.134),
      new THREE.Vector2(0.02, 0.108),
      new THREE.Vector2(0.024, 0.07),
      new THREE.Vector2(0.024, -0.055),
      new THREE.Vector2(0.019, -0.095),
      new THREE.Vector2(0.01, -0.132),
      new THREE.Vector2(0.0, -0.15),
    ];
    const fGeo = new THREE.LatheGeometry(profile, 24);
    fGeo.rotateX(Math.PI / 2);

    // Swept-back main airfoil wings (rotateX(-PI/2) maps +Y shape -> -Z backward sweep)
    const wShape = new THREE.Shape();
    wShape.moveTo(0, -0.042);
    wShape.lineTo(0.168, 0.046);
    wShape.lineTo(0.168, 0.068);
    wShape.lineTo(0, 0.026);
    wShape.lineTo(-0.168, 0.068);
    wShape.lineTo(-0.168, 0.046);
    wShape.closePath();

    const wGeo = new THREE.ExtrudeGeometry(wShape, {
      depth: 0.0055,
      bevelEnabled: true,
      bevelThickness: 0.002,
      bevelSize: 0.002,
      bevelSegments: 2,
    });
    wGeo.rotateX(-Math.PI / 2);

    // Swept-back vertical tail fin (leading edge forward at +Z, trailing edge swept toward -Z)
    const finShape = new THREE.Shape();
    finShape.moveTo(0.042, 0);
    finShape.lineTo(-0.012, 0);
    finShape.lineTo(-0.044, 0.066);
    finShape.lineTo(-0.014, 0.066);
    finShape.closePath();

    const tGeo = new THREE.ExtrudeGeometry(finShape, {
      depth: 0.005,
      bevelEnabled: true,
      bevelThickness: 0.0015,
      bevelSize: 0.0015,
      bevelSegments: 2,
    });
    tGeo.translate(0, 0, -0.0025);
    tGeo.rotateY(Math.PI / 2);

    // Swept-back horizontal rear stabilizer
    const hShape = new THREE.Shape();
    hShape.moveTo(0, -0.016);
    hShape.lineTo(0.064, 0.018);
    hShape.lineTo(0.064, 0.032);
    hShape.lineTo(0, 0.014);
    hShape.lineTo(-0.064, 0.032);
    hShape.lineTo(-0.064, 0.018);
    hShape.closePath();

    const hGeo = new THREE.ExtrudeGeometry(hShape, {
      depth: 0.004,
      bevelEnabled: true,
      bevelThickness: 0.0012,
      bevelSize: 0.0012,
      bevelSegments: 2,
    });
    hGeo.rotateX(-Math.PI / 2);

    return { fuselageGeo: fGeo, wingGeo: wGeo, tailFinGeo: tGeo, horizStabGeo: hGeo };
  }, []);

  useEffect(() => {
    return () => {
      fuselageGeo.dispose();
      wingGeo.dispose();
      tailFinGeo.dispose();
      horizStabGeo.dispose();
    };
  }, [fuselageGeo, wingGeo, tailFinGeo, horizStabGeo]);

  // Reset flight cleanly near departure whenever origin or destination corridor changes
  useEffect(() => {
    progressRef.current = reducedMotion ? 0.5 : 0.28;
  }, [from.lat, from.lng, to.lat, to.lng, reducedMotion]);

  // Reusable math scratch objects (zero per-frame allocations)
  const scratchPos = useRef(new THREE.Vector3());
  const scratchTan = useRef(new THREE.Vector3());
  const scratchUp = useRef(new THREE.Vector3());
  const scratchRight = useRef(new THREE.Vector3());
  const scratchOrthUp = useRef(new THREE.Vector3());
  const scratchMat = useRef(new THREE.Matrix4());
  const scratchQuat = useRef(new THREE.Quaternion());
  const scratchBank = useRef(new THREE.Quaternion());
  const zAxis = useRef(new THREE.Vector3(0, 0, 1));
  const leftStrobeRef = useRef<THREE.Mesh>(null);
  const rightStrobeRef = useRef<THREE.Mesh>(null);
  const strobeClockRef = useRef(0);

  useFrame((_, delta) => {
    const group = aircraftGroupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.05);
    if (reducedMotion) {
      progressRef.current = 0.5;
    } else {
      progressRef.current = (progressRef.current + dt * 0.14) % 1;
      strobeClockRef.current += dt;
    }

    const t = progressRef.current;
    curve.getPointAt(t, scratchPos.current);
    curve.getTangentAt(t, scratchTan.current).normalize();

    // Local radial outward normal from Earth's center
    scratchUp.current.copy(scratchPos.current).normalize();
    scratchRight.current.crossVectors(scratchUp.current, scratchTan.current).normalize();
    scratchOrthUp.current.crossVectors(scratchTan.current, scratchRight.current).normalize();

    // Build orthonormal flight basis where +Z = forward tangent, +Y = radial up, +X = right wing
    scratchMat.current.makeBasis(
      scratchRight.current,
      scratchOrthUp.current,
      scratchTan.current
    );
    scratchQuat.current.setFromRotationMatrix(scratchMat.current);

    // Subtle organic banking sway during cruise (0 under reduced motion)
    if (!reducedMotion) {
      const bankRad = Math.sin(t * Math.PI * 2) * 0.15;
      scratchBank.current.setFromAxisAngle(zAxis.current, bankRad);
      scratchQuat.current.multiply(scratchBank.current);

      const pulse = 0.85 + 0.45 * Math.pow(Math.max(0, Math.sin(strobeClockRef.current * 4.5)), 4);
      leftStrobeRef.current?.scale.setScalar(pulse);
      rightStrobeRef.current?.scale.setScalar(pulse);
    }

    group.position.copy(scratchPos.current);
    group.quaternion.copy(scratchQuat.current);

    // Smooth scale ease-in at takeoff & gentle approach shrink near destination
    const edgeScale = Math.min(1, Math.sin(t * Math.PI) * 5.2 + 0.35);
    group.scale.setScalar(0.95 * edgeScale);

    if (telemetryRef) {
      if (!telemetryRef.current) {
        telemetryRef.current = {
          position: scratchPos.current.clone(),
          tangent: scratchTan.current.clone(),
          normal: scratchUp.current.clone(),
          progress: t,
        };
      } else {
        telemetryRef.current.position.copy(scratchPos.current);
        telemetryRef.current.tangent.copy(scratchTan.current);
        telemetryRef.current.normal.copy(scratchUp.current);
        telemetryRef.current.progress = t;
      }
    }
  });

  return (
    <group ref={aircraftGroupRef} raycast={() => null}>
      {/* Pearl White Aerodynamic Fuselage */}
      <mesh geometry={fuselageGeo}>
        <meshStandardMaterial color="#FFFFFF" roughness={0.22} metalness={0.18} />
      </mesh>

      {/* Deep Atlas Navy Cockpit Windshield Wrap */}
      <mesh position={[0, 0.008, 0.105]} scale={[1.02, 0.65, 1.35]}>
        <sphereGeometry args={[0.017, 16, 12]} />
        <meshStandardMaterial color="#0C1E3A" roughness={0.12} metalness={0.65} />
      </mesh>

      {/* Electric Cobalt Belly Fairing */}
      <mesh position={[0, -0.016, 0.005]} scale={[0.85, 0.45, 3.2]}>
        <sphereGeometry args={[0.02, 16, 12]} />
        <meshStandardMaterial color="#0059FD" roughness={0.28} metalness={0.2} />
      </mesh>

      {/* Swept Main Airfoil Wings */}
      <mesh geometry={wingGeo} position={[0, -0.002, 0.012]}>
        <meshStandardMaterial color="#F4F7FC" roughness={0.26} metalness={0.22} />
      </mesh>

      {/* Upturned Electric Cobalt Winglets */}
      <mesh position={[0.165, 0.009, -0.044]} rotation={[0.15, 0, -0.35]}>
        <boxGeometry args={[0.0045, 0.024, 0.02]} />
        <meshStandardMaterial color="#0059FD" roughness={0.25} />
      </mesh>
      <mesh position={[-0.165, 0.009, -0.044]} rotation={[0.15, 0, 0.35]}>
        <boxGeometry args={[0.0045, 0.024, 0.02]} />
        <meshStandardMaterial color="#0059FD" roughness={0.25} />
      </mesh>

      {/* Twin Underwing Turbofan Engines + Luminous Contrail Plumes */}
      {[-0.062, 0.062].map((x) => (
        <group key={x} position={[x, -0.015, 0.018]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0105, 0.009, 0.044, 16]} />
            <meshStandardMaterial color="#DCE8F8" roughness={0.25} metalness={0.45} />
          </mesh>
          <mesh position={[0, 0, 0.022]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0082, 0.0082, 0.004, 14]} />
            <meshStandardMaterial color="#0C1E3A" roughness={0.4} metalness={0.7} />
          </mesh>
          {/* Tapered Sky-Cyan & White Jet Contrail Vapor */}
          <mesh position={[0, 0, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.011, 0.22, 10, 1, true]} />
            <meshBasicMaterial
              color="#DCEEFF"
              transparent
              opacity={0.34}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* Vertical Tail Fin in Electric Cobalt + Solar Gold Stripe */}
      <mesh geometry={tailFinGeo} position={[0, 0.01, -0.102]}>
        <meshStandardMaterial color="#0059FD" roughness={0.25} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.042, -0.125]} rotation={[-0.36, 0, 0]}>
        <boxGeometry args={[0.0085, 0.013, 0.03]} />
        <meshStandardMaterial
          color="#FDBC03"
          emissive="#FDBC03"
          emissiveIntensity={0.45}
          roughness={0.25}
        />
      </mesh>

      {/* Horizontal Rear Tailplane */}
      <mesh geometry={horizStabGeo} position={[0, 0.008, -0.118]}>
        <meshStandardMaterial color="#DCE8F8" roughness={0.28} metalness={0.2} />
      </mesh>

      {/* Subtle Navigation Wingtip Beacons (Solar Gold + Sky Cyan) */}
      <mesh ref={rightStrobeRef} position={[0.168, 0.018, -0.048]}>
        <sphereGeometry args={[0.0058, 8, 8]} />
        <meshBasicMaterial color="#6EC8FF" />
      </mesh>
      <mesh ref={leftStrobeRef} position={[-0.168, 0.018, -0.048]}>
        <sphereGeometry args={[0.0058, 8, 8]} />
        <meshBasicMaterial color="#FDBC03" />
      </mesh>
    </group>
  );
}
