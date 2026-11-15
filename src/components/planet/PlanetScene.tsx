import React, { useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetConfig } from './PlanetConfig';

// ─────────────────────────────────────────────────────────────────────────────
// PlanetScene — reusable React Three Fiber scene for any procedural planet.
//
// Renders:
//   • SphereGeometry body with MeshStandardMaterial (surface + optional roughness)
//   • Optional transparent cloud layer (separate rotating sphere)
//   • Configurable directional + ambient lighting
//
// Interaction prep:
//   • onPointerMove / onPointerDown exposed via props for future raycasting
//   • readyFired ref notifies parent (PlanetCanvas) when first frame has painted
// ─────────────────────────────────────────────────────────────────────────────

interface PlanetSceneProps {
  config: PlanetConfig;
  /** Fired once after the first rendered frame — PlanetCanvas uses this to reveal the Canvas */
  onReady?: () => void;
  /** Optional pointer events for future raycasting / marker interaction */
  onPointerMove?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
}

export const PlanetScene: React.FC<PlanetSceneProps> = ({
  config,
  onReady,
  onPointerMove,
  onPointerDown,
}) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const readyFired = useRef(false);

  const {
    radius = 2.5,
    segments = 64,
    roughness = 1.0,
    metalness = 0,
    rotationSpeed = 0.03,
    groupPosition = [0, 0, 0],
    groupRotation = [0, 0, 0],
    lighting,
    clouds,
    surfaceTextureUrl,
    roughnessTextureUrl,
  } = config;

  // ── Texture loading via Drei useTexture (integrates with Suspense) ──────────
  // Build the URL list dynamically depending on which optional textures exist
  const textureUrls = [
    surfaceTextureUrl,
    ...(roughnessTextureUrl ? [roughnessTextureUrl] : []),
    ...(clouds ? [clouds.textureUrl] : []),
  ];

  const textures = useTexture(textureUrls, (loaded) => {
    const arr = Array.isArray(loaded) ? loaded : [loaded];

    // Surface map — always index 0
    const surface = arr[0];
    surface.colorSpace = THREE.SRGBColorSpace;
    surface.anisotropy = 16;
    surface.minFilter = THREE.LinearMipmapLinearFilter;
    surface.magFilter = THREE.LinearFilter;

    let idx = 1;

    // Roughness map — linear colour space (not sRGB)
    if (roughnessTextureUrl && arr[idx]) {
      arr[idx].anisotropy = 16;
      arr[idx].minFilter = THREE.LinearMipmapLinearFilter;
      arr[idx].magFilter = THREE.LinearFilter;
      idx++;
    }

    // Cloud map — sRGB, slightly lower anisotropy
    if (clouds && arr[idx]) {
      arr[idx].colorSpace = THREE.SRGBColorSpace;
      arr[idx].anisotropy = 8;
      arr[idx].minFilter = THREE.LinearMipmapLinearFilter;
      arr[idx].magFilter = THREE.LinearFilter;
    }
  });

  const texturesArr = Array.isArray(textures) ? textures : [textures];
  let tIdx = 0;
  const surfaceMap = texturesArr[tIdx++] as THREE.Texture;
  const roughnessMap = roughnessTextureUrl ? (texturesArr[tIdx++] as THREE.Texture) : undefined;
  const cloudsMap = clouds ? (texturesArr[tIdx++] as THREE.Texture) : undefined;

  // ── Per-frame rotation ───────────────────────────────────────────────────────
  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.1);
    if (planetRef.current) {
      planetRef.current.rotation.y += dt * rotationSpeed;
    }
    if (cloudsRef.current && clouds) {
      const mult = clouds.rotationMultiplier ?? 1.4;
      cloudsRef.current.rotation.y += dt * rotationSpeed * mult;
    }
    // Notify parent that the planet has painted its first frame
    if (!readyFired.current && onReady) {
      readyFired.current = true;
      onReady();
    }
  });

  const cloudRadius = radius + (clouds?.radiusOffset ?? 0.02);

  return (
    <group position={groupPosition} rotation={groupRotation}>
      {/* ── Planet body ─────────────────────────────────────────────────────── */}
      <mesh
        ref={planetRef}
        castShadow
        receiveShadow
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
      >
        <sphereGeometry args={[radius, segments, segments]} />
        <meshStandardMaterial
          map={surfaceMap}
          roughnessMap={roughnessMap}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* ── Optional cloud layer ─────────────────────────────────────────────── */}
      {clouds && cloudsMap && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[cloudRadius, segments, segments]} />
          <meshStandardMaterial
            map={cloudsMap}
            alphaMap={cloudsMap}
            transparent={true}
            opacity={clouds.opacity}
            depthWrite={false}
            blending={THREE.NormalBlending}
            roughness={1.0}
            metalness={0}
          />
        </mesh>
      )}

      {/* ── Lighting ─────────────────────────────────────────────────────────── */}
      <directionalLight
        position={lighting.sunPosition}
        intensity={lighting.sunIntensity}
        color={lighting.sunColor ?? '#ffffff'}
      />
      <ambientLight
        intensity={lighting.ambientIntensity}
        color={lighting.ambientColor ?? '#ffffff'}
      />
      {lighting.fillPosition && (
        <directionalLight
          position={lighting.fillPosition}
          intensity={lighting.fillIntensity ?? 0.05}
          color={lighting.fillColor ?? '#ffffff'}
        />
      )}
    </group>
  );
};

export default PlanetScene;
