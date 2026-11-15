import React, { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { MARS_MARKERS, latLonToVec3, type MarsMarker } from './marsMarkers';
import { SurfaceEquipmentModel } from '@/components/common/SurfaceEquipmentModel';

// ─────────────────────────────────────────────────────────────────────────────
// MarsScene — interactive 3D Mars environment with historical mission markers.
//
// Features:
//   • Procedural sphere geometry with 4096x2048 equirectangular surface texture
//   • Six historical markers at verified landing locations
//   • Drei OrbitControls: drag to orbit, scroll to zoom, autoRotate when idle
//   • Smooth camera focus transition on marker selection
//   • Balanced 360° lighting for full visibility on both Martian hemispheres
// ─────────────────────────────────────────────────────────────────────────────

const MARS_RADIUS = 2.5;
const MARS_SEGMENTS = 64;

const CAM_OVERVIEW = 7.0;
const CAM_FOCUS    = 4.2;
const CAM_MIN      = 3.6;
const CAM_MAX      = 11.0;

interface MarsSceneProps {
  onReady?: () => void;
  selectedId: string | null;
  onMarkerClick: (marker: MarsMarker) => void;
  onMarkerNavigate?: (markerId: string) => void;
  onBackgroundClick: () => void;
}

export const MarsScene: React.FC<MarsSceneProps> = ({
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
  const targetAzimuth = useRef(0);
  const targetElevation = useRef(0.2);
  const isAnimating = useRef(false);

  // Texture loading
  const surfaceMap = useTexture('/assets/mars-surface.jpg', (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
  });

  // Focus on marker
  const focusOnMarker = useCallback((marker: MarsMarker) => {
    const pos = latLonToVec3(marker.lat, marker.lon, 1);
    targetAzimuth.current   = Math.atan2(pos.x, pos.z);
    targetElevation.current = Math.asin(Math.max(-1, Math.min(1, pos.y)));
    targetDistance.current  = CAM_FOCUS;
    isAnimating.current     = true;
  }, []);

  const resetView = useCallback(() => {
    targetDistance.current  = CAM_OVERVIEW;
    isAnimating.current     = true;
  }, []);

  const prevSelectedId = useRef<string | null>(null);
  if (selectedId !== prevSelectedId.current) {
    prevSelectedId.current = selectedId;
    if (selectedId) {
      const m = MARS_MARKERS.find(m => m.id === selectedId);
      if (m) focusOnMarker(m);
    } else {
      resetView();
    }
  }

  // Per-frame animation
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    if (!readyFired.current && onReady) {
      readyFired.current = true;
      onReady();
    }

    if (isAnimating.current && orbitRef.current) {
      const ctrl = orbitRef.current;
      const lerpSpeed = 1 - Math.pow(0.04, dt);

      const curDist = ctrl.getDistance();
      const newDist = curDist + (targetDistance.current - curDist) * lerpSpeed;

      const curAz = ctrl.getAzimuthalAngle();
      let dAz = targetAzimuth.current - curAz;
      if (dAz > Math.PI) dAz -= 2 * Math.PI;
      if (dAz < -Math.PI) dAz += 2 * Math.PI;
      const newAz = curAz + dAz * lerpSpeed;

      const curEl = ctrl.getPolarAngle();
      const targetPolar = Math.PI / 2 - targetElevation.current;
      const newEl = curEl + (targetPolar - curEl) * lerpSpeed;

      ctrl.setAzimuthalAngle(newAz);
      ctrl.setPolarAngle(newEl);

      const cam = state.camera;
      const dir = cam.position.clone().normalize();
      cam.position.copy(dir.multiplyScalar(newDist));
      ctrl.update();

      const distDiff = Math.abs(newDist - targetDistance.current);
      const azDiff   = Math.abs(dAz * lerpSpeed);
      if (distDiff < 0.01 && azDiff < 0.001) {
        isAnimating.current = false;
      }
    }
  });

  return (
    <>
      {/* Deep space starfield */}
      <Stars
        radius={120}
        depth={60}
        count={6000}
        factor={3.5}
        saturation={0.15}
        fade
        speed={0.4}
      />

      {/* OrbitControls */}
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

      {/* Mars procedural sphere */}
      <mesh onClick={onBackgroundClick}>
        <sphereGeometry args={[MARS_RADIUS, MARS_SEGMENTS, MARS_SEGMENTS]} />
        <meshStandardMaterial
          map={surfaceMap}
          roughness={0.90}
          metalness={0}
        />
      </mesh>

      {/* ── 3D Equipment Models (Replacing small markers with verified 3D spacecraft) ── */}
      {MARS_MARKERS.map((marker) => {
        const pos = latLonToVec3(marker.lat, marker.lon, MARS_RADIUS + 0.01);
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

      {/* ── Balanced 360° Mars Lighting ────────────────────────────────────── */}
      {/* 1. Global Hemisphere: ambient sky-to-ground contrast with warm Martian undertones */}
      <hemisphereLight
        color="#543c2c"
        groundColor="#1c120c"
        intensity={0.58}
      />

      {/* 2. Soft Ambient base: keeps deep valleys & polar terrain visible */}
      <ambientLight intensity={0.28} color="#1c100a" />

      {/* 3. Near-Side Key Directional: casts crisp terrain shadows across Western hemisphere */}
      <directionalLight position={[-6, 3.5, 5]} intensity={1.25} color="#fff4e6" />

      {/* 4. Far-Side Key Directional: matched power across Eastern hemisphere for equal clarity */}
      <directionalLight position={[6, 3.5, -5]} intensity={1.25} color="#ffeede" />

      {/* 5. Eastern Limb Cross-Fill */}
      <directionalLight position={[6, -2, 3]} intensity={0.42} color="#e2c8b8" />

      {/* 6. Western Limb Cross-Fill */}
      <directionalLight position={[-6, -2, -3]} intensity={0.42} color="#e2c8b8" />
    </>
  );
};

export default MarsScene;
