import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

interface SunProps {
  isSelected: boolean;
  onSelect: () => void;
}

export const Sun: React.FC<SunProps> = ({ isSelected, onSelect }) => {
  const sunMeshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);

  // Load Sun surface texture
  const sunTexture = useTexture('/assets/deep-space/sun-texture.jpg', (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  });

  // Slow solar differential rotation and corona pulsation
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y += dt * 0.008;
    }
    if (coronaRef.current) {
      const t = state.clock.getElapsedTime();
      const scale = 1.05 + Math.sin(t * 1.5) * 0.015;
      coronaRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ── Solar Core Sphere ────────────────────────────────────────────── */}
      <mesh
        ref={sunMeshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <sphereGeometry args={[2.3, 64, 64]} />
        {/* meshStandardMaterial with strong emissive gives the Sun 3D depth
            while remaining self-luminous. The map adds surface detail. */}
        <meshStandardMaterial
          map={sunTexture}
          emissiveMap={sunTexture}
          emissive={new THREE.Color('#ff7700')}
          emissiveIntensity={1.2}
          roughness={0.6}
          metalness={0.0}
        />
      </mesh>

      {/* ── Inner Glow Layer ───────────────────────────────────────────────── */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[2.42, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* ── Outer Solar Corona Glow ───────────────────────────────────────── */}
      <mesh>
        <sphereGeometry args={[2.75, 32, 32]} />
        <meshBasicMaterial
          color="#ff5500"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* ── Omnidirectional Solar Illumination ────────────────────────────── */}
      <pointLight
        position={[0, 0, 0]}
        intensity={4.5}
        distance={160}
        decay={0.5}
        color="#fff4e6"
      />

      {/* ── Optional Center Label on Select ───────────────────────────────── */}
      {isSelected && (
        <Html position={[0, 3.2, 0]} center distanceFactor={20} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: 'rgba(25, 12, 0, 0.92)',
              border: '1px solid #f59e0b',
              borderRadius: '6px',
              padding: '4px 10px',
              color: '#fef3c7',
              fontSize: '11px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.6)',
            }}
          >
            The Sun (Sol) · G-Type Main Sequence Star
          </div>
        </Html>
      )}
    </group>
  );
};
