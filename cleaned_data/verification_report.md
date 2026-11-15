# Data Verification & Source Audit Report
## Space Heritage Explorer — Step 2

### 1. Overview
This report identifies all data points across the 13 cleaned equipment entries that lack direct traceable web citations, stem from incomplete source documents, or require authoritative archival verification prior to downstream production use.

---

### 2. Information Requiring Verification

#### A. Entries with General-Knowledge Additions (Explicitly Disclaimed in Sources)
1. **Pioneer 10 (`DEEP-SPACE/pioneer10.txt`):**
   - **Disclaimer in Source:** Part 2 of the raw file states: *"Added from general knowledge; figures are approximate and worth verifying against NASA sources before citing."*
   - **Items Requiring Verification:**
     - Final distance at last contact (~80 AU / 12 billion km).
     - Trajectory vector toward Aldebaran (estimated transit time: ~2 million years).
     - Specific magnitude of the Pioneer Anomaly constant sunward acceleration ($8.74 \times 10^{-10}\text{ m/s}^2$).
     - Specific power decay figures for the SNAP-19 RTGs (155 W at launch to ~65 W in later mission).

2. **NEAR Shoemaker (`DEEP-SPACE/near_shoemaker.txt`):**
   - **Disclaimer in Source:** Part 2 states: *"Compiled from general knowledge. Verify exact figures against NASA/APL sources before relying on them."*
   - **Items Requiring Verification:**
     - Launch mass breakdown (805 kg total / 318 kg fuel / 487 kg dry mass).
     - Exact dimensions of 433 Eros ($34 \times 11 \times 11\text{ km}$).
     - Date and closest approach distance for Asteroid 253 Mathilde flyby (June 27, 1997, at 1,212 km).
     - Touchdown impact velocity estimate (~1.5 to 1.8 m/s).

#### B. Incomplete Source Documents & Truncated Files
1. **Pioneer 10 Missing PDF Pages:**
   - The original uploaded document contained only pages 2, 5, 6, 8, 9, 10, and 11 of 12.
   - Pages 1, 3, 4, 7, and 12 were missing from the raw capture, leaving gaps in the original mission specification tables.
2. **Ingenuity Mars Helicopter Truncated OCR:**
   - Converted via OCR from an image-only PDF with explicit notes that items were cut off on the physical page prints (marked as `[truncated]` in raw text).
   - Items requiring check against official JPL flight logs: exact rotor RPM operating envelope during winter high-speed flights (2,400–2,700 RPM) and full text of the SkyFall technology successor announcement.
3. **Surveyor 3 Incomplete Technical Metadata:**
   - The primary NASA Science mission webpage lacked standard header specification fields (Alternate Names, Dimensions, Power System wattage, and Mission Profile section).

#### C. Inaccessible URLs and Scraping Failures (Server Errors)
During the initial raw collection phase, several NASA NSSDCA database queries failed with standard error pages (`"An error has occurred. Please search again."`):
- **Apollo 11:**
  - `1969-059C-01` (Lunar Field Geology)
  - `1969-059C-02` (Solar Wind Composition)
  - `1969-059C-03` (Passive Seismic Experiment)
  - `1969-059C-06` (Soil Mechanics)
- **Apollo 12:**
  - `1969-099C-01` (Geologic Samples)
  - `1969-099C-04` (Lunar Surface Magnetometer)
  - `1969-099C-06` (Cold Cathode Ion Gauge individual page)
  - `1969-099C-07` (Lunar Dust Detector)
- **Apollo 12 Surveyor 3 Analysis Report:**
  - FTP URL `http://nssdcftp.gsfc.nasa.gov/miscellaneous/documents/b16023.pdf` failed with a server redirect error.

*Note:* Basic functional descriptions of these experiments were successfully preserved from the master spacecraft mission overviews, but individual experiment catalog pages should be re-queried if deeper instrument sub-assembly schematics are needed.

#### D. Obvious Typographical Errors in Official NASA Releases
1. **Pathfinder Atmospheric Temperature:** NASA Status Report of July 4, 1997, cites: *"minus 220 degrees Kelvin (-64°F)"*. This is physically impossible; absolute zero is 0 K. It is clearly a typographical error for 220 K (which equals -53.15°C or -63.67°F).
2. **Viking Lander Mass Table:** Displays *"Mass: 2.2 pounds (657 kilograms)"*. This is an obvious typographical or unit error for landed dry mass (~1,448 lb / 657 kg).
3. **Pioneer 10 Image Date Span:** PDF text states *"Between Nov. 6 and 31 Dec. 31"*, which has a duplicated day number ("31 Dec. 31").
