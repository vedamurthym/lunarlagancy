import React, { useRef, useState, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Moon as MoonIcon, Compass, Sparkles } from 'lucide-react';

export type DestinationType = 'moon' | 'mars' | 'deep-space';
export type ExploreMode = 'earth' | 'explore' | 'transitioning';

interface CinematicHomeSceneProps {
  mode: ExploreMode;
  selectedDestination: DestinationType | null;
  onSelectDestination: (dest: DestinationType) => void;
  onTransitionComplete: () => void;
  onReady?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Well-Spaced Coordinates in Space (Wide Separation — Zero Visual Clutter)
// ─────────────────────────────────────────────────────────────────────────────
const EARTH_POS = new THREE.Vector3(0, -1.05, 0);
const MOON_POS = new THREE.Vector3(-5.8, -0.3, 1.2);
const MARS_POS = new THREE.Vector3(5.8, 0.4, 0.9);
const DEEP_SPACE_POS = new THREE.Vector3(0, 3.8, 0.2);

/**
 * Renders the 3D rotating Spiral Galaxy representing Deep Space,
 * using the authentic galaxy texture matching the user's specification.
 */
const DeepSpaceGalaxy3D: React.FC<{ targetSize?: number }> = ({ targetSize = 2.4 }) => {
  const galaxyRef = useRef<THREE.Group>(null);
  const galaxyTex = useTexture('/assets/galaxy.jpg');

  useMemo(() => {
    if (galaxyTex) {
      galaxyTex.colorSpace = THREE.SRGBColorSpace;
      galaxyTex.anisotropy = 8;
    }
  }, [galaxyTex]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    if (galaxyRef.current) {
      galaxyRef.current.rotation.z += dt * 0.035; // graceful spiral rotation
    }
  });

  return (
    <group ref={galaxyRef} rotation={[-Math.PI / 3.2, 0.2, 0.4]}>
      {/* 3D Spiral Disc with Galaxy Texture */}
      <mesh>
        <planeGeometry args={[targetSize * 1.5, targetSize]} />
        <meshStandardMaterial
          map={galaxyTex}
          emissiveMap={galaxyTex}
          emissive={new THREE.Color('#93c5fd')}
          emissiveIntensity={0.85}
          transparent
          opacity={0.96}
          side={THREE.DoubleSide}
          roughness={0.4}
        />
      </mesh>

      {/* Luminous Central Galactic Core */}
      <mesh>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshBasicMaterial
          color="#fef08a"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Radiant Galactic Illumination */}
      <pointLight color="#c7d2fe" intensity={2.5} distance={8} />
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main 3D Space Scene
// ─────────────────────────────────────────────────────────────────────────────
const CinematicHomeScene: React.FC<CinematicHomeSceneProps> = ({
  mode,
  selectedDestination,
  onSelectDestination,
  onTransitionComplete,
  onReady,
}) => {
  const { size } = useThree();
  const isMobile = size.width < 768;

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const marsRef = useRef<THREE.Mesh>(null);
  const deepSpaceBeaconRef = useRef<THREE.Group>(null);
  const readyNotified = useRef(false);

  const [hoveredDest, setHoveredDest] = useState<DestinationType | null>(null);

  // ── Reuse verified existing local textures ──────────────────────────────────
  const [earthMap, earthRoughness, earthClouds, moonMap, marsMap] = useTexture([
    '/assets/earth-surface.jpg',
    '/assets/earth-roughness.png',
    '/assets/earth-clouds.png',
    '/assets/moon-surface.jpg',
    '/assets/mars-surface.jpg',
  ]);

  useMemo(() => {
    [earthMap, earthClouds, moonMap, marsMap].forEach((tex) => {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
      }
    });
    if (earthRoughness) {
      earthRoughness.anisotropy = 8;
      earthRoughness.minFilter = THREE.LinearMipmapLinearFilter;
    }
  }, [earthMap, earthRoughness, earthClouds, moonMap, marsMap]);

  // Target camera state
  const targetCamPos = useRef(new THREE.Vector3(0, 0, isMobile ? 9.8 : 7.8));
  const targetLookAt = useRef(new THREE.Vector3(0, -1.05, 0));
  const transitionProgress = useRef(0);

  // Update target camera based on mode
  useMemo(() => {
    if (mode === 'earth') {
      targetCamPos.current.set(0, 0, isMobile ? 9.8 : 7.8);
      targetLookAt.current.set(0, -1.05, 0);
      transitionProgress.current = 0;
    } else if (mode === 'explore') {
      targetCamPos.current.set(0, isMobile ? 1.5 : 0.9, isMobile ? 18.0 : 15.0);
      targetLookAt.current.set(0, 0.2, 0);
      transitionProgress.current = 0;
    } else if (mode === 'transitioning') {
      if (selectedDestination === 'moon') {
        targetCamPos.current.set(MOON_POS.x + 0.2, MOON_POS.y + 0.15, MOON_POS.z + 1.4);
        targetLookAt.current.copy(MOON_POS);
      } else if (selectedDestination === 'mars') {
        targetCamPos.current.set(MARS_POS.x - 0.2, MARS_POS.y + 0.15, MARS_POS.z + 1.5);
        targetLookAt.current.copy(MARS_POS);
      } else if (selectedDestination === 'deep-space') {
        targetCamPos.current.set(DEEP_SPACE_POS.x, DEEP_SPACE_POS.y + 0.3, DEEP_SPACE_POS.z + 1.8);
        targetLookAt.current.copy(DEEP_SPACE_POS);
      }
    }
  }, [mode, selectedDestination, isMobile]);

  // ── Frame Loop: Rotation, Atmosphere & Smooth Camera Transitions ────────────
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    // Initial frame notification
    if (!readyNotified.current && onReady) {
      readyNotified.current = true;
      onReady();
    }

    // Realistic Earth & Cloud Rotation
    if (earthRef.current) {
      earthRef.current.rotation.y += dt * 0.03;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += dt * 0.042;
    }
    // Moon & Mars slow rotation
    if (moonRef.current) {
      moonRef.current.rotation.y += dt * 0.015;
    }
    if (marsRef.current) {
      marsRef.current.rotation.y += dt * 0.025;
    }
    // Deep Space beacon gyroscope animation
    if (deepSpaceBeaconRef.current) {
      deepSpaceBeaconRef.current.rotation.y += dt * 0.04;
      deepSpaceBeaconRef.current.rotation.z += dt * 0.02;
    }

    // Smooth Camera Lerp
    if (controlsRef.current) {
      const lerpSpeed = mode === 'transitioning' ? 0.07 : 0.045;
      const factor = 1 - Math.pow(1 - lerpSpeed, dt * 60);

      state.camera.position.lerp(targetCamPos.current, factor);
      controlsRef.current.target.lerp(targetLookAt.current, factor);
      controlsRef.current.update();

      if (mode === 'transitioning') {
        transitionProgress.current += dt;
        if (transitionProgress.current > 0.85) {
          onTransitionComplete();
        }
      }
    }
  });

  return (
    <>
      {/* ── Deep Space Starfield ────────────────────────────────────────────── */}
      <Stars
        radius={240}
        depth={100}
        count={11000}
        factor={4.8}
        saturation={0.25}
        fade
        speed={0.2}
      />

      {/* ── Atmospheric & Celestial Lighting ───────────────────────────────── */}
      <directionalLight position={[-8, 4, 6]} intensity={2.2} color="#fff9f0" />
      <ambientLight intensity={0.25} color="#08142a" />
      <hemisphereLight color="#233554" groundColor="#060b14" intensity={0.35} />
      <directionalLight position={[6, -2, -3]} intensity={0.12} color="#0a2046" />

      {/* ── Orbit Controls (Auto-rotates during initial Earth view) ─────────── */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={mode === 'earth'}
        minDistance={4.5}
        maxDistance={25}
        autoRotate={mode === 'earth'}
        autoRotateSpeed={0.35}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.5}
      />

      {/* ═════════════════════════════════════════════════════════════════════
          1. EARTH — The Center of Exploration (Shifted down for clear typography)
      ═════════════════════════════════════════════════════════════════════ */}
      <group position={[EARTH_POS.x, EARTH_POS.y, EARTH_POS.z]}>
        {/* Earth Surface Sphere */}
        <mesh ref={earthRef} castShadow receiveShadow>
          <sphereGeometry args={[2.6, 64, 64]} />
          <meshStandardMaterial
            map={earthMap}
            roughnessMap={earthRoughness}
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>

        {/* Dynamic Cloud Layer */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[2.62, 64, 64]} />
          <meshStandardMaterial
            map={earthClouds}
            alphaMap={earthClouds}
            transparent
            opacity={0.75}
            depthWrite={false}
            roughness={1.0}
            metalness={0}
          />
        </mesh>

        {/* Subtle Atmospheric Blue Corona */}
        <mesh>
          <sphereGeometry args={[2.66, 32, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.12}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* ═════════════════════════════════════════════════════════════════════
          2. DESTINATIONS (Prominent, Majestic Scale — Zero Connecting Lines)
      ═════════════════════════════════════════════════════════════════════ */}
      {mode !== 'earth' && (
        <>
          {/* ── Destination: Moon (Prominent on Left — No circle ring) ── */}
          <group
            position={MOON_POS}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDestination('moon');
            }}
            onPointerEnter={(e) => {
              e.stopPropagation();
              setHoveredDest('moon');
              document.body.style.cursor = 'pointer';
            }}
            onPointerLeave={() => {
              setHoveredDest(null);
              document.body.style.cursor = 'auto';
            }}
          >
            <mesh ref={moonRef}>
              <sphereGeometry args={[1.05, 32, 32]} />
              <meshStandardMaterial map={moonMap} roughness={0.92} metalness={0} />
            </mesh>

            {/* Compact Pill Label Positioned BELOW the Sphere — Zero Overlap */}
            <Html position={[0, -1.35, 0]} center distanceFactor={14} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDestination('moon');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all duration-200 backdrop-blur-md border cursor-pointer select-none ${
                  hoveredDest === 'moon'
                    ? 'bg-slate-900/95 border-slate-300 shadow-md shadow-slate-300/30 scale-105'
                    : 'bg-space-darkest/90 border-space-border/80 hover:border-slate-300 text-slate-200'
                }`}
              >
                <MoonIcon className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                <span className="text-xs font-semibold tracking-wide text-white">Moon</span>
                <span className="text-[10px] font-mono text-slate-400">· 4 Sites</span>
              </button>
            </Html>
          </group>

          {/* ── Destination: Mars (Prominent on Right — No circle ring) ─── */}
          <group
            position={MARS_POS}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDestination('mars');
            }}
            onPointerEnter={(e) => {
              e.stopPropagation();
              setHoveredDest('mars');
              document.body.style.cursor = 'pointer';
            }}
            onPointerLeave={() => {
              setHoveredDest(null);
              document.body.style.cursor = 'auto';
            }}
          >
            <mesh ref={marsRef}>
              <sphereGeometry args={[1.22, 32, 32]} />
              <meshStandardMaterial map={marsMap} roughness={0.9} metalness={0} />
            </mesh>

            {/* Compact Pill Label Positioned BELOW the Sphere — Zero Overlap */}
            <Html position={[0, -1.50, 0]} center distanceFactor={14} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDestination('mars');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all duration-200 backdrop-blur-md border cursor-pointer select-none ${
                  hoveredDest === 'mars'
                    ? 'bg-amber-950/95 border-amber-400 shadow-md shadow-amber-500/30 scale-105'
                    : 'bg-space-darkest/90 border-space-border/80 hover:border-amber-400 text-amber-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-xs font-semibold tracking-wide text-white">Mars</span>
                <span className="text-[10px] font-mono text-amber-300/80">· 6 Sites</span>
              </button>
            </Html>
          </group>

          {/* ── Destination: Deep Space (3D Spiral Galaxy — No circle ring) ─ */}
          <group
            position={DEEP_SPACE_POS}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDestination('deep-space');
            }}
            onPointerEnter={(e) => {
              e.stopPropagation();
              setHoveredDest('deep-space');
              document.body.style.cursor = 'pointer';
            }}
            onPointerLeave={() => {
              setHoveredDest(null);
              document.body.style.cursor = 'auto';
            }}
          >
            {/* 3D Spiral Galaxy Model Matching Uploaded Image */}
            <Suspense
              fallback={
                <mesh>
                  <sphereGeometry args={[0.6, 16, 16]} />
                  <meshBasicMaterial color="#818cf8" wireframe />
                </mesh>
              }
            >
              <DeepSpaceGalaxy3D targetSize={2.4} />
            </Suspense>

            {/* Compact Pill Label Positioned BELOW the Galaxy Model — Zero Overlap */}
            <Html position={[0, -1.40, 0]} center distanceFactor={14} style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDestination('deep-space');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all duration-200 backdrop-blur-md border cursor-pointer select-none ${
                  hoveredDest === 'deep-space'
                    ? 'bg-indigo-950/95 border-indigo-400 shadow-md shadow-indigo-500/30 scale-105'
                    : 'bg-space-darkest/90 border-space-border/80 hover:border-indigo-400 text-indigo-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-300 flex-shrink-0" />
                <span className="text-xs font-semibold tracking-wide text-white">Deep Space</span>
                <span className="text-[10px] font-mono text-indigo-300/80">· Outer Cosmos</span>
              </button>
            </Html>
          </group>
        </>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Canvas Container Component
// ─────────────────────────────────────────────────────────────────────────────
export interface CinematicHomeCanvasProps {
  mode: ExploreMode;
  selectedDestination: DestinationType | null;
  onSelectDestination: (dest: DestinationType) => void;
  onTransitionComplete: () => void;
  className?: string;
}

export const CinematicHomeCanvas: React.FC<CinematicHomeCanvasProps> = ({
  mode,
  selectedDestination,
  onSelectDestination,
  onTransitionComplete,
  className = '',
}) => {
  const [isReady, setIsReady] = useState(false);
  const handleReady = useCallback(() => setIsReady(true), []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
        }}
      >
        <Suspense fallback={null}>
          <CinematicHomeScene
            mode={mode}
            selectedDestination={selectedDestination}
            onSelectDestination={onSelectDestination}
            onTransitionComplete={onTransitionComplete}
            onReady={handleReady}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CinematicHomeCanvas;
