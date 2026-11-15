# Duplicate Data & Deduplication Report
## Space Heritage Explorer — Step 2

### 1. Overview
The original project collection exhibited significant internal and cross-file data duplication. This report catalogues the duplicate content identified and details the deduplication procedures applied.

---

### 2. Major Duplicate Categories & Resolution

#### A. Internal Dual-Section Duplication (HUMAN vs. AI Collected)
Almost every file in the `MOON` and `MARS` directories contained two complete halves:
1. `MOON/Apollo 11 Lunar Module.txt`: Lines 1–188 (Raw Scrape) vs. Lines 189–497 (`AI COLLECTED:`)
2. `MOON/Apollo 12 Lunar Module.txt`: Lines 1–456 (`AI COLLECTED:`) vs. Lines 457–850 (`HUMAN COLLECTED:`)
3. `MOON/Apollo 15 Lunar Module.txt`: Lines 1–542 (`HUMAN COLLECTED:`) vs. Lines 543–967 (`AI COLLECTED:`)
4. `MOON/Surveyor 3.txt`: Lines 1–272 (`AI COLLECTED`) vs. Lines 273–330 (`HUMAN COLLCTED:`)
5. `MARS/mars-exploration-rovers-spirit-and-opportunity.txt`: Lines 1–180 (`HUMAN COLLECTED:`) vs. Lines 183–629 (`AI COLLECTED:`)
6. `MARS/Viking 1 & 2.txt`: Lines 1–284 (`HUMAN COLLECTED :`) vs. Lines 285–684 (`AI COLLECTED :`)

- **Handling:** Rather than discarding either section, each fact, date, coordinate, and technical specification was cross-compared. Exact duplicate sentences and restated paragraphs were merged into a single authoritative statement, retaining the most detailed attributes (e.g., combining specific telemetry frequencies from the human scrape with calibrated LRO coordinates from the AI synthesis).

#### B. Exact Verbatim Paragraph Repetition
Inside several source files, identical paragraphs were duplicated immediately adjacent to one another due to scraping glitches:
- **`MARS/Viking 1 & 2.txt` (Lines 277–278):**
  The following paragraph was duplicated verbatim:
  > *"Oblique color mosaic of Candor Chasma on Mars looking from the west. This color mosaic of Viking Orbiter 1 and 2 images showing Candor Chasma, part of the Valles Marineris system on Mars. This oblique view is looking from the west over the 800 km wide chasm, which is centered at about 6.5 S, 71. W. The walls and floor show evidence of erosion and mass wasting and complex geomorphology."*
- **`MARS/Viking 1 & 2.txt` (Lines 274–275):**
  The caption for the first panoramic image of Chryse Planitia was repeated twice verbatim.
- **Handling:** Verbatim duplicate lines and paragraphs were collapsed to a single instance.

#### C. Cross-File Story & Event Duplication
- **Surveyor 3 Retrieval by Apollo 12:**
  Both `MOON/Apollo 12 Lunar Module.txt` and `MOON/Surveyor 3.txt` detailed the visit by astronauts Pete Conrad and Alan Bean to the inactive Surveyor 3 lander, the cutting of its TV camera and soil scoop, and subsequent terrestrial analysis.
  - **Handling:** The shared event was preserved in both records from their respective viewpoints: in Apollo 12, it is treated as an EVA milestone and sample return achievement; in Surveyor 3, it is treated as a post-landing historical milestone and materials weathering experiment.
- **Pioneer 10 & 11 Sister Mission References:**
  `DEEP-SPACE/pioneer10.txt` contained paragraphs detailing the launch and trajectory of Pioneer 11 to Saturn.
  - **Handling:** The comparative notes were condensed to contextualize Pioneer 10's design without duplicating a full secondary mission profile.

#### D. Repeated Specifications within the Same Equipment File
In the Apollo Lunar Module files, spacecraft subsystem overviews (descent stage propulsion, ascent engine, RCS modules, silver-zinc batteries) appeared in the general mission overview, and then reappeared verbatim under the individual experiment and landing site coordinate tables.
- **Handling:** Consolidated into Section 3 ("Meet the Technology") of each equipment record to provide a unified, non-redundant engineering overview.

---

### 3. Summary of Deduplication Impact
- **Character / Line Reduction:** Redundant textual repetition was eliminated, reducing file bloat while expanding the depth and clarity of the unique information retained.
- **Data Integrity:** Zero unique historical facts, technical metrics, or scientific findings were lost during deduplication.
