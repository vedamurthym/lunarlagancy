import { getModel3DUrl } from '@/lib/supabase';

export interface PlanetData {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'asteroid' | 'spacecraft';
  distance: number; // orbital radius in scene units
  radius: number;   // physical radius of the mesh
  orbitSpeed: number; // radians per second factor
  axialTilt?: number;
  rotationSpeed: number;
  textureUrl: string;
  color: string;
  description: string;
  facts: string[];
  ring?: {
    innerRadius: number;
    outerRadius: number;
    color: string;
  };
  shapeScale?: [number, number, number]; // for irregular asteroids
}

export interface SpacecraftData {
  id: string;
  equipmentId: string;
  name: string;
  target: string;
  badge: string;
  modelUrl: string;
  position: [number, number, number];
  scale: number;
  color: string;
  description: string;
  trajectoryPoints: [number, number, number][];
}

// ── Sun & Planets Data ────────────────────────────────────────────────────────
export const CELESTIAL_BODIES: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    distance: 5.8,
    radius: 0.32,
    orbitSpeed: 0.045,
    rotationSpeed: 0.01,
    textureUrl: '/assets/deep-space/mercury-texture.jpg',
    color: '#b0a99f',
    description: 'The smallest planet and closest to the Sun, heavily cratered with zero atmosphere.',
    facts: ['Orbital period: 88 Earth days', 'Surface temp: -180°C to 430°C', 'Largest impact: Caloris Basin'],
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    distance: 8.2,
    radius: 0.55,
    orbitSpeed: 0.032,
    rotationSpeed: -0.005, // retrograde
    textureUrl: '/assets/deep-space/venus-texture.jpg',
    color: '#e6b87d',
    description: 'Hottest planet in the Solar System, enveloped by dense toxic clouds of sulfuric acid.',
    facts: ['Retrograde slow rotation', 'Surface pressure: 92 bar', 'Runaway greenhouse atmosphere'],
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    distance: 11.2,
    radius: 0.60,
    orbitSpeed: 0.024,
    rotationSpeed: 0.03,
    textureUrl: '/assets/deep-space/earth-texture.jpg',
    color: '#4ba3e3',
    description: 'Humanity cradle world, featuring liquid water oceans and nitrogen-oxygen atmosphere.',
    facts: ['1 AU distance from Sun', 'Only known world with life', 'Orbital period: 365.25 days'],
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    distance: 14.5,
    radius: 0.44,
    orbitSpeed: 0.018,
    rotationSpeed: 0.025,
    textureUrl: '/assets/deep-space/mars-texture.jpg',
    color: '#e26d5c',
    description: 'The Red Planet, home to Olympus Mons and Valles Marineris canyon system.',
    facts: ['Two moons: Phobos & Deimos', 'Half the size of Earth', 'Ancient riverbeds & polar ice'],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    distance: 24.5,
    radius: 1.55,
    orbitSpeed: 0.009,
    rotationSpeed: 0.05,
    textureUrl: '/assets/deep-space/jupiter-texture.jpg',
    color: '#d4a373',
    description: 'The largest planet in the Solar System, a gas giant with the Great Red Spot storm.',
    facts: ['95 recognized moons', 'Fastest planetary rotation (9.9 hrs)', 'Mass > 2.5x all other planets combined'],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    distance: 31.0,
    radius: 1.25,
    orbitSpeed: 0.0065,
    rotationSpeed: 0.045,
    axialTilt: 0.47,
    textureUrl: '/assets/deep-space/saturn-texture.jpg',
    color: '#e0bb6b',
    description: 'The ringed jewel of the Solar System, with vast ice particle ring structures.',
    facts: ['Spectacular ring system 282,000 km across', 'Density less than water', 'Titan: giant moon with atmosphere'],
    ring: {
      innerRadius: 1.6,
      outerRadius: 2.8,
      color: '#d8b87a',
    },
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    distance: 37.5,
    radius: 0.82,
    orbitSpeed: 0.0045,
    rotationSpeed: -0.03,
    axialTilt: 1.71, // 98 deg tilt
    textureUrl: '/assets/deep-space/uranus-texture.jpg',
    color: '#70d6ff',
    description: 'Ice giant rotating on its side, shrouded in a pale turquoise methane atmosphere.',
    facts: ['Extreme 98° axial tilt', 'Coldest planetary atmosphere (-224°C)', '28 known moons'],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    distance: 43.5,
    radius: 0.80,
    orbitSpeed: 0.0032,
    rotationSpeed: 0.035,
    textureUrl: '/assets/deep-space/neptune-texture.jpg',
    color: '#3a86ff',
    description: 'The outermost major planet, an ice giant with supersonic winds and deep azure hue.',
    facts: ['Winds reach 2,100 km/h', 'Discovered via mathematical prediction', 'Triton moon with nitrogen geysers'],
  },
];

// ── Three Asteroids Data ──────────────────────────────────────────────────────
export const ASTEROIDS: PlanetData[] = [
  {
    id: 'vesta',
    name: 'Asteroid 4 Vesta',
    type: 'asteroid',
    distance: 18.2,
    radius: 0.32,
    orbitSpeed: 0.013,
    rotationSpeed: 0.04,
    shapeScale: [1.18, 0.86, 1.04], // oblate spheroidal protoplanet
    textureUrl: '/assets/deep-space/vesta-texture.jpg',
    color: '#cbd5e1',
    description: 'Massive differentiated protoplanet in the Asteroid Belt, surveyed in 2011–2012 by NASA Dawn.',
    facts: ['Mean diameter: 525 km', 'Rheasilvia south polar crater', 'Source of HED meteorites'],
  },
  {
    id: 'ceres',
    name: 'Dwarf Planet Ceres',
    type: 'asteroid',
    distance: 20.8,
    radius: 0.42,
    orbitSpeed: 0.011,
    rotationSpeed: 0.03,
    shapeScale: [1.02, 0.98, 1.0], // nearly spherical dwarf planet
    textureUrl: '/assets/deep-space/ceres-texture.jpg',
    color: '#94a3b8',
    description: 'Largest object in the Asteroid Belt, a water-rich dwarf planet surveyed by NASA Dawn.',
    facts: ['Diameter: 940 km (dwarf planet)', 'Occator Crater bright salt faculae', 'Contains subsurface water ice & clay'],
  },
  {
    id: 'eros',
    name: 'Asteroid 433 Eros',
    type: 'asteroid',
    distance: 16.0,
    radius: 0.24,
    orbitSpeed: 0.015,
    rotationSpeed: 0.06,
    shapeScale: [1.85, 0.72, 0.82], // elongated peanut shape
    textureUrl: '/assets/deep-space/eros-texture.jpg',
    color: '#d97706',
    description: 'Elongated S-type near-Earth asteroid orbited and landed on by NASA NEAR Shoemaker in 2001.',
    facts: ['Dimensions: 34.4 × 11.2 × 11.2 km', 'First asteroid orbited by human spacecraft', 'Historic soft touchdown: Feb 12, 2001'],
  },
];

// ── Three Spacecraft Data ─────────────────────────────────────────────────────
export const SPACECRAFT: SpacecraftData[] = [
  {
    id: 'dawn',
    equipmentId: 'eq_deep_space_dawn',
    name: 'Dawn Spacecraft',
    target: 'Protoplanet Vesta & Dwarf Planet Ceres',
    badge: 'Ion Propulsion Pioneer',
    modelUrl: getModel3DUrl('deep-space/dawn.glb') || '/models/deep-space/dawn.glb',
    position: [19.5, 0.6, 2.5],
    scale: 0.0035,
    color: '#38bdf8', // cyan
    description: 'First spacecraft to orbit two separate extraterrestrial bodies (Vesta 2011, Ceres 2015) using xenone-ion propulsion.',
    trajectoryPoints: [
      [11.2, 0, 0],       // Earth launch (2007)
      [13.8, 0.4, 4.2],   // Mars gravity assist (2009)
      [17.8, 0.5, 3.8],   // Vesta orbital insertion (2011-2012)
      [19.5, 0.6, 2.5],   // Transit between Vesta and Ceres
      [20.8, 0.2, 1.2],   // Ceres orbital capture (2015-2018)
    ],
  },
  {
    id: 'near_shoemaker',
    equipmentId: 'eq_deep_space_near_shoemaker',
    name: 'NEAR Shoemaker',
    target: 'Near-Earth Asteroid 433 Eros',
    badge: 'First Asteroid Touchdown',
    modelUrl: getModel3DUrl('deep-space/near_shoemaker.glb') || '/models/deep-space/near_shoemaker.glb',
    position: [15.6, 0.35, -2.8],
    scale: 0.004,
    color: '#f59e0b', // amber
    description: 'First robotic probe to orbit and safely land upon the surface of an asteroid (433 Eros, February 2001).',
    trajectoryPoints: [
      [11.2, 0, 0],       // Earth launch (1996)
      [13.2, -0.3, -4.5], // Asteroid 253 Mathilde flyby (1997)
      [11.5, 0.2, -1.8],  // Earth swingby gravity assist (1998)
      [15.6, 0.35, -2.8], // Eros orbital capture and landing (2000-2001)
    ],
  },
  {
    id: 'pioneer10',
    equipmentId: 'eq_deep_space_pioneer10',
    name: 'Pioneer 10 Spacecraft',
    target: 'Outer Solar System & Interstellar Frontier',
    badge: 'Interstellar Messenger',
    modelUrl: getModel3DUrl('deep-space/pioneer_10.glb') || '/models/deep-space/pioneer_10.glb',
    position: [46.5, 1.8, 8.5],
    scale: 0.0038,
    color: '#c084fc', // purple
    description: 'First probe to traverse the Asteroid Belt, conduct a direct flyby of Jupiter, and achieve solar escape velocity carrying the Golden Plaque.',
    trajectoryPoints: [
      [11.2, 0, 0],      // Earth departure (1972)
      [18.5, 0.3, 1.5],  // Asteroid Belt crossing
      [24.5, 0.8, 3.8],  // Jupiter close flyby & gravity assist (1973)
      [34.0, 1.2, 5.8],  // Crosses Saturn orbit
      [46.5, 1.8, 8.5],  // Solar escape vector towards Aldebaran
    ],
  },
];
