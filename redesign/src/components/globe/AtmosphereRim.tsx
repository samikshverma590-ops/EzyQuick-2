'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '@/lib/geo';

const VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Subtle natural Rayleigh-inspired blue limb scattering along the planet horizon
const INNER_FRAGMENT = `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float ndotv = clamp(dot(vNormal, vViewDir), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 3.0);
    gl_FragColor = vec4(uColor, fresnel * 0.56);
  }
`;

// Soft outer blue atmospheric fade (smooth exponential falloff to zero at shell edge)
const OUTER_FRAGMENT = `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float rim = clamp(dot(-vNormal, vViewDir), 0.0, 1.0);
    float glow = pow(rim, 4.6) * 0.44;
    gl_FragColor = vec4(uColor, glow);
  }
`;

export function AtmosphereRim({ segments = 64 }: { segments?: number }) {
  const innerMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: INNER_FRAGMENT,
        uniforms: {
          uColor: { value: new THREE.Color('#6EC8FF') },
        },
        side: THREE.FrontSide,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  const outerMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: OUTER_FRAGMENT,
        uniforms: {
          uColor: { value: new THREE.Color('#3B82F6') },
        },
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  useEffect(() => {
    return () => {
      innerMat.dispose();
      outerMat.dispose();
    };
  }, [innerMat, outerMat]);

  return (
    <group raycast={() => null}>
      <mesh scale={1.005} material={innerMat}>
        <sphereGeometry args={[GLOBE_RADIUS, segments, segments]} />
      </mesh>
      <mesh scale={1.072} material={outerMat}>
        <sphereGeometry args={[GLOBE_RADIUS, segments, segments]} />
      </mesh>
    </group>
  );
}
