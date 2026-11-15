import React, { useMemo, useState, useCallback, useEffect, Suspense } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { getModel3DUrl } from '@/lib/supabase';
import { disposeObject3D } from '@/lib/assetManager';

// Ensure local Draco decoder path is active
useGLTF.setDecoderPath('/draco/gltf/');

interface SurfaceEquipmentModelProps {
  id: string;
  name: string;
  shortName: string;
  badge?: string;
  color: string;
  modelPath: string;
  position: THREE.Vector3;
  isSelected: boolean;
  onNavigate?: (id: string) => void;
  onClick?: (id: string) => void;
  targetSize?: number;
}

/**
 * GLBModelMesh accurately computes the bounding box across all geometry meshes,
 * normalizes the model to a very tiny marker size, and centers its base at Y = 0.
 */
const GLBModelMesh: React.FC<{
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
    const s = maxDim > 0 ? targetSize / maxDim : 0.01;

    // Center in X and Z, and place base at Y = 0 in unscaled coordinate space
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    clone.position.x = -center.x;
    clone.position.z = -center.z;
    clone.position.y = -bbox.min.y;

    return { clonedScene: clone, baseScale: s };
  }, [scene, targetSize]);

  // Safely dispose cloned geometries on unmount to free GPU memory
  useEffect(() => {
    return () => {
      disposeObject3D(clonedScene);
    };
  }, [clonedScene]);

  // Subtle interactive scale boost on hover or select
  const currentScale = baseScale * (isSelected ? 1.25 : hovered ? 1.15 : 1.0);

  return (
    <group scale={[currentScale, currentScale, currentScale]}>
      <primitive object={clonedScene} />
    </group>
  );
};

/**
 * SurfaceEquipmentModel — Tiny 3D equipment model placed directly on the planetary surface.
 * Replaces the old pin/dot with an exact, tiny 3D spacecraft replica.
 */
export const SurfaceEquipmentModel: React.FC<SurfaceEquipmentModelProps> = ({
  id,
  name,
  shortName,
  badge,
  color,
  modelPath,
  position,
  isSelected,
  onNavigate,
  onClick,
  targetSize = 0.16, // Clean medium size — clearly visible & recognizable on planet surface
}) => {
  const [hovered, setHovered] = useState(false);

  // Surface normal vector pointing directly away from the planet's core
  const normal = useMemo(() => position.clone().normalize(), [position]);

  // Quaternion orienting the model's +Y axis to stand upright on the sphere
  const orientation = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal),
    [normal]
  );

  const threeColor = useMemo(() => new THREE.Color(color), [color]);
  const modelUrl = useMemo(() => getModel3DUrl(modelPath), [modelPath]);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      document.body.style.cursor = 'auto';
      if (onNavigate) {
        onNavigate(id);
      } else if (onClick) {
        onClick(id);
      }
    },
    [id, onNavigate, onClick]
  );

  return (
    <group
      position={position}
      quaternion={orientation}
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
      {/* 3D Equipment Model */}
      <Suspense
        fallback={
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.03, 0.05, 16]} />
            <meshBasicMaterial color={threeColor} transparent opacity={0.6} />
          </mesh>
        }
      >
        <GLBModelMesh
          modelUrl={modelUrl}
          targetSize={targetSize}
          isSelected={isSelected}
          hovered={hovered}
        />
      </Suspense>

      {/* Surface Base Target Ring (appears when selected or hovered) */}
      {(isSelected || hovered) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
          <ringGeometry args={[targetSize * 0.75, targetSize * 1.15, 32]} />
          <meshBasicMaterial
            color={threeColor}
            transparent
            opacity={isSelected ? 0.9 : 0.65}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Active Selection Light Glow */}
      {isSelected && (
        <pointLight position={[0, 0.08, 0]} color={threeColor} intensity={1.5} distance={0.6} />
      )}

      {/* Floating telemetry label */}
      {(isSelected || hovered) && (
        <Html
          position={[0, targetSize * 1.6 + 0.04, 0]}
          center
          distanceFactor={7}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(5, 10, 24, 0.92)',
              border: `1px solid ${color}88`,
              borderRadius: '6px',
              padding: '3px 8px',
              color: '#f0f4ff',
              fontSize: '10px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(8px)',
              boxShadow: `0 0 12px ${color}55`,
            }}
          >
            <div style={{ color, fontWeight: 'bold' }}>{name || shortName}</div>
            {badge && <div style={{ color: '#94a3b8', fontSize: '8px' }}>{badge}</div>}
          </div>
        </Html>
      )}
    </group>
  );
};
