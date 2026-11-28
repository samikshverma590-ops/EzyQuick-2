'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { cameraPositionForLatLng } from '@/lib/geo';
import type { AtlasRegionFilter } from '@/data/atlas';
import type { FlightTelemetry } from './Airplane3D';

export const GLOBAL_VIEW_COORDS = { lat: 21, lng: 68 };
export const DEFAULT_CAMERA_DISTANCE = 6.2;

export const REGION_VIEW_PRESETS: Record<
  AtlasRegionFilter,
  { lat: number; lng: number; distance: number }
> = {
  All: { lat: 21, lng: 68, distance: 6.2 },
  India: { lat: 20, lng: 79, distance: 5.2 },
  'Middle East': { lat: 24.8, lng: 55, distance: 5.05 },
  'Southeast Asia': { lat: 4, lng: 105, distance: 5.25 },
  'South & Central Asia': { lat: 25, lng: 78, distance: 5.35 },
};

interface CameraRigProps {
  focusTarget: { lat: number; lng: number; distance?: number } | null;
  regionFilter: AtlasRegionFilter;
  followFlight: boolean;
  flightTelemetryRef: React.MutableRefObject<FlightTelemetry | null>;
  zoomEvent: { delta: number; seq: number };
  resetCounter: number;
  reducedMotion: boolean;
  isMobile: boolean;
}

/**
 * Cinematic camera rig with permanent trackpad/wheel scroll protection:
 * OrbitControls uses enableZoom={false} so two-finger vertical trackpad gestures
 * and mouse-wheel scrolling ALWAYS scroll the webpage normally.
 * Intentional camera zoom is handled explicitly via the +/- UI buttons.
 */
export function CameraRig({
  focusTarget,
  regionFilter,
  followFlight,
  flightTelemetryRef,
  zoomEvent,
  resetCounter,
  reducedMotion,
  isMobile,
}: CameraRigProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const desiredPosRef = useRef<THREE.Vector3 | null>(null);
  const userInteractingRef = useRef(false);
  const lastRegionRef = useRef<AtlasRegionFilter>('All');
  const sunLightRef = useRef<THREE.DirectionalLight>(null);

  const baseDist = isMobile ? 6.55 : DEFAULT_CAMERA_DISTANCE;

  // Restore pan-y touchAction after OrbitControls.connect() sets touchAction='none'
  // so normal vertical touch swipes scroll the page naturally even over the 3D canvas.
  useEffect(() => {
    const dom = controlsRef.current?.domElement;
    if (dom) {
      dom.style.touchAction = 'pan-y';
    }
  }, []);

  // Initial atmospheric reveal: gently glide from slightly wider perspective into poised framing
  useEffect(() => {
    const startPos = cameraPositionForLatLng(
      GLOBAL_VIEW_COORDS.lat + (reducedMotion ? 0 : 3),
      GLOBAL_VIEW_COORDS.lng - (reducedMotion ? 0 : 8),
      reducedMotion ? baseDist : baseDist + 0.58
    );
    camera.position.copy(startPos);
    camera.lookAt(0, 0, 0);

    if (!reducedMotion) {
      desiredPosRef.current = cameraPositionForLatLng(
        GLOBAL_VIEW_COORDS.lat,
        GLOBAL_VIEW_COORDS.lng,
        baseDist
      );
    }
  }, [camera, baseDist, reducedMotion]);

  useEffect(() => {
    if (!focusTarget || followFlight) return;
    const dist = focusTarget.distance ?? (isMobile ? 5.55 : 5.55);
    const nextPos = cameraPositionForLatLng(focusTarget.lat, focusTarget.lng, dist);
    if (reducedMotion) {
      camera.position.copy(nextPos);
      camera.lookAt(0, 0, 0);
      desiredPosRef.current = null;
    } else {
      desiredPosRef.current = nextPos;
    }
  }, [focusTarget, followFlight, reducedMotion, isMobile, camera]);

  useEffect(() => {
    if (regionFilter === lastRegionRef.current) return;
    lastRegionRef.current = regionFilter;
    if (focusTarget || followFlight) return;

    const preset = REGION_VIEW_PRESETS[regionFilter];
    const dist = isMobile ? preset.distance + 0.6 : preset.distance;
    const nextPos = cameraPositionForLatLng(preset.lat, preset.lng, dist);
    if (reducedMotion) {
      camera.position.copy(nextPos);
      camera.lookAt(0, 0, 0);
      desiredPosRef.current = null;
    } else {
      desiredPosRef.current = nextPos;
    }
  }, [regionFilter, focusTarget, followFlight, isMobile, reducedMotion, camera]);

  useEffect(() => {
    if (resetCounter === 0) return;
    lastRegionRef.current = 'All';
    const homePos = cameraPositionForLatLng(
      GLOBAL_VIEW_COORDS.lat,
      GLOBAL_VIEW_COORDS.lng,
      baseDist
    );
    if (reducedMotion) {
      camera.position.copy(homePos);
      camera.lookAt(0, 0, 0);
      desiredPosRef.current = null;
    } else {
      desiredPosRef.current = homePos;
    }
  }, [resetCounter, baseDist, reducedMotion, camera]);

  useEffect(() => {
    if (zoomEvent.seq === 0) return;
    const currentLen = camera.position.length();
    const targetLen = THREE.MathUtils.clamp(currentLen + zoomEvent.delta, 3.4, 7.2);
    const dir = camera.position.clone().normalize();
    desiredPosRef.current = dir.multiplyScalar(targetLen);
  }, [zoomEvent, camera]);

  // Pre-allocated scratch vectors (zero per-frame GC allocations)
  const upVec = useRef(new THREE.Vector3(0, 1, 0));
  const rightVec = useRef(new THREE.Vector3());
  const lightPos = useRef(new THREE.Vector3());
  const chaseTarget = useRef(new THREE.Vector3());
  const scratchCamDir = useRef(new THREE.Vector3());
  const scratchTargetDir = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (followFlight && flightTelemetryRef.current && !userInteractingRef.current) {
      const { position, tangent, normal } = flightTelemetryRef.current;
      const chaseDist = isMobile ? 2.55 : 2.25;
      chaseTarget.current
        .copy(position)
        .addScaledVector(normal, chaseDist)
        .addScaledVector(tangent, -0.92);
      const factor = 1 - Math.exp(-3.1 * dt);
      camera.position.lerp(chaseTarget.current, factor);
    } else if (desiredPosRef.current && !userInteractingRef.current) {
      scratchCamDir.current.copy(camera.position).normalize();
      scratchTargetDir.current.copy(desiredPosRef.current).normalize();
      const currentLen = camera.position.length();
      const targetLen = desiredPosRef.current.length();

      const factor = 1 - Math.exp(-3.6 * dt);
      scratchCamDir.current.lerp(scratchTargetDir.current, factor).normalize();
      const nextLen = THREE.MathUtils.lerp(currentLen, targetLen, factor);
      camera.position.copy(scratchCamDir.current).multiplyScalar(nextLen);

      if (camera.position.distanceTo(desiredPosRef.current) < 0.018) {
        desiredPosRef.current = null;
      }
    }

    // Warm daylight studio key light gently tracking the viewing hemisphere
    if (sunLightRef.current) {
      scratchCamDir.current.copy(camera.position).normalize();
      rightVec.current.crossVectors(upVec.current, scratchCamDir.current).normalize();
      lightPos.current
        .copy(scratchCamDir.current)
        .multiplyScalar(9)
        .addScaledVector(rightVec.current, -3.2)
        .addScaledVector(upVec.current, 4.2);
      sunLightRef.current.position.copy(lightPos.current);
    }

    controlsRef.current?.update();
  });

  return (
    <>
      <directionalLight ref={sunLightRef} intensity={2.35} color="#FFFBF2" />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.075}
        rotateSpeed={0.52}
        minDistance={3.4}
        maxDistance={7.2}
        autoRotate={!reducedMotion && !focusTarget && !followFlight && regionFilter === 'All'}
        autoRotateSpeed={0.12}
        onStart={() => {
          userInteractingRef.current = true;
          desiredPosRef.current = null;
        }}
        onEnd={() => {
          userInteractingRef.current = false;
        }}
      />
    </>
  );
}
