import React, { useState, useCallback, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Moon as MoonIcon,
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Orbit,
  RotateCw,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import type { DestinationType, ExploreMode } from '@/components/home/CinematicHomeCanvas';
import { preloadDestination } from '@/lib/assetManager';

const CinematicHomeCanvas = lazy(() => import('@/components/home/CinematicHomeCanvas'));

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ExploreMode>('earth');
  const [selectedDestination, setSelectedDestination] = useState<DestinationType | null>(null);

  // Trigger Explore mode: camera pulls back smoothly and reveals Moon, Mars, Deep Space in 3D
  const handleStartExplore = useCallback(() => {
    setMode('explore');
    // Preload planetary surface textures immediately when entering Explore mode
    preloadDestination('moon');
    preloadDestination('mars');
    preloadDestination('deep-space');
  }, []);

  // Return camera back to Earth focus
  const handleReturnToEarth = useCallback(() => {
    setMode('earth');
    setSelectedDestination(null);
  }, []);

  // Select destination: camera flies in toward destination with cinematic warp
  const handleSelectDestination = useCallback((dest: DestinationType) => {
    setSelectedDestination(dest);
    setMode('transitioning');
  }, []);

  // Navigate once camera fly-in settles
  const handleTransitionComplete = useCallback(() => {
    if (selectedDestination === 'moon') {
      navigate('/moon');
    } else if (selectedDestination === 'mars') {
      navigate('/mars');
    } else if (selectedDestination === 'deep-space') {
      navigate('/deep-space');
    }
  }, [navigate, selectedDestination]);

  const destLabels: Record<DestinationType, { name: string; color: string; desc: string }> = {
    moon: { name: 'The Moon', color: '#cbd5e1', desc: 'Apollo & Surveyor Landing Sites' },
    mars: { name: 'Mars', color: '#f59e0b', desc: 'Rovers & Historic Landers' },
    'deep-space': { name: 'Deep Space', color: '#818cf8', desc: 'Dawn, NEAR & Pioneer 10' },
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between overflow-hidden bg-space-darkest select-none">
      {/* ═══════════════════════════════════════════════════════════════════
          FULL-SCREEN 3D CINEMATIC UNIVERSE CANVAS
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center bg-space-darkest">
              <div className="w-12 h-12 rounded-full border-2 border-space-accent/30 border-t-space-accent animate-spin mb-4" />
              <p className="text-xs font-mono text-space-subtle tracking-widest uppercase">
                Rendering Planetary Simulation
              </p>
            </div>
          }
        >
          <CinematicHomeCanvas
            mode={mode}
            selectedDestination={selectedDestination}
            onSelectDestination={handleSelectDestination}
            onTransitionComplete={handleTransitionComplete}
          />
        </Suspense>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CINEMATIC HUD OVERLAY (Minimal, Elegant & Unobtrusive)
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 pointer-events-none flex-1 flex flex-col justify-between p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {/* ── Top Header Section ──────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center transition-all duration-500 ease-out">
          {mode === 'earth' && (
            <div className="flex flex-col items-center gap-2 max-w-2xl animate-fadeIn">
              <Badge variant="accent" size="sm" withDot>
                PLANETARY ARTIFACT ARCHIVE
              </Badge>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                You are on Earth.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300 font-light block sm:inline">
                  Where do you want to explore?
                </span>
              </h1>

              <p className="text-xs font-mono text-space-muted tracking-wide max-w-lg mt-1">
                Explore humanity's greatest planetary achievements across the Solar System.
              </p>
            </div>
          )}

          {mode === 'explore' && (
            <div className="w-full flex items-center justify-between pointer-events-auto animate-fadeIn px-2 pt-1">
              {/* Back to Earth */}
              <button
                type="button"
                onClick={handleReturnToEarth}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-space-darkest/90 hover:bg-space-surface border border-space-border hover:border-space-accent/50 text-xs font-mono text-space-muted hover:text-white transition-all backdrop-blur-md cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Earth View</span>
              </button>

              {/* Status Indicator */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-space-subtle uppercase tracking-widest">
                <Orbit className="w-3.5 h-3.5 text-space-accent animate-spin-slow" />
                <span>Select a 3D Destination</span>
              </div>

              {/* Counter Badge */}
              <div className="text-[11px] font-mono text-space-accent bg-space-surface/80 border border-space-border px-3 py-1 rounded-lg backdrop-blur-md">
                3 Exploration Realms
              </div>
            </div>
          )}
        </div>

        {/* ── Center / Lower Interaction Controls ─────────────────────── */}
        <div className="flex flex-col items-center gap-4 pb-2 sm:pb-6">
          {/* Initial Mode: Minimal Elegant Explore Action */}
          {mode === 'earth' && (
            <div className="flex flex-col items-center gap-3 pointer-events-auto animate-fadeIn">
              <button
                type="button"
                onClick={handleStartExplore}
                className="group relative inline-flex items-center gap-3.5 px-8 py-3.5 rounded-full bg-space-surface/90 hover:bg-space-surface border border-space-accent/50 hover:border-space-accent text-white font-medium text-sm tracking-wide shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:scale-105 transition-all duration-300 backdrop-blur-md cursor-pointer"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-space-accent animate-ping" />
                <span className="font-semibold text-white tracking-wider uppercase text-xs font-mono">
                  Explore Destinations
                </span>
                <ArrowRight className="w-4 h-4 text-space-accent group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 text-[10px] font-mono text-space-subtle/80">
                <RotateCw className="w-3 h-3 text-space-subtle animate-spin-slow" />
                <span>Drag Earth to rotate · Scroll to zoom</span>
              </div>
            </div>
          )}

          {/* Explore Mode: Crystal-Clear Bottom Destination Selector Bar */}
          {mode === 'explore' && (
            <div className="w-full max-w-3xl flex flex-col sm:flex-row items-center justify-center gap-3 pointer-events-auto animate-fadeIn">
              {/* Moon Pill Card */}
              <button
                type="button"
                onClick={() => handleSelectDestination('moon')}
                onMouseEnter={() => preloadDestination('moon')}
                className="group flex-1 w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-space-darkest/90 hover:bg-space-surface border border-space-border hover:border-slate-300 transition-all duration-200 backdrop-blur-md shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-600 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
                    <MoonIcon className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white group-hover:text-slate-200 transition-colors">
                      The Moon
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                      Apollo & Surveyor
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-space-muted group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Mars Pill Card */}
              <button
                type="button"
                onClick={() => handleSelectDestination('mars')}
                onMouseEnter={() => preloadDestination('mars')}
                className="group flex-1 w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-space-darkest/90 hover:bg-space-surface border border-space-border hover:border-amber-500/70 transition-all duration-200 backdrop-blur-md shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-600/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      Mars
                    </div>
                    <div className="text-[10px] font-mono text-amber-300/80 truncate max-w-[140px]">
                      Rovers & Landers
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-space-muted group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Deep Space Pill Card */}
              <button
                type="button"
                onClick={() => handleSelectDestination('deep-space')}
                onMouseEnter={() => preloadDestination('deep-space')}
                className="group flex-1 w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-space-darkest/90 hover:bg-space-surface border border-space-border hover:border-indigo-500/70 transition-all duration-200 backdrop-blur-md shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-600/60 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Deep Space
                    </div>
                    <div className="text-[10px] font-mono text-indigo-300/80 truncate max-w-[140px]">
                      Dawn, NEAR & Pioneer
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-space-muted group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CINEMATIC TRANSIT WARP VEIL (Subtle Hyperdrive Transition)
      ═══════════════════════════════════════════════════════════════════ */}
      {mode === 'transitioning' && selectedDestination && (
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-space-darkest/60 backdrop-blur-sm animate-fadeIn">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full border-2 border-t-transparent animate-spin"
                style={{
                  borderColor: `${destLabels[selectedDestination].color}55`,
                  borderTopColor: destLabels[selectedDestination].color,
                }}
              />
              <Orbit
                className="w-7 h-7 absolute inset-0 m-auto animate-pulse"
                style={{ color: destLabels[selectedDestination].color }}
              />
            </div>

            <div className="text-center font-mono">
              <p className="text-xs uppercase tracking-widest text-space-subtle mb-1">
                Initiating Direct Transit
              </p>
              <h2
                className="text-lg font-bold tracking-wider"
                style={{ color: destLabels[selectedDestination].color }}
              >
                Approaching {destLabels[selectedDestination].name}
              </h2>
              <p className="text-[11px] text-space-muted mt-1">
                {destLabels[selectedDestination].desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
