import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Compass,
  Calendar,
  Clock,
  MapPin,
  Rocket,
  ShieldCheck,
  AlertTriangle,
  Database,
} from 'lucide-react';
import { useEquipment } from '@/hooks/useEquipment';
import { Badge } from '@/components/common/Badge';
import { Panel } from '@/components/common/Panel';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getMissionData } from './missionData';
import { EquipmentViewer3D } from './EquipmentViewer3D';
import { AccordionSection } from './AccordionSection';
import { parseSupabaseTopics, formatCoordinates } from '@/services/topicParser';
import { getModel3DUrl } from '@/lib/supabase';
import type { EquipmentImage } from '@/types';

export const EquipmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { equipment, loading: supabaseLoading } = useEquipment(id);

  // Retrieve local fallback specification data from verified registry
  const localMission = id ? getMissionData(id) : null;

  // Destination path mapping
  const getDestinationInfo = (category?: string, equipmentId?: string) => {
    if (category === 'Moon' || equipmentId?.includes('moon')) {
      return { name: 'Moon Exploration', path: '/moon', badgeVariant: 'moon' as const };
    }
    if (category === 'Mars' || equipmentId?.includes('mars')) {
      return { name: 'Mars Exploration', path: '/mars', badgeVariant: 'mars' as const };
    }
    if (category === 'Deep Space' || equipmentId?.includes('deep_space')) {
      return { name: 'Deep Space', path: '/deep-space', badgeVariant: 'deep-space' as const };
    }
    return { name: 'Home', path: '/', badgeVariant: 'default' as const };
  };

  const destInfo = getDestinationInfo(equipment?.category || localMission?.category, id);

  // Parse sections dynamically from Supabase `topics` JSON with fallback to local verified topics
  const displaySections = useMemo(() => {
    if (equipment?.topics) {
      const parsed = parseSupabaseTopics(equipment.topics);
      if (parsed.length >= 7) return parsed;
    }
    return localMission?.sections || [];
  }, [equipment?.topics, localMission?.sections]);

  // Loading state if initial data fetch is in flight and no local fallback exists
  if (supabaseLoading && !localMission) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <LoadingSpinner message="Retrieving planetary telemetry from Supabase..." size="lg" />
      </div>
    );
  }

  // If equipment ID is completely invalid
  if (!localMission && !supabaseLoading && !equipment) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Unknown Mission Telemetry</h1>
        <p className="text-xs text-space-muted leading-relaxed mb-6 font-mono">
          The requested equipment ID <code className="text-amber-400">"{id}"</code> was not found in
          the planetary artifact registry or Supabase database.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/moon"
            className="px-4 py-2 rounded-lg bg-space-surface border border-space-border text-xs font-mono text-white hover:border-slate-400 transition-colors"
          >
            Explore Moon (4 Missions)
          </Link>
          <Link
            to="/mars"
            className="px-4 py-2 rounded-lg bg-space-surface border border-space-border text-xs font-mono text-white hover:border-amber-400 transition-colors"
          >
            Explore Mars (6 Missions)
          </Link>
          <Link
            to="/deep-space"
            className="px-4 py-2 rounded-lg bg-space-surface border border-space-border text-xs font-mono text-white hover:border-indigo-400 transition-colors"
          >
            Explore Deep Space (3 Missions)
          </Link>
        </div>
      </div>
    );
  }

  // Derive active display values with Supabase data taking priority
  const equipmentName = equipment?.name || localMission?.equipmentName || 'Spacecraft Equipment';
  const missionTitle =
    (equipment?.topics as any)?.mission_and_purpose?.mission_name ||
    localMission?.missionTitle ||
    equipment?.name ||
    'Mission Explorer';
  const accentColor = localMission?.accentColor || '#38bdf8';
  const introduction =
    equipment?.short_description ||
    localMission?.introduction ||
    'Historical planetary exploration craft deployed on behalf of humanity.';

  // Model URL from Supabase CDN or local fallback with getModel3DUrl path resolution
  const rawModelPath = equipment?.models_3d?.storage_path || localMission?.modelUrl || null;
  const modelUrl = rawModelPath ? getModel3DUrl(rawModelPath) : null;

  // Images from Supabase equipment_images
  const displayImages: EquipmentImage[] = equipment?.equipment_images || equipment?.images || [];

  /**
   * Distribute up to 5 images across the 7 sections.
   *
   * Strategy: use the image `purpose` field to match images to the most
   * relevant section, then fill remaining slots in display_order.
   *
   * Section mapping (0-indexed):
   *   0 "Meet the Explorer"        → hero, context_map
   *   1 "Mission & Purpose"        → orbit_view
   *   2 "Meet the Technology"      → technical_diagram
   *   3 "The Journey"              → surface_view
   *   4 "Scientific Discoveries"   → science_sample
   *   5 "Where Is It Now?"         → memorial
   *   6 "Its Legacy"               → (overflow)
   */
  const sectionImages = useMemo(() => {
    const map: (EquipmentImage | undefined)[] = new Array(7).fill(undefined);
    if (!displayImages.length) return map;

    // Sort by display_order to get a stable ordering
    const sorted = [...displayImages].sort((a, b) => a.display_order - b.display_order);
    const used = new Set<string>();

    // Purpose-to-section preference mapping
    const purposeMap: Record<string, number[]> = {
      hero: [0],
      context_map: [0, 5],
      orbit_view: [1, 3],
      technical_diagram: [2],
      surface_view: [3, 4],
      science_sample: [4],
      memorial: [5, 6],
    };

    // Phase 1: assign by purpose match (up to 5 images)
    for (const img of sorted) {
      if (used.size >= 5) break;
      const key = img.id || img.storage_path;
      if (used.has(key)) continue;

      const slots = purposeMap[img.purpose] || [];
      for (const slot of slots) {
        if (!map[slot]) {
          map[slot] = img;
          used.add(key);
          break;
        }
      }
    }

    // Phase 2: fill remaining empty slots with unused images in order
    // Preferred section order: 0, 2, 4, 1, 3, 6, 5
    const fillOrder = [0, 2, 4, 1, 3, 6, 5];
    for (const img of sorted) {
      if (used.size >= 5) break;
      const key = img.id || img.storage_path;
      if (used.has(key)) continue;

      for (const slot of fillOrder) {
        if (!map[slot]) {
          map[slot] = img;
          used.add(key);
          break;
        }
      }
    }

    return map;
  }, [displayImages]);

  // Metadata attributes
  const topicsObj = (equipment?.topics as Record<string, any>) || {};
  const launchDate =
    topicsObj.the_journey?.launch_event?.timestamp_utc
      ? new Date(topicsObj.the_journey.launch_event.timestamp_utc).toLocaleDateString()
      : localMission?.meta?.launchDate;
  const launchVehicle =
    topicsObj.the_journey?.launch_event?.launch_vehicle || localMission?.meta?.launchVehicle;
  const rawCoords =
    topicsObj.where_is_it_now?.resting_coordinates ||
    topicsObj.mission_and_purpose?.landing_or_orbital_coordinates;
  const coordinates = formatCoordinates(rawCoords) || localMission?.meta?.coordinates || '';
  const currentStatus =
    topicsObj.where_is_it_now?.operational_status || localMission?.meta?.currentStatus;
  const agency =
    topicsObj.mission_and_purpose?.sponsoring_agencies?.[0] || localMission?.meta?.agency || 'NASA';

  const isConnectedToSupabase = Boolean(equipment);

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
      {/* ── Breadcrumb Navigation ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs font-mono text-space-muted mb-6 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-white transition-colors">
          Earth Hub
        </Link>
        <span className="text-space-border">/</span>
        <Link to={destInfo.path} className="hover:text-white transition-colors">
          {destInfo.name}
        </Link>
        <span className="text-space-border">/</span>
        <span className="text-white font-semibold truncate max-w-[240px] sm:max-w-none">
          {missionTitle}
        </span>
      </div>

      {/* ── Header Section ───────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-space-border/60 mb-8">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <Badge variant={destInfo.badgeVariant} size="sm" withDot>
              {equipment?.category || localMission?.category || 'Mission'}
            </Badge>

            <span className="text-xs font-mono text-space-subtle bg-space-surface/60 px-2 py-0.5 rounded border border-space-border/40">
              ID: {id}
            </span>

            {/* Supabase Dynamic Data Source Indicator */}
            {isConnectedToSupabase ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/30 px-2.5 py-0.5 rounded border border-emerald-500/30">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Supabase Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-400 bg-amber-950/30 px-2.5 py-0.5 rounded border border-amber-500/30">
                <span>Local Fallback</span>
              </span>
            )}

            {coordinates && (
              <span className="text-xs font-mono text-space-subtle hidden sm:inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-space-accent" />
                {coordinates}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            {missionTitle}
          </h1>

          <div className="text-sm sm:text-base font-semibold text-space-accent mt-1">
            {equipmentName}
          </div>

          <p className="text-xs sm:text-sm text-space-muted leading-relaxed max-w-3xl mt-3 font-sans">
            {introduction}
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(destInfo.path)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-space-surface border border-space-border text-xs font-mono text-white hover:bg-space-surface-elevated hover:border-space-border/80 transition-all self-start flex-shrink-0 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-space-accent group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to {destInfo.name}</span>
        </button>
      </div>

      {/* ── 3D Viewer & Telemetry Overview ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left 2 Cols: 3D Interactive Equipment Viewer */}
        <div className="lg:col-span-2">
          <EquipmentViewer3D
            modelUrl={modelUrl}
            equipmentName={equipmentName}
            category={equipment?.category || localMission?.category || 'Moon'}
            accentColor={accentColor}
            modelNote={localMission?.modelNote}
          />
        </div>

        {/* Right Col: Mission Metadata Card */}
        <Panel variant="hud" padding="md" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-space-border/50 mb-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-space-accent" /> Mission Specifications
              </h3>
              <Badge variant="success" size="xs">
                Verified Record
              </Badge>
            </div>

            <dl className="space-y-3 text-xs">
              {launchDate && (
                <div className="flex justify-between py-1 border-b border-space-border/30">
                  <dt className="text-space-subtle font-mono flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-space-accent" /> Launch Date
                  </dt>
                  <dd className="text-white font-medium">{launchDate}</dd>
                </div>
              )}

              {localMission?.meta?.landingDate && localMission.meta.landingDate !== 'N/A (orbiter)' && (
                <div className="flex justify-between py-1 border-b border-space-border/30">
                  <dt className="text-space-subtle font-mono flex items-center gap-1.5">
                    <Rocket className="w-3.5 h-3.5 text-space-accent" /> Landing Date
                  </dt>
                  <dd className="text-white font-medium">{localMission.meta.landingDate}</dd>
                </div>
              )}

              {agency && (
                <div className="flex justify-between py-1 border-b border-space-border/30">
                  <dt className="text-space-subtle font-mono">Agency</dt>
                  <dd className="text-white font-medium">{agency}</dd>
                </div>
              )}

              {launchVehicle && (
                <div className="flex justify-between py-1 border-b border-space-border/30">
                  <dt className="text-space-subtle font-mono">Launch Vehicle</dt>
                  <dd className="text-white font-medium font-mono text-[11px] truncate max-w-[180px]">
                    {launchVehicle}
                  </dd>
                </div>
              )}

              {localMission?.meta?.missionDuration && (
                <div className="flex justify-between py-1 border-b border-space-border/30">
                  <dt className="text-space-subtle font-mono flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-space-accent" /> Duration
                  </dt>
                  <dd className="text-white font-medium">{localMission.meta.missionDuration}</dd>
                </div>
              )}

              {coordinates && (
                <div className="flex justify-between py-1 border-b border-space-border/30">
                  <dt className="text-space-subtle font-mono">Coordinates / Site</dt>
                  <dd className="text-space-accent font-mono text-[11px] text-right truncate max-w-[160px]">
                    {coordinates}
                  </dd>
                </div>
              )}

              {currentStatus && (
                <div className="pt-1">
                  <dt className="text-space-subtle font-mono text-[10px] mb-1 uppercase tracking-wider">
                    Current Status
                  </dt>
                  <dd className="text-emerald-400 font-mono text-xs leading-relaxed bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20">
                    {currentStatus}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="mt-4 pt-3 border-t border-space-border/40 text-[10px] font-mono text-space-subtle flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-space-accent" /> NASA Heritage Verified
            </span>
            <span className="text-emerald-400 font-mono">
              {isConnectedToSupabase ? 'Supabase Synced' : 'Offline Ready'}
            </span>
          </div>
        </Panel>
      </div>

      {/* ── Seven Expandable Information Sections with Distributed Images ── */}
      <div className="mb-12">
        <div className="flex items-center justify-between pb-3 border-b border-space-border/50 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Mission Dossier & Heritage Analysis
            </h2>
            <p className="text-xs font-mono text-space-muted mt-0.5">
              Seven comprehensive technical topics with historical images from verified NASA archival records
            </p>
          </div>
          <Badge variant="accent" size="xs">
            7 Sections
          </Badge>
        </div>

        <div className="flex flex-col gap-3">
          {displaySections.map((section, idx) => (
            <AccordionSection
              key={section.title}
              section={section}
              index={idx}
              accentColor={accentColor}
              defaultOpen={idx === 0}
              image={sectionImages[idx]}
            />
          ))}
        </div>
      </div>

      {/* ── Bottom Navigation & Direct transit footer ────────────────────── */}
      <div className="pt-6 border-t border-space-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => navigate(destInfo.path)}
          className="inline-flex items-center gap-2 text-xs font-mono text-space-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to {destInfo.name}</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-mono text-space-subtle">
          <span>Space Heritage Explorer</span>
          <span>•</span>
          <Link to="/" className="hover:text-space-accent transition-colors">
            Earth Landing Hub
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EquipmentPage;
