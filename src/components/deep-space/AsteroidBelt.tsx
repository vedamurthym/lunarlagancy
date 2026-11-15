import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const AsteroidBelt: React.FC<{ count?: number }> = ({ count = 900 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const minR = 16.5;
    const maxR = 22.2;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = minR + Math.random() * (maxR - minR);
      const y = (Math.random() - 0.5) * 1.2; // slight vertical inclination spread

      pos[i * 3]     = Math.cos(theta) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * r;

      // Realistic rocky asteroid shades (grey, stone tan, charcoal)
      const shade = 0.45 + Math.random() * 0.45;
      col[i * 3]     = shade * (0.9 + Math.random() * 0.15); // R
      col[i * 3 + 1] = shade * (0.85 + Math.random() * 0.1); // G
      col[i * 3 + 2] = shade * (0.8 + Math.random() * 0.1);  // B
    }
    return [pos, col];
  }, [count]);

  // Slow orbital rotation of the entire belt
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.003;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
};
