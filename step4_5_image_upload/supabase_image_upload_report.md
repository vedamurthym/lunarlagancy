# STEP 4.5 IMAGE UPLOAD REPORT — SPACE HERITAGE EXPLORER

**Timestamp:** 14-11-2026 20:42  
**Supabase Endpoint:** `https://hblojsryggnotcurccra.supabase.co`  
**Storage Bucket:** `equipment-images`  
**Status:** **COMPLETED SUCCESSFULLY**  

---

## 1. Executive Summary

| Metric | Target | Actual | Status |
| :--- | :--- | :--- | :--- |
| **Total Images Discovered** | 65 | 65 | PASSED |
| **Total Images Uploaded** | 65 | 65 | PASSED |
| **Total Database Records Upserted** | 65 | 65 | PASSED |
| **Skipped Files** | 0 | 0 | PASSED |
| **Failed Uploads** | 0 | 0 | PASSED |
| **Public CDN Accessible Objects** | 65 | 65 | PASSED |
| **Equipment with Exactly 5 Images** | 13 | 13 (ALL VERIFIED) | PASSED |
| **Attribution Complete (Source/Photo ID)** | Variable | 33 / 65 | VERIFIED |
| **Missing Attribution (Pending Manual Entry)** | -- | 32 / 65 | FLAGGED |

---

## 2. Directory & Category Breakdown

### 2.1 Moon Exploration (20 Images)
- **Apollo 11 LM & EASEP (`eq_moon_apollo11_lm`):** 5 images uploaded (`moon/apollo11/ap11-[1-5].jpg`)
- **Apollo 12 LM & ALSEP (`eq_moon_apollo12_lm`):** 5 images uploaded (`moon/apollo12/ap12-[1-5].jpg`)
- **Apollo 15 LM & LRV (`eq_moon_apollo15_lm`):** 5 images uploaded (`moon/apollo15/ap15-[1-5].jpg`)
- **Surveyor 3 (`eq_moon_surveyor3`):** 5 images uploaded (`moon/surveyor3/Surveyor3-[1-5].jpg`)

### 2.2 Mars Exploration (30 Images)
- **Ingenuity Mars Helicopter (`eq_mars_ingenuity`):** 5 images uploaded (`mars/ingenuity/ingenuity-[1-5].jpg`)
- **Spirit MER-A (`eq_mars_spirit`):** 5 images uploaded (`mars/spirit/spirit-[1-5].jpg`)
- **Opportunity MER-B (`eq_mars_opportunity`):** 5 images uploaded (`mars/opportunity/opportunity-[1-5].jpg`)
- **Sojourner Rover & Pathfinder (`eq_mars_sojourner_pathfinder`):** 5 images uploaded (`mars/sojourner/sojourner-[1-5].jpg`)
- **Viking 1 Orbiter & Lander (`eq_mars_viking1`):** 5 images uploaded (`mars/viking1/viking1-[1-5].jpg`)
- **Viking 2 Orbiter & Lander (`eq_mars_viking2`):** 5 images uploaded (`mars/viking2/viking2-[1-5].jpg`)

### 2.3 Deep Space Exploration (15 Images)
- **Dawn Spacecraft (`eq_deep_space_dawn`):** 5 images uploaded (`deep-space/dawn/dawn[1-3].jpg`, `deep-space/dawn/dwan4.jpg`, `deep-space/dawn/dawn5.jpg`)
- **NEAR Shoemaker (`eq_deep_space_near_shoemaker`):** 5 images uploaded (`deep-space/near-shoemaker/NEAR Shoemaker-[1-5].jpg`)
- **Pioneer 10 Spacecraft (`eq_deep_space_pioneer10`):** 5 images uploaded (`deep-space/pioneer10/Pioneer10-[1-5].jpg`)

---

## 3. Storage Hierarchy & Mapping Table

| Equipment ID | Local Folder | Local Files | Supabase Storage Path | MIME Type | Purpose Distribution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eq_moon_apollo11_lm` | `MOON/` | `ap11-[1-5].jpg` | `moon/apollo11/` | `image/jpeg` | hero, technical_diagram, surface_view, science_sample |
| `eq_moon_apollo12_lm` | `MOON/` | `ap12-[1-5].jpg` | `moon/apollo12/` | `image/jpeg` | hero, surface_view, science_sample, technical_diagram |
| `eq_moon_apollo15_lm` | `MOON/` | `ap15-[1-5].jpg` | `moon/apollo15/` | `image/jpeg` | hero, surface_view, science_sample, technical_diagram |
| `eq_moon_surveyor3` | `MOON/` | `Surveyor3-[1-5].jpg` | `moon/surveyor3/` | `image/jpeg` | hero, surface_view, science_sample, technical_diagram |
| `eq_mars_ingenuity` | `MARS/` | `ingenuity-[1-5].jpg` | `mars/ingenuity/` | `image/jpeg` | hero, surface_view, technical_diagram |
| `eq_mars_spirit` | `MARS/` | `spirit-[1-5].jpg` | `mars/spirit/` | `image/jpeg` | hero, surface_view, science_sample |
| `eq_mars_opportunity` | `MARS/` | `opportunity-[1-5].jpg` | `mars/opportunity/` | `image/jpeg` | hero, surface_view, science_sample |
| `eq_mars_sojourner_pathfinder` | `MARS/` | `sojourner-[1-5].jpg` | `mars/sojourner/` | `image/jpeg` | hero, surface_view, science_sample |
| `eq_mars_viking1` | `MARS/` | `viking1-[1-5].jpg` | `mars/viking1/` | `image/jpeg` | hero, surface_view, technical_diagram, orbit_view |
| `eq_mars_viking2` | `MARS/` | `viking2-[1-5].jpg` | `mars/viking2/` | `image/jpeg` | hero, surface_view, science_sample, orbit_view |
| `eq_deep_space_dawn` | `DEEP-SPACE/` | `dawn[1-3,5].jpg`, `dwan4.jpg` | `deep-space/dawn/` | `image/jpeg` | hero, surface_view, science_sample, orbit_view |
| `eq_deep_space_near_shoemaker` | `DEEP-SPACE/` | `NEAR Shoemaker-[1-5].jpg` | `deep-space/near-shoemaker/` | `image/jpeg` | hero, surface_view, technical_diagram |
| `eq_deep_space_pioneer10` | `DEEP-SPACE/` | `Pioneer10-[1-5].jpg` | `deep-space/pioneer10/` | `image/jpeg` | hero, memorial, orbit_view, science_sample, technical_diagram |

---

## 4. Attribution & Provenance Summary

In accordance with strict data integrity rules, no unverified source URLs or photo IDs were fabricated.
- **Embedded XMP/EXIF Metadata:** Successfully extracted for Spirit, Opportunity, Sojourner, Pioneer 10, and Viking 2.
- **Documented NSSDC / NASA Records:** Attached where verifiable (Apollo 11, Apollo 12, Surveyor 3, etc.).
- **Missing Attribution Records (32 items):** Retained with `source_url = NULL` and `nasa_photo_id = NULL` in database rows, flagged in `image_upload_manifest.csv` for future manual curation.

---

## 5. Security & Verification Checklist

- [x] **Service Role Key Isolation:** Loaded securely from `.env`, never exposed to client-side code or printed in logs.
- [x] **Idempotent Ingestion:** Re-running the script safely updates metadata and avoids redundant duplicate objects.
- [x] **Schema Integrity:** Database schema was untouched; all foreign keys, column names, and enum types strictly adhered to `migration_v1_schema.sql`.
- [x] **File Integrity:** Original files in `IMAGES` were not altered, compressed, or renamed. The disk filename `dwan4.jpg` was preserved.
- [x] **Relational Verification:** All 65 rows in `equipment_images` link to valid primary keys in `public.equipment`.
