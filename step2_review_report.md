# Step 2.1: Cleaning Report Review and Conflict Classification
## Space Heritage Explorer Project

**Review Date:** 2026-11-14  
**Scope:** Review and audit of completed Step 2 cleaned equipment data, folder architecture, and metadata reports.  
**Strict Directives Observed:**
- No original files modified or deleted.
- No cleaned equipment data modified.
- No new external research conducted.
- No JSON conversion or database operations performed.
- Existing folder structure preserved without unauthorized alteration.

---

## 1. Equipment Record Count Clarification

### 1.1 Project Records vs. Physical Hardware
A critical distinction must be maintained between **Project Records (folders/files)** and **Individual Physical Equipment (spacecraft, landers, rovers, and deployed instruments)**:

- **Original Raw Files:** 11 files representing 12 user-defined entries.
- **Cleaned Data Folders/Records:** 13 distinct directories (`cleaned_data/`).
- **Physical Equipment Elements:** Over 24 distinct major physical flight and surface hardware units across the three domains.

The table below delineates the relationship between project records and physical equipment:

| Domain | Project Record Folder | Cleaned File Name | Primary Physical Equipment Represented | Associated Deployable / Stowed Hardware | Total Major Physical Units |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MOON** | `Apollo_11_Lunar_Module` | `Apollo_11_Lunar_Module.txt` | • Apollo 11 LM Descent Stage<br>• Apollo 11 LM Ascent Stage | • EASEP Central Station<br>• LRRR Retroreflector Array<br>• Lunar Dust Detector (DTREM) | 5 |
| **MOON** | `Apollo_12_Lunar_Module` | `Apollo_12_Lunar_Module.txt` | • Apollo 12 LM Descent Stage<br>• Apollo 12 LM Ascent Stage | • ALSEP Central Station<br>• SNAP-27 RTG<br>• PSE, SIDE/CCIG, SWS, SWC, Soil Mech. | 6+ |
| **MOON** | `Apollo_15_Lunar_Module` | `Apollo_15_Lunar_Module.txt` | • Apollo 15 LM Descent Stage<br>• Apollo 15 LM Ascent Stage | • Lunar Roving Vehicle (LRV-1)<br>• ALSEP Central Station & SNAP-27 RTG<br>• Heat Flow probes, LRRR, PSE, etc. | 7+ |
| **MOON** | `Surveyor_3` | `Surveyor_3.txt` | • Surveyor 3 Spaceframe & Landing Legs | • Surface Sampler Pantograph Arm<br>• Surveyor TV Camera Assembly | 2 |
| **MARS** | `Ingenuity` | `Ingenuity.txt` | • Ingenuity Mars Helicopter | • Coaxial Dual Rotor System & Fuselage | 1 |
| **MARS** | `Spirit` | `Spirit.txt` | • Spirit Rover (MER-A) | • Lander Petal Platform & Airbag System | 2 |
| **MARS** | `Opportunity` | `Opportunity.txt` | • Opportunity Rover (MER-B) | • Lander Petal Platform & Airbag System | 2 |
| **MARS** | `Sojourner` | `Sojourner.txt` | • Sojourner Microrover<br>• Mars Pathfinder Lander (Carl Sagan Memorial Station) | • Three Airbag clusters & Deployable Petals<br>• IMP Camera Mast & APXS mechanism | 2 |
| **MARS** | `Viking_1` | `Viking_1.txt` | • Viking Orbiter 1<br>• Viking Lander 1 (Thomas Mutch Memorial Station) | • Aeroshell & Parachute<br>• Dual SNAP-19 RTGs & Sampler Arm | 2 |
| **MARS** | `Viking_2` | `Viking_2.txt` | • Viking Orbiter 2<br>• Viking Lander 2 (Gerald Soffen Memorial Station) | • Aeroshell & Parachute<br>• Dual SNAP-19 RTGs & Sampler Arm | 2 |
| **DEEP-SPACE** | `Dawn` | `Dawn.txt` | • Dawn Spacecraft Bus | • NSTAR Triple Xenon Ion Thruster System | 1 |
| **DEEP-SPACE** | `NEAR_Shoemaker`| `NEAR_Shoemaker.txt` | • NEAR Shoemaker Spacecraft Bus | • Bipropellant Main Engine & Solar Wings | 1 |
| **DEEP-SPACE** | `Pioneer_10` | `Pioneer_10.txt` | • Pioneer 10 Spacecraft Bus | • Quadruple SNAP-19 RTGs & 2.74m Dish | 1 |

### 1.2 Representation of Mars Pathfinder Lander and Sojourner
- **Current Representation:** The data is currently housed in `cleaned_data/MARS/Sojourner/Sojourner.txt`.
- **Architectural Separation:** Within `Sojourner.txt`, the text strictly distinguishes between:
  1. **Carl Sagan Memorial Station (Pathfinder Lander):** The tetrahedron base petal, three solar petals, entry aeroshell, parachute, radar altimeter, airbag deceleration system, Imager for Mars Pathfinder (IMP), and Atmospheric Structure Instrument / Meteorology (ASI/MET).
  2. **Sojourner Rover:** The 10.6 kg, six-wheeled rocker-bogie microrover, its autonomous laser obstacle avoidance system, solar panel, and rear-mounted Alpha Proton X-ray Spectrometer (APXS).
- **Proposed Structural Recommendation (For User Review):**
  - *Option A (Status Quo):* Maintain `cleaned_data/MARS/Sojourner/` as a combined lander-and-rover record, with clear internal distinctions (as currently implemented).
  - *Option B (Split Folders):* Create two independent equipment directories: `cleaned_data/MARS/Mars_Pathfinder_Lander/` and `cleaned_data/MARS/Sojourner/`.
  - *Option C (Renamed Folder):* Rename `cleaned_data/MARS/Sojourner/` to `cleaned_data/MARS/Mars_Pathfinder_and_Sojourner/` to explicitly reflect both machines in the directory title.
  *(No changes will be applied until approved by the user).*

---

## 2. Equipment and Scientific Systems Distinction Audit

A detailed review was conducted to ensure that Apollo Lunar Modules are not conflated with their surface payloads, experiment packages, or separate vehicles.

### 2.1 Audit Findings across Apollo Missions
1. **Flight Vehicle vs. Surface Payload Boundary:**
   - **Apollo 11:** The Lunar Module (*Eagle* / LM-5) is correctly defined as a two-stage flight vehicle (ascent and descent stages). The Early Apollo Scientific Experiment Package (EASEP), the Laser Ranging Retroreflector (LRRR), and the Lunar Dust Detector (DTREM) are explicitly documented as surface payloads stowed in the descent stage equipment bay (MESA) and deployed away from the lander by the crew.
   - **Apollo 12:** The Lunar Module (*Intrepid* / LM-6) is correctly distinguished from the Apollo Lunar Surface Experiments Package (ALSEP). The ALSEP central station, the SNAP-27 Radioisotope Thermoelectric Generator (RTG), and individual instruments (PSE, SIDE, CCIG, Solar Wind Spectrometer) are documented as independent, ground-emplaced stations operating 3 to 15 meters away from the central station and powered by nuclear decay rather than the LM batteries.
   - **Apollo 15:** The Lunar Module (*Falcon* / LM-10) is clearly separated from both the ALSEP geophysical station and the **Lunar Roving Vehicle (LRV-1)**. The LRV is documented as an independent electric ground vehicle stowed folded in Quadrant 1 of the LM descent stage and driven up to 5 km away.

### 2.2 Safeguards Maintained in Cleaned Files
- No scientific experiment or surface vehicle is classified as an integral flight subcomponent of the Lunar Module ascent or descent stage.
- Frequencies, power outputs, and operating lifespans are segregated: LM lifespans are measured in hours/days (powered by silver-zinc batteries), whereas ALSEP/EASEP lifespans are measured in years (powered by SNAP-27 RTGs or surface solar panels).

---

## 3. Systematic Conflict Classification

Every discrepancy identified in Step 2 has been analyzed and classified into one of the six mandatory categories:

| Domain & Equipment | Discrepancy Description | Source A Value | Source B Value | Classification | Justification / Analytical Assessment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Moon: Apollo 11** | LM Ascent Stage Jettison Time | 22 July 1969, 00:01:01 UT *(NSSDCA 1969-059C)* | 21 July 1969, 23:41 UT *(NSSDCA "Where Are They Now?")* | **Genuine factual conflict** | A 20-minute divergence exists between primary orbital telemetry logs and retrospective archival summaries. |
| **Moon: Apollo 11** | Surface EVA Duration | 1h 41m (Aldrin) / 1h 53m (Armstrong) *(NSSDCA Mission Profile)* | 2h 32m total / 2h 15m (Aldrin) *(25th Anniversary Summary)* | **Unresolved discrepancy** | Definitional boundary difference: hatch opening to hatch closure (cabin depressurization) vs. boots-on-the-ground duration. |
| **Moon: Apollo 11** | Landing Time in EDT | 4:17:40 PM EDT *(NSSDCA Main Record)* | 4:18 PM EDT *(25th Anniversary Summary)* | **Rounding or precision difference** | Simple rounding to the nearest minute in public anniversary literature. |
| **Moon: Apollo 11** | Splashdown Time | 12:50:35 PM EDT *(Overview Page)* | 12:50 PM EDT *(Caption Page)* | **Rounding or precision difference** | Truncation of seconds in general caption text. |
| **Moon: Apollo 12** | ALSEP Central Station Coordinates | 3.0094° S, 23.4246° W *(NSSDCA Main & Instrument Pages)* | -3.0098° S, -23.4249° W *(Landing Sites Table / LRO DE421)* | **Genuine factual conflict** | Historical nominal astronaut navigation coordinates vs modern Lunar Reconnaissance Orbiter photogrammetric geodesy. |
| **Moon: Apollo 12** | LM Impact Longitude | 338.80° E *(Apollo 12 Mission Profile)* | 21.20° W *(Impact Sites Table & "Where Are They Now?")* | **Coordinate-format difference** | Mathematically identical ($360^\circ - 338.80^\circ = 21.20^\circ\text{ W}$), expressed in eastern positive vs western coordinates. |
| **Mars: MER** | Rover Launch Mass | 405 lb (185 kg) *(Spirit Science Page)* | 408 lb (185 kg) *(Opportunity Science Page)* | **Rounding or precision difference** | Both cite 185 kg ($185\text{ kg} = 407.855\text{ lb}$). Spirit rounded down to 405 lb; Opportunity rounded to 408 lb. |
| **Mars: Opportunity**| Landing Calendar Date | Jan. 24, 2004 *(PST Log)* | Jan. 25, 2004 *(UTC Log)* | **Time-zone difference** | Touchdown occurred at 21:05 PST on Jan 24, which corresponds to 04:54 UTC on Jan 25. |
| **Mars: Opportunity**| Lunokhod 2 Benchmark Distance | 24 miles (39 km) / 25.01 miles *(Soviet claim)* | Up to 26 miles (42 km) *(Russian LRO analysis)* | **Unresolved discrepancy** | Historical Soviet telemetry estimates vs modern orbital track measurements by Russian researchers. |
| **Mars: Pathfinder** | Lander Image Count | >16,500 images *(NASA Science Page)* | >16,000 images *(NASA Wind-Down Release 1997)* | **Rounding or precision difference** | Preliminary operational estimate at mission wind-down vs final processed planetary data archive total. |
| **Mars: Pathfinder** | Surface Temperature Record | "minus 220 degrees Kelvin (-64°F)" *(July 4, 1997 Status Report)* | ~220 Kelvin (-53.15°C / -63.67°F) | **Typographical/OCR error** | Typographical error in the official 1997 NASA release (Kelvin cannot be negative; 220 K equals -64°F). |
| **Mars: Viking** | Lander Mass Table Entry | "Mass: 2.2 pounds (657 kilograms)" *(Viking Tech Specs Table)* | 2,156 lb (978 kg) separated / 657 kg landed dry mass *(Narrative)* | **Typographical/OCR error** | Clear typographical/OCR corruption in source web table (omitted digits or "tons" confused with "pounds"). |
| **Mars: Viking 1** | Touchdown Target Date | July 4, 1976 *(Pre-launch Release)* | July 20, 1976 *(Actual Touchdown)* | **Genuine factual conflict** | Planned milestone (US Bicentennial touchdown) was altered in flight due to hazardous terrain detected by the orbiter. |
| **Mars: Viking 1** | Landing Coordinates | 22.483° N, 47.94° W *(Science Page)* | 22.27° N, 47.95° W *(NSSDCA Master Catalog)* | **Genuine factual conflict** | Discrepancy between early post-landing navigation estimates and subsequent cartographic revisions. |
| **Mars: Viking 2** | Landing Longitude Standard | 225.71° W *(Viking Flight Log)* | 134.29° E *(IAU Planetocentric Standard)* | **Coordinate-format difference** | Mathematically identical ($360^\circ - 225.71^\circ = 134.29^\circ$). |
| **Deep Space: Pioneer 10** | Image Date Range | "Between Nov. 6 and 31 Dec. 31" *(Source Text)* | Between Nov. 6 and Dec. 31 | **Typographical/OCR error** | Repetition of the day numeral "31" in source text printing. |

---

## 4. Source Traceability and Gaps Audit

### 4.1 Incomplete Source Identifiers Identified
In `cleaned_data/source_reference_report.md` and several equipment reference sections, several entries cited bare catalog IDs or institutional archives without full HTTP endpoints:
1. **NSSDCA ID Catalog References Lacking Complete URLs:**
   - Viking 1 Orbiter (`1975-075A`) and Lander (`1975-075C`)
   - Viking 2 Orbiter (`1975-083A`) and Lander (`1975-083C`)
   - Mars Pathfinder (`1996-068A`)
   - NEAR Shoemaker (`1996-008A`)
   - Pioneer 10 (`1972-012A`)
   *Correction:* In Step 3, these should be hyperlinked to the standardized NSSDCA query format: `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=<ID>`.
2. **Institutional General Citations:**
   - "NASA Ames Research Center Pioneer Project Archive"
   - "Johns Hopkins University Applied Physics Laboratory (JHU/APL) NEAR Mission Archive"
   *Correction:* These denote institutional repository provenance rather than direct deep-links.

### 4.2 Facts Lacking Direct Traceable Web Citations
Certain facts present in the raw source files were flagged as originating from general knowledge or secondary text:
1. **Pioneer 10:**
   - Terminal distance of ~80 AU (12 billion km) at last contact.
   - 2-million-year estimated transit time to Aldebaran.
   - Specific Pioneer Anomaly deceleration value ($8.74 \times 10^{-10}\text{ m/s}^2$).
   *(Flagged in `verification_report.md` as explicitly noted in the source file as general knowledge).*
2. **NEAR Shoemaker:**
   - 433 Eros peanut dimensions ($34 \times 11 \times 11\text{ km}$).
   - 253 Mathilde flyby closest approach distance (1,212 km).
   - Detailed launch mass breakdown (805 kg total / 318 kg fuel / 487 kg dry mass).
   *(Flagged as compiled from general knowledge in source Part 2).*
3. **Dawn:**
   - Spacecraft bus dimensions (5.4 x 4.2 x 5.8 ft) and thruster mass/thrust ranges were added in source Part 2 from secondary NASA research not present in the original 6-page PDF.

### 4.3 Inaccessible URLs during Raw Collection
The following four Apollo 11 and four Apollo 12 experiment query URLs returned server errors during initial scraping:
- Apollo 11: `1969-059C-01` (Geology), `1969-059C-02` (Solar Wind), `1969-059C-03` (Seismic), `1969-059C-06` (Soil Mechanics).
- Apollo 12: `1969-099C-01` (Geology), `1969-099C-04` (Magnetometer), `1969-099C-06` (CCIG individual page), `1969-099C-07` (Dust Detector).
- Surveyor 3 Analysis Report FTP link (`b16023.pdf`).
*Note:* The core facts for these experiments were preserved from the master mission summaries, but sub-assembly circuit schematics remain absent due to these server errors.

---

## 5. Report Consistency and Quality Check

### 5.1 Verification of Cleaned Outputs
A comprehensive filesystem audit was performed across `cleaned_data/`:
- **File Existence:** All 13 equipment files exist in their designated directory locations.
- **Report Existence:** All 5 required Step 2 reports exist in `cleaned_data/` (`cleaning_report.md`, `duplicate_report.md`, `conflict_report.md`, `verification_report.md`, `source_reference_report.md`).
- **Topic Completeness:** Every single one of the 13 cleaned text files contains all **Seven Mandatory Topics** intact, numbered sequentially from `## 1. Meet the Explorer` to `## 7. Its Legacy`.

### 5.2 Verification of Removal Claims
- **Curiosity & Perseverance Excisions:** Confirmed that the paragraph describing Curiosity's wheel Morse code ("JPL"), Perseverance's parachute binary message ("Dare Mighty Things"), and the COVID-19 tribute plate were completely removed from `Spirit.txt` and `Opportunity.txt`.
- **Promotional & Web Artifacts:** Confirmed that Viking 50th-anniversary wallpaper links, Instagram reel URLs, sitemaps, and direct scientist emails were purged across all files.
- **AI Prompt Leaks:** Confirmed that the prompt reflection artifact in `Viking 1 & 2.txt` line 290 was removed from both `Viking_1.txt` and `Viking_2.txt`.

---

## 6. Recommended Corrections for Future Steps

1. **Pathfinder/Sojourner Folder Nomenclature:**
   - Request user guidance on whether to retain `cleaned_data/MARS/Sojourner/` as a combined folder or split into `Mars_Pathfinder_Lander` and `Sojourner`.
2. **URL Standardisation:**
   - In Step 3, standardize all bare NSSDCA IDs into full clickable URLs using `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=<COSPAR_ID>`.
3. **Coordinate Standard Harmonization:**
   - Explicitly annotate both the modern IAU Planetocentric standard (e.g. degrees East) and the historical flight mission standard (e.g. degrees West) in metadata schemas to eliminate confusion.
4. **Typographical Error Annotations:**
   - In database schemas, store true physical values (e.g. $220\text{ K} = -64^\circ\text{F}$; Viking lander dry mass = 657 kg) while storing the verbatim flawed press release quotes as historical notes with `[sic]` markers.

---

## 7. Final Readiness Assessment

- **Data Integrity:** **PASS** (Zero original files altered; all raw facts and figures preserved).
- **Structure Adherence:** **PASS** (100% compliance with the 7-topic requirement across all 13 equipment entries).
- **Conflict Documentation:** **PASS** (All 16 identified discrepancies rigorously categorized without silent modification).
- **Readiness for Step 3:** **READY**, subject to user review and approval.
