import { PlanetConfig } from '@/components/planet/PlanetConfig';

// ─────────────────────────────────────────────────────────────────────────────
// Earth planet configuration for Space Heritage Explorer.
//
// Preserves the exact visual appearance approved in Prompt 3:
//   • 4096×2048 equirectangular satellite surface texture
//   • Ocean/land roughness map (ocean=160/255, land=230/255) — no hot-spot
//   • RGBA cloud layer (alpha remapped 0-220) with independent drift rotation
//   • Soft warm sunlight + dark deep-space ambient + faint night-side fill
//   • metalness=0 (no specular mirror flare)
// ─────────────────────────────────────────────────────────────────────────────

export const earthConfig: PlanetConfig = {
  name: 'Earth',

  // Geometry
  radius: 2.5,
  segments: 64,

  // Surface textures
  surfaceTextureUrl: '/assets/earth-surface.jpg',
  roughnessTextureUrl: '/assets/earth-roughness.png',

  // Material
  roughness: 1.0,
  metalness: 0,

  // Rotation — slow westward drift
  rotationSpeed: 0.03,

  // Cloud layer
  clouds: {
    textureUrl: '/assets/earth-clouds.png',
    radiusOffset: 0.02,   // 2.52 total radius
    opacity: 0.75,
    rotationMultiplier: 1.4, // drifts slightly faster than the surface
  },

  // Lighting — approved in Prompt 3 refinement
  lighting: {
    sunPosition: [-7, 3.5, 5.5],
    sunIntensity: 2.1,
    sunColor: '#fff8f0',
    ambientIntensity: 0.14,
    ambientColor: '#08142a',
    fillPosition: [6, -2, -3],
    fillIntensity: 0.08,
    fillColor: '#0a2046',
  },

  // Scene transform — Earth sits right-centre of the landing page
  groupPosition: [1.4, -0.15, 0],
  groupRotation: [0.22, 0, -0.12],
};
