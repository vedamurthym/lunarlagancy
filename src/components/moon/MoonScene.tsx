import React, { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { LUNAR_MARKERS, latLonToVec3, type LunarMarker } from './lunarMarkers';
import { SurfaceEquipmentModel } from '@/components/common/SurfaceEquipmentModel';

// ─────────────────────────────────────────────────────────────────────────────
// MoonScene — interactive 3D Moon with equipment markers.
//
// Architecture:
//   • Stars (Drei) — procedural deep-space star field
//   • Moon sphere — SphereGeometry + MeshStandardMaterial, NASA LRO texture
//   • Equipment markers — small glowing spheres at verified lat/lon positions
//   • OrbitControls — drag to orbit, scroll to zoom, autoRotate when idle
//   • Camera focus — smooth lerp toward selected marker on selection
// ─────────────────────────────────────────────────────────────────────────────

const MOON_RADIUS = 2.5;
const MOON_SEGMENTS = 64;

// Camera distance limits
const CAM_OVERVIEW = 7.0;   // default overview distance
const CAM_FOCUS    = 4.2;   // close-up when marker selected
const CAM_MIN      = 3.6;
const CAM_MAX      = 11.0;

interface MoonSceneProps {
  onReady?: () => void;
  selectedId: string | null;
  onMarkerClick: (marker: LunarMarker) => void;
  onMarkerNavigate?: (markerId: string) => void;
  onBackgroundClick: () => void;
}

// ── Main scene ────────────────────────────────────────────────────────────────
export const MoonScene: React.FC<MoonSceneProps> = ({
  onReady,
  selectedId,
  onMarkerClick,
  onMarkerNavigate,
  onBackgroundClick,
}) => {
  const orbitRef = useRef<OrbitControlsImpl>(null);
  const readyFired = useRef(false);

  // Target camera state for smooth focus animation
  const targetDistance = useRef(CAM_OVERVIEW);
  const targetAzimuth = useRef(0);    // radians
  const targetElevation = useRef(0.2); // radians (slight downward tilt)
  const isAnimating = useRef(false);

  // ── Texture loading ───────────────────────────────────────────────────────
  const surfaceMap = useTexture('/assets/moon-surface.jpg', (tex) => {
    // NASA LRO surface texture with sRGB color space and anisotropic filtering
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
  });

  // ── Camera focus on selected marker ──────────────────────────────────────
  const focusOnMarker = useCallback((marker: LunarMarker) => {
    const pos = latLonToVec3(
      marker.displayLat ?? marker.lat,
      marker.displayLon ?? marker.lon,
      1
    );
    // Compute azimuth and elevation angles from the marker's world position
    targetAzimuth.current   = Math.atan2(pos.x, pos.z);
    targetElevation.current = Math.asin(Math.max(-1, Math.min(1, pos.y)));
    targetDistance.current  = CAM_FOCUS;
    isAnimating.current     = true;
  }, []);

  const resetView = useCallback(() => {
    targetDistance.current  = CAM_OVERVIEW;
    // Preserve current azimuth — just zoom out
    isAnimating.current = true;
  }, []);

  // Expose reset for parent via ref would be complex; use effect approach below
  // For now selectedId drives focus
  const prevSelectedId = useRef<string | null>(null);
  if (selectedId !== prevSelectedId.current) {
    prevSelectedId.current = selectedId;
    if (selectedId) {
      const m = LUNAR_MARKERS.find(m => m.id === selectedId);
      if (m) focusOnMarker(m);
    } else {
      resetView();
    }
  }

  // ── Per-frame camera animation ────────────────────────────────────────────
  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.1);

    // Fire onReady once
    if (!readyFired.current && onReady) {
      readyFired.current = true;
      onReady();
    }

    // Smooth camera animation toward target
    if (isAnimating.current && orbitRef.current) {
      const ctrl = orbitRef.current;
      // Lerp spherical coordinates
      const lerpSpeed = 1 - Math.pow(0.04, dt);

      // Distance (zoom)
      const curDist = ctrl.getDistance();
      const newDist = curDist + (targetDistance.current - curDist) * lerpSpeed;

      // Azimuth (horizontal orbit)
      const curAz = ctrl.getAzimuthalAngle();
      let dAz = targetAzimuth.current - curAz;
      // Shortest path
      if (dAz > Math.PI) dAz -= 2 * Math.PI;
      if (dAz < -Math.PI) dAz += 2 * Math.PI;
      const newAz = curAz + dAz * lerpSpeed;

      // Elevation (vertical orbit)
      const curEl = ctrl.getPolarAngle();
      const targetPolar = Math.PI / 2 - targetElevation.current;
      const newEl = curEl + (targetPolar - curEl) * lerpSpeed;

      ctrl.setAzimuthalAngle(newAz);
      ctrl.setPolarAngle(newEl);
      // Adjust camera distance by moving along its current direction
      const cam = _state.camera;
      const dir = cam.position.clone().normalize();
      cam.position.copy(dir.multiplyScalar(newDist));
      ctrl.update();

      // Stop animating when close enough
      const distDiff = Math.abs(newDist - targetDistance.current);
      const azDiff   = Math.abs(dAz * lerpSpeed);
      if (distDiff < 0.01 && azDiff < 0.001) {
        isAnimating.current = false;
      }
    }
  });

  return (
    <>
      {/* ── Deep space star field ─────────────────────────────────────────── */}
      <Stars
        radius={120}
        depth={60}
        count={6000}
        factor={3.5}
        saturation={0.1}
        fade
        speed={0.4}
      />

      {/* ── Orbit controls — drag + zoom, autoRotate when idle ───────────── */}
      <OrbitControls
        ref={orbitRef}
        enablePan={false}
        enableZoom={true}
        minDistance={CAM_MIN}
        maxDistance={CAM_MAX}
        autoRotate={!selectedId}
        autoRotateSpeed={0.35}
        zoomSpeed={0.8}
        rotateSpeed={0.55}
        enableDamping
        dampingFactor={0.08}
      />

      {/* ── Moon sphere ───────────────────────────────────────────────────── */}
      <mesh onClick={onBackgroundClick}>
        <sphereGeometry args={[MOON_RADIUS, MOON_SEGMENTS, MOON_SEGMENTS]} />
        <meshStandardMaterial
          map={surfaceMap}
          roughness={0.92}
          metalness={0}
        />
      </mesh>

      {/* ── 3D Equipment Models (Replacing small markers with verified 3D spacecraft) ── */}
      {LUNAR_MARKERS.map((marker) => {
        const pos = latLonToVec3(
          marker.displayLat ?? marker.lat,
          marker.displayLon ?? marker.lon,
          MOON_RADIUS + 0.01
        );
        return (
          <SurfaceEquipmentModel
            key={marker.id}
            id={marker.id}
            name={marker.name}
            shortName={marker.shortName}
            badge={marker.badge}
            color={marker.color}
            modelPath={marker.modelPath}
            position={pos}
            isSelected={selectedId === marker.id}
            onNavigate={onMarkerNavigate}
            onClick={() => onMarkerClick(marker)}
            targetSize={0.16}
          />
        );
      })}

      {/* ── Balanced 360-Degree Lighting (Identical Near & Far Hemisphere Visibility) ── */}
      {/* 1. Global Hemisphere: lifts ambient floor with cool sky / warm terrain contrast */}
      <hemisphereLight
        color="#4d5f7a"
        groundColor="#1e2536"
        intensity={0.58}
      />

      {/* 2. Soft Ambient base: guarantees deepest shadow valleys remain readable (no black drop) */}
      <ambientLight intensity={0.28} color="#0f1624" />

      {/* 3. Near-Side Key Directional: casts crisp 3D crater shadows across the near hemisphere */}
      <directionalLight position={[-6, 3.5, 5]} intensity={1.15} color="#fff8ed" />

      {/* 4. Far-Side Key Directional: identical power on the opposite hemisphere for balanced 3D relief */}
      <directionalLight position={[6, 3.5, -5]} intensity={1.15} color="#f0f5fc" />

      {/* 5. Eastern Limb Cross-Fill: balances transitional brightness as Moon rotates */}
      <directionalLight position={[6, -2, 3]} intensity={0.42} color="#cbd5e1" />

      {/* 6. Western Limb Cross-Fill: prevents dark bands during 360-degree rotation */}
      <directionalLight position={[-6, -2, -3]} intensity={0.42} color="#cbd5e1" />
    </>
  );
};

export default MoonScene;
