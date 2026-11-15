// ─────────────────────────────────────────────────────────────────────────────
// PlanetConfig — typed configuration for any procedural planet sphere.
// Pass one of these to <PlanetScene> to describe a specific planet's visuals.
// ─────────────────────────────────────────────────────────────────────────────

export interface PlanetLightingConfig {
  /** Primary directional sun: position, intensity, colour */
  sunPosition: [number, number, number];
  sunIntensity: number;
  sunColor?: string;
  /** Ambient fill: low value keeps night hemisphere dark */
  ambientIntensity: number;
  ambientColor?: string;
  /** Optional secondary back-fill light for night-side silhouette */
  fillPosition?: [number, number, number];
  fillIntensity?: number;
  fillColor?: string;
}

export interface PlanetCloudConfig {
  /** Path to an RGBA cloud texture (white clouds, alpha = cloud density) */
  textureUrl: string;
  /** Cloud sphere radius offset above the surface (e.g. 0.02) */
  radiusOffset: number;
  /** Base material opacity (0–1). Actual visibility also depends on alpha channel. */
  opacity: number;
  /** Rotation speed multiplier relative to the planet body (default 1.4×) */
  rotationMultiplier?: number;
}

export interface PlanetConfig {
  // ── Identity ────────────────────────────────────────────────────────────────
  /** Human-readable label used for aria and debugging */
  name: string;

  // ── Geometry ────────────────────────────────────────────────────────────────
  /** Sphere radius in Three.js world units */
  radius: number;
  /** Latitude / longitude segment count (default 64). Higher = smoother. */
  segments?: number;

  // ── Textures ────────────────────────────────────────────────────────────────
  /** URL to the equirectangular surface map (sRGB) */
  surfaceTextureUrl: string;
  /** URL to a greyscale roughness map (linear, optional) */
  roughnessTextureUrl?: string;

  // ── Material ────────────────────────────────────────────────────────────────
  /** PBR roughness value: 1.0 = fully rough, 0.0 = mirror */
  roughness?: number;
  /** PBR metalness value: keep 0 for rocky planets */
  metalness?: number;

  // ── Rotation ────────────────────────────────────────────────────────────────
  /** Body rotation speed (radians per second, default 0.03) */
  rotationSpeed?: number;

  // ── Clouds (optional) ───────────────────────────────────────────────────────
  clouds?: PlanetCloudConfig;

  // ── Lighting ────────────────────────────────────────────────────────────────
  lighting: PlanetLightingConfig;

  // ── Scene transform ─────────────────────────────────────────────────────────
  /** Group position offset within the Canvas world [x, y, z] */
  groupPosition?: [number, number, number];
  /** Group rotation [rx, ry, rz] in radians (axial tilt) */
  groupRotation?: [number, number, number];
}
