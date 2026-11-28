'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  ATLAS_DESTINATIONS,
  ATLAS_HUBS,
  type AtlasDestination,
  type AtlasHub,
  type AtlasOriginCity,
} from '@/data/atlas';
import { GLOBE_RADIUS, latLngToVector3 } from '@/lib/geo';

interface HubAndMarkersProps {
  visibleDestinations: AtlasDestination[];
  selectedDestination: AtlasDestination | null;
  selectedHub: AtlasHub | null;
  activeOriginHubId: 'delhi' | 'dubai';
  originCity?: AtlasOriginCity;
  reducedMotion: boolean;
  onSelectDestination: (dest: AtlasDestination) => void;
  onSelectHub: (hub: AtlasHub) => void;
}

function getNormalQuaternion(pos: THREE.Vector3): THREE.Quaternion {
  const up = new THREE.Vector3(0, 0, 1);
  return new THREE.Quaternion().setFromUnitVectors(up, pos.clone().normalize());
}

/**
 * Generates a crisp retina-DPI WebGL pill badge texture.
 * Native Three.js sprites avoid React DOM-portal unmount races and obey true 3D planet occlusion.
 */
function createBadgeTexture(
  label: string,
  sublabel: string | null,
  bgColor: string,
  textColor: string,
  subColor: string,
  borderColor: string
): { texture: THREE.CanvasTexture; aspect: number } {
  const canvas = document.createElement('canvas');
  const dpr = 2;
  const fontMain = '700 22px system-ui, -apple-system, sans-serif';
  const fontSub = '500 18px system-ui, -apple-system, sans-serif';

  const ctx = canvas.getContext('2d')!;
  ctx.font = fontMain;
  const mainW = ctx.measureText(label).width;
  let subW = 0;
  if (sublabel) {
    ctx.font = fontSub;
    subW = ctx.measureText(sublabel).width + 12;
  }

  const padX = 22;
  const w = Math.ceil(mainW + subW + padX * 2);
  const h = 44;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  // Rounded pill background
  const r = h / 2;
  ctx.beginPath();
  ctx.moveTo(r, 1);
  ctx.lineTo(w - r, 1);
  ctx.quadraticCurveTo(w - 1, 1, w - 1, r);
  ctx.quadraticCurveTo(w - 1, h - 1, w - r, h - 1);
  ctx.lineTo(r, h - 1);
  ctx.quadraticCurveTo(1, h - 1, 1, r);
  ctx.quadraticCurveTo(1, 1, r, 1);
  ctx.closePath();

  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = borderColor;
  ctx.stroke();

  // Text
  ctx.textBaseline = 'middle';
  ctx.font = fontMain;
  ctx.fillStyle = textColor;
  ctx.fillText(label, padX, h / 2 + 1);

  if (sublabel) {
    ctx.font = fontSub;
    ctx.fillStyle = subColor;
    ctx.fillText(sublabel, padX + mainW + 12, h / 2 + 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return { texture, aspect: w / h };
}

function SpriteBadge({
  label,
  sublabel = null,
  bgColor,
  textColor,
  subColor = '#60A5FA',
  borderColor,
  position,
  height = 0.145,
}: {
  label: string;
  sublabel?: string | null;
  bgColor: string;
  textColor: string;
  subColor?: string;
  borderColor: string;
  position: [number, number, number];
  height?: number;
}) {
  const { texture, aspect } = useMemo(
    () => createBadgeTexture(label, sublabel, bgColor, textColor, subColor, borderColor),
    [label, sublabel, bgColor, textColor, subColor, borderColor]
  );

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return (
    <sprite position={position} scale={[height * aspect, height, 1]} raycast={() => null}>
      <spriteMaterial map={texture} transparent depthTest depthWrite={false} />
    </sprite>
  );
}

function HubBeacon({
  hub,
  isSelected,
  isActiveOrigin,
  hideLabel = false,
  reducedMotion,
  onSelect,
}: {
  hub: AtlasHub;
  isSelected: boolean;
  isActiveOrigin: boolean;
  hideLabel?: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pulseRef = useRef<THREE.Mesh>(null);
  const phaseRef = useRef(hub.id === 'delhi' ? 0 : 0.5);

  const { position, quaternion, labelPos } = useMemo(() => {
    const pos = latLngToVector3(hub.lat, hub.lng, GLOBE_RADIUS + 0.026);
    const lPos = latLngToVector3(hub.lat + 4.2, hub.lng, GLOBE_RADIUS + 0.12);
    return {
      position: pos,
      quaternion: getNormalQuaternion(pos),
      labelPos: [lPos.x, lPos.y, lPos.z] as [number, number, number],
    };
  }, [hub.lat, hub.lng]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame((_, delta) => {
    if (!pulseRef.current) return;
    if (reducedMotion) {
      pulseRef.current.scale.setScalar(isSelected || isActiveOrigin ? 1.45 : 1.15);
      return;
    }
    phaseRef.current = (phaseRef.current + Math.min(delta, 0.05) * 0.65) % 1;
    const t = phaseRef.current;
    pulseRef.current.scale.setScalar(1.0 + t * (isSelected || isActiveOrigin ? 2.1 : 1.5));
    const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = (1 - t) * (isSelected || isActiveOrigin ? 0.85 : 0.5);
  });

  const highlighted = isSelected || hovered;

  return (
    <group>
      <group position={position} quaternion={quaternion}>
        {/* Expanding Solar Gold pulse ring */}
        <mesh ref={pulseRef} raycast={() => null}>
          <ringGeometry args={[0.036, 0.048, 32]} />
          <meshBasicMaterial color="#F5A623" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>

        {/* Crisp white collar */}
        <mesh raycast={() => null}>
          <ringGeometry args={[0.024, 0.036, 28]} />
          <meshBasicMaterial color="#FFFFFF" side={THREE.DoubleSide} />
        </mesh>

        {/* Core Solar Gold Hub Beacon (explicitly marking EzyQuick's 2 real offices) */}
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[highlighted ? 0.036 : 0.029, 20, 20]} />
          <meshStandardMaterial
            color="#F5A623"
            emissive="#F5A623"
            emissiveIntensity={highlighted ? 0.9 : 0.45}
            roughness={0.22}
          />
        </mesh>
      </group>

      {/* Native WebGL Depth-Occluded Hub Pill (DEL HUB / DXB HUB) */}
      {!hideLabel && (
        <SpriteBadge
          label={`${hub.code} HUB`}
          bgColor={highlighted ? '#0B56E8' : '#091933'}
          textColor={highlighted ? '#FFFFFF' : isActiveOrigin ? '#F5A623' : '#FFFFFF'}
          borderColor={highlighted ? '#60A5FA' : isActiveOrigin ? '#F5A623' : '#60A5FA'}
          position={labelPos}
          height={0.135}
        />
      )}
    </group>
  );
}

function DestinationPin({
  dest,
  isSelected,
  isDimmed,
  reducedMotion,
  onSelect,
}: {
  dest: AtlasDestination;
  isSelected: boolean;
  isDimmed: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);

  const latOffset = dest.slug === 'dubai' ? -0.9 : 0;
  const lngOffset = dest.slug === 'dubai' ? -0.55 : 0;

  const { position, quaternion, labelPos } = useMemo(() => {
    const pos = latLngToVector3(dest.lat + latOffset, dest.lng + lngOffset, GLOBE_RADIUS + 0.024);
    const lPos = latLngToVector3(
      dest.lat + latOffset + 3.6,
      dest.lng + lngOffset,
      GLOBE_RADIUS + 0.13
    );
    return {
      position: pos,
      quaternion: getNormalQuaternion(pos),
      labelPos: [lPos.x, lPos.y, lPos.z] as [number, number, number],
    };
  }, [dest.lat, dest.lng, latOffset, lngOffset]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame((_, delta) => {
    if (!ringRef.current || !isSelected || reducedMotion) return;
    pulseRef.current += Math.min(delta, 0.05) * 3.0;
    ringRef.current.scale.setScalar(1 + Math.sin(pulseRef.current) * 0.2);
  });

  const active = isSelected || hovered;
  const isIndiaRegional = dest.region === 'India';

  return (
    <group>
      <group position={position} quaternion={quaternion}>
        {isSelected && (
          <mesh ref={ringRef} raycast={() => null}>
            <ringGeometry args={[0.034, 0.047, 28]} />
            <meshBasicMaterial color="#60A5FA" transparent opacity={0.95} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Outer ring distinguishing International (Electric Cobalt) vs Regional India (Deep Navy) */}
        <mesh raycast={() => null}>
          <ringGeometry args={[0.017, 0.025, 20]} />
          <meshBasicMaterial
            color={isSelected ? '#0B56E8' : isIndiaRegional ? '#091933' : '#0B56E8'}
            transparent
            opacity={isDimmed ? 0.25 : 0.95}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Comfortable invisible click/tap target */}
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Pin head */}
        <mesh raycast={() => null} position={[0, 0, active ? 0.019 : 0.008]}>
          <sphereGeometry args={[active ? 0.026 : 0.018, 16, 16]} />
          <meshStandardMaterial
            color={
              isSelected ? '#F5A623' : hovered ? '#0B56E8' : isIndiaRegional ? '#60A5FA' : '#FFFFFF'
            }
            emissive={isSelected ? '#F5A623' : hovered ? '#0B56E8' : '#60A5FA'}
            emissiveIntensity={active ? 0.8 : isDimmed ? 0.05 : 0.25}
            transparent
            opacity={isDimmed ? 0.3 : 1}
            roughness={0.25}
          />
        </mesh>
      </group>

      {/* Hover / Selected label only — true 3D depth-occluded WebGL badge */}
      {active && (
        <SpriteBadge
          label={dest.name}
          sublabel={isIndiaRegional ? 'India' : dest.country}
          bgColor="#091933"
          textColor="#FFFFFF"
          subColor="#60A5FA"
          borderColor="#60A5FA"
          position={labelPos}
          height={0.145}
        />
      )}
    </group>
  );
}

function OriginDeparturePin({ originCity }: { originCity: AtlasOriginCity }) {
  const { position, quaternion, labelPos } = useMemo(() => {
    const pos = latLngToVector3(originCity.lat, originCity.lng, GLOBE_RADIUS + 0.025);
    const lPos = latLngToVector3(originCity.lat + 3.8, originCity.lng, GLOBE_RADIUS + 0.13);
    return {
      position: pos,
      quaternion: getNormalQuaternion(pos),
      labelPos: [lPos.x, lPos.y, lPos.z] as [number, number, number],
    };
  }, [originCity.lat, originCity.lng]);

  return (
    <group>
      <group position={position} quaternion={quaternion}>
        <mesh raycast={() => null}>
          <ringGeometry args={[0.028, 0.04, 28]} />
          <meshBasicMaterial color="#60A5FA" transparent opacity={0.92} side={THREE.DoubleSide} />
        </mesh>
        <mesh raycast={() => null} position={[0, 0, 0.012]}>
          <sphereGeometry args={[0.026, 18, 18]} />
          <meshStandardMaterial
            color="#0B56E8"
            emissive="#60A5FA"
            emissiveIntensity={0.65}
            roughness={0.25}
          />
        </mesh>
      </group>
      <SpriteBadge
        label={`FROM ${originCity.code}`}
        bgColor="#091933"
        textColor="#60A5FA"
        borderColor="#60A5FA"
        position={labelPos}
        height={0.132}
      />
    </group>
  );
}

export function HubAndMarkers({
  visibleDestinations,
  selectedDestination,
  selectedHub,
  activeOriginHubId,
  originCity,
  reducedMotion,
  onSelectDestination,
  onSelectHub,
}: HubAndMarkersProps) {
  const visibleSlugs = useMemo(
    () => new Set(visibleDestinations.map((d) => d.slug)),
    [visibleDestinations]
  );

  return (
    <group>
      {ATLAS_HUBS.map((hub) => (
        <HubBeacon
          key={hub.id}
          hub={hub}
          isSelected={selectedHub?.id === hub.id}
          isActiveOrigin={Boolean(originCity?.isEzyQuickHub && activeOriginHubId === hub.id)}
          hideLabel={hub.id === 'dubai' && selectedDestination?.slug === 'dubai'}
          reducedMotion={reducedMotion}
          onSelect={() => onSelectHub(hub)}
        />
      ))}

      {originCity && !originCity.isEzyQuickHub && <OriginDeparturePin originCity={originCity} />}

      {ATLAS_DESTINATIONS.map((dest) => (
        <DestinationPin
          key={dest.slug}
          dest={dest}
          isSelected={selectedDestination?.slug === dest.slug}
          isDimmed={!visibleSlugs.has(dest.slug)}
          reducedMotion={reducedMotion}
          onSelect={() => onSelectDestination(dest)}
        />
      ))}
    </group>
  );
}
