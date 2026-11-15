import React, { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  CELESTIAL_BODIES,
  ASTEROIDS,
  SPACECRAFT,
  type PlanetData,
  type SpacecraftData,
} from './deepSpaceData';
import { CelestialSphere } from './CelestialSphere';
import { Sun } from './Sun';
import { SpacecraftModel } from './SpacecraftModel';
import { OrbitRing } from './OrbitRing';
import { TrajectoryLine } from './TrajectoryLine';
import { AsteroidBelt } from './AsteroidBelt';

// Synthetic "Sun" data object so the sidebar card can display it on click
const SUN_DATA: PlanetData = {
  id: 'sun',
  name: 'The Sun (Sol)',
  type: 'star',
  distance: 0,
  radius: 2.3,
  orbitSpeed: 0,
  rotationSpeed: 0.008,
  textureUrl: '/assets/deep-space/sun-texture.jpg',
  color: '#fbbf24',
  description: 'G-type main-sequence star at the centre of the Solar System. It contains 99.86% of the total mass of the Solar System.',
  facts: [
    'Surface temperature: 5,500 °C',
    'Core temperature: 15 million °C',
    'Age: ~4.6 billion years',
  ],
};

// Evenly distribute planets around the full 360° so they aren't clumped
const PLANET_INITIAL_ANGLES = CELESTIAL_BODIES.map((_, i) =>
  (i / CELESTIAL_BODIES.length) * Math.PI * 2
);

interface DeepSpaceSceneProps {
  onReady?: () => void;
  selectedId: string | null;
  onSelectObject: (item: PlanetData | SpacecraftData | null) => void;
  onNavigateToEquipment?: (equipmentId: string) => void;
}

export const DeepSpaceScene: React.FC<DeepSpaceSceneProps> = ({
  onReady,
  selectedId,
  onSelectObject,
  onNavigateToEquipment,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const readyFired = useRef(false);

  // Target camera state for smooth lerp transitions
  const targetCamPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3 | null>(null);
  const isTransitioning = useRef(false);

  // Live position map — updated each frame by CelestialSphere callbacks
  const livePositions = useRef<Map<string, [number, number]>>(new Map());

  const handlePositionUpdate = useCallback((id: string, x: number, z: number) => {
    livePositions.current.set(id, [x, z]);
  }, []);

  // ── Camera focus on selected celestial body or spacecraft ─────────────────
  const focusOnPosition = useCallback((pos: [number, number, number], offsetDist: number) => {
    const center = new THREE.Vector3(...pos);
    targetLookAt.current = center;
    targetCamPos.current = new THREE.Vector3(
      center.x + offsetDist * 0.7,
      center.y + offsetDist * 0.5,
      center.z + offsetDist * 0.8
    );
    isTransitioning.current = true;
  }, []);

  const resetToOverview = useCallback(() => {
    targetLookAt.current = new THREE.Vector3(0, 0, 0);
    targetCamPos.current = new THREE.Vector3(0, 38, 55);
    isTransitioning.current = true;
  }, []);

  // When selectedId changes, trigger camera transition
  const prevSelectedId = useRef<string | null>(null);
  if (selectedId !== prevSelectedId.current) {
    prevSelectedId.current = selectedId;
    if (selectedId === 'sun') {
      focusOnPosition([0, 0, 0], 8.0);
    } else if (selectedId) {
      const craft = SPACECRAFT.find((s) => s.id === selectedId);
      if (craft) {
        focusOnPosition(craft.position, 3.5);
      } else {
        const body = [...CELESTIAL_BODIES, ...ASTEROIDS].find((b) => b.id === selectedId);
        if (body) {
          // Use live position if already available, else fall back to initial angle estimate
          const live = livePositions.current.get(body.id);
          const lx = live ? live[0] : Math.cos(0) * body.distance;
          const lz = live ? live[1] : Math.sin(0) * body.distance;
          focusOnPosition([lx, 0, lz], body.radius * 5.5 + 2.5);
        }
      }
    } else {
      resetToOverview();
    }
  }

  // ── Smooth Camera Transition Frame Loop ───────────────────────────────────
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    if (!readyFired.current && onReady) {
      readyFired.current = true;
      onReady();
    }

    // If a planet/asteroid is selected, continuously update the target to follow its orbit
    if (selectedId && selectedId !== 'sun') {
      const craft = SPACECRAFT.find((s) => s.id === selectedId);
      if (!craft) {
        const live = livePositions.current.get(selectedId);
        if (live) {
          const body = [...CELESTIAL_BODIES, ...ASTEROIDS].find((b) => b.id === selectedId);
          const offset = body ? body.radius * 5.5 + 2.5 : 5;
          const center = new THREE.Vector3(live[0], 0, live[1]);
          targetLookAt.current = center;
          targetCamPos.current = new THREE.Vector3(
            center.x + offset * 0.7,
            offset * 0.5,
            center.z + offset * 0.8
          );
        }
      }
    }

    if (isTransitioning.current && controlsRef.current && targetCamPos.current && targetLookAt.current) {
      const lerpFactor = 1 - Math.pow(0.02, dt);
      state.camera.position.lerp(targetCamPos.current, lerpFactor);
      controlsRef.current.target.lerp(targetLookAt.current, lerpFactor);
      controlsRef.current.update();

      const distDiff = state.camera.position.distanceTo(targetCamPos.current);
      if (distDiff < 0.15) {
        isTransitioning.current = false;
      }
    } else if (selectedId && selectedId !== 'sun') {
      // Keep tracking after initial transition settles
      const craft = SPACECRAFT.find((s) => s.id === selectedId);
      if (!craft && controlsRef.current && targetLookAt.current && targetCamPos.current) {
        const lerpFactor = 1 - Math.pow(0.08, dt);
        state.camera.position.lerp(targetCamPos.current, lerpFactor);
        controlsRef.current.target.lerp(targetLookAt.current, lerpFactor);
        controlsRef.current.update();
      }
    }
  });

  return (
    <>
      {/* ── Deep Space Authentic Starfield ────────────────────────────────── */}
      <Stars
        radius={220}
        depth={100}
        count={12000}
        factor={5.5}
        saturation={0.3}
        fade
        speed={0.25}
      />

      {/* ── Camera OrbitControls ─────────────────────────────────────────── */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        minDistance={3.5}
        maxDistance={140}
        enableDamping={true}
        dampingFactor={0.08}
        zoomSpeed={0.8}
        rotateSpeed={0.5}
      />

      {/* ── Global Space Ambient Lighting ─────────────────────────────────── */}
      {/* Brighter fill so users can see planets on all sides */}
      <ambientLight intensity={0.55} color="#1a2a4a" />
      <hemisphereLight color="#2a3f6f" groundColor="#0a0d18" intensity={0.45} />

      {/* ── 3D Sun at Origin [0, 0, 0] with PointLight ────────────────────── */}
      <Sun
        isSelected={selectedId === 'sun'}
        onSelect={() => onSelectObject(SUN_DATA)}
      />

      {/* ── Eight Planets with Orbit Lines ────────────────────────────────── */}
      {CELESTIAL_BODIES.map((planet, idx) => (
        <React.Fragment key={planet.id}>
          <OrbitRing distance={planet.distance} color="#334155" opacity={0.22} />
          <CelestialSphere
            data={planet}
            isSelected={selectedId === planet.id}
            onSelect={onSelectObject}
            initialAngle={PLANET_INITIAL_ANGLES[idx]}
            onPositionUpdate={handlePositionUpdate}
          />
        </React.Fragment>
      ))}

      {/* ── Asteroid Belt Particles ───────────────────────────────────────── */}
      <AsteroidBelt count={1100} />

      {/* ── Three Mission Asteroids (Vesta, Ceres, Eros) ───────────────────── */}
      {ASTEROIDS.map((ast, idx) => (
        <React.Fragment key={ast.id}>
          <OrbitRing distance={ast.distance} color="#64748b" opacity={0.35} />
          <CelestialSphere
            data={ast}
            isSelected={selectedId === ast.id}
            onSelect={onSelectObject}
            initialAngle={idx * 1.8 + 2.1}
            onPositionUpdate={handlePositionUpdate}
          />
        </React.Fragment>
      ))}

      {/* ── Three Spacecraft Trajectory Lines — only show when that spacecraft is selected ── */}
      {SPACECRAFT.map((craft) =>
        selectedId === craft.id ? (
          <TrajectoryLine
            key={`traj-${craft.id}`}
            points={craft.trajectoryPoints}
            color={craft.color}
          />
        ) : null
      )}

      {/* ── Three Spacecraft 3D GLB Models ────────────────────────────────── */}
      {SPACECRAFT.map((craft) => (
        <SpacecraftModel
          key={craft.id}
          data={craft}
          isSelected={selectedId === craft.id}
          onSelect={onSelectObject}
          onNavigateToEquipment={onNavigateToEquipment}
        />
      ))}
    </>
  );
};
