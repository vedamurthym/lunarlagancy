import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { RotateCw, Box, Compass } from 'lucide-react';
import { disposeObject3D, getDevicePerformanceConfig } from '@/lib/assetManager';

// Ensure local Draco decoder path is active
useGLTF.setDecoderPath('/draco/gltf/');

interface ModelProps {
  url: string;
}

const GLBModel: React.FC<ModelProps> = ({ url }) => {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    // Auto-normalize bounding box so any GLB model renders at optimal viewing scale
    const box = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const targetSize = 2.4;
      const scale = targetSize / maxDim;
      c.scale.set(scale, scale, scale);
    }
    return c;
  }, [scene]);

  useEffect(() => {
    return () => {
      disposeObject3D(cloned);
    };
  }, [cloned]);

  return (
    <Center>
      <primitive object={cloned} />
    </Center>
  );
};

interface EquipmentViewer3DProps {
  modelUrl: string | null;
  equipmentName: string;
  category: 'Moon' | 'Mars' | 'Deep Space';
  accentColor: string;
  modelNote?: string;
}

export const EquipmentViewer3D: React.FC<EquipmentViewer3DProps> = ({
  modelUrl,
  equipmentName,
  category,
  accentColor,
  modelNote,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [hasError, setHasError] = useState(false);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // If no model URL is bound or if error occurred during GLB load
  if (!modelUrl || hasError) {
    return (
      <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-space-darkest/90 border border-space-border/60 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-cosmic-grid opacity-30 pointer-events-none" />

        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform shadow-panel border"
          style={{
            backgroundColor: `${accentColor}15`,
            borderColor: `${accentColor}40`,
            color: accentColor,
          }}
        >
          <Box className="w-8 h-8 animate-pulse-subtle" />
        </div>

        <h3 className="text-base font-bold text-white mb-1.5">
          {equipmentName} 3D Asset
        </h3>

        <p className="text-xs text-space-muted max-w-md leading-relaxed mb-4">
          {modelNote ||
            `High-fidelity glTF 2.0 digital twin for ${equipmentName} will stream directly via Supabase Storage in Prompt 8.`}
        </p>

        <div className="inline-flex items-center gap-2 font-mono text-[11px] bg-space-surface/80 border border-space-border px-3 py-1.5 rounded-lg text-space-subtle">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span className="uppercase text-space-muted font-semibold">Classification:</span>
          <span className="text-white">{category} Telemetry Ingested</span>
        </div>
      </div>
    );
  }

  const perf = useMemo(() => getDevicePerformanceConfig(), []);

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-[#131d31] via-[#0b1322] to-[#060a14] border border-space-border/80 overflow-hidden group shadow-2xl">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [2.5, 2.0, 3.2], fov: 45 }}
        dpr={perf.dpr}
        gl={{ antialias: true, powerPreference: perf.powerPreference }}
      >
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[6, 9, 6]} intensity={1.8} castShadow />
        <directionalLight position={[-6, 3, -5]} intensity={1.0} color="#94a3b8" />
        <directionalLight position={[0, -5, 3]} intensity={0.6} color="#64748b" />
        <pointLight position={[0, 4, 0]} intensity={0.8} color={accentColor} />

        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center gap-2 font-mono text-xs text-space-muted bg-space-darkest/90 px-4 py-2 rounded-lg border border-space-border backdrop-blur-md">
                <div
                  className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: accentColor, borderTopColor: 'transparent' }}
                />
                <span>Streaming 3D Telemetry...</span>
              </div>
            </Html>
          }
        >
          <ErrorBoundary onCatch={() => setHasError(true)}>
            <GLBModel url={modelUrl} />
          </ErrorBoundary>
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableDamping={true}
          dampingFactor={0.08}
          minDistance={1.0}
          maxDistance={12.0}
          autoRotate={true}
          autoRotateSpeed={0.8}
        />
      </Canvas>

      {/* Control Buttons Overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          onClick={resetCamera}
          className="p-2 rounded-lg bg-space-surface/80 border border-space-border/80 text-space-muted hover:text-white hover:bg-space-surface transition-all backdrop-blur-md"
          title="Reset Camera View"
          aria-label="Reset Camera View"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Hint Overlay */}
      <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex items-center justify-between text-[10px] font-mono text-space-subtle/80">
        <div className="flex items-center gap-1.5 bg-space-darkest/75 backdrop-blur-md px-2.5 py-1 rounded-md border border-space-border/40">
          <Compass className="w-3 h-3 text-space-accent" />
          <span>Drag to rotate • Scroll to zoom • Right-click to pan</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-space-darkest/75 backdrop-blur-md px-2 py-1 rounded-md border border-space-border/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Verified 3D glTF Model</span>
        </div>
      </div>
    </div>
  );
};

// Simple React Error Boundary for Three.js suspended models
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onCatch: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onCatch: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('[EquipmentViewer3D] Model load failed:', error?.message);
    setTimeout(() => {
      this.props.onCatch();
    }, 0);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
