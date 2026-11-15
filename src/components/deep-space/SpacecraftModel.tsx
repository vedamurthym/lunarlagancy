import React, { useRef, useState, useCallback, useMemo, useEffect, Suspense } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SpacecraftData } from './deepSpaceData';
import { disposeObject3D } from '@/lib/assetManager';

// Ensure local Draco decoder path is active for Dawn, NEAR Shoemaker & Pioneer 10
useGLTF.setDecoderPath('/draco/gltf/');

interface SpacecraftModelProps {
  data: SpacecraftData;
  isSelected: boolean;
  onSelect: (data: SpacecraftData) => void;
  onNavigateToEquipment?: (equipmentId: string) => void;
}

/**
 * Normalizes 3D spacecraft GLB models so Dawn, NEAR Shoemaker,
 * and Pioneer 10 are consistently sized and visible in the vast solar system.
 */
const SpacecraftGLB: React.FC<{
  modelUrl: string;
  targetSize: number;
  isSelected: boolean;
  hovered: boolean;
}> = ({ modelUrl, targetSize, isSelected, hovered }) => {
  const { scene } = useGLTF(modelUrl);

  const { clonedScene, baseScale } = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const bbox = new THREE.Box3().setFromObject(clone);

    const size = new THREE.Vector3();
    bbox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0 ? targetSize / maxDim : 0.05;

    // Center geometry at origin (0, 0, 0)
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    clone.position.x = -center.x;
    clone.position.y = -center.y;
    clone.position.z = -center.z;

    return { clonedScene: clone, baseScale: s };
  }, [scene, targetSize]);

  // Safely dispose cloned geometry on unmount
  useEffect(() => {
    return () => {
      disposeObject3D(clonedScene);
    };
  }, [clonedScene]);

  const currentScale = baseScale * (isSelected ? 1.35 : hovered ? 1.2 : 1.0);

  return (
    <group scale={[currentScale, currentScale, currentScale]}>
      <primitive object={clonedScene} />
    </group>
  );
};

export const SpacecraftModel: React.FC<SpacecraftModelProps> = ({
  data,
  isSelected,
  onSelect,
  onNavigateToEquipment,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      document.body.style.cursor = 'auto';
      if (onNavigateToEquipment && data.equipmentId) {
        onNavigateToEquipment(data.equipmentId);
      } else {
        onSelect(data);
      }
    },
    [data, onSelect, onNavigateToEquipment]
  );

  // Gentle idle wobble / drift
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y += 0.005;
      groupRef.current.position.y = data.position[1] + Math.sin(t * 1.2 + data.position[0]) * 0.08;
    }
  });

  const color = new THREE.Color(data.color);

  return (
    <group
      ref={groupRef}
      position={data.position}
      onClick={handleClick}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 3D GLB Spacecraft Model */}
      <Suspense
        fallback={
          <mesh>
            <octahedronGeometry args={[0.2, 0]} />
            <meshBasicMaterial color={color} wireframe transparent opacity={0.6} />
          </mesh>
        }
      >
        <SpacecraftGLB
          modelUrl={data.modelUrl}
          targetSize={0.55}
          isSelected={isSelected}
          hovered={hovered}
        />
      </Suspense>

      {/* Target Marker Beacon Ring (so spacecraft is easily spotted in vast space) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.32, 0.40, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.9 : hovered ? 0.75 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Highlight point light when selected */}
      {isSelected && (
        <pointLight position={[0, 0.4, 0]} color={color} intensity={2.0} distance={5} />
      )}

      {/* Interactive HUD Label */}
      {(isSelected || hovered) && (
        <Html position={[0, 0.65, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: 'rgba(8, 12, 28, 0.92)',
              border: `1px solid ${data.color}88`,
              borderRadius: '6px',
              padding: '4px 10px',
              color: '#ffffff',
              fontSize: '11px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              boxShadow: `0 0 14px ${data.color}55`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ color: data.color, fontWeight: 'bold' }}>{data.name}</div>
            <div style={{ color: '#94a3b8', fontSize: '9px' }}>{data.target}</div>
          </div>
        </Html>
      )}
    </group>
  );
};
