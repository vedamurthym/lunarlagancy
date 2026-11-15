import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// Lunar equipment marker definitions with verified landing coordinates.
//
// Sources:
//   Apollo 11 — NASA Technical Report R-346 (0.6741° N, 23.4729° E)
//   Apollo 12 — NASA SP-235 (3.0128° S, 23.4219° W)
//   Apollo 15 — NASA SP-289 (26.1322° N, 3.6339° E)
//   Surveyor 3 — JPL Technical Report 32-1177 (2.9942° S, 23.3313° W)
// ─────────────────────────────────────────────────────────────────────────────

export interface LunarMarker {
  id: string;
  name: string;
  shortName: string;
  site: string;
  badge: string;
  lat: number;   // exact verified landing latitude (degrees, +N / -S)
  lon: number;   // exact verified landing longitude (degrees, +E / -W)
  displayLat?: number; // cartographic visual position on globe to prevent marker overlap
  displayLon?: number;
  color: string; // hex accent colour for this marker
  modelPath: string; // Supabase 3d-models bucket storage path
}

export const LUNAR_MARKERS: LunarMarker[] = [
  {
    id: 'eq_moon_apollo11_lm',
    name: 'Apollo 11 Lunar Module & EASEP',
    shortName: 'Apollo 11',
    site: 'Tranquility Base',
    badge: 'First Manned Landing',
    lat: 0.6741,
    lon: 23.4729,
    color: '#60a5fa', // blue
    modelPath: 'moon/apollo.glb',
  },
  {
    id: 'eq_moon_apollo12_lm',
    name: 'Apollo 12 Lunar Module & ALSEP',
    shortName: 'Apollo 12',
    site: 'Ocean of Storms (Surveyor Crater)',
    badge: 'Pinpoint Landing',
    lat: -3.0128,
    lon: -23.4219,
    // Apollo 12 landed 160m from Surveyor 3. Visual offset prevents the 2 marker spheres from colliding on the globe:
    displayLat: -1.8,
    displayLon: -25.2,
    color: '#34d399', // emerald
    modelPath: 'moon/apollo.glb',
  },
  {
    id: 'eq_moon_apollo15_lm',
    name: 'Apollo 15 Lunar Module, ALSEP & LRV',
    shortName: 'Apollo 15',
    site: 'Hadley–Apennine',
    badge: 'First Lunar Rover',
    lat: 26.1322,
    lon: 3.6339,
    color: '#f59e0b', // amber
    modelPath: 'moon/apollo.glb',
  },
  {
    id: 'eq_moon_surveyor3',
    name: 'Surveyor 3 Lunar Soft-Lander',
    shortName: 'Surveyor 3',
    site: 'Ocean of Storms (Visited by Apollo 12)',
    badge: 'Surface Sampler',
    lat: -2.9942,
    lon: -23.3313,
    // Visual offset placed slightly east so both Apollo 12 and Surveyor 3 are individually visible and clickable:
    displayLat: -4.2,
    displayLon: -21.6,
    color: '#a78bfa', // violet
    modelPath: 'moon/surveyor_3.glb',
  },
];

/**
 * Convert geographic latitude / longitude to a THREE.Vector3 on a sphere of
 * the given radius. Matches the UV mapping of THREE.SphereGeometry so that
 * markers appear at the correct surface position on the equirectangular texture.
 *
 * phi  = colatitude (angle from +Y / north-pole axis)
 * theta = longitude mapped to [0, 2π] with +180° offset to match THREE UV origin
 */
export function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  );
}
