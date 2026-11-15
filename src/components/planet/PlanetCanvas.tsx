import React, { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { PlanetScene } from './PlanetScene';
import { PlanetConfig } from './PlanetConfig';

// ─────────────────────────────────────────────────────────────────────────────
// PlanetCanvas — reusable React Three Fiber Canvas wrapper for any planet.
//
// Features:
//   • Synchronous WebGL detection (avoids photo flash on first render)
//   • Canvas stays opacity:0 until PlanetScene fires onReady (no blank flash)
//   • Optional WebGL fallback image (shown only when WebGL is unavailable)
//   • Configurable camera, DPR, and edge feathering
//   • Suspense boundary for texture loading
// ─────────────────────────────────────────────────────────────────────────────

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export interface PlanetCanvasProps {
  config: PlanetConfig;
  /** Camera distance from origin */
  cameraDistance?: number;
  /** Camera field of view in degrees */
  cameraFov?: number;
  /** Additional CSS class applied to the outer container */
  className?: string;
  /** Fallback image URL shown when WebGL is unavailable */
  fallbackImageUrl?: string;
  /** Left-edge feathering width (Tailwind class, e.g. 'w-24 sm:w-36') */
  leftFeather?: string;
  /** Bottom-edge feathering height (Tailwind class, e.g. 'h-16') */
  bottomFeather?: string;
}

export const PlanetCanvas: React.FC<PlanetCanvasProps> = ({
  config,
  cameraDistance = 6.8,
  cameraFov = 42,
  className = '',
  fallbackImageUrl,
  leftFeather = 'w-24 sm:w-36',
  bottomFeather = 'h-16',
}) => {
  // Synchronous detection before first paint — avoids useState(true) + useEffect flash
  const [webglSupported] = useState<boolean>(() => isWebGLAvailable());
  const [planetReady, setPlanetReady] = useState(false);
  const handleReady = useCallback(() => setPlanetReady(true), []);

  // ── WebGL fallback ──────────────────────────────────────────────────────────
  if (!webglSupported) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
        {fallbackImageUrl && (
          <img
            src={fallbackImageUrl}
            alt={`${config.name} from Space`}
            className="w-full h-full object-cover opacity-90 select-none pointer-events-none"
          />
        )}
        {leftFeather && (
          <div
            className={`absolute inset-y-0 left-0 ${leftFeather} bg-gradient-to-r from-space-darkest to-transparent`}
          />
        )}
      </div>
    );
  }

  // ── 3D WebGL Canvas ─────────────────────────────────────────────────────────
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 0, cameraDistance], fov: cameraFov }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        // Hidden until planet has painted its first frame → no empty canvas flash
        style={{ opacity: planetReady ? 1 : 0 }}
        className="w-full h-full pointer-events-none select-none"
      >
        <Suspense fallback={null}>
          <PlanetScene config={config} onReady={handleReady} />
        </Suspense>
      </Canvas>

      {/* ── Edge feathering — blends planet into the dark page ─────────────── */}
      {leftFeather && (
        <div
          className={`absolute inset-y-0 left-0 ${leftFeather} pointer-events-none bg-gradient-to-r from-space-darkest to-transparent`}
        />
      )}
      {bottomFeather && (
        <div
          className={`absolute inset-x-0 bottom-0 ${bottomFeather} pointer-events-none bg-gradient-to-t from-space-darkest to-transparent`}
        />
      )}
    </div>
  );
};

export default PlanetCanvas;
