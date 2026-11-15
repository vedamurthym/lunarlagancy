import React, { Suspense, useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { MoonScene } from './MoonScene';
import type { LunarMarker } from './lunarMarkers';
import { AssetLoadingIndicator } from '@/components/common/AssetLoadingIndicator';
import { getDevicePerformanceConfig } from '@/lib/assetManager';

// ─────────────────────────────────────────────────────────────────────────────
// MoonCanvas — Canvas wrapper for the interactive Moon environment.
// Handles WebGL detection, opacity-reveal (no flash), and marker state.
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

interface MoonCanvasProps {
  className?: string;
  selectedId: string | null;
  onMarkerClick: (marker: LunarMarker) => void;
  onMarkerNavigate?: (markerId: string) => void;
  onBackgroundClick: () => void;
}

export const MoonCanvas: React.FC<MoonCanvasProps> = ({
  className = '',
  selectedId,
  onMarkerClick,
  onMarkerNavigate,
  onBackgroundClick,
}) => {
  const [webglSupported] = useState<boolean>(() => isWebGLAvailable());
  const [moonReady, setMoonReady] = useState(false);
  const handleReady = useCallback(() => setMoonReady(true), []);

  // ── WebGL fallback ──────────────────────────────────────────────────────
  if (!webglSupported) {
    return (
      <div
        className={`flex items-center justify-center bg-space-darkest text-space-muted text-sm font-mono ${className}`}
      >
        <div className="text-center">
          <div className="text-3xl mb-3">🌕</div>
          <div>WebGL is required for the 3D Moon view.</div>
          <div className="text-xs mt-1 text-space-subtle">Enable hardware acceleration in your browser settings.</div>
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
        style={{ opacity: moonReady ? 1 : 0, background: '#00040d' }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <MoonScene
            onReady={handleReady}
            selectedId={selectedId}
            onMarkerClick={onMarkerClick}
            onMarkerNavigate={onMarkerNavigate}
            onBackgroundClick={onBackgroundClick}
          />
        </Suspense>
      </Canvas>

      {/* Real-time telemetry loading progress & errors */}
      {!moonReady && (
        <AssetLoadingIndicator
          label="Loading Lunar Surface & Telemetry"
          accentColor="#cbd5e1"
        />
      )}
    </div>
  );
};

export default MoonCanvas;
