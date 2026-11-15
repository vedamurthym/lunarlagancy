import * as THREE from 'three';
import { useGLTF, useTexture } from '@react-three/drei';
import { getModel3DUrl } from './supabase';

// ─────────────────────────────────────────────────────────────────────────────
// 1. GLOBAL THREE.JS CACHING
// ─────────────────────────────────────────────────────────────────────────────
// Enables internal FileLoader cache to ensure identical assets are never
// re-downloaded over the network within the application lifetime.
THREE.Cache.enabled = true;

// Registry of already preloaded URLs to prevent duplicate preload calls
const preloadedUrlSet = new Set<string>();

// ─────────────────────────────────────────────────────────────────────────────
// 2. DESTINATION ASSET MANIFESTS
// ─────────────────────────────────────────────────────────────────────────────
export const DESTINATION_ASSET_MANIFESTS = {
  earth: {
    textures: [
      '/assets/earth-surface.jpg',
      '/assets/earth-roughness.png',
      '/assets/earth-clouds.png',
    ],
    models: [] as string[],
  },
  moon: {
    textures: ['/assets/moon-surface.jpg'],
    models: ['moon/apollo.glb', 'moon/surveyor_3.glb'],
  },
  mars: {
    textures: ['/assets/mars-surface.jpg'],
    models: [
      'mars/ingenuity.glb',
      'mars/viking.glb',
      'mars/sojourner_pathfinder.glb',
      'mars/spirit.glb',
      'mars/opportunity.glb',
    ],
  },
  'deep-space': {
    textures: [
      '/assets/galaxy.jpg',
      '/assets/deep-space/sun-texture.jpg',
      '/assets/deep-space/vesta-texture.jpg',
      '/assets/deep-space/ceres-texture.jpg',
      '/assets/deep-space/eros-texture.jpg',
    ],
    models: [
      'deep-space/dawn.glb',
      'deep-space/near_shoemaker.glb',
      'deep-space/pioneer_10.glb',
    ],
  },
} as const;

export type DestinationKey = keyof typeof DESTINATION_ASSET_MANIFESTS;

// ─────────────────────────────────────────────────────────────────────────────
// 3. TARGETED PRELOADING (Approaching / Hover Triggered)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Preload a single 3D GLB model by relative storage path or full URL.
 */
export function preloadModel(modelPath: string): void {
  const url = getModel3DUrl(modelPath);
  if (!url || preloadedUrlSet.has(url)) return;

  preloadedUrlSet.add(url);
  try {
    useGLTF.preload(url);
  } catch (err) {
    console.warn(`[AssetManager] Failed to preload model ${url}:`, err);
  }
}

/**
 * Preload a single texture URL.
 */
export function preloadTexture(textureUrl: string): void {
  if (!textureUrl || preloadedUrlSet.has(textureUrl)) return;

  preloadedUrlSet.add(textureUrl);
  try {
    useTexture.preload(textureUrl);
  } catch (err) {
    console.warn(`[AssetManager] Failed to preload texture ${textureUrl}:`, err);
  }
}

/**
 * Preload all core assets for an entire exploration destination on-demand
 * (e.g., when the user hovers a portal card or clicks Explore).
 */
export function preloadDestination(destination: DestinationKey): void {
  const manifest = DESTINATION_ASSET_MANIFESTS[destination];
  if (!manifest) return;

  // 1. Preload key textures first
  manifest.textures.forEach((texUrl) => preloadTexture(texUrl));

  // 2. Preload 3D models progressively
  manifest.models.forEach((modelPath) => preloadModel(modelPath));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MEMORY MANAGEMENT & OBJECT DISPOSAL
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Recursively disposes geometries and materials of an Object3D hierarchy
 * when unmounting, preventing WebGL buffer leaks while preserving shared textures.
 */
export function disposeObject3D(root: THREE.Object3D | null): void {
  if (!root) return;

  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DEVICE CAPABILITY & MOBILE OPTIMIZATION
// ─────────────────────────────────────────────────────────────────────────────
export interface DevicePerformanceConfig {
  isMobile: boolean;
  dpr: [number, number];
  maxAnisotropy: number;
  powerPreference: 'high-performance' | 'default' | 'low-power';
}

/**
 * Returns optimized rendering parameters based on user device profile.
 * Prevents thermal throttling and frame drops on mobile devices by capping DPR.
 */
export function getDevicePerformanceConfig(): DevicePerformanceConfig {
  const isMobile =
    typeof window !== 'undefined' &&
    (window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ));

  return {
    isMobile,
    // Mobile capped at 1.25x (avoids 3x retina pixel pipeline bottleneck)
    // Desktop capped at 1.5x
    dpr: [1, isMobile ? 1.25 : 1.5],
    maxAnisotropy: isMobile ? 4 : 16,
    powerPreference: 'high-performance',
  };
}
