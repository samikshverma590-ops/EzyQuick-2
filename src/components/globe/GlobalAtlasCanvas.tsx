'use client';

import React, { Component, Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import type { AtlasDestination, AtlasHub, AtlasRegionFilter } from '@/data/atlas';
import { ATLAS_HUBS } from '@/data/atlas';
import { EarthSphere } from './EarthSphere';
import { HubAndMarkers } from './HubAndMarkers';
import { IllustrativeArc } from './IllustrativeArc';
import { Airplane3D, type FlightTelemetry } from './Airplane3D';
import { CameraRig } from './CameraRig';
import { FallbackAtlas2D } from './FallbackAtlas2D';

interface GlobalAtlasCanvasProps {
  visibleDestinations: AtlasDestination[];
  originHub: AtlasHub;
  selectedDestination: AtlasDestination | null;
  selectedHub: AtlasHub | null;
  regionFilter: AtlasRegionFilter;
  focusTarget: { lat: number; lng: number; distance?: number } | null;
  followFlight: boolean;
  zoomEvent: { delta: number; seq: number };
  resetCounter: number;
  reducedMotion: boolean;
  isMobile: boolean;
  maxDpr: number;
  textureWidth: number;
  sphereSegments: number;
  onSelectDestination: (dest: AtlasDestination) => void;
  onSelectHub: (hub: AtlasHub) => void;
  onReady?: () => void;
}

class WebGLErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function detectWebGL(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function GlobalAtlasCanvas({
  visibleDestinations,
  originHub,
  selectedDestination,
  selectedHub,
  regionFilter,
  focusTarget,
  followFlight,
  zoomEvent,
  resetCounter,
  reducedMotion,
  isMobile,
  maxDpr,
  textureWidth,
  sphereSegments,
  onSelectDestination,
  onSelectHub,
  onReady,
}: GlobalAtlasCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flightTelemetryRef = useRef<FlightTelemetry | null>(null);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    setWebglAvailable(detectWebGL());
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Active flight route:
  // - When a destination is selected: Origin Hub -> Selected Destination (if distinct)
  // - Otherwise (Global View or Hub View): EzyQuick's flagship DEL <-> DXB hub corridor
  const activeRoute = React.useMemo(() => {
    if (selectedDestination) {
      if (originHub.id === 'dubai' && selectedDestination.slug === 'dubai') {
        return {
          from: { lat: ATLAS_HUBS[0].lat, lng: ATLAS_HUBS[0].lng },
          to: { lat: ATLAS_HUBS[1].lat, lng: ATLAS_HUBS[1].lng },
          showArc: false,
        };
      }
      return {
        from: { lat: originHub.lat, lng: originHub.lng },
        to: { lat: selectedDestination.lat, lng: selectedDestination.lng },
        showArc: true,
      };
    }
    return {
      from: { lat: ATLAS_HUBS[0].lat, lng: ATLAS_HUBS[0].lng },
      to: { lat: ATLAS_HUBS[1].lat, lng: ATLAS_HUBS[1].lng },
      showArc: Boolean(selectedHub),
    };
  }, [originHub, selectedDestination, selectedHub]);

  const fallbackNode = (
    <FallbackAtlas2D
      visibleDestinations={visibleDestinations}
      originHub={originHub}
      selectedDestination={selectedDestination}
      selectedHub={selectedHub}
      onSelectDestination={onSelectDestination}
      onSelectHub={onSelectHub}
      reason={
        contextLost
          ? 'WebGL context paused — showing interactive 2D Global Atlas'
          : 'Interactive 2D Global Atlas (WebGL unavailable on this device)'
      }
    />
  );

  if (!webglAvailable || contextLost) {
    return (
      <div ref={containerRef} className="h-full w-full">
        {fallbackNode}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <WebGLErrorBoundary fallback={fallbackNode}>
        <Canvas
          dpr={[1, maxDpr]}
          frameloop={inView ? 'always' : 'never'}
          camera={{ fov: isMobile ? 42 : 36, near: 0.1, far: 100, position: [0, 1.5, 6.25] }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            const dom = gl.domElement;
            const handleLost = (e: Event) => {
              e.preventDefault();
              setContextLost(true);
            };
            const handleRestored = () => {
              setContextLost(false);
            };
            dom.addEventListener('webglcontextlost', handleLost, false);
            dom.addEventListener('webglcontextrestored', handleRestored, false);
          }}
        >
          {/* Bright Studio Daylight Lighting */}
          <ambientLight intensity={1.15} color="#FFFFFF" />
          <hemisphereLight args={['#FFFFFF', '#DCE8F8', 0.92]} />
          <directionalLight position={[0, -6, 4]} intensity={0.45} color="#6EC8FF" />

          <Suspense fallback={null}>
            <EarthSphere
              textureWidth={textureWidth}
              segments={sphereSegments}
              reducedMotion={reducedMotion}
              onTexturesReady={onReady}
            />
            <HubAndMarkers
              visibleDestinations={visibleDestinations}
              selectedDestination={selectedDestination}
              selectedHub={selectedHub}
              activeOriginHubId={originHub.id}
              reducedMotion={reducedMotion}
              onSelectDestination={onSelectDestination}
              onSelectHub={onSelectHub}
            />
            {activeRoute.showArc && (
              <IllustrativeArc
                from={activeRoute.from}
                to={activeRoute.to}
                reducedMotion={reducedMotion}
              />
            )}
            {/* Animated 3D EzyQuick Commercial Jet flying the active corridor */}
            <Airplane3D
              from={activeRoute.from}
              to={activeRoute.to}
              reducedMotion={reducedMotion}
              telemetryRef={flightTelemetryRef}
            />
            <CameraRig
              focusTarget={focusTarget}
              regionFilter={regionFilter}
              followFlight={followFlight}
              flightTelemetryRef={flightTelemetryRef}
              zoomEvent={zoomEvent}
              resetCounter={resetCounter}
              reducedMotion={reducedMotion}
              isMobile={isMobile}
            />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
