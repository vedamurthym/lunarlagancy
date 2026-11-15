import React from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { PlanetScene } from '@/components/planet/PlanetScene';
import { earthConfig } from './earthConfig';

// ─────────────────────────────────────────────────────────────────────────────
// EarthScene — thin Earth-specific wrapper around the reusable PlanetScene.
// All visual parameters live in earthConfig.ts.
// ─────────────────────────────────────────────────────────────────────────────

interface EarthSceneProps {
  /** Called once after the first rendered frame — EarthCanvas uses this to reveal the Canvas */
  onReady?: () => void;
  onPointerMove?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
}

export const EarthScene: React.FC<EarthSceneProps> = ({
  onReady,
  onPointerMove,
  onPointerDown,
}) => (
  <PlanetScene
    config={earthConfig}
    onReady={onReady}
    onPointerMove={onPointerMove}
    onPointerDown={onPointerDown}
  />
);

export default EarthScene;
