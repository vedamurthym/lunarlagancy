import { PlanetConfig } from '@/components/planet/PlanetConfig';

// ─────────────────────────────────────────────────────────────────────────────
// Moon planet configuration.
//
// Texture source: NASA Lunar Reconnaissance Orbiter (LRO) LROC WAC global
// mosaic, equirectangular projection.
// Image credit: NASA/GSFC/Arizona State University.
// ─────────────────────────────────────────────────────────────────────────────

export const moonConfig: PlanetConfig = {
  name: 'Moon',

  // Geometry — same radius as Earth for consistent visual scale
  radius: 2.5,
  segments: 64,

  // Surface texture — NASA LRO equirectangular mosaic
  surfaceTextureUrl: '/assets/moon-surface.jpg',
  // No roughness map needed — greyscale surface drives roughness uniformly
  roughnessTextureUrl: undefined,

  // Material — lunar regolith: very matte, no metalness
  roughness: 0.92,
  metalness: 0,

  // Rotation — tidally locked in reality; slow visual drift for UX
  rotationSpeed: 0.012,

  // No cloud layer
  clouds: undefined,

  // Balanced multi-directional lighting ensuring equal near- and far-side visibility
  lighting: {
    sunPosition: [-6, 3.5, 5],
    sunIntensity: 1.15,
    sunColor: '#fff8ed',
    ambientIntensity: 0.58,
    ambientColor: '#253042',
    fillPosition: [6, 3.5, -5],
    fillIntensity: 1.15,
    fillColor: '#f0f5fc',
  },

  // No group transform — Moon is centered for interactive view
  groupPosition: [0, 0, 0],
  groupRotation: [0, 0, 0],
};
