import React, { useRef, useState, useCallback } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData } from './deepSpaceData';

interface CelestialSphereProps {
  data: PlanetData;
  isSelected: boolean;
  onSelect: (data: PlanetData) => void;
  initialAngle?: number;
  /** Called every frame with the planet's current world (x, z) position */
  onPositionUpdate?: (id: string, x: number, z: number) => void;
}

export const CelestialSphere: React.FC<CelestialSphereProps> = ({
  data,
  isSelected,
  onSelect,
  initialAngle = 0,
  onPositionUpdate,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Load planet texture
  const texture = useTexture(data.textureUrl, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  });

  const angleRef = useRef(initialAngle);

  // Per-frame orbital movement and axial spin
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);

    // Orbit around the Sun
    angleRef.current += dt * data.orbitSpeed;
    const x = Math.cos(angleRef.current) * data.distance;
    const z = Math.sin(angleRef.current) * data.distance;

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }

    // Report live position to parent so camera can follow the planet
    onPositionUpdate?.(data.id, x, z);

    // Axial spin
    if (meshRef.current) {
      meshRef.current.rotation.y += dt * data.rotationSpeed;
    }
  });

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect(data);
    },
    [data, onSelect]
  );

  return (
    <group ref={groupRef}>
      {/* 3D Planet / Asteroid Mesh */}
      <mesh
        ref={meshRef}
        rotation={[data.axialTilt ?? 0, 0, 0]}
        scale={data.shapeScale ?? [1, 1, 1]}
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[data.radius, 48, 48]} />
        <meshStandardMaterial
          map={texture}
          roughness={data.type === 'asteroid' ? 0.95 : 0.8}
          metalness={0.02}
        />
      </mesh>

      {/* Saturn's Rings (if present) */}
      {data.ring && (
        <mesh
          ref={ringRef}
          rotation={[-Math.PI / 2 + (data.axialTilt ?? 0.45), 0, 0]}
          receiveShadow
        >
          <ringGeometry args={[data.ring.innerRadius, data.ring.outerRadius, 64]} />
          <meshStandardMaterial
            color={data.ring.color}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
            roughness={0.9}
          />
        </mesh>
      )}

      {/* Target Focus Glow Indicator — a soft outer halo, NOT a flat ring */}
      {(isSelected || hovered) && (
        <mesh>
          <sphereGeometry args={[data.radius * 1.55, 32, 32]} />
          <meshBasicMaterial
            color={data.color}
            transparent
            opacity={isSelected ? 0.18 : 0.08}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Interactive HUD Label */}
      {(isSelected || hovered) && (
        <Html
          position={[0, data.radius + 0.45, 0]}
          center
          distanceFactor={18}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(5, 10, 24, 0.92)',
              border: `1px solid ${data.color}88`,
              borderRadius: '6px',
              padding: '4px 10px',
              color: '#f8fafc',
              fontSize: '11px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              boxShadow: `0 0 14px ${data.color}44`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{ color: data.color, fontWeight: 'bold' }}>{data.name}</span>
          </div>
        </Html>
      )}
    </group>
  );
};
