import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Panel } from '@/components/common/Panel';
import { LUNAR_MARKERS, type LunarMarker } from '@/components/moon/lunarMarkers';
import { preloadDestination, preloadModel } from '@/lib/assetManager';

const MoonCanvas = lazy(() => import('@/components/moon/MoonCanvas'));

// ─────────────────────────────────────────────────────────────────────────────
// MoonPage — interactive Moon exploration environment.
//
// Layout: immersive full-height split
//   Left  (lg:w-[380px]) — mission info, equipment cards, transit links
//   Right (flex-1)       — interactive 3D Moon canvas
// ─────────────────────────────────────────────────────────────────────────────

export const MoonPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMarker, setSelectedMarker] = useState<LunarMarker | null>(null);

  const handleMarkerClick = useCallback((marker: LunarMarker) => {
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
              <Badge variant="moon" size="sm" withDot>Lunar Surface Active</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight mb-2">
              Moon Exploration
            </h1>
            <p className="text-xs sm:text-sm text-space-muted leading-relaxed">
              Four verified landing sites. Click any mission to focus camera on its exact landing site. Click the 3D marker on the surface to open full mission records.
            </p>
          </div>

          {/* ── Equipment catalog ─────────────────────────────────────── */}
          <div className="flex-1">
            <p className="text-[11px] font-mono uppercase tracking-widest text-space-subtle mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-space-moon" />
              Verified Landing Sites ({LUNAR_MARKERS.length})
            </p>

            <div className="flex flex-col gap-2.5">
              {LUNAR_MARKERS.map((marker) => {
                const isActive = selectedMarker?.id === marker.id;
                return (
                  <button
                    key={marker.id}
                    onClick={() => handleMarkerClick(marker)}
                    onMouseEnter={() => preloadModel(marker.modelPath)}
                    className={`group w-full text-left rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-accent`}
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
                        {/* Colour dot matching globe marker */}
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: marker.color,
                            boxShadow: isActive ? `0 0 8px ${marker.color}` : 'none',
                          }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Badge variant="moon" size="xs">{marker.badge}</Badge>
                          </div>
                          <h3 className="text-xs font-semibold text-white group-hover:text-space-accent transition-colors truncate">
                            {marker.name}
                          </h3>
                          <p className="text-[10px] font-mono text-space-subtle truncate">
                            {marker.site}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        {isActive && (
                          <span className="text-[9px] font-mono text-space-accent uppercase tracking-wider">
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
            Lunar surface: NASA/GSFC/Arizona State University — LRO LROC WAC global mosaic.
            Landing coordinates: NASA mission technical reports.
          </p>

          {/* ── Transit links ─────────────────────────────────────────── */}
          <div className="pt-3 border-t border-space-border/40 flex items-center gap-2">
            <Link
              to="/mars"
              onMouseEnter={() => preloadDestination('mars')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-space-surface border border-space-border text-white hover:border-amber-500/50 hover:text-amber-400 transition-colors font-mono text-[10px]"
            >
              <Compass className="w-3 h-3 text-amber-500" />
              Mars
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
          RIGHT — interactive 3D Moon canvas (fills remaining space)
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 relative min-h-[400px] lg:min-h-0">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-space-darkest">
              <div className="w-10 h-10 rounded-full border-2 border-space-moon/30 border-t-space-moon animate-spin mb-4" />
              <p className="text-xs font-mono text-space-subtle tracking-widest uppercase">
                Loading Lunar Surface
              </p>
            </div>
          }
        >
          <MoonCanvas
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

export default MoonPage;
