import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Moon,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Panel } from '@/components/common/Panel';
import { preloadDestination, preloadModel } from '@/lib/assetManager';
import {
  CELESTIAL_BODIES,
  ASTEROIDS,
  SPACECRAFT,
  type PlanetData,
  type SpacecraftData,
} from '@/components/deep-space/deepSpaceData';

// Sun data for sidebar — mirrors the SUN_DATA in DeepSpaceScene
const SUN_SIDEBAR: PlanetData = {
  id: 'sun',
  name: 'The Sun (Sol)',
  type: 'star',
  distance: 0,
  radius: 2.3,
  orbitSpeed: 0,
  rotationSpeed: 0.008,
  textureUrl: '/assets/deep-space/sun-texture.jpg',
  color: '#fbbf24',
  description: 'G-type main-sequence star at the centre of the Solar System. Contains 99.86% of the total mass of the Solar System.',
  facts: [
    'Surface temperature: 5,500 °C',
    'Core temperature: 15 million °C',
    'Age: ~4.6 billion years',
  ],
};

const DeepSpaceCanvas = lazy(() => import('@/components/deep-space/DeepSpaceCanvas'));

export const DeepSpacePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<PlanetData | SpacecraftData | null>(null);
  const [activeCategory, setActiveCategory] = useState<'probes' | 'asteroids' | 'planets'>('probes');

  const handleSelectObject = useCallback((item: PlanetData | SpacecraftData | null) => {
    setSelectedItem((prev) => (prev?.id === item?.id ? null : item));
  }, []);

  const handleDeselect = useCallback(() => setSelectedItem(null), []);

  const handleNavigateToEquipment = useCallback((equipmentId: string) => {
    navigate(`/equipment/${equipmentId}`);
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative min-h-0">
      {/* ═══════════════════════════════════════════════════════════════════
          LEFT PANEL — telemetry HUD, probes & celestial registry
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="lg:w-[410px] flex-shrink-0 flex flex-col z-10 overflow-y-auto bg-space-darkest/85 backdrop-blur-md border-r border-space-border/40">
        <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">

          {/* ── Back to Earth ─────────────────────────────────────────── */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-mono text-space-muted hover:text-white transition-colors self-start group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Return to Earth Hub
          </button>

          {/* ── Mission Header ────────────────────────────────────────── */}
          <div>
            <div className="mb-2">
              <Badge variant="deep-space" size="sm" withDot>Heliocentric Active</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight mb-1">
              Deep Space
            </h1>
            <p className="text-xs text-space-muted leading-relaxed">
              Explore the Sun, all eight planets, asteroid targets, and pioneering deep-space probes. Click any mission to focus the camera in 3D. Click a 3D spacecraft model to open full mission records.
            </p>
          </div>

          {/* ── Category Switcher Tabs ────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-space-surface border border-space-border text-xs font-mono">
            <button
              onClick={() => setActiveCategory('probes')}
              className={`py-1.5 px-2 rounded-lg text-center transition-colors ${
                activeCategory === 'probes'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-semibold'
                  : 'text-space-muted hover:text-white'
              }`}
            >
              Probes ({SPACECRAFT.length})
            </button>
            <button
              onClick={() => setActiveCategory('asteroids')}
              className={`py-1.5 px-2 rounded-lg text-center transition-colors ${
                activeCategory === 'asteroids'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-semibold'
                  : 'text-space-muted hover:text-white'
              }`}
            >
              Asteroids ({ASTEROIDS.length})
            </button>
            <button
              onClick={() => setActiveCategory('planets')}
              className={`py-1.5 px-2 rounded-lg text-center transition-colors ${
                activeCategory === 'planets'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-semibold'
                  : 'text-space-muted hover:text-white'
              }`}
            >
              Planets (9)
            </button>
          </div>

          {/* ── List based on active category ─────────────────────────── */}
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            {activeCategory === 'probes' && (
              <div className="flex flex-col gap-2">
                {SPACECRAFT.map((craft) => {
                  const isActive = selectedItem?.id === craft.id;
                  return (
                    <button
                      key={craft.id}
                      onClick={() => handleSelectObject(craft)}
                      onMouseEnter={() => preloadModel(craft.modelUrl)}
                      className="group w-full text-left rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-accent"
                    >
                      <Panel
                        variant="interactive"
                        padding="sm"
                        className={`flex items-center justify-between transition-all ${
                          isActive ? 'border-opacity-60 bg-indigo-950/20' : ''
                        }`}
                        style={isActive ? { borderColor: `${craft.color}88` } : undefined}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: craft.color,
                              boxShadow: isActive ? `0 0 10px ${craft.color}` : 'none',
                            }}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Badge variant="deep-space" size="xs">
                                {craft.badge}
                              </Badge>
                            </div>
                            <h4 className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                              {craft.name}
                            </h4>
                            <p className="text-[10px] font-mono text-space-subtle truncate">
                              {craft.target}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          {isActive && (
                            <span className="text-[9px] font-mono text-indigo-300 uppercase tracking-wider">
                              Focused
                            </span>
                          )}
                          <div
                            className="w-6 h-6 rounded-md border flex items-center justify-center transition-all"
                            style={
                              isActive
                                ? { borderColor: `${craft.color}88`, color: craft.color }
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
            )}

            {activeCategory === 'asteroids' && (
              <div className="flex flex-col gap-2">
                {ASTEROIDS.map((ast) => {
                  const isActive = selectedItem?.id === ast.id;
                  return (
                    <button
                      key={ast.id}
                      onClick={() => handleSelectObject(ast)}
                      className="group w-full text-left rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-accent"
                    >
                      <Panel
                        variant="interactive"
                        padding="sm"
                        className={`flex items-center justify-between transition-all ${
                          isActive ? 'border-opacity-60 bg-indigo-950/20' : ''
                        }`}
                        style={isActive ? { borderColor: `${ast.color}88` } : undefined}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: ast.color,
                              boxShadow: isActive ? `0 0 10px ${ast.color}` : 'none',
                            }}
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                              {ast.name}
                            </h4>
                            <p className="text-[10px] font-mono text-space-subtle truncate">
                              {ast.facts[0]}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-space-muted group-hover:text-white flex-shrink-0 ml-2" />
                      </Panel>
                    </button>
                  );
                })}
              </div>
            )}

            {activeCategory === 'planets' && (
              <div className="flex flex-col gap-1.5 max-h-[260px] overflow-y-auto pr-1">
                {/* Sun entry */}
                {[SUN_SIDEBAR, ...CELESTIAL_BODIES].map((planet) => {
                  const isActive = selectedItem?.id === planet.id;
                  return (
                    <button
                      key={planet.id}
                      onClick={() => handleSelectObject(planet)}
                      className={`group w-full text-left py-2 px-3 rounded-lg border transition-all text-xs flex items-center justify-between ${
                        isActive
                          ? 'border-indigo-500/50 bg-indigo-950/30 text-white'
                          : 'border-space-border/60 bg-space-surface/50 text-space-muted hover:text-white hover:border-space-border'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: planet.color }}
                        />
                        <span className="font-semibold truncate">{planet.name}</span>
                        {planet.ring && (
                          <span className="text-[9px] font-mono text-amber-400/80">RINGS</span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-space-subtle flex-shrink-0">
                        {planet.distance} AU
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Controls Navigation Hint ──────────────────────────────── */}
          <Panel variant="hud" padding="sm" className="bg-space-darkest/70">
            <p className="text-[10px] font-mono text-space-subtle text-center leading-relaxed">
              Drag to orbit/pan&ensp;·&ensp;Scroll to zoom&ensp;·&ensp;Click any body or probe
            </p>
          </Panel>

          {/* ── Scientific Attribution ─────────────────────────────────── */}
          <p className="text-[9px] font-mono text-space-subtle/60 leading-relaxed">
            Planetary ephemeris: NASA JPL Horizons. Asteroid imagery: NASA/JPL/Dawn/NEAR.
            Spacecraft telemetry: NASA Deep Space Network archives.
          </p>

          {/* ── Direct Transit Links ──────────────────────────────────── */}
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
              to="/mars"
              onMouseEnter={() => preloadDestination('mars')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-space-surface border border-space-border text-white hover:border-amber-500/50 hover:text-amber-400 transition-colors font-mono text-[10px]"
            >
              <Compass className="w-3 h-3 text-amber-500" />
              Mars
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          RIGHT — interactive 3D Solar System Viewport (full remaining space)
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 relative min-h-[400px] lg:min-h-0">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-space-darkest">
              <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4" />
              <p className="text-xs font-mono text-space-subtle tracking-widest uppercase">
                Loading Solar System Simulation
              </p>
            </div>
          }
        >
          <DeepSpaceCanvas
            className="absolute inset-0"
            selectedId={selectedItem?.id ?? null}
            onSelectObject={handleSelectObject}
            onNavigateToEquipment={handleNavigateToEquipment}
            onBackgroundClick={handleDeselect}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default DeepSpacePage;
