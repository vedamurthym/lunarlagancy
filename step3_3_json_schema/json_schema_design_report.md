# Step 3.3: JSON Schema Design Report
## Space Heritage Explorer Project

**Date:** 2026-11-14  
**Auditor / Architect:** Antigravity Data Pipeline Architecture Engine  
**Schema Specification:** JSON Schema Draft 2020-12 (`https://json-schema.org/draft/2020-12/schema`)  
**Scope:** Formal JSON architecture design for all 13 equipment records across the Moon, Mars, and Deep Space domains, targeted for Supabase PostgreSQL (JSONB / Relational) and React + TypeScript frontend applications.

---

## 1. Executive Summary

This report establishes the complete architectural rationale for the `SpaceHeritageEquipmentRecord` JSON schema (`equipment.schema.json`).

The schema was designed strictly by inspecting:
1. The 13 fully enriched equipment records in `step3_2_enrichment/step3_2_enriched_records/`.
2. The Step 3.2 Enrichment Report and Final Verification Report.
3. The Step 3.2 Unresolved Issues Register (preserving conflicts, errata, and source mappings).
4. The future tech stack requirements: **Supabase (PostgreSQL + PostgREST + Supabase Storage)** on the backend, and **React + TypeScript + Three.js / @react-three/fiber** on the frontend.

### Primary Architectural Principles Observed:
- **No Forcing of Homogeneity:** While every equipment record shares the identical top-level envelope and the mandatory Seven Topics, internal sub-fields are structured semantically. For example, technical propulsion parameters for an ion engine (Dawn) differ from a solar-powered helicopter (Ingenuity), but both map cleanly into `meet_the_technology`.
- **Compound Hardware Support:** Complex compound missions—such as Mars Pathfinder (`Carl Sagan Memorial Station` lander + `Sojourner` microrover) and Apollo extended missions (LM + ALSEP + LRV)—are fully modeled via `sub_components_represented` and `associated_surface_vehicles_or_stations`.
- **Future-Proof Media Architecture:** Image arrays remain initialized to empty (`[]`) and 3D model references remain `null`, completely decoupling content readiness from media collection.
- **Shared Model Architecture:** Mars records explicitly support the requirement that **six equipment records reference only four unique 3D model assets**.
- **Rigorous Source Traceability:** Citations are not merely lumped into a single list at the bottom; every topic provides a `source_refs` key containing IDs linked to the top-level `sources` catalog.

---

## 2. Top-Level Field Specifications

Every equipment record must possess the following canonical top-level fields:

| Field Name | Type | Mandatory? | Purpose & Technical Description |
| :--- | :---: | :---: | :--- |
| `id` | `string` | **Yes** | Canonical immutable primary key. Regex format: `^eq_(moon\|mars\|deep_space)_[a-z0-9_]+$` (e.g., `eq_moon_apollo11_lm`, `eq_mars_sojourner_pathfinder`, `eq_mars_spirit`, `eq_deep_space_dawn`). |
| `slug` | `string` | **Yes** | URL-friendly slug used by React Router for client-side deep linking (e.g., `/explore/mars/sojourner`). |
| `name` | `string` | **Yes** | Formal human-readable display title (e.g., `"Surveyor 3"`, `"Apollo 15 Lunar Module, ALSEP & Lunar Roving Vehicle"`). |
| `alternate_designations` | `string[]` | No | Array of flight numbers, COSPAR IDs, NORAD tracking numbers, and NASA project codes. |
| `category` | `string` | **Yes** | Domain taxonomy restricted to `["Moon", "Mars", "Deep Space"]`. Enables instant SQL filtering and frontend navigation tabs. |
| `equipment_type` | `string` | **Yes** | Specific functional classification enum (e.g., `"Robotic Geologic Rover"`, `"Autonomous Aerial Rotorcraft"`, `"Lunar Module & Science Package"`). |
| `target_body` | `string` | **Yes** | Target celestial world (e.g., `"The Moon"`, `"Mars"`, `"Main Asteroid Belt (Vesta & Ceres)"`, `"Asteroid 433 Eros"`). |
| `short_description` | `string` | **Yes** | 30 to 600 character synopsis designed for search engine indexing, overview cards, and map tooltips. |
| `topics` | `object` | **Yes** | Strict container containing the **exact seven mandatory topics** in specified order. |
| `images` | `array` | **Yes** | Array of future historical image metadata. Initialized to `[]` in all Step 3 records. |
| `model_3d` | `object \| null` | **Yes** | 3D model asset reference object. Initialized to `null` in all Step 3 records. |
| `sources` | `array` | **Yes** | Comprehensive array of verified source references, including titles, URLs, publishing authorities, and topic linkages. |
| `verification_status` | `object` | **Yes** | Metadata block detailing the audit state (`VERIFIED`, `VERIFIED_WITH_ANNOTATIONS`), audit step, and preserved discrepancy counts. |
| `metadata` | `object` | **Yes** | Audit timestamps (`created_at`, `updated_at`) and schema version (`"1.0.0"`). |

---

## 3. The Seven-Topic Structure Specification

The schema mandates that the `topics` object contains exactly seven sub-objects with `additionalProperties: false`. Each topic possesses a fixed `topic_number` (1 to 7) and immutable `title`.

### Topic 1: `meet_the_explorer`
- **Purpose:** Answers "What is it?" and introduces the equipment identity, purpose, and physical presence.
- **Key Fields:**
  - `introduction` (`string`): Comprehensive narrative summary.
  - `equipment_identity` (`object`): Formal name, nicknames, COSPAR ID, NORAD ID, PDS ID, and memorial station designations.
  - `sub_components_represented` (`array`): Distinct physical hardware units (e.g. Descent Stage vs. Ascent Stage, or Lander Petal vs. Rover).
  - `source_refs` (`string[]`): Cross-reference IDs to the `sources` array.

### Topic 2: `mission_and_purpose`
- **Purpose:** Answers "Which mission did it belong to, where was it sent, and why?"
- **Key Fields:**
  - `mission_name`, `program`, `sponsoring_agencies` (`string[]`), `disciplines` (`string[]`).
  - `destination` (`object`): Body, region name, and targeted geological feature.
  - `landing_or_orbital_coordinates` (`object`): Decimal degrees latitude/longitude, standard reference frame, and an array of `coordinate_discrepancies` (preserving historical flight log coordinates vs. modern LRO/MRO photogrammetry).
  - `objectives` (`string[]`): High-level scientific and operational mandates.

### Topic 3: `meet_the_technology`
- **Purpose:** Answers "What components did it have, how did it work, and what technology did it use?"
- **Key Fields:**
  - `architecture_description` (`string`): Engineering summary of the spaceframe.
  - `physical_specifications` (`object`): Launch mass, dry mass, landed mass, dimensions, and `mass_discrepancies` (documenting imperial vs. metric rounding differences).
  - `propulsion` (`object`): Descent engines, thrusters, specific impulse, and propellants.
  - `power_system` (`object`): Primary source (solar, battery, nuclear RTG) with specific Plutonium-238 decay parameters and thermocouple specs.
  - `communications` (`object`): Antennas, frequency bands (S-band, X-band, UHF), and transceivers.
  - `scientific_instruments` (`array`): Itemized list of scientific tools (cameras, spectrometers, magnetometers, drills) with specific purposes and operational statuses.
  - `associated_surface_vehicles_or_stations` (`array`): Deep technical details for auxiliary hardware (e.g. Lunar Roving Vehicle LRV-1 on Apollo 15).

### Topic 4: `the_journey`
- **Purpose:** Answers "What happened during its mission, what work did it perform, and what were its milestones?"
- **Key Fields:**
  - `journey_narrative` (`string`): Complete chronological narrative.
  - `launch_event` (`object`): UTC and local timestamps, launch vehicle, pad location.
  - `arrival_event` (`object`): Event type (`Landing`, `Orbit Insertion`, `Flyby`, `Terminal Touchdown`), approach speeds, and entry dynamics.
  - `mission_timeline` (`array`): Chronological items featuring `date_or_sol`, `phase`, `event_description`, `anomaly_or_record_flag`, and `discrepancy_note`.
  - `operational_totals` (`object`): Mission lifespan (days/sols), distance driven (km), flights completed, orbits, returned imagery, and sample mass.

### Topic 5: `scientific_discoveries`
- **Purpose:** Answers "What experiments did it conduct, what did it discover, and how did it advance space science?"
- **Key Fields:**
  - `summary_narrative` (`string`): Overview of scientific yield.
  - `key_discoveries` (`array`): Itemized breakthroughs categorized into seven scientific disciplines (`Geology & Mineralogy`, `Astrobiology & Organic Chemistry`, `Atmospheric & Climate Science`, `Geophysics & Internal Structure`, `Space Weather & Heliospheric Physics`, `Engineering & Materials Science`, `Planetary Dynamics & Celestial Mechanics`).
  - `claim_status` (`enum`): `["Verified Consensus", "Disputed Claim", "Unconfirmed Candidate Event", "Historical Erratum"]`. Enables explicit flagging of controversies (such as Surveyor 3 *S. mitis* bacteria or Viking 2 candidate Marsquakes).

### Topic 6: `where_is_it_now`
- **Purpose:** Answers "What is its current or final status, where is it located, and why was it left behind?"
- **Key Fields:**
  - `operational_status` (`enum`): `["Inactive on Surface", "Inactive in Stable Orbit", "Inactive in Interstellar Space", "Destroyed by Intentional Surface Impact", "Presumed Impact on Surface (Unknown Exact Site)", "Partially Retrieved to Earth (Remaining Airframe on Surface)"]`.
  - `last_contact_date` (`string`), `is_still_communicating` (`boolean`: `false`).
  - `location_summary` (`string`), `resting_coordinates` (`object`).
  - `why_left_behind` (`string`): Engineering and planetary protection rationale.
  - `hardware_elements_at_site` (`array`): Residual condition of stages, masts, and footpads.
  - `terrestrial_repositories` (`array`): For retrieved hardware (Surveyor 3 camera at Smithsonian, scoop at JPL).

### Topic 7: `its_legacy`
- **Purpose:** Answers "Why is this equipment important and how did it influence future space exploration?"
- **Key Fields:**
  - `historical_significance` (`string`).
  - `key_contributions` (`string[]`).
  - `influence_on_future_missions` (`array`): Itemized mapping showing how proven technology was adapted by subsequent missions (e.g. Surveyor scoop influencing Viking; Ingenuity inspiring SkyFall and Dragonfly).
  - `cultural_or_philosophical_impact` (`string`).

---

## 4. Source Attribution & Discrepancy Modeling

### 4.1 Granular Source Linking
To avoid "floating facts" without traceability:
- Every top-level source is assigned a unique alphanumeric ID (e.g., `src_surveyor3_science_nasa`, `src_pioneer10_turyshev2012`).
- Each of the seven topic objects contains a `source_refs` array listing the exact source IDs that corroborate the information within that section.

### 4.2 Handling of Unresolved Issues & Historical Errata
The schema explicitly provides dedicated structures for all categories identified in `step3_2_unresolved_issues.md`:
1. **Coordinate Format / Precision Discrepancies:** Handled via `coordinate_discrepancies` array under Topic 2.
2. **Mass Rounding Discrepancies:** Handled via `mass_discrepancies` array under Topic 3.
3. **Scientific Controversies:** Handled via `claim_status: "Disputed Claim"` and `notes_or_disputes` under Topic 5.
4. **Typographical Press Errata:** Handled via `claim_status: "Historical Erratum"` or explicit notes in timelines, keeping the true physical value distinct from verbatim flawed quotes.

---

## 5. Media Integration Architecture (Images & 3D Models)

### 5.1 Historical Images
- **Current State:** Defined as an empty array (`"images": []`) in example records.
- **Future Integration:** Each image item contains `id`, `title`, `storage_path` (relative to Supabase Storage bucket `equipment-media`), `caption`, `nasa_photo_id`, and `purpose` (`"hero"`, `"technical_diagram"`, `"surface_view"`, `"science_sample"`, `"memorial"`).

### 5.2 3D Model Asset Architecture (Shared Model Support)
A central project requirement is that **six Mars records share four unique 3D model assets**:
1. `model_mars_ingenuity` — Unique to Ingenuity.
2. `model_mars_mer_rover` — **Shared by Spirit and Opportunity**.
3. `model_mars_sojourner` — Unique to Sojourner.
4. `model_mars_viking_lander` — **Shared by Viking 1 and Viking 2**.

To support this:
- The `model_3d` object includes `model_id`, `storage_path`, `format` (`"glb"` or `"gltf"`), `is_shared_asset` (`boolean`), and `shared_with_equipment_ids` (`string[]`).
- In Supabase, 3D models will reside in a normalized `models_3d` table, referenced via foreign key `model_3d_id` from the `equipment` table. This prevents asset duplication and guarantees that 3D asset updates automatically reflect across both twin spacecraft.

---

## 6. Validation Audit Confirmation

The example record [`equipment_structure_example.json`](file:///c:/Users/SKC/OneDrive/Documents/Desktop/lunarlegacy/LunarLagancy/step3_3_json_schema/equipment_structure_example.json) was validated directly against [`equipment.schema.json`](file:///c:/Users/SKC/OneDrive/Documents/Desktop/lunarlegacy/LunarLagancy/step3_3_json_schema/equipment.schema.json) using the Python `jsonschema` engine:
- **Result:** **100% Strictly Valid** (`VALIDATION_SUCCESS`).
- **Media Invariance:** Empty `"images": []` and null `"model_3d": null` passed validation without warnings.
- **Topic Order:** All seven mandatory topics validated in exact numerical sequence (1 to 7).
