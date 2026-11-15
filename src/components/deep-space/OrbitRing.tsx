import React, { useMemo } from 'react';
import * as THREE from 'three';

interface OrbitRingProps {
  distance: number;
  color?: string;
  opacity?: number;
}

export const OrbitRing: React.FC<OrbitRingProps> = ({
  distance,
  color = '#334155',
  opacity = 0.25,
}) => {
  const lineObject = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * distance, 0, Math.sin(theta) * distance));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: opacity,
    });
    return new THREE.LineLoop(geometry, material);
  }, [distance, color, opacity]);

  return <primitive object={lineObject} />;
};
