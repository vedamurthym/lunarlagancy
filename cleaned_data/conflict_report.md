# Conflicting Information & Discrepancies Report
## Space Heritage Explorer — Step 2

### 1. Overview
Per the project guidelines, no conflicting facts were silently resolved or modified. Where authoritative NASA pages, mission journals, or catalog records presented differing figures, dates, or coordinates, both values were preserved and catalogued below for systematic verification.

---

### 2. Itemized Conflicts & Sources

#### A. Apollo 11 Lunar Module
| Item in Conflict | Value 1 (Source A) | Value 2 (Source B) | Notes & Context |
| :--- | :--- | :--- | :--- |
| **Ascent Stage Jettison Time** | **22 July 1969, 00:01:01 UT**<br>*(NSSDCA Main Page 1969-059C)* | **21 July 1969, 23:41 UT (7:41 PM EDT)**<br>*(NSSDCA "Where Are They Now?" page)* | Represents a 20-minute difference in recorded separation/jettison timestamps between mission logs. |
| **Surface EVA Duration** | **1 hour 41 minutes (Aldrin) / +12 min (Armstrong)**<br>*(NSSDCA Main Page Mission Profile)* | **2 hours 32 minutes total (2:15 for Aldrin)**<br>*(NASA 25th Anniversary Apollo 11 Page)* | Discrepancy arises from measuring time between hatch opening to hatch closure vs. boots-on-the-ground duration. |
| **Landing Time (EDT)** | **4:17:40 PM EDT (20:17:40 UT)**<br>*(NSSDCA Main Spacecraft Record)* | **4:18 PM EDT**<br>*(NASA 25th Anniversary Summary)* | Simple rounding to the nearest minute in anniversary public release. |
| **Splashdown Time** | **12:50:35 PM EDT (16:50:35 UT)**<br>*(Apollo 11 Overview Page)* | **12:50 PM EDT**<br>*(Apollo 11 Image / Caption Page)* | Precision seconds omitted in summary text. |

#### B. Apollo 12 Lunar Module
| Item in Conflict | Value 1 (Source A) | Value 2 (Source B) | Notes & Context |
| :--- | :--- | :--- | :--- |
| **ALSEP Central Station Coordinates** | **3.0094° S, 23.4246° W**<br>*(NSSDCA Main Page & Instrument Pages)* | **-3.0098° S, -23.4249° W**<br>*(NSSDCA Landing Site Coordinates / LRO DE421)* | Nominal astronaut-reported coordinates vs. high-precision Lunar Reconnaissance Orbiter optical photogrammetry. |
| **LM Impact Site Longitude** | **338.80° E**<br>*(Apollo 12 Main Mission Profile)* | **21.20° W**<br>*(Apollo Impact Sites Table & "Where Are They Now?")* | Mathematically identical in a 360° coordinate system ($360^\circ - 338.80^\circ = 21.20^\circ\text{ W}$), but formatted under differing planetary coordinate standards. |

#### C. Mars Exploration Rovers: Spirit & Opportunity
| Item in Conflict | Value 1 (Source A) | Value 2 (Source B) | Notes & Context |
| :--- | :--- | :--- | :--- |
| **Rover Mass** | **405 lb (185 kg)**<br>*(Spirit NASA Science Mission Page)* | **408 lb (185 kg)**<br>*(Opportunity NASA Science Mission Page)* | Both pages list identical metric mass (185 kg), but imperial conversion diverges by 3 pounds in NASA's specification tables. |
| **Opportunity Touchdown Date** | **Jan. 24, 2004 (PST)**<br>*(MER Flight Operations Log / In-Depth)* | **Jan. 25, 2004 (UTC)**<br>*(NSSDCA Master Catalog & UTC Log)* | Standard time-zone boundary crossover ($21:05\text{ PST Jan 24} = 04:54\text{ UTC Jan 25}$). |
| **Lunokhod 2 Distance Benchmark** | **24 miles (39 km) / 25.01 miles (40.25 km)**<br>*(Historical Soviet official claim)* | **Up to 26 miles (42 km)**<br>*(Russian analysis of LRO images cited on page)* | Comparison cited when evaluating Opportunity's off-world driving record. |

#### D. Mars Pathfinder
| Item in Conflict | Value 1 (Source A) | Value 2 (Source B) | Notes & Context |
| :--- | :--- | :--- | :--- |
| **Lander Image Count** | **More than 16,500 lander images**<br>*(Main NASA Science Pathfinder Page)* | **More than 16,000 lander images**<br>*(NASA "Winds Down" Release, Nov. 1997)* | Preliminary wind-down tally vs. final processed image catalog. |
| **Atmospheric Temperature Reading** | **Minus 220 degrees Kelvin (-64°F)**<br>*(NASA Status Report, July 4, 1997)* | **Physical Fact: ~220 Kelvin (-53°C / -64°F)** | Obvious typo in original NASA press release text ("minus 220 degrees Kelvin" is physically impossible; absolute zero is 0 K). Preserved as original quotation and flagged. |

#### E. Viking 1 & 2
| Item in Conflict | Value 1 (Source A) | Value 2 (Source B) | Notes & Context |
| :--- | :--- | :--- | :--- |
| **Lander Mass OCR Glitch** | **2.2 pounds (657 kilograms)**<br>*(Viking Tech Specs Table)* | **2,156 pounds (978 kg) separated / 657 kg landed dry mass**<br>*(Narrative text)* | Clear copy-paste or OCR omission of digits (likely meant ~1,448 lb / 657 kg, or 2.2 tons). Flagged for verification. |
| **Viking 1 Landing Date (Planned vs Actual)** | **July 4, 1976 (Planned Touchdown)**<br>*(Viking Pre-launch Press Kits)* | **July 20, 1976 (Actual Touchdown)**<br>*(Mission Flight Records)* | Touchdown was delayed by 16 days to search for a smoother landing site. |
| **Viking 1 Landing Coordinates** | **22.483° N, 47.94° W**<br>*(science.nasa.gov mission page)* | **22.27° N, 47.95° W**<br>*(NSSDCA master database)* | Mapping reference frame updates between 1976 navigation grids and modern IAU planetocentric cartography. |
| **Viking 2 Touchdown Longitude Standard** | **225.71° W**<br>*(Viking Lander 2 flight log)* | **134.29° E**<br>*(IAU Planetocentric standard)* | Coordinate standard equivalence ($360^\circ - 225.71^\circ = 134.29^\circ$). |
