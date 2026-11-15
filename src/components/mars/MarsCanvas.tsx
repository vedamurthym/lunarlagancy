import React, { Suspense, useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { MarsScene } from './MarsScene';
import type { MarsMarker } from './marsMarkers';
import { AssetLoadingIndicator } from '@/components/common/AssetLoadingIndicator';
import { getDevicePerformanceConfig } from '@/lib/assetManager';

// ─────────────────────────────────────────────────────────────────────────────
// MarsCanvas — Canvas wrapper for the interactive Mars environment.
// Handles WebGL detection, opacity-reveal, and loading state.
// ─────────────────────────────────────────────────────────────────────────────

function isWebGLAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

interface MarsCanvasProps {
  className?: string;
  selectedId: string | null;
  onMarkerClick: (marker: MarsMarker) => void;
  onMarkerNavigate?: (markerId: string) => void;
  onBackgroundClick: () => void;
}

export const MarsCanvas: React.FC<MarsCanvasProps> = ({
  className = '',
  selectedId,
  onMarkerClick,
  onMarkerNavigate,
  onBackgroundClick,
}) => {
  const [webglSupported] = useState<boolean>(() => isWebGLAvailable());
  const [marsReady, setMarsReady] = useState(false);
  const handleReady = useCallback(() => setMarsReady(true), []);

  if (!webglSupported) {
    return (
      <div
        className={`flex items-center justify-center bg-space-darkest text-space-muted text-sm font-mono ${className}`}
      >
        <div className="text-center">
          <div className="text-3xl mb-3">🔴</div>
          <div>WebGL is required for the 3D Mars view.</div>
          <div className="text-xs mt-1 text-space-subtle">
            Enable hardware acceleration in your browser settings.
          </div>
        </div>
      </div>
    );
  }

  const perf = useMemo(() => getDevicePerformanceConfig(), []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 7.0], fov: 45 }}
        dpr={perf.dpr}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: perf.powerPreference,
          stencil: false,
        }}
        style={{ opacity: marsReady ? 1 : 0, background: '#050201' }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <MarsScene
            onReady={handleReady}
            selectedId={selectedId}
            onMarkerClick={onMarkerClick}
            onMarkerNavigate={onMarkerNavigate}
            onBackgroundClick={onBackgroundClick}
          />
        </Suspense>
      </Canvas>

      {!marsReady && (
        <AssetLoadingIndicator
          label="Loading Martian Surface & Telemetry"
          accentColor="#f59e0b"
        />
      )}
    </div>
  );
};

export default MarsCanvas;
