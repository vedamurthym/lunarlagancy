import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// Martian equipment marker definitions with verified landing coordinates.
//
// Sources:
//   Ingenuity — NASA JPL Mars 2020 Mission (18.4447° N, 77.4508° E)
//   Spirit (MER-A) — NASA JPL Mars Exploration Rover (14.5684° S, 175.4726° E)
//   Opportunity (MER-B) — NASA JPL Mars Exploration Rover (1.9462° S, 5.5266° W)
//   Sojourner + Mars Pathfinder — NASA JPL Mars Pathfinder (19.33° N, 33.55° W)
//   Viking 1 Lander — NASA SP-425 / NSSDC (22.697° N, 48.222° W)
//   Viking 2 Lander — NASA SP-425 / NSSDC (48.269° N, 134.01° W)
// ─────────────────────────────────────────────────────────────────────────────

export interface MarsMarker {
  id: string;
  name: string;
  shortName: string;
  site: string;
  badge: string;
  lat: number;   // degrees, +N / -S
  lon: number;   // degrees, +E / -W
  color: string; // hex accent colour for marker & UI
  modelPath: string; // Supabase 3d-models bucket storage path
}

export const MARS_MARKERS: MarsMarker[] = [
  {
    id: 'eq_mars_ingenuity',
    name: 'Ingenuity Mars Helicopter',
    shortName: 'Ingenuity',
    site: 'Jezero Crater (Wright Brothers Field)',
    badge: 'Powered Flight',
    lat: 18.4447,
    lon: 77.4508,
    color: '#38bdf8', // sky cyan
    modelPath: 'mars/ingenuity.glb',
  },
  {
    id: 'eq_mars_spirit',
    name: 'Mars Exploration Rover Spirit (MER-A)',
    shortName: 'Spirit',
    site: 'Gusev Crater (Columbia Memorial Station)',
    badge: 'Field Geologist',
    lat: -14.5684,
    lon: 175.4726,
    color: '#fb923c', // orange
    modelPath: 'mars/spirit.glb',
  },
  {
    id: 'eq_mars_opportunity',
    name: 'Mars Exploration Rover Opportunity (MER-B)',
    shortName: 'Opportunity',
    site: 'Meridiani Planum (Challenger Memorial Station)',
    badge: 'Field Geologist',
    lat: -1.9462,
    lon: -5.5266,
    color: '#facc15', // yellow
    modelPath: 'mars/opportunity.glb',
  },
  {
    id: 'eq_mars_sojourner_pathfinder',
    name: 'Sojourner Rover & Mars Pathfinder',
    shortName: 'Sojourner',
    site: 'Ares Vallis (Carl Sagan Memorial Station)',
    badge: 'First Microrover',
    lat: 19.33,
    lon: -33.55,
    color: '#f43f5e', // rose
    modelPath: 'mars/sojourner_pathfinder.glb',
  },
  {
    id: 'eq_mars_viking1',
    name: 'Viking 1 Lander',
    shortName: 'Viking 1',
    site: 'Chryse Planitia (Thomas Mutch Memorial Station)',
    badge: 'Bio-Science Station',
    lat: 22.697,
    lon: -48.222,
    color: '#a855f7', // purple
    modelPath: 'mars/viking.glb',
  },
  {
    id: 'eq_mars_viking2',
    name: 'Viking 2 Lander',
    shortName: 'Viking 2',
    site: 'Utopia Planitia',
    badge: 'Bio-Science Station',
    lat: 48.269,
    lon: -134.01,
    color: '#34d399', // emerald
    modelPath: 'mars/viking.glb',
  },
];

/**
 * Convert geographic latitude / longitude to a THREE.Vector3 on a sphere of
 * the given radius. Matches the UV mapping of THREE.SphereGeometry.
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
