import React from 'react';
import { PlanetCanvas } from '@/components/planet/PlanetCanvas';
import { earthConfig } from './earthConfig';

// ─────────────────────────────────────────────────────────────────────────────
// EarthCanvas — thin Earth-specific wrapper around the reusable PlanetCanvas.
// Camera, feathering and fallback image are Earth-specific overrides.
// ─────────────────────────────────────────────────────────────────────────────

interface EarthCanvasProps {
  className?: string;
}

export const EarthCanvas: React.FC<EarthCanvasProps> = ({ className = '' }) => (
  <PlanetCanvas
    config={earthConfig}
    cameraDistance={6.8}
    cameraFov={42}
    className={className}
    fallbackImageUrl="/assets/earth-reference.jpg"
    leftFeather="w-24 sm:w-36"
    bottomFeather="h-16"
  />
);

export default EarthCanvas;
