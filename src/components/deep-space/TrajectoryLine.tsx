import React, { useMemo } from 'react';
import * as THREE from 'three';

interface TrajectoryLineProps {
  points: [number, number, number][];
  color: string;
  dashed?: boolean;
}

export const TrajectoryLine: React.FC<TrajectoryLineProps> = ({
  points,
  color,
}) => {
  const lineObject = useMemo(() => {
    const vecPoints = points.map((p) => new THREE.Vector3(...p));
    // Create smooth Catmull-Rom spline through waypoints
    const curve = new THREE.CatmullRomCurve3(vecPoints, false, 'centripetal', 0.5);
    const curvePoints = curve.getPoints(80);
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.65,
    });
    return new THREE.Line(geometry, material);
  }, [points, color]);

  return <primitive object={lineObject} />;
};
