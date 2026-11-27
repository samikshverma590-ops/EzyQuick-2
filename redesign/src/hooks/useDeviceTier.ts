'use client';

import { useEffect, useState } from 'react';

export type DeviceTier = 'high' | 'medium' | 'low';

export interface DeviceProfile {
  tier: DeviceTier;
  isMobile: boolean;
  maxDpr: number;
  textureWidth: number;
  sphereSegments: number;
  starCount: number;
}

const DEFAULT_PROFILE: DeviceProfile = {
  tier: 'high',
  isMobile: false,
  maxDpr: 1.75,
  textureWidth: 2048,
  sphereSegments: 64,
  starCount: 700,
};

export function useDeviceTier(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    const compute = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const cores = navigator.hardwareConcurrency || 4;

      if (isMobile || cores <= 4) {
        setProfile({
          tier: isMobile ? 'low' : 'medium',
          isMobile,
          maxDpr: isMobile ? 1.25 : 1.5,
          textureWidth: isMobile ? 1024 : 2048,
          sphereSegments: isMobile ? 48 : 64,
          starCount: isMobile ? 320 : 520,
        });
      } else {
        setProfile({
          tier: 'high',
          isMobile: false,
          maxDpr: 1.75,
          textureWidth: 2048,
          sphereSegments: 72,
          starCount: 750,
        });
      }
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return profile;
}
