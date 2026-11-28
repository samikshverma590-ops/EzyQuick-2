'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { createGreatCircleArc, GLOBE_RADIUS } from '@/lib/geo';
import { assetPath } from '@/lib/asset-path';

export interface FlightTelemetry {
  position: THREE.Vector3;
  tangent: THREE.Vector3;
  normal: THREE.Vector3;
  progress: number;
  routeReveal: number;
  phase: 'climb' | 'cruise' | 'approach' | 'settled';
}

interface Airplane3DProps {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  reducedMotion: boolean;
  replaySeq?: number;
  telemetryRef?: React.MutableRefObject<FlightTelemetry | null>;
}

const AIRLINER_GLB_URL = assetPath('/assets/models/a350.glb');
const FLIGHT_DURATION_SEC = 8.4;
const CONTRAIL_SEGMENTS = 34;

function easeInOutQuart(x: number): number {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

/**
 * Loads the real Airbus A350 glTF 2.0 commercial airliner (amvlab, CC BY 4.0),
 * centers its bounding box around the wing center-of-gravity, aligns nose -> +Z,
 * tail -> +Y, wings -> ±X, and refines its metallic pearlescent aviation finish.
 */
function AirbusA350Model() {
  const gltf = useGLTF(AIRLINER_GLB_URL);

  const { clonedScene, centerOffset, normalizedScale } = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.raycast = () => null;
        // Refine PBR livery material for crisp sunlit aviation sheen
        const mat = new THREE.MeshStandardMaterial({
          color: '#F8FAFF',
          roughness: 0.24,
          metalness: 0.26,
          envMapIntensity: 1.1,
        });
        mesh.material = mat;
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const targetSpan = 0.36;
    const scale = targetSpan / maxDim;

    return {
      clonedScene: clone,
      centerOffset: new THREE.Vector3(-center.x, -center.y, -center.z),
      normalizedScale: scale,
    };
  }, [gltf.scene]);

  useEffect(() => {
    return () => {
      clonedScene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mat = (obj as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat?.dispose();
        }
      });
    };
  }, [clonedScene]);

  return (
    <group rotation={[0, -Math.PI / 2, 0]} scale={normalizedScale}>
      <primitive object={clonedScene} position={centerOffset} />
    </group>
  );
}

/**
 * Realistic 3D Airbus A350 commercial airliner (amvlab, CC BY 4.0) with:
 *   1. Authentic 4-phase aviation flight physics:
 *      Takeoff nose-up rotation -> aerodynamic banked climb -> level cruise -> smooth descent flare
 *   2. Real curved 3D dual-engine contrail ribbons dynamically following the spline behind the jet
 *   3. Authentic aviation navigation lights: Red Port, Green Starboard, pulsing White Wingtip Strobes,
 *      and EzyQuick Solar Gold anti-collision belly beacon
 */
export function Airplane3D({
  from,
  to,
  reducedMotion,
  replaySeq = 0,
  telemetryRef,
}: Airplane3DProps) {
  const aircraftGroupRef = useRef<THREE.Group>(null);
  const leftStrobeRef = useRef<THREE.Mesh>(null);
  const rightStrobeRef = useRef<THREE.Mesh>(null);
  const bellyBeaconRef = useRef<THREE.Mesh>(null);

  const elapsedRef = useRef(0);
  const hasInitializedQuatRef = useRef(false);

  // Build an organic 3D transcontinental flight spline with realistic climb/cruise/approach altitude
  // and a graceful lateral curve so aerodynamic banking looks authentic and cinematic.
  const curve = useMemo(() => {
    const basePts = createGreatCircleArc(from, to, GLOBE_RADIUS + 0.02, 112);
    const total = basePts.length;
    const sculptedPts: THREE.Vector3[] = [];

    const tmpNorm = new THREE.Vector3();
    const tmpTan = new THREE.Vector3();
    const tmpSide = new THREE.Vector3();

    for (let i = 0; i < total; i++) {
      const u = i / (total - 1);
      const pt = basePts[i].clone();
      tmpNorm.copy(pt).normalize();

      const prevPt = basePts[Math.max(0, i - 1)];
      const nextPt = basePts[Math.min(total - 1, i + 1)];
      tmpTan.subVectors(nextPt, prevPt).normalize();
      tmpSide.crossVectors(tmpNorm, tmpTan).normalize();

      // Realistic aviation altitude envelope: smooth takeoff climb -> high cruise plateau -> gentle descent
      const climbCurve = Math.sin(u * Math.PI);
      const cruiseAlt = 0.024 + 0.105 * Math.pow(climbCurve, 0.64);
      // Graceful lateral S-curve for natural aerodynamic roll banking
      const lateralOffset = Math.sin(u * Math.PI * 2) * 0.052 * climbCurve;

      pt.copy(tmpNorm)
        .multiplyScalar(GLOBE_RADIUS + cruiseAlt)
        .addScaledVector(tmpSide, lateralOffset);
      sculptedPts.push(pt);
    }

    return new THREE.CatmullRomCurve3(sculptedPts);
  }, [from, to]);

  // Dynamic curved 3D dual-engine contrail ribbons (updated in world-space along the spline each frame)
  const { leftRibbonGeo, rightRibbonGeo, ribbonMat } = useMemo(() => {
    const createRibbonGeo = () => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(CONTRAIL_SEGMENTS * 2 * 3);
      const colors = new Float32Array(CONTRAIL_SEGMENTS * 2 * 3);
      const indices: number[] = [];

      for (let i = 0; i < CONTRAIL_SEGMENTS; i++) {
        const fade = 1 - i / (CONTRAIL_SEGMENTS - 1);
        const intensity = Math.pow(fade, 1.5);
        // Bright porcelain-sky core fading smoothly into transparent blue atmosphere
        colors[i * 6 + 0] = 0.72 + 0.28 * intensity;
        colors[i * 6 + 1] = 0.86 + 0.14 * intensity;
        colors[i * 6 + 2] = 1.0;
        colors[i * 6 + 3] = 0.72 + 0.28 * intensity;
        colors[i * 6 + 4] = 0.86 + 0.14 * intensity;
        colors[i * 6 + 5] = 1.0;

        if (i < CONTRAIL_SEGMENTS - 1) {
          const a = i * 2;
          const b = a + 1;
          const c = a + 2;
          const d = a + 3;
          indices.push(a, b, c, b, d, c);
        }
      }

      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geo.setIndex(indices);
      return geo;
    };

    const mat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    return {
      leftRibbonGeo: createRibbonGeo(),
      rightRibbonGeo: createRibbonGeo(),
      ribbonMat: mat,
    };
  }, []);

  useEffect(() => {
    return () => {
      leftRibbonGeo.dispose();
      rightRibbonGeo.dispose();
      ribbonMat.dispose();
    };
  }, [leftRibbonGeo, rightRibbonGeo, ribbonMat]);

  // Reset departure choreography whenever route or replaySeq changes
  useEffect(() => {
    elapsedRef.current = reducedMotion ? FLIGHT_DURATION_SEC : 0;
    hasInitializedQuatRef.current = false;
  }, [from.lat, from.lng, to.lat, to.lng, replaySeq, reducedMotion]);

  // Pre-allocated scratch math objects (zero per-frame allocations)
  const scratchPos = useRef(new THREE.Vector3());
  const scratchPrevPos = useRef(new THREE.Vector3());
  const scratchNextPos = useRef(new THREE.Vector3());
  const scratchTan = useRef(new THREE.Vector3());
  const scratchTanPrev = useRef(new THREE.Vector3());
  const scratchTanNext = useRef(new THREE.Vector3());
  const scratchCurvature = useRef(new THREE.Vector3());
  const scratchUp = useRef(new THREE.Vector3());
  const scratchRight = useRef(new THREE.Vector3());
  const scratchOrthUp = useRef(new THREE.Vector3());
  const scratchMat = useRef(new THREE.Matrix4());
  const targetQuat = useRef(new THREE.Quaternion());
  const bankQuat = useRef(new THREE.Quaternion());
  const pitchQuat = useRef(new THREE.Quaternion());
  const zAxis = useRef(new THREE.Vector3(0, 0, 1));
  const xAxis = useRef(new THREE.Vector3(1, 0, 0));

  // Scratch vectors for curved contrail ribbon updates
  const trailPt = useRef(new THREE.Vector3());
  const trailTan = useRef(new THREE.Vector3());
  const trailUp = useRef(new THREE.Vector3());
  const trailRight = useRef(new THREE.Vector3());
  const engineCenter = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const group = aircraftGroupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.05);
    if (!reducedMotion) {
      elapsedRef.current += dt;
    }

    const elapsed = elapsedRef.current;
    let t = 0.64;
    let routeReveal = 1;
    let phase: FlightTelemetry['phase'] = 'settled';
    let visualScale = 1.0;
    let extraPitch = 0;
    let trailLength = 0.14;
    let trailOpacity = 0.36;

    if (reducedMotion) {
      t = 0.58;
      routeReveal = 1;
      phase = 'settled';
      visualScale = 1.0;
      trailLength = 0.12;
      trailOpacity = 0.28;
    } else if (elapsed < FLIGHT_DURATION_SEC) {
      const rawNorm = THREE.MathUtils.clamp(elapsed / FLIGHT_DURATION_SEC, 0, 1);
      // Smooth takeoff acceleration -> brisk transcontinental cruise -> poised deceleration
      const eased = 0.45 * rawNorm + 0.55 * easeInOutQuart(rawNorm);
      t = 0.03 + eased * 0.74;
      routeReveal = THREE.MathUtils.clamp(eased * 1.08, 0.02, 1);

      if (rawNorm < 0.18) {
        phase = 'climb';
        // Authentic nose-up takeoff rotation
        const rotFactor = Math.sin((rawNorm / 0.18) * Math.PI);
        extraPitch = -0.22 * rotFactor;
      } else if (rawNorm < 0.78) {
        phase = 'cruise';
      } else {
        phase = 'approach';
        // Gentle landing flare near destination
        const flareFactor = Math.sin(((rawNorm - 0.78) / 0.22) * Math.PI);
        extraPitch = -0.09 * flareFactor;
      }

      const takeoffScale = THREE.MathUtils.smoothstep(rawNorm, 0, 0.14);
      visualScale = 0.62 + 0.42 * takeoffScale;
      trailLength = 0.03 + 0.15 * Math.sin(rawNorm * Math.PI);
      trailOpacity = 0.14 + 0.34 * Math.sin(rawNorm * Math.PI);
    } else {
      // Poised high-altitude showcase cruise: subtle aerodynamic breathing, never jarring
      const idleSec = elapsed - FLIGHT_DURATION_SEC;
      t = 0.77 + Math.sin(idleSec * 0.32) * 0.011;
      routeReveal = 1;
      phase = 'settled';
      visualScale = 1.04;
      trailLength = 0.11;
      trailOpacity = 0.26 + Math.sin(idleSec * 1.1) * 0.05;
    }

    const eps = 0.016;
    const tPrev = Math.max(0.001, t - eps);
    const tNext = Math.min(0.999, t + eps);

    curve.getPointAt(t, scratchPos.current);
    curve.getPointAt(tPrev, scratchPrevPos.current);
    curve.getPointAt(tNext, scratchNextPos.current);
    curve.getTangentAt(t, scratchTan.current).normalize();
    curve.getTangentAt(tPrev, scratchTanPrev.current).normalize();
    curve.getTangentAt(tNext, scratchTanNext.current).normalize();

    // Orthonormal flight basis (+Z forward tangent, +Y radial up, +X right wing)
    scratchUp.current.copy(scratchPos.current).normalize();
    scratchRight.current.crossVectors(scratchUp.current, scratchTan.current).normalize();
    scratchOrthUp.current.crossVectors(scratchTan.current, scratchRight.current).normalize();

    scratchMat.current.makeBasis(
      scratchRight.current,
      scratchOrthUp.current,
      scratchTan.current
    );
    targetQuat.current.setFromRotationMatrix(scratchMat.current);

    if (!reducedMotion) {
      // Curvature-derived aerodynamic roll banking into turns
      scratchCurvature.current.crossVectors(scratchTanPrev.current, scratchTanNext.current);
      const turnSigned = scratchCurvature.current.dot(scratchUp.current);
      const subtleRollBreath = Math.sin(elapsed * 0.9) * 0.035;
      const bankRad = THREE.MathUtils.clamp(turnSigned * 11.5 + subtleRollBreath, -0.44, 0.44);
      bankQuat.current.setFromAxisAngle(zAxis.current, bankRad);
      targetQuat.current.multiply(bankQuat.current);

      // Altitude-slope pitch + takeoff rotation / approach flare
      const altSlope = scratchNextPos.current.length() - scratchPrevPos.current.length();
      const pitchRad = THREE.MathUtils.clamp(-altSlope * 4.8 + extraPitch, -0.28, 0.18);
      pitchQuat.current.setFromAxisAngle(xAxis.current, pitchRad);
      targetQuat.current.multiply(pitchQuat.current);

      // Double-flash realistic commercial airliner wingtip strobes & anti-collision beacon
      const strobeCycle = (elapsed * 1.15) % 1;
      const strobeFlash =
        (strobeCycle > 0.02 && strobeCycle < 0.07) || (strobeCycle > 0.12 && strobeCycle < 0.17)
          ? 1.75
          : 0.72;
      leftStrobeRef.current?.scale.setScalar(strobeFlash);
      rightStrobeRef.current?.scale.setScalar(strobeFlash);

      const beaconCycle = (elapsed * 0.85 + 0.5) % 1;
      const beaconFlash = beaconCycle < 0.12 ? 1.55 : 0.6;
      bellyBeaconRef.current?.scale.setScalar(beaconFlash);
    }

    group.position.copy(scratchPos.current);
    if (!hasInitializedQuatRef.current || reducedMotion) {
      group.quaternion.copy(targetQuat.current);
      hasInitializedQuatRef.current = true;
    } else {
      group.quaternion.slerp(targetQuat.current, 1 - Math.exp(-7.2 * dt));
    }

    group.scale.setScalar(visualScale);

    // Update curved 3D dual-engine contrail ribbons along the spline behind the jet
    ribbonMat.opacity = trailOpacity;
    const engineSpread = 0.056 * visualScale;
    const leftPosAttr = leftRibbonGeo.attributes.position as THREE.BufferAttribute;
    const rightPosAttr = rightRibbonGeo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < CONTRAIL_SEGMENTS; i++) {
      const frac = i / (CONTRAIL_SEGMENTS - 1);
      const uSample = Math.max(0.002, t - 0.012 - frac * trailLength);
      curve.getPointAt(uSample, trailPt.current);
      curve.getTangentAt(uSample, trailTan.current).normalize();
      trailUp.current.copy(trailPt.current).normalize();
      trailRight.current.crossVectors(trailUp.current, trailTan.current).normalize();

      // Contrail expands slightly as it disperses in high-altitude air
      const halfWidth = (0.0045 + frac * 0.011) * visualScale * (1 - frac * 0.55);

      // Left engine contrail
      engineCenter.current
        .copy(trailPt.current)
        .addScaledVector(trailRight.current, -engineSpread)
        .addScaledVector(trailUp.current, -0.006 * visualScale);
      leftPosAttr.setXYZ(
        i * 2,
        engineCenter.current.x - trailRight.current.x * halfWidth,
        engineCenter.current.y - trailRight.current.y * halfWidth,
        engineCenter.current.z - trailRight.current.z * halfWidth
      );
      leftPosAttr.setXYZ(
        i * 2 + 1,
        engineCenter.current.x + trailRight.current.x * halfWidth,
        engineCenter.current.y + trailRight.current.y * halfWidth,
        engineCenter.current.z + trailRight.current.z * halfWidth
      );

      // Right engine contrail
      engineCenter.current
        .copy(trailPt.current)
        .addScaledVector(trailRight.current, engineSpread)
        .addScaledVector(trailUp.current, -0.006 * visualScale);
      rightPosAttr.setXYZ(
        i * 2,
        engineCenter.current.x - trailRight.current.x * halfWidth,
        engineCenter.current.y - trailRight.current.y * halfWidth,
        engineCenter.current.z - trailRight.current.z * halfWidth
      );
      rightPosAttr.setXYZ(
        i * 2 + 1,
        engineCenter.current.x + trailRight.current.x * halfWidth,
        engineCenter.current.y + trailRight.current.y * halfWidth,
        engineCenter.current.z + trailRight.current.z * halfWidth
      );
    }
    leftPosAttr.needsUpdate = true;
    rightPosAttr.needsUpdate = true;

    if (telemetryRef) {
      if (!telemetryRef.current) {
        telemetryRef.current = {
          position: scratchPos.current.clone(),
          tangent: scratchTan.current.clone(),
          normal: scratchUp.current.clone(),
          progress: t,
          routeReveal,
          phase,
        };
      } else {
        telemetryRef.current.position.copy(scratchPos.current);
        telemetryRef.current.tangent.copy(scratchTan.current);
        telemetryRef.current.normal.copy(scratchUp.current);
        telemetryRef.current.progress = t;
        telemetryRef.current.routeReveal = routeReveal;
        telemetryRef.current.phase = phase;
      }
    }
  });

  return (
    <group raycast={() => null}>
      {/* Curved 3D Dual-Engine Contrail Ribbons */}
      <mesh geometry={leftRibbonGeo} material={ribbonMat} frustumCulled={false} />
      <mesh geometry={rightRibbonGeo} material={ribbonMat} frustumCulled={false} />

      {/* Real Airbus A350 Wide-Body Commercial Airliner + Authentic Aviation Lighting */}
      <group ref={aircraftGroupRef} raycast={() => null}>
        <Suspense fallback={null}>
          <AirbusA350Model />
        </Suspense>

        {/* Port (Left) Red Navigation Light + Strobe */}
        <mesh ref={leftStrobeRef} position={[-0.172, 0.012, -0.042]}>
          <sphereGeometry args={[0.0065, 10, 10]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>

        {/* Starboard (Right) Green Navigation Light + Strobe */}
        <mesh ref={rightStrobeRef} position={[0.172, 0.012, -0.042]}>
          <sphereGeometry args={[0.0065, 10, 10]} />
          <meshBasicMaterial color="#22C55E" />
        </mesh>

        {/* EzyQuick Solar Gold Anti-Collision Beacon */}
        <mesh ref={bellyBeaconRef} position={[0, 0.022, 0.01]}>
          <sphereGeometry args={[0.0055, 10, 10]} />
          <meshBasicMaterial color="#FCB400" />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload(AIRLINER_GLB_URL);
