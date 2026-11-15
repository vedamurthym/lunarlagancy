import type { MissionSection } from '@/pages/Equipment/missionData';

/**
 * Formats heterogeneous resting coordinates (strings, ephemeris objects,
 * interstellar headings, or AU distances) into a clean, human-readable string.
 */
export function formatCoordinates(coords: any): string {
  if (!coords) return '';
  if (typeof coords === 'string') return coords;
  if (typeof coords === 'object') {
    if (
      coords.latitude_deg !== null &&
      coords.latitude_deg !== undefined &&
      coords.longitude_deg !== null &&
      coords.longitude_deg !== undefined
    ) {
      const lat = Number(coords.latitude_deg);
      const lon = Number(coords.longitude_deg);
      const latStr = lat >= 0 ? `${lat.toFixed(4).replace(/\.?0+$/, '')}° N` : `${Math.abs(lat).toFixed(4).replace(/\.?0+$/, '')}° S`;
      const lonStr = lon >= 0 ? `${lon.toFixed(4).replace(/\.?0+$/, '')}° E` : `${Math.abs(lon).toFixed(4).replace(/\.?0+$/, '')}° W`;
      const frame = coords.body_or_frame ? ` (${coords.body_or_frame})` : '';
      return `${latStr}, ${lonStr}${frame}`;
    }
    if (coords.interstellar_heading) {
      return coords.interstellar_heading;
    }
    if (coords.distance_au) {
      return `${coords.distance_au} AU · ${coords.body_or_frame || 'Deep Space'}`;
    }
    if (coords.body_or_frame) {
      return coords.body_or_frame;
    }
  }
  return String(coords);
}

/**
 * Formats power system specifications from strings or structured telemetry objects.
 */
function formatPowerSystem(ps: any): string {
  if (!ps) return '';
  if (typeof ps === 'string') return ps;
  if (typeof ps === 'object') {
    const lines: string[] = [];
    if (ps.primary_power_source) lines.push(`• Primary Source: ${ps.primary_power_source}`);
    if (ps.solar_array_details) lines.push(`• Solar Arrays: ${ps.solar_array_details}`);
    if (ps.battery_specifications) lines.push(`• Battery Storage: ${ps.battery_specifications}`);
    if (ps.nuclear_rtg_details && typeof ps.nuclear_rtg_details === 'object') {
      const rtg = ps.nuclear_rtg_details;
      const details = [
        rtg.model,
        rtg.launch_power_w ? `${rtg.launch_power_w} W` : null,
        rtg.fuel_isotope ? `(${rtg.fuel_isotope})` : null,
      ]
        .filter(Boolean)
        .join(' ');
      const decay = rtg.power_decay_profile ? ` — ${rtg.power_decay_profile}` : '';
      lines.push(`• Nuclear / RTG: ${details}${decay}`);
    }
    if (lines.length > 0) return lines.join('\n');
    return Object.entries(ps)
      .filter(([_, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => `• ${k.replace(/_/g, ' ')}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
      .join('\n');
  }
  return String(ps);
}

/**
 * Formats propulsion specifications from strings or structured telemetry objects.
 */
function formatPropulsion(prop: any): string {
  if (!prop) return '';
  if (typeof prop === 'string') return prop;
  if (typeof prop === 'object') {
    const lines: string[] = [];
    if (prop.type) lines.push(`• System Type: ${prop.type}`);
    if (prop.engines_or_thrusters) lines.push(`• Engines / Thrusters: ${prop.engines_or_thrusters}`);
    if (prop.thrust_rating) lines.push(`• Thrust Rating: ${prop.thrust_rating}`);
    if (prop.specific_impulse_sec) lines.push(`• Specific Impulse: ${prop.specific_impulse_sec} s`);
    if (Array.isArray(prop.propellants) && prop.propellants.length > 0) {
      lines.push(`• Propellants: ${prop.propellants.join(', ')}`);
    }
    if (lines.length > 0) return lines.join('\n');
    return Object.entries(prop)
      .filter(([_, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => `• ${k.replace(/_/g, ' ')}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
      .join('\n');
  }
  return String(prop);
}

/**
 * Formats communications specifications from strings or structured telemetry objects.
 */
function formatCommunications(comm: any): string {
  if (!comm) return '';
  if (typeof comm === 'string') return comm;
  if (typeof comm === 'object') {
    const lines: string[] = [];
    if (Array.isArray(comm.antennas) && comm.antennas.length > 0) {
      lines.push(`• Antennas: ${comm.antennas.join('; ')}`);
    }
    if (Array.isArray(comm.frequency_bands) && comm.frequency_bands.length > 0) {
      lines.push(`• Frequency Bands: ${comm.frequency_bands.join(', ')}`);
    }
    if (comm.relay_systems) lines.push(`• Relay & Ground Network: ${comm.relay_systems}`);
    if (lines.length > 0) return lines.join('\n');
    return Object.entries(comm)
      .filter(([_, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => `• ${k.replace(/_/g, ' ')}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
      .join('\n');
  }
  return String(comm);
}

/**
 * Transforms raw Supabase `equipment.topics` JSON into the 7 formatted
 * technical sections for the Space Heritage Explorer equipment detail page.
 */
export function parseSupabaseTopics(topics?: Record<string, any> | null): MissionSection[] {
  if (!topics || typeof topics !== 'object') return [];

  const sections: MissionSection[] = [];

  // 1. Meet the Explorer
  const mte = topics.meet_the_explorer;
  if (mte) {
    const parts: string[] = [];
    if (mte.introduction) parts.push(mte.introduction);
    if (mte.equipment_identity) {
      if (typeof mte.equipment_identity === 'string') {
        parts.push(mte.equipment_identity);
      } else if (typeof mte.equipment_identity === 'object') {
        if (mte.equipment_identity.overview) parts.push(mte.equipment_identity.overview);
        if (mte.equipment_identity.appearance) parts.push(`Physical Appearance:\n${mte.equipment_identity.appearance}`);
        if (mte.equipment_identity.role) parts.push(`Primary Exploration Role:\n${mte.equipment_identity.role}`);
      }
    }
    if (mte.sub_components_represented && Array.isArray(mte.sub_components_represented)) {
      parts.push(
        `Sub-Components Represented:\n${mte.sub_components_represented
          .map((c: any) => {
            if (typeof c === 'string') return `• ${c}`;
            if (typeof c === 'object' && c !== null) {
              const name = c.name || c.element_name || c.title || 'Component';
              const role = c.role || c.description ? ` — ${c.role || c.description}` : '';
              const status = c.status_at_site || c.condition ? ` (${c.status_at_site || c.condition})` : '';
              return `• ${name}${role}${status}`;
            }
            return `• ${String(c)}`;
          })
          .join('\n')}`
      );
    }
    sections.push({
      title: 'Meet the Explorer',
      icon: '🚀',
      content: parts.join('\n\n').trim(),
    });
  }

  // 2. Mission & Purpose
  const map = topics.mission_and_purpose;
  if (map) {
    const parts: string[] = [];
    if (map.mission_name && map.program) {
      parts.push(`Program & Mission: ${map.program} (${map.mission_name})`);
    }
    if (map.objectives && Array.isArray(map.objectives)) {
      parts.push(`Primary Objectives:\n${map.objectives.map((o: string) => `• ${o}`).join('\n')}`);
    }
    if (map.sponsoring_agencies && Array.isArray(map.sponsoring_agencies)) {
      parts.push(`Sponsoring Agencies:\n${map.sponsoring_agencies.map((a: string) => `• ${a}`).join('\n')}`);
    }
    if (map.destination?.region_name || map.destination?.targeted_feature) {
      const dest = [map.destination.body, map.destination.region_name, map.destination.targeted_feature]
        .filter(Boolean)
        .join(' — ');
      parts.push(`Destination Target: ${dest}`);
    }
    sections.push({
      title: 'Mission & Purpose',
      icon: '🎯',
      content: parts.join('\n\n').trim(),
    });
  }

  // 3. Meet the Technology
  const mtt = topics.meet_the_technology;
  if (mtt) {
    const parts: string[] = [];
    if (mtt.architecture_description) parts.push(mtt.architecture_description);
    if (mtt.scientific_instruments && Array.isArray(mtt.scientific_instruments)) {
      parts.push(
        `Scientific Instruments & Sensor Suite:\n${mtt.scientific_instruments
          .map((inst: any) => {
            const name = inst.instrument_name || inst.name || 'Instrument';
            const desc = inst.description || inst.purpose || '';
            return `• ${name}${desc ? `: ${desc}` : ''}`;
          })
          .join('\n')}`
      );
    }
    if (mtt.power_system) {
      const formatted = formatPowerSystem(mtt.power_system);
      if (formatted) parts.push(`Power Generation & Storage:\n${formatted}`);
    }
    if (mtt.propulsion) {
      const formatted = formatPropulsion(mtt.propulsion);
      if (formatted) parts.push(`Propulsion & Thruster Systems:\n${formatted}`);
    }
    if (mtt.communications) {
      const formatted = formatCommunications(mtt.communications);
      if (formatted) parts.push(`Telecommunications:\n${formatted}`);
    }
    if (mtt.associated_surface_vehicles_or_stations && Array.isArray(mtt.associated_surface_vehicles_or_stations)) {
      parts.push(
        `Associated Surface Vehicles & Stations:\n${mtt.associated_surface_vehicles_or_stations
          .map((v: any) => {
            if (typeof v === 'string') return `• ${v}`;
            if (typeof v === 'object' && v !== null) {
              const name = v.entity_name || v.name || 'Vehicle';
              const summary = v.technical_summary || v.specifications ? ` — ${v.technical_summary || v.specifications}` : '';
              return `• ${name}${summary}`;
            }
            return `• ${String(v)}`;
          })
          .join('\n')}`
      );
    }
    sections.push({
      title: 'Meet the Technology',
      icon: '⚙️',
      content: parts.join('\n\n').trim(),
    });
  }

  // 4. The Journey
  const tj = topics.the_journey;
  if (tj) {
    const parts: string[] = [];
    if (tj.journey_narrative) parts.push(tj.journey_narrative);

    const eventDetails: string[] = [];
    if (tj.launch_event) {
      const le = tj.launch_event;
      eventDetails.push(
        `Launch: ${le.timestamp_utc ? new Date(le.timestamp_utc).toLocaleDateString() : ''} via ${le.launch_vehicle || 'Rocket'} from ${le.launch_site || 'Spaceport'}`
      );
    }
    if (tj.arrival_event) {
      const ae = tj.arrival_event;
      eventDetails.push(
        `${ae.event_type || 'Arrival'}: ${ae.timestamp_utc ? new Date(ae.timestamp_utc).toLocaleDateString() : ''}${ae.arrival_notes ? ` — ${ae.arrival_notes}` : ''}`
      );
    }
    if (eventDetails.length) parts.push(eventDetails.join('\n'));

    if (tj.mission_timeline && Array.isArray(tj.mission_timeline)) {
      parts.push(
        `Key Mission Milestones:\n${tj.mission_timeline
          .map((t: any) => {
            const date = t.date_or_sol || t.date || '';
            const phase = t.phase ? ` · ${t.phase}` : '';
            const desc = t.event_description || t.description || '';
            return `• [${date}${phase}] ${desc}`;
          })
          .join('\n')}`
      );
    }
    sections.push({
      title: 'The Journey',
      icon: '🛸',
      content: parts.join('\n\n').trim(),
    });
  }

  // 5. Scientific Discoveries
  const sd = topics.scientific_discoveries;
  if (sd) {
    const parts: string[] = [];
    if (sd.summary_narrative) parts.push(sd.summary_narrative);
    if (sd.key_discoveries && Array.isArray(sd.key_discoveries)) {
      parts.push(
        `Key Scientific Discoveries:\n${sd.key_discoveries
          .map((d: any) => {
            const title = d.title || 'Discovery';
            const desc = d.description || '';
            const impact = d.scientific_impact ? `\n  Impact: ${d.scientific_impact}` : '';
            return `• ${title}: ${desc}${impact}`;
          })
          .join('\n\n')}`
      );
    }
    sections.push({
      title: 'Scientific Discoveries',
      icon: '🔬',
      content: parts.join('\n\n').trim(),
    });
  }

  // 6. Where Is It Now?
  const win = topics.where_is_it_now;
  if (win) {
    const parts: string[] = [];
    if (win.location_summary) parts.push(win.location_summary);
    if (win.operational_status) parts.push(`Operational Status: ${win.operational_status}`);
    if (win.resting_coordinates) {
      parts.push(`Final / Current Coordinates: ${formatCoordinates(win.resting_coordinates)}`);
    }
    if (win.hardware_elements_at_site && Array.isArray(win.hardware_elements_at_site)) {
      parts.push(
        `Hardware Elements at Site:\n${win.hardware_elements_at_site
          .map((h: any) => {
            if (typeof h === 'string') return `• ${h}`;
            if (typeof h === 'object' && h !== null) {
              const name = h.element_name || h.name || h.title || 'Hardware';
              const condition = h.condition || h.status ? ` (${h.condition || h.status})` : '';
              return `• ${name}${condition}`;
            }
            return `• ${String(h)}`;
          })
          .join('\n')}`
      );
    }
    sections.push({
      title: 'Where Is It Now?',
      icon: '📍',
      content: parts.join('\n\n').trim(),
    });
  }

  // 7. Its Legacy
  const leg = topics.its_legacy;
  if (leg) {
    const parts: string[] = [];
    if (leg.historical_significance) parts.push(leg.historical_significance);
    if (leg.key_contributions && Array.isArray(leg.key_contributions)) {
      parts.push(
        `Key Contributions to Space Exploration:\n${leg.key_contributions.map((c: string) => `• ${c}`).join('\n')}`
      );
    }
    if (leg.influence_on_future_missions && Array.isArray(leg.influence_on_future_missions)) {
      parts.push(
        `Influence on Later Missions:\n${leg.influence_on_future_missions
          .map((m: any) => `• ${m.mission_or_technology || 'Successor'}: ${m.influence_description || ''}`)
          .join('\n')}`
      );
    }
    if (leg.cultural_or_philosophical_impact) {
      parts.push(`Cultural & Philosophical Legacy:\n${leg.cultural_or_philosophical_impact}`);
    }
    sections.push({
      title: 'Its Legacy',
      icon: '🏛️',
      content: parts.join('\n\n').trim(),
    });
  }

  return sections;
}
