# Data Cleaning & Reorganization Report
## Space Heritage Explorer — Step 2

### 1. Overview
This report documents the operations performed during Step 2 (Data Cleaning, Deduplication, and Normalization) across the three planetary domains: **MOON**, **MARS**, and **DEEP-SPACE**. All raw text files (11 files representing 12 original entries) were thoroughly processed, cleaned, de-duplicated, and mapped into **13 distinct equipment entries** structured under the mandatory Seven Topics.

No original files were deleted, modified, or overwritten.

---

### 2. What Was Removed

Across the raw files, significant quantities of non-essential, extraneous, and corrupting text were identified and purged:

1. **Website Navigation, Footers & Administrative Clutter:**
   - Universal NASA header and footer menus (e.g. *"Home | News & Events | Multimedia | NASA+ | Missions | Humans in Space | Earth..."*).
   - Sitemap, FOIA, No FEAR Act, Agency Financial Reports, and privacy disclaimers.
   - Web page editorial metadata (e.g. *"Page Last Updated: Sep 22, 2026", "Page Editor: Stephen Carney", "Responsible NASA Official for Science: Dana Bolles"*).
   - Print-to-PDF formatting artifacts (e.g. `PAGE 1`, `PAGE 2`, `PAGE 16`, page numbers, form-feed `\x0c` control characters).

2. **Advertisements, Promotional Content & Marketing Noise:**
   - Viking 50th-anniversary celebration wallpaper download links, poster promotions, and Instagram reel links (`https://www.instagram.com/reel/DbA3XXzxNSZ/`).
   - General public engagement links (e.g. *"Join Us", "Follow @NASAMars on your preferred social media platform"*).
   - High-resolution TIFF download warnings (e.g. Photojournal notes warning that `PIA8393_full.tif` is too large for web browsers).

3. **Unrelated Mission & Out-of-Scope Spacecraft Contamination:**
   - **Critical Contamination in MER file:** In `mars-exploration-rovers-spirit-and-opportunity.txt`, paragraphs dedicated to the **Perseverance rover's supersonic parachute binary puzzle** ("Dare Mighty Things"), **Perseverance COVID-19 tribute plate**, and **Curiosity rover's wheel Morse code ("JPL")** were completely excised from the Spirit and Opportunity records.
   - In `near_shoemaker.txt` and `pioneer10.txt`, lists of unrelated suggested NASA articles (e.g. *James Webb Space Telescope, Parker Solar Probe, Juno, Blue Origin New Glenn rocket, ISS Botany*) were removed.

4. **AI Prompts, Scratchpad Commentary & Scraping Errors:**
   - Agent scratchpad notes (e.g., *"I opened the main page and 9 linked NASA pages. Others failed or are blocked...", "Main page read. Now the linked NASA pages..."*).
   - Literal AI prompt leakage in `Viking 1 & 2.txt` (line 290: *"Your prompt text still named the Surveyor 3 URL, but the link you supplied was the Viking page, so I used that..."*).
   - Server error announcements (e.g. *"Returned an NSSDCA error page ('An error has occurred. Please search again.')"*).
   - Personnel direct email addresses (`@ozemail.com.au`, `@jsc.nasa.gov`, `@kelvin.umd.edu`) from Apollo 11 NSSDCA records.
   - Raw OCR truncation placeholders (e.g. `[truncated]`, `[bracketed placeholders]`, `[Embedded video: ...]`).

---

### 3. What Was Combined

For each piece of equipment, two primary data streams existed in the source files:
- **`HUMAN COLLECTED:`** Raw web scrapes from NASA NSSDCA, NASA Science mission pages, and NASA press kits.
- **`AI COLLECTED:`** Organized bullet-point syntheses generated from the primary and linked NASA pages.

**Combination Methodology:**
1. **Fact Integration:** Unique factual data from both sections were united. For instance, in Apollo 11, the human-scraped section provided detailed telemetry frequencies and thermal resistance thermometer thresholds, while the AI section provided structured milestone timestamps and LRO-derived coordinates.
2. **Technical Harmonization:** In Apollo 12 and 15, instrument specifications (dimensions, masses, power consumptions, bitrates) from experiment records were synthesized alongside the operational logs (deployment distances, borehole depths, heater power schedules) from the AI summaries.
3. **Multi-Source Cross-Referencing:** In Surveyor 3, the launch and landing specifications from *Beyond Earth* were combined with the Apollo 12 astronaut retrieval reports from the NASA mission pages into a cohesive timeline.

---

### 4. What Was Reorganized

1. **Separation of Bundled Twin Spacecraft:**
   - **Spirit and Opportunity:** Originally bundled in `mars-exploration-rovers-spirit-and-opportunity.txt`. These were partitioned into two independent equipment directories: `cleaned_data/MARS/Spirit/` and `cleaned_data/MARS/Opportunity/`.
   - **Viking 1 and Viking 2:** Originally bundled in `Viking 1 & 2.txt`. These were partitioned into two independent equipment directories: `cleaned_data/MARS/Viking_1/` and `cleaned_data/MARS/Viking_2/`.
   - **Sojourner Rover & Pathfinder Lander:** Structured within `cleaned_data/MARS/Sojourner/`, keeping the mobile rover (Sojourner) and the lander base station (Carl Sagan Memorial Station) clearly distinguished across all sections.

2. **Standardization under the Mandatory Seven Topics:**
   Every equipment entry was transformed into the strict seven-topic layout:
   - **Topic 1: Meet the Explorer:** Formal names, alternate IDs (COSPAR/NORAD/PDS), image links, and summary introductions.
   - **Topic 2: Mission & Purpose:** Sponsoring agencies, target celestial body, exact landing/orbital coordinates, and high-level objectives.
   - **Topic 3: Meet the Technology:** Dimensions, masses, propulsion, power systems (solar arrays, batteries, RTGs), communications, and detailed science instruments.
   - **Topic 4: The Journey:** Chronological narrative from launch, cruise, landing/orbit insertion, operational milestones, anomalies, to end-of-mission.
   - **Topic 5: Scientific Discoveries:** Key experiments, geological/atmospheric/physical findings, and paradigm shifts.
   - **Topic 6: Where Is It Now?:** Current physical status, precise coordinates/orbit, and reasons for remaining at the site.
   - **Topic 7: Its Legacy:** Historical significance, technologies proven, and direct contributions to subsequent missions.
