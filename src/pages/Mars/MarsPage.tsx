import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Moon, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Panel } from '@/components/common/Panel';
import { MARS_MARKERS, type MarsMarker } from '@/components/mars/marsMarkers';
import { preloadDestination, preloadModel } from '@/lib/assetManager';

const MarsCanvas = lazy(() => import('@/components/mars/MarsCanvas'));

// ─────────────────────────────────────────────────────────────────────────────
// MarsPage — interactive Mars exploration environment.
//
// Layout: immersive full-height split
//   Left  (lg:w-[380px]) — mission info, equipment cards, transit links
//   Right (flex-1)       — interactive 3D Mars globe with 6 mission markers
// ─────────────────────────────────────────────────────────────────────────────

export const MarsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMarker, setSelectedMarker] = useState<MarsMarker | null>(null);

  const handleMarkerClick = useCallback((marker: MarsMarker) => {
    setSelectedMarker(prev => (prev?.id === marker.id ? null : marker));
  }, []);

  const handleDeselect = useCallback(() => setSelectedMarker(null), []);

  const handleMarkerNavigate = useCallback((markerId: string) => {
    navigate(`/equipment/${markerId}`);
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative min-h-0">
      {/* ═══════════════════════════════════════════════════════════════════
          LEFT PANEL — mission info & equipment cards
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="lg:w-[380px] flex-shrink-0 flex flex-col z-10 overflow-y-auto bg-space-darkest/80 backdrop-blur-sm border-r border-space-border/40">
        <div className="p-5 sm:p-6 flex flex-col gap-5 flex-1">

          {/* ── Back to Earth ─────────────────────────────────────────── */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-mono text-space-muted hover:text-white transition-colors self-start group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Return to Earth Hub
          </button>

          {/* ── Header ───────────────────────────────────────────────── */}
          <div>
            <div className="mb-3">
              <Badge variant="mars" size="sm" withDot>Martian Surface Active</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight mb-2">
              Mars Exploration
            </h1>
            <p className="text-xs sm:text-sm text-space-muted leading-relaxed">
              Six verified landing sites. Click any mission to focus camera on its exact landing site. Click the 3D marker on the surface to open full mission records.
            </p>
          </div>

          {/* ── Equipment catalog ─────────────────────────────────────── */}
          <div className="flex-1">
            <p className="text-[11px] font-mono uppercase tracking-widest text-space-subtle mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Verified Landing Sites ({MARS_MARKERS.length})
            </p>

            <div className="flex flex-col gap-2.5">
              {MARS_MARKERS.map((marker) => {
                const isActive = selectedMarker?.id === marker.id;
                return (
                  <button
                    key={marker.id}
                    onClick={() => handleMarkerClick(marker)}
                    onMouseEnter={() => preloadModel(marker.modelPath)}
                    className="group w-full text-left rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-accent"
                  >
                    <Panel
                      variant="interactive"
                      padding="sm"
                      className={`flex items-center justify-between transition-all ${
                        isActive ? 'border-opacity-60' : ''
                      }`}
                      style={isActive ? { borderColor: `${marker.color}60` } : undefined}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Color dot matching globe marker */}
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: marker.color,
                            boxShadow: isActive ? `0 0 8px ${marker.color}` : 'none',
                          }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Badge variant="mars" size="xs">{marker.badge}</Badge>
                          </div>
                          <h3 className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors truncate">
                            {marker.name}
                          </h3>
                          <p className="text-[10px] font-mono text-space-subtle truncate">
                            {marker.site}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        {isActive && (
                          <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider">
                            Focused
                          </span>
                        )}
                        <div
                          className="w-6 h-6 rounded-md border flex items-center justify-center transition-all"
                          style={
                            isActive
                              ? { borderColor: `${marker.color}60`, color: marker.color }
                              : { borderColor: 'var(--space-border)', color: 'var(--space-muted)' }
                          }
                        >
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Panel>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Controls hint ─────────────────────────────────────────── */}
          <Panel variant="hud" padding="sm" className="bg-space-darkest/70">
            <p className="text-[10px] font-mono text-space-subtle text-center leading-relaxed">
              Drag to rotate&ensp;·&ensp;Scroll to zoom&ensp;·&ensp;Click marker to focus
            </p>
          </Panel>

          {/* ── NASA attribution ──────────────────────────────────────── */}
          <p className="text-[9px] font-mono text-space-subtle/60 leading-relaxed">
            Martian surface: USGS / NASA Mars Global GIS Equirectangular Basemap.
            Landing coordinates: NASA JPL mission telemetry.
          </p>

          {/* ── Transit links ─────────────────────────────────────────── */}
          <div className="pt-3 border-t border-space-border/40 flex items-center gap-2">
            <Link
              to="/moon"
              onMouseEnter={() => preloadDestination('moon')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-space-surface border border-space-border text-white hover:border-slate-500 hover:text-slate-200 transition-colors font-mono text-[10px]"
            >
              <Moon className="w-3 h-3 text-space-moon" />
              Moon
            </Link>
            <Link
              to="/deep-space"
              onMouseEnter={() => preloadDestination('deep-space')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-space-surface border border-space-border text-white hover:border-indigo-500/50 hover:text-indigo-300 transition-colors font-mono text-[10px]"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Deep Space
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          RIGHT — interactive 3D Mars canvas (fills remaining space)
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 relative min-h-[400px] lg:min-h-0">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-space-darkest">
              <div className="w-10 h-10 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin mb-4" />
              <p className="text-xs font-mono text-space-subtle tracking-widest uppercase">
                Loading Martian Surface
              </p>
            </div>
          }
        >
          <MarsCanvas
            className="absolute inset-0"
            selectedId={selectedMarker?.id ?? null}
            onMarkerClick={handleMarkerClick}
            onMarkerNavigate={handleMarkerNavigate}
            onBackgroundClick={handleDeselect}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default MarsPage;
