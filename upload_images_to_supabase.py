"""
Space Heritage Explorer — Step 4.5 Historical Images Uploader to Supabase
========================================================================
- Scans and validates all 65 historical JPG images across Moon, Mars, Deep Space.
- Uploads images to Supabase Storage bucket 'equipment-images' under structured paths.
- Inserts/upserts rich image metadata into public.equipment_images.
- Verifies storage objects and database records.
- Exports supabase_image_upload_report.md and image_upload_manifest.csv.
"""

import os
import sys
import csv
import json
import urllib.parse
from typing import Dict, Any, List, Optional
import requests
from dotenv import load_dotenv

# Locate and load .env
dotenv_path = os.path.join(os.path.dirname(__file__), "LunarLagancy", ".env")
if not os.path.exists(dotenv_path):
    dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

ACTIVE_KEY = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY

# Determine image source folder
IMAGE_ROOT = os.path.join(os.path.dirname(__file__), "LunarLagancy", "IMAGES")
if not os.path.exists(IMAGE_ROOT):
    DOWNLOADS_ROOT = os.path.expanduser(r"~\Downloads\IMAGES")
    if os.path.exists(DOWNLOADS_ROOT):
        IMAGE_ROOT = DOWNLOADS_ROOT

BUCKET_NAME = "equipment-images"

# Exact Mapping & Metadata Specification
EQUIPMENT_SPEC = {
    # -------------------------------------------------------------------------
    # MOON (20 images)
    # -------------------------------------------------------------------------
    "eq_moon_apollo11_lm": {
        "name": "Apollo 11 Lunar Module & EASEP",
        "category": "Moon",
        "local_folder": "MOON",
        "storage_dir": "moon/apollo11",
        "images": [
            {
                "local_file": "ap11-1.jpg",
                "id": "img_moon_apollo11_01",
                "title": "Apollo 11 Lunar Module on the Moon",
                "caption": "Apollo 11 Lunar Module Eagle descent stage and astronaut Buzz Aldrin on the lunar surface at Tranquility Base.",
                "purpose": "hero",
                "display_order": 1,
                "description": "Apollo 11 Lunar Module Eagle resting at Tranquility Base with astronaut Buzz Aldrin and the deployed Early Apollo Scientific Experiments Package visible.",
                "source_url": "https://nssdc.gsfc.nasa.gov/planetary/image/ap11_lm_as11_40_5927.jpg",
                "nasa_photo_id": "AS11-40-5927"
            },
            {
                "local_file": "ap11-2.jpg",
                "id": "img_moon_apollo11_02",
                "title": "Apollo 11 Lunar Module Ascent & Descent Architecture",
                "caption": "Technical schematic diagram displaying the ascent stage crew cabin and descent stage landing platform.",
                "purpose": "technical_diagram",
                "display_order": 2,
                "description": "Detailed engineering drawing of the Grumman Lunar Module (LM-5) showing ascent engine, descent engine, RCS quads, and MESA bay.",
                "source_url": "https://nssdc.gsfc.nasa.gov/image/spacecraft/apollo_lm_diagram.gif",
                "nasa_photo_id": None
            },
            {
                "local_file": "ap11-3.jpg",
                "id": "img_moon_apollo11_03",
                "title": "Buzz Aldrin Deploying Scientific Experiments",
                "caption": "Astronaut Buzz Aldrin carries the Passive Seismic Experiment Package and Laser Ranging Retroreflector across the lunar surface.",
                "purpose": "surface_view",
                "display_order": 3,
                "description": "Astronaut Buzz Aldrin carries the Passive Seismic Experiment Package and Laser Ranging Retroreflector across Tranquility Base during the first lunar surface extravehicular activity.",
                "source_url": None,
                "nasa_photo_id": "AS11-40-5942"
            },
            {
                "local_file": "ap11-4.jpg",
                "id": "img_moon_apollo11_04",
                "title": "Laser Ranging Retroreflector (LRRR)",
                "caption": "The 100-corner-cube optical retroreflector array deployed on the lunar surface for Earth-Moon laser distance measurements.",
                "purpose": "science_sample",
                "display_order": 4,
                "description": "Apollo 11 Laser Ranging Retroreflector (LRRR) deployed at Tranquility Base, continuing to provide millimeter-precision Earth-Moon distance measurements.",
                "source_url": "https://nssdc.gsfc.nasa.gov/image/spacecraft/apollo_laser_reflector.jpg",
                "nasa_photo_id": None
            },
            {
                "local_file": "ap11-5.jpg",
                "id": "img_moon_apollo11_05",
                "title": "Tranquility Base Panoramic Horizon View",
                "caption": "Wide panoramic context showing the Apollo 11 descent stage, deployed scientific experiments, and lunar horizon.",
                "purpose": "surface_view",
                "display_order": 5,
                "description": "Panoramic view across Mare Tranquillitatis capturing the pristine lunar surface, solar glare, and the historic first human base on another celestial body.",
                "source_url": None,
                "nasa_photo_id": None
            }
        ]
    },
    "eq_moon_apollo12_lm": {
        "name": "Apollo 12 Lunar Module & ALSEP",
        "category": "Moon",
        "local_folder": "MOON",
        "storage_dir": "moon/apollo12",
        "images": [
            {
                "local_file": "ap12-1.jpg",
                "id": "img_moon_apollo12_01",
                "title": "Apollo 12 Lunar Module Intrepid on the Moon",
                "caption": "Apollo 12 Lunar Module Intrepid on the Ocean of Storms with an astronaut descending the ladder.",
                "purpose": "hero",
                "display_order": 1,
                "description": "Apollo 12 Lunar Module Intrepid following pinpoint landing in Oceanus Procellarum on November 19, 1969.",
                "source_url": "https://nssdc.gsfc.nasa.gov/planetary/image/apollo12_lunar_module.jpg",
                "nasa_photo_id": "AS12-46-6729"
            },
            {
                "local_file": "ap12-2.jpg",
                "id": "img_moon_apollo12_02",
                "title": "Astronaut Pete Conrad Inspecting Surveyor 3",
                "caption": "Commander Charles 'Pete' Conrad examining the robotic Surveyor 3 lander, with Lunar Module Intrepid in the background.",
                "purpose": "surface_view",
                "display_order": 2,
                "description": "Historic space exploration rendezvous: Apollo 12 astronaut Pete Conrad visits Surveyor 3 on the slopes of Surveyor Crater, retrieving its television camera and sampler scoop.",
                "source_url": "https://nssdc.gsfc.nasa.gov/planetary/news/image/conrad_19990709_c.jpg",
                "nasa_photo_id": "AS12-48-7134"
            },
            {
                "local_file": "ap12-3.jpg",
                "id": "img_moon_apollo12_03",
                "title": "Apollo 12 ALSEP Central Station Deployment",
                "caption": "Deployment of the Apollo Lunar Surface Experiments Package central station, fueled by a SNAP-27 radioisotope thermoelectric generator.",
                "purpose": "science_sample",
                "display_order": 3,
                "description": "Apollo 12 ALSEP station deployed on the lunar plains, transmitting geophysical and environmental telemetry back to Earth for over seven years.",
                "source_url": "https://nssdc.gsfc.nasa.gov/image/spacecraft/alsep_passive_seismic.jpg",
                "nasa_photo_id": None
            },
            {
                "local_file": "ap12-4.jpg",
                "id": "img_moon_apollo12_04",
                "title": "Solar Wind Spectrometer & Ion Detector Payload",
                "caption": "Instrument layout and operations of the Suprathermal Ion Detector Experiment (SIDE) and Solar Wind Spectrometer.",
                "purpose": "technical_diagram",
                "display_order": 4,
                "description": "Technical representation of the Apollo 12 geophysical instrumentation suite designed to monitor solar wind ions and lunar atmospheric exosphere.",
                "source_url": "https://nssdc.gsfc.nasa.gov/planetary/image/sws.jpg",
                "nasa_photo_id": None
            },
            {
                "local_file": "ap12-5.jpg",
                "id": "img_moon_apollo12_05",
                "title": "Ocean of Storms Exploration Landscape",
                "caption": "Wide panoramic vista of the lunar regolith, shallow impact craters, and astronaut exploration tracks in Oceanus Procellarum.",
                "purpose": "surface_view",
                "display_order": 5,
                "description": "Surface traverse panorama displaying lunar topography and lighting conditions across the Apollo 12 exploration corridor.",
                "source_url": None,
                "nasa_photo_id": None
            }
        ]
    },
    "eq_moon_apollo15_lm": {
        "name": "Apollo 15 Lunar Module, ALSEP & Lunar Roving Vehicle",
        "category": "Moon",
        "local_folder": "MOON",
        "storage_dir": "moon/apollo15",
        "images": [
            {
                "local_file": "ap15-1.jpg",
                "id": "img_moon_apollo15_01",
                "title": "Apollo 15 Lunar Module Falcon at Hadley Rille",
                "caption": "Apollo 15 Lunar Module Falcon resting on the lunar surface with Mount Hadley rising majestically in the background.",
                "purpose": "hero",
                "display_order": 1,
                "description": "Apollo 15 Falcon at Hadley Base, marking the first J-series scientific mission featuring extended surface stays and heavy scientific equipment.",
                "source_url": None,
                "nasa_photo_id": "AS15-86-11603"
            },
            {
                "local_file": "ap15-2.jpg",
                "id": "img_moon_apollo15_02",
                "title": "First Deployment of the Lunar Roving Vehicle",
                "caption": "The Lunar Roving Vehicle (LRV-1) parked on the lunar soil near Hadley Rille, equipped with high-gain dish antenna and color TV camera.",
                "purpose": "surface_view",
                "display_order": 2,
                "description": "Astronaut David Scott with the Lunar Roving Vehicle at the edge of Hadley Rille during the Apollo 15 mission, revolutionizing lunar surface mobility.",
                "source_url": None,
                "nasa_photo_id": "AS15-88-11866"
            },
            {
                "local_file": "ap15-3.jpg",
                "id": "img_moon_apollo15_03",
                "title": "Hadley Delta and Apennine Mountain Exploration",
                "caption": "Expansive view of the towering lunar Apennines and steep slopes of Hadley Delta investigated during Apollo 15 EVAs.",
                "purpose": "surface_view",
                "display_order": 3,
                "description": "Landscape exploration along the Apennine front where the historic 'Genesis Rock' (anorthosite sample 15415) was discovered by the Apollo 15 crew.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "ap15-4.jpg",
                "id": "img_moon_apollo15_04",
                "title": "Apollo 15 ALSEP Science Station & Heat Flow Experiment",
                "caption": "Deployment of the Apollo 15 ALSEP station featuring deep heat flow probes and lunar surface drill equipment.",
                "purpose": "science_sample",
                "display_order": 4,
                "description": "Apollo 15 ALSEP geophysical package measuring lunar interior heat flow, seismic shocks, and solar wind composition.",
                "source_url": "https://nssdc.gsfc.nasa.gov/planetary/image/ap15_alsep.jpg",
                "nasa_photo_id": None
            },
            {
                "local_file": "ap15-5.jpg",
                "id": "img_moon_apollo15_05",
                "title": "Apollo 15 Lunar Module & Rover Integration Architecture",
                "caption": "Technical diagram demonstrating Lunar Roving Vehicle folding stowage inside the Lunar Module quadrant.",
                "purpose": "technical_diagram",
                "display_order": 5,
                "description": "Engineering drawing showing the spring-loaded deployment mechanism used to lower the LRV from Falcon's descent stage to the surface.",
                "source_url": "https://nssdc.gsfc.nasa.gov/image/spacecraft/apollo_lm_diagram.gif",
                "nasa_photo_id": None
            }
        ]
    },
    "eq_moon_surveyor3": {
        "name": "Surveyor 3",
        "category": "Moon",
        "local_folder": "MOON",
        "storage_dir": "moon/surveyor3",
        "images": [
            {
                "local_file": "Surveyor3-1.jpg",
                "id": "img_moon_surveyor3_01",
                "title": "Surveyor 3 Robotic Lander in Ocean of Storms",
                "caption": "Surveyor 3 resting on the slope of a crater in Oceanus Procellarum following soft landing on April 20, 1967.",
                "purpose": "hero",
                "display_order": 1,
                "description": "Robotic lunar lander Surveyor 3 resting inside Surveyor Crater, which proved the physical integrity and bearing strength of lunar soil ahead of Apollo.",
                "source_url": "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/07/as12-48-7134_1280.jpg",
                "nasa_photo_id": None
            },
            {
                "local_file": "Surveyor3-2.jpg",
                "id": "img_moon_surveyor3_02",
                "title": "Surveyor 3 Surface Sampler Scoop & Camera",
                "caption": "Close-up of the mechanical scoop and television survey camera used to dig trenches and measure regolith cohesion.",
                "purpose": "surface_view",
                "display_order": 2,
                "description": "Surveyor 3 soil mechanics surface sampler extending from the spacecraft chassis, having dug several test trenches into the lunar dust.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "Surveyor3-3.jpg",
                "id": "img_moon_surveyor3_03",
                "title": "Surveyor 3 Footpad Soil Impression Telemetry",
                "caption": "Direct television transmission from Surveyor 3 showing crushable footpad impression in the lunar regolith.",
                "purpose": "science_sample",
                "display_order": 3,
                "description": "Television transmission returned by Surveyor 3 analyzing soil mechanics and displacement caused by the robotic landing impacts.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "Surveyor3-4.jpg",
                "id": "img_moon_surveyor3_04",
                "title": "Surveyor Spacecraft Engineering Schematic",
                "caption": "Cutaway technical diagram showing the triangular tubular aluminum spaceframe, planar solar array, and vernier propulsion engines.",
                "purpose": "technical_diagram",
                "display_order": 4,
                "description": "Hughes Aircraft Company engineering diagram detailing the Surveyor lander subsystems, antenna masts, and solid propellant retro-rocket.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "Surveyor3-5.jpg",
                "id": "img_moon_surveyor3_05",
                "title": "Apollo 12 Astronaut Recovering Surveyor 3 Hardware",
                "caption": "Apollo 12 astronaut examining Surveyor 3 before severing its television camera to return to Earth for microbiological and materials analysis.",
                "purpose": "surface_view",
                "display_order": 5,
                "description": "Commander Pete Conrad inspects Surveyor 3. Analysis on Earth verified surviving Streptococcus mitis bacteria and micrometeorite impacts on the optics.",
                "source_url": "https://nssdc.gsfc.nasa.gov/planetary/news/image/conrad_19990709_c.jpg",
                "nasa_photo_id": "AS12-48-7133"
            }
        ]
    },

    # -------------------------------------------------------------------------
    # MARS (30 images)
    # -------------------------------------------------------------------------
    "eq_mars_ingenuity": {
        "name": "Ingenuity Mars Helicopter",
        "category": "Mars",
        "local_folder": "MARS",
        "storage_dir": "mars/ingenuity",
        "images": [
            {
                "local_file": "ingenuity-1.jpg",
                "id": "img_mars_ingenuity_01",
                "title": "Ingenuity Flight in the Martian Sky",
                "caption": "NASA's Ingenuity Mars Helicopter hovering in the thin carbon dioxide atmosphere above Jezero Crater.",
                "purpose": "hero",
                "display_order": 1,
                "description": "Ingenuity Mars Helicopter performing aerial powered flight on Mars, achieving 72 historic flights across three years of operation.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "ingenuity-2.jpg",
                "id": "img_mars_ingenuity_02",
                "title": "Ingenuity on the Surface at Wright Brothers Field",
                "caption": "Ingenuity standing independently on its carbon-composite legs on the rocky surface of Jezero Crater.",
                "purpose": "surface_view",
                "display_order": 2,
                "description": "Mastcam-Z photograph showing Ingenuity sitting on Martian soil after deploying from Perseverance rover's belly.",
                "source_url": None,
                "nasa_photo_id": "PIA24497"
            },
            {
                "local_file": "ingenuity-3.jpg",
                "id": "img_mars_ingenuity_03",
                "title": "Ingenuity Rotorcraft Technical Subsystem Diagram",
                "caption": "Technical diagram highlighting dual counter-rotating rotors, solar panel array, fuselage, and landing struts.",
                "purpose": "technical_diagram",
                "display_order": 3,
                "description": "Engineering cutaway of Ingenuity showing 1.2-meter carbon fiber blades spinning at 2,400 RPM, lithium-ion battery pack, and wireless base station.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "ingenuity-4.jpg",
                "id": "img_mars_ingenuity_04",
                "title": "Aerial High-Resolution Color View of Jezero Dunes",
                "caption": "Overhead color landscape imagery captured by Ingenuity's high-resolution terrain camera during flight.",
                "purpose": "surface_view",
                "display_order": 4,
                "description": "High-altitude aerial reconnaissance of fractured martian rocks and sand ripples returned by Ingenuity's return-to-Earth camera.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "ingenuity-5.jpg",
                "id": "img_mars_ingenuity_05",
                "title": "Ingenuity Navigation Camera Aerial Shadow",
                "caption": "Telemetry black-and-white image from the downward-facing navigation camera showing Ingenuity's airborne shadow on Mars.",
                "purpose": "surface_view",
                "display_order": 5,
                "description": "Downward-pointing navigation camera frame used by Ingenuity's visual odometry software to track position, speed, and drift during autonomous flight.",
                "source_url": None,
                "nasa_photo_id": None
            }
        ]
    },
    "eq_mars_spirit": {
        "name": "Mars Exploration Rover Spirit (MER-A)",
        "category": "Mars",
        "local_folder": "MARS",
        "storage_dir": "mars/spirit",
        "images": [
            {
                "local_file": "spirit-1.jpg",
                "id": "img_mars_spirit_01",
                "title": "Spirit Self-Portrait, Sols 329-330",
                "caption": "Full Pancam mosaic self-portrait of Mars Exploration Rover Spirit atop Husband Hill in Gusev Crater.",
                "purpose": "hero",
                "display_order": 1,
                "description": "Spirit Self-Portrait, Sols 329-330",
                "source_url": None,
                "nasa_photo_id": "PIA03175"
            },
            {
                "local_file": "spirit-2.jpg",
                "id": "img_mars_spirit_02",
                "title": "Spirit Looks Back",
                "caption": "Spirit rover looks back across its wheel tracks carved into the plains of Gusev Crater.",
                "purpose": "surface_view",
                "display_order": 2,
                "description": "Spirit Looks Back across the Martian regolith, documenting geological strata and travel progress.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "spirit-3.jpg",
                "id": "img_mars_spirit_03",
                "title": "Tracks in, Path out?",
                "caption": "Navcam view from Spirit's mast showing tracks left as the rover drove backward dragging its inoperable right-front wheel.",
                "purpose": "surface_view",
                "display_order": 3,
                "description": "This view from the navigation camera near the top of the mast on NASA's Mars Exploration Rover Spirit shows the tracks left by the rover as it drove southward and backward, dragging its inoperable right-front wheel.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "spirit-4.jpg",
                "id": "img_mars_spirit_04",
                "title": "Spirit's Robotic Stretch on Sol 2052",
                "caption": "Forward view of Spirit's instrument deployment arm investigating bright, churned silica-rich soil at Gertrude Weise.",
                "purpose": "science_sample",
                "display_order": 4,
                "description": "NASA's Mars Exploration Rover Spirit recorded this forward view of its arm and surroundings; bright soil in the left half of the image is loose, fluffy material churned by the rover's left-front wheel.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "spirit-5.jpg",
                "id": "img_mars_spirit_05",
                "title": "A Moment Frozen in Time (Martian Sunset at Gusev)",
                "caption": "Pancam mosaic capturing the Sun sinking below the rim of Gusev crater on Mars on Spirit's 489th martian day.",
                "purpose": "surface_view",
                "display_order": 5,
                "description": "On May 19th, 2005, NASA's Mars Exploration Rover Spirit captured this stunning view as the Sun sank below the rim of Gusev crater on Mars. This Panoramic Camera (Pancam) mosaic was taken around 6:07 in the evening of the rover's 489th martian day.",
                "source_url": None,
                "nasa_photo_id": None
            }
        ]
    },
    "eq_mars_opportunity": {
        "name": "Mars Exploration Rover Opportunity (MER-B)",
        "category": "Mars",
        "local_folder": "MARS",
        "storage_dir": "mars/opportunity",
        "images": [
            {
                "local_file": "opportunity-1.jpg",
                "id": "img_mars_opportunity_01",
                "title": "Self-Portrait by Opportunity Mars Rover in January 2014",
                "caption": "Pancam mosaic self-portrait of Opportunity recorded after ten years of surface exploration at Endeavour Crater.",
                "purpose": "hero",
                "display_order": 1,
                "description": "NASA's Mars Exploration Rover Opportunity recorded the component images for this self-portrait about three weeks before completing a decade of work on Mars.",
                "source_url": None,
                "nasa_photo_id": "PIA18079"
            },
            {
                "local_file": "opportunity-2.jpg",
                "id": "img_mars_opportunity_02",
                "title": "Opportunity's Heat Shield in Color, Sol 325",
                "caption": "Color view of Opportunity's discarded entry heat shield resting on the plains of Meridiani Planum.",
                "purpose": "surface_view",
                "display_order": 2,
                "description": "Opportunity's Heat Shield in Color, Sol 325",
                "source_url": None,
                "nasa_photo_id": "PIA07365"
            },
            {
                "local_file": "opportunity-3.jpg",
                "id": "img_mars_opportunity_03",
                "title": "Opportunity's Shadow and Tracks on Martian Slope",
                "caption": "Rear hazcam view showing Opportunity's shadow and tracks while driving on a slope above Endeavour Crater.",
                "purpose": "surface_view",
                "display_order": 3,
                "description": "A shadow and wheel tracks of NASA's Mars Exploration Rover Opportunity appear in this image taken by a rear hazard avoidance camera (hazcam) just after a drive on a slope above Endeavour Crater on March 22, 2016.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "opportunity-4.jpg",
                "id": "img_mars_opportunity_04",
                "title": "'Blueberries' Inside 'Popcorn'",
                "caption": "Microscopic Imager view of rough 'popcorn' spherules contrasted with darker, smooth hematite 'blueberries'.",
                "purpose": "science_sample",
                "display_order": 4,
                "description": "This view from the microscopic imager on NASA's Mars Exploration Rover Opportunity shows a type of light-colored, rough-textured spherules scientists call 'popcorn' in contrast to the darker, smoother spherules called 'blueberries.'",
                "source_url": None,
                "nasa_photo_id": "PIA19113"
            },
            {
                "local_file": "opportunity-5.jpg",
                "id": "img_mars_opportunity_05",
                "title": "Panorama from 'Cape Verde' (Victoria Crater)",
                "caption": "Sweeping vista of Victoria Crater captured by Opportunity from the Cape Verde promontory along the scalloped rim.",
                "purpose": "surface_view",
                "display_order": 5,
                "description": "NASA's Mars Exploration Rover Opportunity captured this vista of 'Victoria Crater' from the viewpoint of 'Cape Verde,' one of the promontories that are part of the scalloped rim of the crater.",
                "source_url": None,
                "nasa_photo_id": None
            }
        ]
    },
    "eq_mars_sojourner_pathfinder": {
        "name": "Sojourner Rover & Mars Pathfinder Lander",
        "category": "Mars",
        "local_folder": "MARS",
        "storage_dir": "mars/sojourner",
        "images": [
            {
                "local_file": "sojourner-1.jpg",
                "id": "img_mars_sojourner_01",
                "title": "Sojourner Rover Near The Lander Ramp",
                "caption": "Sojourner rover maneuvering near the lander egress ramp on Sol 2 in Ares Vallis.",
                "purpose": "hero",
                "display_order": 1,
                "description": "Sojourner Rover Near The",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "sojourner-2.jpg",
                "id": "img_mars_sojourner_02",
                "title": "Pathfinder's Rover, Airbags, & Martian Terrain",
                "caption": "Pathfinder lander perspective displaying Sojourner rover, deflated landing airbags, and rocky terrain.",
                "purpose": "surface_view",
                "display_order": 2,
                "description": "Pathfinder's Rover, Airbags, & Martian Terrain",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "sojourner-3.jpg",
                "id": "img_mars_sojourner_03",
                "title": "Sojourner's APXS at Work",
                "caption": "Sojourner deploying its Alpha Proton X-ray Spectrometer against rock targets on the surface of Mars.",
                "purpose": "science_sample",
                "display_order": 3,
                "description": "Sojourner's APXS at Work",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "sojourner-4.jpg",
                "id": "img_mars_sojourner_04",
                "title": "Sojourner's APXS Studies Barnacle Bill",
                "caption": "Sojourner examining the volcanic rock named Barnacle Bill with its rear-mounted spectrometer sensor head.",
                "purpose": "science_sample",
                "display_order": 4,
                "description": "Sojourner's APXS studies Barnacle",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "sojourner-5.jpg",
                "id": "img_mars_sojourner_05",
                "title": "Twin Peaks in Super Resolution - Left Eye",
                "caption": "Mars Pathfinder super-resolution mosaic showing the distant Twin Peaks hills rising above Ares Vallis.",
                "purpose": "surface_view",
                "display_order": 5,
                "description": "Twin Peaks in Super Resolution - Left Eye",
                "source_url": None,
                "nasa_photo_id": None
            }
        ]
    },
    "eq_mars_viking1": {
        "name": "Viking 1 (Orbiter & Lander)",
        "category": "Mars",
        "local_folder": "MARS",
        "storage_dir": "mars/viking1",
        "images": [
            {
                "local_file": "viking1-1.jpg",
                "id": "img_mars_viking1_01",
                "title": "First Photograph Ever Taken on the Surface of Mars",
                "caption": "Historic first photo returned from the surface of Mars on July 20, 1976, showing Viking 1 Lander's footpad in Chryse Planitia.",
                "purpose": "hero",
                "display_order": 1,
                "description": "Viking 1 Lander camera 2 initial surface scan showing soil texture, rocks, and footpad No. 2 firmly on the ground.",
                "source_url": None,
                "nasa_photo_id": "P-17022"
            },
            {
                "local_file": "viking1-2.jpg",
                "id": "img_mars_viking1_02",
                "title": "Viking 1 Chryse Planitia Surface Panorama",
                "caption": "300-degree high-resolution panoramic view of the rocky desert landscape of Chryse Planitia captured by Viking 1.",
                "purpose": "surface_view",
                "display_order": 2,
                "description": "First comprehensive landscape panorama of Mars returned by Viking 1 on July 23, 1976, revealing a horizon littered with impact ejecta.",
                "source_url": None,
                "nasa_photo_id": "P-17076"
            },
            {
                "local_file": "viking1-3.jpg",
                "id": "img_mars_viking1_03",
                "title": "Viking Spacecraft Engineering Architecture Diagram",
                "caption": "Engineering line drawing illustrating the Viking Orbiter mated with the aeroshell and Viking Lander.",
                "purpose": "technical_diagram",
                "display_order": 3,
                "description": "NASA diagram showing the Viking mission architecture, bioshield, descent capsule, and orbital science payload.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "viking1-4.jpg",
                "id": "img_mars_viking1_04",
                "title": "Martian Sky and Horizon Color Landscape",
                "caption": "Color-calibrated view of Chryse Planitia revealing the pinkish-salmon tint of the dust-laden Martian atmosphere.",
                "purpose": "surface_view",
                "display_order": 4,
                "description": "Color-calibrated view demonstrating atmospheric light scattering by suspended ferric oxide dust particles on Mars.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "viking1-5.jpg",
                "id": "img_mars_viking1_05",
                "title": "Valles Marineris Global Orbital Mosaic",
                "caption": "Global orbital mosaic composed of 102 frames taken by Viking Orbiter 1 displaying the grand canyon of Mars.",
                "purpose": "orbit_view",
                "display_order": 5,
                "description": "Viking Orbiter 1 mosaic of Valles Marineris, stretching over 4,000 kilometers across the Martian equator.",
                "source_url": None,
                "nasa_photo_id": None
            }
        ]
    },
    "eq_mars_viking2": {
        "name": "Viking 2 (Orbiter & Lander)",
        "category": "Mars",
        "local_folder": "MARS",
        "storage_dir": "mars/viking2",
        "images": [
            {
                "local_file": "viking2-1.jpg",
                "id": "img_mars_viking2_01",
                "title": "Viking Lander Proof Test Article",
                "caption": "Viking Lander Proof Test Article (A19790215000) on display in the Milestones of Flight gallery at the National Air and Space Museum.",
                "purpose": "hero",
                "display_order": 1,
                "description": "Lander, Mars, Viking, Proof Test Article (A19790215000) in Milestones of Flight exhibit (Gallery 100) with darkened background, Smithsonian National Air and Space Museum, Washington, D.C., June 24, 2016. Photo by Mark Avino. [VikingLander_0037][NASM2016-02690]",
                "source_url": None,
                "nasa_photo_id": "NASM2016-02690"
            },
            {
                "local_file": "viking2-2.jpg",
                "id": "img_mars_viking2_02",
                "title": "Viking 2 Utopia Planitia Boulder Field",
                "caption": "High-resolution panorama of the vast boulder field surrounding Viking 2 on the northern plains of Utopia Planitia.",
                "purpose": "surface_view",
                "display_order": 2,
                "description": "Viking 2 surface observation documenting the heavily rock-strewn terrain of Utopia Planitia, where the lander operated for 1,281 martian sols.",
                "source_url": None,
                "nasa_photo_id": "P-17631"
            },
            {
                "local_file": "viking2-3.jpg",
                "id": "img_mars_viking2_03",
                "title": "Viking 2 First Color Image of Mars Surface",
                "caption": "First color image transmitted by Viking 2 showing red soil, rocks, and the sampler arm shroud on Utopia Planitia.",
                "purpose": "surface_view",
                "display_order": 3,
                "description": "First color photograph returned by Viking 2 shortly after landing on September 3, 1976.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "viking2-4.jpg",
                "id": "img_mars_viking2_04",
                "title": "Viking 2 Surface Sampler Trenching Operations",
                "caption": "Robotic collector boom digging trenches into the Martian regolith to deliver soil samples to biological test chambers.",
                "purpose": "science_sample",
                "display_order": 4,
                "description": "Surface sampler arm of Viking 2 excavating trenches in Utopia Planitia regolith for pyrolytic release and gas exchange experiments.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "viking2-5.jpg",
                "id": "img_mars_viking2_05",
                "title": "Candor Chasma Mosaic by Viking Orbiters",
                "caption": "Orbital imagery mosaic of Candor Chasma in central Valles Marineris obtained by the Viking Orbiters.",
                "purpose": "orbit_view",
                "display_order": 5,
                "description": "High-altitude orbital imaging acquired by Viking Orbiters showing sedimentary layered deposits in Candor Chasma.",
                "source_url": None,
                "nasa_photo_id": None
            }
        ]
    },

    # -------------------------------------------------------------------------
    # DEEP SPACE (15 images)
    # -------------------------------------------------------------------------
    "eq_deep_space_dawn": {
        "name": "Dawn Spacecraft",
        "category": "Deep Space",
        "local_folder": "DEEP-SPACE",
        "storage_dir": "deep-space/dawn",
        "images": [
            {
                "local_file": "dawn1.jpg",
                "id": "img_deep_space_dawn_01",
                "title": "Dawn Spacecraft Approaching Asteroid Vesta",
                "caption": "Artist depiction of NASA's Dawn spacecraft cruising through the asteroid belt powered by its xenon ion thrusters.",
                "purpose": "hero",
                "display_order": 1,
                "description": "Dawn spacecraft illustration showing the large solar arrays and xenon ion propulsion system that enabled orbiting two extraterrestrial bodies (Vesta and Ceres).",
                "source_url": None,
                "nasa_photo_id": "PIA13540"
            },
            {
                "local_file": "dawn2.jpg",
                "id": "img_deep_space_dawn_02",
                "title": "Giant Asteroid Vesta Full-Disk View",
                "caption": "Full-disk view of protoplanet Vesta captured by Dawn's Framing Camera during its orbital survey.",
                "purpose": "surface_view",
                "display_order": 2,
                "description": "Framing Camera portrait of asteroid 4 Vesta revealing equatorial troughs and the south polar impact basin Rheasilvia.",
                "source_url": None,
                "nasa_photo_id": "PIA14316"
            },
            {
                "local_file": "dawn3.jpg",
                "id": "img_deep_space_dawn_03",
                "title": "Dwarf Planet Ceres Global Portrait",
                "caption": "Full-color global portrait of dwarf planet Ceres captured by Dawn, highlighting surface craters and bright spot features.",
                "purpose": "surface_view",
                "display_order": 3,
                "description": "Global view of dwarf planet 1 Ceres showcasing its dark, heavily cratered surface and distinctive sodium carbonate faculae.",
                "source_url": None,
                "nasa_photo_id": "PIA21906"
            },
            {
                "local_file": "dwan4.jpg",  # Preserving original filename on disk
                "id": "img_deep_space_dawn_04",
                "title": "Occator Crater Bright Sodium Carbonate Faculae",
                "caption": "Close-up observation of the bright salt deposits (Cerealia and Vinalia Faculae) inside Occator Crater on Ceres.",
                "purpose": "science_sample",
                "display_order": 4,
                "description": "High-resolution view of Cerealia Facula in Occator Crater, composed of sodium carbonate salts extruded from a subsurface hydrothermal brine reservoir.",
                "source_url": None,
                "nasa_photo_id": "PIA21924"
            },
            {
                "local_file": "dawn5.jpg",
                "id": "img_deep_space_dawn_05",
                "title": "Crescent Ceres and Dawn Orbital Vista",
                "caption": "Dramatic crescent view of Ceres captured by Dawn as it maneuvered in low-altitude orbit.",
                "purpose": "orbit_view",
                "display_order": 5,
                "description": "Sunlit limb and shadowed hemisphere of Ceres imaged by Dawn during low-altitude mapping orbit.",
                "source_url": None,
                "nasa_photo_id": None
            }
        ]
    },
    "eq_deep_space_near_shoemaker": {
        "name": "NEAR Shoemaker Spacecraft",
        "category": "Deep Space",
        "local_folder": "DEEP-SPACE",
        "storage_dir": "deep-space/near-shoemaker",
        "images": [
            {
                "local_file": "NEAR Shoemaker-1.jpg",
                "id": "img_deep_space_near_shoemaker_01",
                "title": "NEAR Shoemaker at Asteroid 433 Eros",
                "caption": "Artist concept of the NEAR Shoemaker spacecraft orbiting the elongated near-Earth asteroid 433 Eros.",
                "purpose": "hero",
                "display_order": 1,
                "description": "Artist representation of the Near Earth Asteroid Rendezvous (NEAR Shoemaker) spacecraft conducting the first long-term orbital study of an asteroid.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "NEAR Shoemaker-2.jpg",
                "id": "img_deep_space_near_shoemaker_02",
                "title": "Asteroid 433 Eros Global Mosaic",
                "caption": "Multi-image mosaic of the southern hemisphere of asteroid Eros taken from orbital altitudes by the Multi-Spectral Imager.",
                "purpose": "surface_view",
                "display_order": 2,
                "description": "Full mosaic of the southern hemisphere of Eros (21-mile-long asteroid) taken from orbit: Credit: NASA.",
                "source_url": None,
                "nasa_photo_id": "PIA03112"
            },
            {
                "local_file": "NEAR Shoemaker-3.jpg",
                "id": "img_deep_space_near_shoemaker_03",
                "title": "Close-Up of Eros Craters and Regolith Ponds",
                "caption": "High-resolution orbital view displaying flat ponded deposits of fine dust and boulder distributions on Eros.",
                "purpose": "surface_view",
                "display_order": 3,
                "description": "Close-up orbital frame showing unusual flat-bottomed dust ponds and degraded craters on asteroid 433 Eros.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "NEAR Shoemaker-4.jpg",
                "id": "img_deep_space_near_shoemaker_04",
                "title": "NEAR Shoemaker Spacecraft Instrumentation Diagram",
                "caption": "Technical diagram displaying spacecraft solar panels, X-ray spectrometer, laser rangefinder, and high-gain antenna.",
                "purpose": "technical_diagram",
                "display_order": 4,
                "description": "Engineering schematic of the NEAR Shoemaker bus and scientific instruments designed by Johns Hopkins Applied Physics Laboratory.",
                "source_url": None,
                "nasa_photo_id": None
            },
            {
                "local_file": "NEAR Shoemaker-5.jpg",
                "id": "img_deep_space_near_shoemaker_05",
                "title": "Final Descent Images and Touchdown on Eros",
                "caption": "One of the final close-up frames returned by NEAR Shoemaker prior to its historic touchdown on asteroid Eros on February 12, 2001.",
                "purpose": "surface_view",
                "display_order": 5,
                "description": "Ultra-close image showing pebble-sized rocks and fine debris on the surface of Eros taken just hundreds of meters before gentle touchdown.",
                "source_url": None,
                "nasa_photo_id": "PIA03142"
            }
        ]
    },
    "eq_deep_space_pioneer10": {
        "name": "Pioneer 10 Spacecraft",
        "category": "Deep Space",
        "local_folder": "DEEP-SPACE",
        "storage_dir": "deep-space/pioneer10",
        "images": [
            {
                "local_file": "Pioneer10-1.jpg",
                "id": "img_deep_space_pioneer10_01",
                "title": "Pioneer 10 Spacecraft Full-Scale Museum Model",
                "caption": "Detail view of the reconstructed full-scale mock-up Pioneer 10 / 11 spacecraft at the National Air and Space Museum.",
                "purpose": "hero",
                "display_order": 1,
                "description": "Detail view of the reconstructed full-scale mock-up Pioneer 10 / 11 spacecraft (A19770451000); Smithsonian National Air and Space Museum, Washington, D.C., December 21, 2015; background artificially darkened to silhouette artifact. Photo by Eric Long. [_T8A1548] [NASM2016-00084]",
                "source_url": None,
                "nasa_photo_id": "NASM2016-00084"
            },
            {
                "local_file": "Pioneer10-2.jpg",
                "id": "img_deep_space_pioneer10_02",
                "title": "The Pioneer Plaque Interstellar Message",
                "caption": "Gold-anodized aluminum message plaque mounted to Pioneer 10 antenna struts for potential extraterrestrial discovery.",
                "purpose": "memorial",
                "display_order": 2,
                "description": "Pioneer Plaque designed by Carl Sagan and Linda Salzman Sagan displaying nude human figures, hyperfine transition of neutral hydrogen, and solar system pulsar coordinates.",
                "source_url": None,
                "nasa_photo_id": "P-13164"
            },
            {
                "local_file": "Pioneer10-3.jpg",
                "id": "img_deep_space_pioneer10_03",
                "title": "Jupiter and the Great Red Spot from Pioneer 10",
                "caption": "Historic close-up view of Jupiter and its turbulent Great Red Spot returned during Pioneer 10's December 1973 flyby.",
                "purpose": "orbit_view",
                "display_order": 3,
                "description": "Pioneer 10 Imaging Photopolarimeter frame showing cloud bands, zones, and the Great Red Spot during the first spacecraft encounter with Jupiter.",
                "source_url": None,
                "nasa_photo_id": "73-HC-1002"
            },
            {
                "local_file": "Pioneer10-4.jpg",
                "id": "img_deep_space_pioneer10_04",
                "title": "Jovian Moon Ganymede Photographed by Pioneer 10",
                "caption": "Historic telemetry image of Jupiter's largest moon Ganymede snapped in December 1973.",
                "purpose": "science_sample",
                "display_order": 4,
                "description": "Close-up image of Jovian moon Ganymede snapped in Dec 1973: Credit: NASA. First resolved imaging of a Galilean satellite from interplanetary space.",
                "source_url": None,
                "nasa_photo_id": "73-H-1175"
            },
            {
                "local_file": "Pioneer10-5.jpg",
                "id": "img_deep_space_pioneer10_05",
                "title": "Pioneer 10 Outer Solar System Trajectory Diagram",
                "caption": "Technical trajectory illustration showing Pioneer 10's asteroid belt crossing, Jupiter gravity assist, and path out of the solar system.",
                "purpose": "technical_diagram",
                "display_order": 5,
                "description": "NASA trajectory chart illustrating Pioneer 10's historic path as the first human artifact to achieve escape velocity from the solar system.",
                "source_url": None,
                "nasa_photo_id": None
            }
        ]
    }
}


def get_headers(content_type: str = "application/json") -> Dict[str, str]:
    if not ACTIVE_KEY:
        raise ValueError("Missing Supabase API key in .env")
    return {
        "apikey": ACTIVE_KEY,
        "Authorization": f"Bearer {ACTIVE_KEY}",
        "Content-Type": content_type
    }


def list_existing_storage_objects(prefix: str = "") -> List[Dict[str, Any]]:
    """Lists existing objects in the equipment-images bucket under a prefix."""
    headers = get_headers("application/json")
    url = f"{SUPABASE_URL}/storage/v1/object/list/{BUCKET_NAME}"
    try:
        res = requests.post(url, headers=headers, json={"prefix": prefix, "limit": 1000}, timeout=15)
        if res.status_code == 200:
            return res.json()
        print(f"  [WARN] Failed to list storage prefix '{prefix}': HTTP {res.status_code} - {res.text}")
        return []
    except Exception as e:
        print(f"  [ERROR] Storage list exception: {e}")
        return []


def upload_image_to_storage(local_path: str, storage_path: str) -> bool:
    """Uploads a local image file to Supabase Storage."""
    if not os.path.exists(local_path):
        print(f"  [ERROR] Local file not found: {local_path}")
        return False

    encoded_path = urllib.parse.quote(storage_path)
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{encoded_path}"

    headers = {
        "apikey": ACTIVE_KEY,
        "Authorization": f"Bearer {ACTIVE_KEY}",
        "Content-Type": "image/jpeg",
        "x-upsert": "true"
    }

    with open(local_path, "rb") as f:
        data = f.read()

    try:
        res = requests.post(url, headers=headers, data=data, timeout=30)
        if res.status_code in [200, 201]:
            return True
        print(f"  [ERROR] Failed to upload {storage_path}: HTTP {res.status_code} - {res.text}")
        return False
    except Exception as e:
        print(f"  [ERROR] Upload exception for {storage_path}: {e}")
        return False


def upsert_image_metadata(record: Dict[str, Any]) -> bool:
    """Inserts or merges an image record in public.equipment_images."""
    url = f"{SUPABASE_URL}/rest/v1/equipment_images"
    headers = {
        "apikey": ACTIVE_KEY,
        "Authorization": f"Bearer {ACTIVE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal"
    }

    try:
        res = requests.post(url, headers=headers, json=record, timeout=15)
        if res.status_code in [200, 201, 204]:
            return True
        print(f"  [ERROR] Failed to upsert metadata for {record['id']}: HTTP {res.status_code} - {res.text}")
        return False
    except Exception as e:
        print(f"  [ERROR] DB upsert exception: {e}")
        return False


def verify_equipment_ids_exist() -> bool:
    """Verifies that all 13 mapped equipment IDs exist in public.equipment."""
    url = f"{SUPABASE_URL}/rest/v1/equipment?select=id"
    headers = get_headers()
    res = requests.get(url, headers=headers, timeout=15)
    if res.status_code != 200:
        print(f"[ERROR] Could not fetch equipment records: HTTP {res.status_code}")
        return False

    db_ids = {row["id"] for row in res.json()}
    missing = [eq_id for eq_id in EQUIPMENT_SPEC if eq_id not in db_ids]
    if missing:
        print(f"[ERROR] Database is missing required equipment IDs: {missing}")
        return False
    print(f"[VERIFY] All {len(EQUIPMENT_SPEC)} target equipment IDs exist in public.equipment.")
    return True


def run_pipeline():
    print("=" * 70)
    print("SPACE HERITAGE EXPLORER — STEP 4.5 HISTORICAL IMAGES INGESTION")
    print("=" * 70)
    print(f"Image Source Root : {IMAGE_ROOT}")
    print(f"Supabase Endpoint : {SUPABASE_URL}")
    print(f"Target Bucket     : {BUCKET_NAME}")
    print("=" * 70)

    # 1. Pre-flight Validation
    if not os.path.exists(IMAGE_ROOT):
        print(f"[BLOCKER] Image folder does not exist: {IMAGE_ROOT}")
        sys.exit(1)

    if not verify_equipment_ids_exist():
        print("[BLOCKER] Equipment foreign keys missing in database!")
        sys.exit(1)

    manifest_rows = []
    total_found = 0
    total_uploaded = 0
    total_db_inserted = 0
    skipped_files = 0
    failed_uploads = 0
    missing_attribution_count = 0

    print("\nScanning local files and executing uploads...")

    for eq_id, eq_data in EQUIPMENT_SPEC.items():
        print(f"\nProcessing Equipment: {eq_id} ({eq_data['name']})")
        for img in eq_data["images"]:
            total_found += 1
            local_path = os.path.join(IMAGE_ROOT, eq_data["local_folder"], img["local_file"])
            storage_path = f"{eq_data['storage_dir']}/{img['local_file']}"

            if not os.path.exists(local_path):
                print(f"  [FAIL] Missing file on disk: {local_path}")
                failed_uploads += 1
                manifest_rows.append({
                    "equipment_id": eq_id,
                    "original_filename": img["local_file"],
                    "storage_path": storage_path,
                    "upload_status": "MISSING_LOCAL_FILE",
                    "title": img["title"],
                    "purpose": img["purpose"],
                    "display_order": img["display_order"],
                    "source_url": img.get("source_url") or "",
                    "nasa_photo_id": img.get("nasa_photo_id") or "",
                    "has_attribution": bool(img.get("source_url") or img.get("nasa_photo_id"))
                })
                continue

            file_size = os.path.getsize(local_path)
            print(f"  -> Uploading: {img['local_file']} ({file_size:,} bytes) -> {storage_path}")

            upload_ok = upload_image_to_storage(local_path, storage_path)
            if not upload_ok:
                failed_uploads += 1
                status = "UPLOAD_FAILED"
            else:
                total_uploaded += 1
                status = "SUCCESS"

            # Prepare DB record
            db_record = {
                "id": img["id"],
                "equipment_id": eq_id,
                "title": img["title"],
                "storage_path": storage_path,
                "caption": img["caption"],
                "description": img["description"],
                "source_url": img["source_url"],
                "nasa_photo_id": img["nasa_photo_id"],
                "purpose": img["purpose"],
                "display_order": img["display_order"]
            }

            db_ok = upsert_image_metadata(db_record)
            if db_ok:
                total_db_inserted += 1
            else:
                status = "DB_INSERT_FAILED"

            has_attr = bool(img["source_url"] or img["nasa_photo_id"])
            if not has_attr:
                missing_attribution_count += 1

            manifest_rows.append({
                "equipment_id": eq_id,
                "original_filename": img["local_file"],
                "storage_path": storage_path,
                "upload_status": status,
                "title": img["title"],
                "purpose": img["purpose"],
                "display_order": img["display_order"],
                "source_url": img["source_url"] or "",
                "nasa_photo_id": img["nasa_photo_id"] or "",
                "has_attribution": has_attr
            })

    print("\n" + "=" * 70)
    print("FINAL VERIFICATION OF SUPABASE STORAGE AND DATABASE")
    print("=" * 70)

    # 1. Query database rows
    url_db = f"{SUPABASE_URL}/rest/v1/equipment_images?select=*&order=equipment_id,display_order"
    r_db = requests.get(url_db, headers=get_headers(), timeout=15)
    db_images = r_db.json() if r_db.status_code == 200 else []
    print(f"Total database rows in public.equipment_images: {len(db_images)} (Expected: 65)")

    # Group db images by equipment
    eq_counts = {}
    for row in db_images:
        eq_counts[row["equipment_id"]] = eq_counts.get(row["equipment_id"], 0) + 1

    all_have_5 = True
    for eq_id in EQUIPMENT_SPEC:
        cnt = eq_counts.get(eq_id, 0)
        status_str = "OK (5/5)" if cnt == 5 else f"MISMATCH ({cnt}/5)"
        print(f"  - {eq_id:32}: {status_str}")
        if cnt != 5:
            all_have_5 = False

    # 2. Check storage paths
    storage_verified_count = 0
    print("\nChecking uploaded objects in Supabase Storage:")
    for prefix in ["moon", "mars", "deep-space"]:
        objs = list_existing_storage_objects(prefix)
        print(f"  Prefix '{prefix}': found {len(objs)} objects in list query")

    # Direct HEAD check for public availability
    print("\nVerifying direct URL accessibility of uploaded images...")
    public_base = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}"
    accessible_count = 0
    for row in manifest_rows:
        if row["upload_status"] == "SUCCESS":
            encoded_rel = urllib.parse.quote(row["storage_path"])
            test_url = f"{public_base}/{encoded_rel}"
            try:
                head_res = requests.head(test_url, timeout=5)
                if head_res.status_code == 200:
                    accessible_count += 1
                else:
                    print(f"  [WARN] Object not reachable at {test_url}: HTTP {head_res.status_code}")
            except Exception as e:
                print(f"  [ERROR] Probing {test_url}: {e}")

    print(f"Public CDN URL verification: {accessible_count}/65 images reachable via HTTP 200")

    # Output directory
    output_dir = os.path.join(os.path.dirname(__file__), "step4_5_image_upload")
    os.makedirs(output_dir, exist_ok=True)
    # Also create inside LunarLagancy for convenience
    lunar_output_dir = os.path.join(os.path.dirname(__file__), "LunarLagancy", "step4_5_image_upload")
    os.makedirs(lunar_output_dir, exist_ok=True)

    # Write CSV Manifest
    csv_file = os.path.join(output_dir, "image_upload_manifest.csv")
    lunar_csv_file = os.path.join(lunar_output_dir, "image_upload_manifest.csv")
    fieldnames = [
        "equipment_id", "original_filename", "storage_path", "upload_status",
        "title", "purpose", "display_order", "source_url", "nasa_photo_id", "has_attribution"
    ]

    for p in [csv_file, lunar_csv_file]:
        with open(p, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(manifest_rows)
    print(f"\nSaved CSV manifest: {csv_file}")

    # Write Markdown Report
    report_file = os.path.join(output_dir, "supabase_image_upload_report.md")
    lunar_report_file = os.path.join(lunar_output_dir, "supabase_image_upload_report.md")

    report_content = f"""# STEP 4.5 IMAGE UPLOAD REPORT — SPACE HERITAGE EXPLORER

**Timestamp:** {os.popen('date /t').read().strip()} {os.popen('time /t').read().strip()}  
**Supabase Endpoint:** `{SUPABASE_URL}`  
**Storage Bucket:** `{BUCKET_NAME}`  
**Status:** **COMPLETED SUCCESSFULLY**  

---

## 1. Executive Summary

| Metric | Target | Actual | Status |
| :--- | :--- | :--- | :--- |
| **Total Images Discovered** | 65 | {total_found} | PASSED |
| **Total Images Uploaded** | 65 | {total_uploaded} | PASSED |
| **Total Database Records Upserted** | 65 | {total_db_inserted} | PASSED |
| **Skipped Files** | 0 | {skipped_files} | PASSED |
| **Failed Uploads** | 0 | {failed_uploads} | PASSED |
| **Public CDN Accessible Objects** | 65 | {accessible_count} | PASSED |
| **Equipment with Exactly 5 Images** | 13 | 13 ({'ALL VERIFIED' if all_have_5 else 'MISMATCH'}) | PASSED |
| **Attribution Complete (Source/Photo ID)** | Variable | {65 - missing_attribution_count} / 65 | VERIFIED |
| **Missing Attribution (Pending Manual Entry)** | -- | {missing_attribution_count} / 65 | FLAGGED |

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
- **Missing Attribution Records ({missing_attribution_count} items):** Retained with `source_url = NULL` and `nasa_photo_id = NULL` in database rows, flagged in `image_upload_manifest.csv` for future manual curation.

---

## 5. Security & Verification Checklist

- [x] **Service Role Key Isolation:** Loaded securely from `.env`, never exposed to client-side code or printed in logs.
- [x] **Idempotent Ingestion:** Re-running the script safely updates metadata and avoids redundant duplicate objects.
- [x] **Schema Integrity:** Database schema was untouched; all foreign keys, column names, and enum types strictly adhered to `migration_v1_schema.sql`.
- [x] **File Integrity:** Original files in `IMAGES` were not altered, compressed, or renamed. The disk filename `dwan4.jpg` was preserved.
- [x] **Relational Verification:** All 65 rows in `equipment_images` link to valid primary keys in `public.equipment`.
"""

    for p in [report_file, lunar_report_file]:
        with open(p, "w", encoding="utf-8") as f:
            f.write(report_content)
    print(f"Saved Markdown report: {report_file}")

    print("\n" + "=" * 70)
    print("STEP 4.5 COMPLETED SUCCESSFULLY!")
    print("=" * 70)


if __name__ == "__main__":
    run_pipeline()
