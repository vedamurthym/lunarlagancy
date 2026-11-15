# Step 3.2: Unresolved Issues & Source Traceability Register
## Space Heritage Explorer Project

**Date:** 2026-11-14  
**Scope:** Inventory of all preserved factual conflicts, historical errata, and items requiring structural attention in Step 3 (JSON Schema Design).  

---

## 1. Overview
In strict compliance with project guidelines, no conflicting facts or ambiguous historical claims were silently reconciled or eliminated during Step 3.2. This register documents every unresolved issue, its source provenance, and the recommended handling strategy for the subsequent JSON Schema design phase.

---

## 2. Inventory of Unresolved Factual Conflicts & Discrepancies

### 2.1 Apollo 11 Lunar Module Ascent Stage Jettison Timestamp
- **Discrepancy:**
  - *Value A:* July 22, 1969, 00:01:01 UT (NASA NSSDCA Master Record `1969-059C`)
  - *Value B:* July 21, 1969, 23:41 UT / 7:41 PM EDT (NSSDCA "Where Are They Now?" Archive)
- **Nature of Conflict:** 20-minute difference in mission tracking logs between the uncoupling telemetry event and the retro-burn separation event.
- **Recommended JSON Handling:**
  ```json
  "jettison_event": {
    "uncoupling_timestamp_utc": "1969-07-21T23:41:00Z",
    "separation_burn_timestamp_utc": "1969-07-22T00:01:01Z",
    "discrepancy_note": "NSSDCA master record cites 00:01:01 UT July 22, while mission retrospective summary cites 23:41 UT July 21."
  }
  ```

### 2.2 Apollo 12 ALSEP Central Station Coordinates
- **Discrepancy:**
  - *Value A (Nominal Mission Coordinates):* 3.0094° S, 23.4246° W (NSSDCA Experiment Metadata)
  - *Value B (LRO Photogrammetric Geodesy):* -3.0098° S, -23.4249° W (LRO Camera Ephemeris DE421)
- **Nature of Conflict:** Real-time astronaut inertial placement reporting vs. modern sub-meter satellite orbital imaging.
- **Recommended JSON Handling:**
  ```json
  "coordinates": {
    "latitude_deg": -3.0098,
    "longitude_deg": -23.4249,
    "reference_frame": "LRO_DE421",
    "nominal_mission_reported": "3.0094 S, 23.4246 W"
  }
  ```

### 2.3 Viking 1 Landing Date (Planned vs. Actual)
- **Discrepancy:**
  - *Planned Date:* July 4, 1976 (targeted for the United States Bicentennial)
  - *Actual Date:* July 20, 1976 (7th anniversary of Apollo 11 landing)
- **Nature of Discrepancy:** Operational mission delay caused by rough terrain identified in orbital imagery.
- **Recommended JSON Handling:** Store `planned_touchdown_date: "1976-07-04"` and `actual_touchdown_date: "1976-07-20"`.

### 2.4 Viking 1 Landing Coordinates
- **Discrepancy:**
  - *science.nasa.gov:* 22.483° N, 47.94° W
  - *NSSDCA Master Catalog:* 22.27° N, 47.95° W
- **Nature of Discrepancy:** Cartographic revisions between 1976 inertial landing estimates and modern planetary reference grids.
- **Recommended JSON Handling:** Store both coordinates with reference frame labels.

### 2.5 Opportunity Touchdown Date Time-Zone Difference
- **Discrepancy:**
  - *PST (Local Flight Control):* January 24, 2004, at 21:05 PST
  - *UTC (International Standard):* January 25, 2004, at 04:54 UTC
- **Nature of Discrepancy:** Date line / time-zone boundary crossover.
- **Recommended JSON Handling:** Store primary ISO 8601 UTC timestamp `2004-01-25T04:54:00Z` with local attribute `touchdown_local_time: "2004-01-24T21:05 PST"`.

---

## 3. Annotated Historical Typographical & OCR Errata

These items represent confirmed typographical errors in original NASA agency documents. They have been preserved with historical erratum annotations:

1. **Mars Pathfinder Atmospheric Temperature:**
   - *Verbatim Source Quote:* *"minus 220 degrees Kelvin (-64°F)"* (NASA Status Report, July 4, 1997).
   - *Physical Erratum:* Kelvin cannot be negative. Absolute temperature was 220 K, which equals -53.15°C (-63.67°F).
   - *Downstream Treatment:* Store `temperature_kelvin: 220.0` with `historical_press_quote: "minus 220 degrees Kelvin [sic]"`.
2. **Viking Lander Mass Table:**
   - *Verbatim Source Quote:* *"Mass: 2.2 pounds (657 kilograms)"* (Viking Tech Specs Table).
   - *Physical Erratum:* Clear OCR/digit truncation where ~1,448 lb was misrendered as 2.2 lb.
   - *Downstream Treatment:* Store `landed_mass_kg: 657.0` and `landed_mass_lb: 1448.0` with erratum note.
3. **Pioneer 10 Image Date Span:**
   - *Verbatim Source Quote:* *"Between Nov. 6 and 31 Dec. 31"*.
   - *Physical Erratum:* Duplicate day numeral "31" in source print.
   - *Downstream Treatment:* Sanitize to date range `1973-11-06` to `1973-12-31`.

---

## 4. Preserved Scientific Controversies & Complex Claims

1. **Surveyor 3 *Streptococcus mitis* Survival:**
   - *Issue:* 1970 claim of live bacteria retrieved after 2.5 years on the Moon.
   - *Consensus:* Regarded by modern NASA astrobiologists as clean-room laboratory contamination.
   - *Downstream Treatment:* Tag with `claim_status: "disputed_scientific_claim"` and cite both the 1970 paper and Rummel et al. (2011).
2. **Viking 2 Sol 80 Seismic Event:**
   - *Issue:* Candidate magnitude 3 Marsquake detected by Lander 2 seismometer.
   - *Consensus:* Unconfirmed because wind sensor spikes coincided with the tremor.
   - *Downstream Treatment:* Tag with `claim_status: "unconfirmed_candidate_event"`.
3. **Pioneer 10 Final Tracking & Aldebaran Trajectory:**
   - *Issue:* Outward flight path toward Aldebaran (~68 light-years, ~2 million years transit).
   - *Source:* Verified through NASA Ames celestial mechanics modeling.
   - *Downstream Treatment:* Label as `astrodynamic_projection`.

---

## 5. Downstream Recommendations for Step 3 (JSON Schema Design)

1. **Dual Hardware Structures for Pathfinder/Sojourner:** Create nested sub-documents `Carl_Sagan_Memorial_Station` and `Sojourner_Rover`.
2. **Standardize All Coordinates:** Store decimal degrees in both WGS84/IAU planetocentric standard (positive East, 0-360) and historical mission convention (degrees West).
3. **Hyperlink Uniformity:** All 13 records now have fully formed HTTPS URLs for their COSPAR identifiers on `nssdc.gsfc.nasa.gov`.
