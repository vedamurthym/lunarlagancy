import { PlanetConfig } from '@/components/planet/PlanetConfig';

// ─────────────────────────────────────────────────────────────────────────────
// Mars planet configuration.
//
// Texture source: USGS / NASA Mars Global GIS Equirectangular Basemap
// Visual appearance: Desert rust orange with dark basaltic lowlands (Syrtis Major)
// and lighter Tharsis volcanic plateaus.
// ─────────────────────────────────────────────────────────────────────────────

export const marsConfig: PlanetConfig = {
  name: 'Mars',

  // Geometry — standard 2.5 world unit radius matching Earth and Moon
  radius: 2.5,
  segments: 64,

  // Surface texture — high-resolution 4096x2048 equirectangular map
  surfaceTextureUrl: '/assets/mars-surface.jpg',
  roughnessTextureUrl: undefined,

  // Material — dusty regolith: very high roughness, no metallic reflection
  roughness: 0.90,
  metalness: 0,

  // Slow natural Martian rotation (Martian sol is 24h 39m)
  rotationSpeed: 0.015,

  // No thick clouds
  clouds: undefined,

  // Balanced 360-degree illumination ensuring both hemispheres are detailed
  lighting: {
    sunPosition: [-6, 3.5, 5],
    sunIntensity: 1.25,
    sunColor: '#fff4e6',
    ambientIntensity: 0.58,
    ambientColor: '#2b1b14',
    fillPosition: [6, 3.5, -5],
    fillIntensity: 1.25,
    fillColor: '#ffeede',
  },

  groupPosition: [0, 0, 0],
  groupRotation: [0, 0, 0],
};
