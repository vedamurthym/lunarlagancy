import React, { Suspense, useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { DeepSpaceScene } from './DeepSpaceScene';
import type { PlanetData, SpacecraftData } from './deepSpaceData';
import { AssetLoadingIndicator } from '@/components/common/AssetLoadingIndicator';
import { getDevicePerformanceConfig } from '@/lib/assetManager';

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

interface DeepSpaceCanvasProps {
  className?: string;
  selectedId: string | null;
  onSelectObject: (item: PlanetData | SpacecraftData | null) => void;
  onNavigateToEquipment?: (equipmentId: string) => void;
  onBackgroundClick?: () => void;
}

export const DeepSpaceCanvas: React.FC<DeepSpaceCanvasProps> = ({
  className = '',
  selectedId,
  onSelectObject,
  onNavigateToEquipment,
  onBackgroundClick,
}) => {
  const [webglSupported] = useState<boolean>(() => isWebGLAvailable());
  const [sceneReady, setSceneReady] = useState(false);
  const handleReady = useCallback(() => setSceneReady(true), []);

  if (!webglSupported) {
    return (
      <div
        className={`flex items-center justify-center bg-space-darkest text-space-muted text-sm font-mono ${className}`}
      >
        <div className="text-center">
          <div className="text-3xl mb-3">🌌</div>
          <div>WebGL is required for the 3D Deep Space solar system simulation.</div>
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
        camera={{ position: [0, 38, 55], fov: 45, near: 0.1, far: 500 }}
        dpr={perf.dpr}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: perf.powerPreference,
          stencil: false,
        }}
        onPointerMissed={() => onBackgroundClick?.()}
        style={{ opacity: sceneReady ? 1 : 0, background: '#060c18' }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <DeepSpaceScene
            onReady={handleReady}
            selectedId={selectedId}
            onSelectObject={onSelectObject}
            onNavigateToEquipment={onNavigateToEquipment}
          />
        </Suspense>
      </Canvas>

      {!sceneReady && (
        <AssetLoadingIndicator
          label="Loading Solar System Simulation"
          accentColor="#818cf8"
        />
      )}
    </div>
  );
};

export default DeepSpaceCanvas;
