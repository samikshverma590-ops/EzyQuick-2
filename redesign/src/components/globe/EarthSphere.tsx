'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '@/lib/geo';
import { buildCartographicEarthTextures } from './cartographicTextures';
import { AtmosphereRim } from './AtmosphereRim';

interface EarthSphereProps {
  textureWidth: number;
  segments: number;
  reducedMotion?: boolean;
  onTexturesReady?: () => void;
}

/**
 * Generates an ultra-lightweight procedural high-altitude cloud whisper texture
 * (100% self-contained, zero external downloads) to pair Phase 1 atmospheric depth
 * with the sculptural Blue & Cloud-Pearl cartographic globe without obscuring coastlines.
 */
function buildCloudWhisperTexture(width: number): THREE.CanvasTexture {
  const w = Math.min(1024, Math.max(512, Math.floor(width / 2)));
  const h = Math.floor(w / 2);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);

  // Deterministic pseudo-random wispy cirrus bands (reproducible across renders)
  let seed = 4219;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 68; i++) {
    const cx = rand() * w;
    const cy = h * (0.14 + rand() * 0.72);
    const rx = w * (0.045 + rand() * 0.11);
    const ry = h * (0.012 + rand() * 0.028);
    const alpha = 0.055 + rand() * 0.075;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    grad.addColorStop(0, `rgba(255, 255, 255, ${alpha.toFixed(3)})`);
    grad.addColorStop(0.55, `rgba(220, 238, 255, ${(alpha * 0.45).toFixed(3)})`);
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, ry / rx);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Sculptural Cartographic 3D Earth built from Natural Earth 1:50m vector polygons
 * styled in EzyQuick's official Atlas Blue, Cloud White, and Sky Cyan palette,
 * enhanced with a subtle independently drifting atmospheric cloud whisper shell.
 */
export function EarthSphere({
  textureWidth,
  segments,
  reducedMotion = false,
  onTexturesReady,
}: EarthSphereProps) {
  const onReadyRef = useRef(onTexturesReady);
  onReadyRef.current = onTexturesReady;
  const cloudMeshRef = useRef<THREE.Mesh>(null);

  const textures = useMemo(() => buildCartographicEarthTextures(textureWidth), [textureWidth]);
  const cloudTex = useMemo(() => buildCloudWhisperTexture(textureWidth), [textureWidth]);

  useEffect(() => {
    onReadyRef.current?.();
    return () => {
      textures.dispose();
      cloudTex.dispose();
    };
  }, [textures, cloudTex]);

  useFrame((_, delta) => {
    if (reducedMotion || !cloudMeshRef.current) return;
    cloudMeshRef.current.rotation.y += Math.min(delta, 0.05) * 0.011;
  });

  return (
    <group>
      {/* Core Sculptural Cartographic Earth Mesh */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, segments, segments]} />
        <meshStandardMaterial
          map={textures.albedoMap}
          roughnessMap={textures.roughnessMap}
          bumpMap={textures.bumpMap}
          bumpScale={0.024}
          roughness={0.84}
          metalness={0.05}
        />
      </mesh>

      {/* Subtle Independently Drifting High-Altitude Cloud Whisper Shell */}
      <mesh ref={cloudMeshRef} raycast={() => null}>
        <sphereGeometry args={[GLOBE_RADIUS + 0.014, Math.max(40, segments - 12), Math.max(40, segments - 12)]} />
        <meshStandardMaterial
          map={cloudTex}
          transparent
          opacity={0.72}
          depthWrite={false}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Subtle Sky Cyan Atmospheric Rim */}
      <AtmosphereRim segments={Math.max(40, segments - 12)} />
    </group>
  );
}
