/**
 * Static mission content for all 13 Space Heritage Explorer equipment IDs.
 * Prompt 8 will replace these with live Supabase data.
 * Content is prepared and accurate — do not invent facts.
 */

export interface MissionSection {
  title: string;
  icon: string;
  content: string;
}

export interface MissionMeta {
  launchDate?: string;
  landingDate?: string;
  missionEnd?: string;
  launchVehicle?: string;
  agency?: string;
  launchSite?: string;
  missionDuration?: string;
  currentStatus?: string;
  coordinates?: string;
}

export interface MissionData {
  id: string;
  missionTitle: string;
  equipmentName: string;
  category: 'Moon' | 'Mars' | 'Deep Space';
  destination: string;
  badgeVariant: 'moon' | 'mars' | 'deep-space';
  accentColor: string;
  introduction: string;
  modelUrl: string | null;      // local GLB path, null = no local model
  modelNote?: string;           // note about shared/combined model
  meta: MissionMeta;
  sections: MissionSection[];
}

// ─── GLB model paths ──────────────────────────────────────────────────────────
const APOLLO_GLB      = '/models/moon/apollo.glb';
const SURVEYOR_GLB    = '/models/moon/surveyor_3.glb';
const VIKING_GLB      = '/models/mars/viking.glb';
const INGENUITY_GLB   = '/models/mars/ingenuity.glb';
const SPIRIT_GLB      = '/models/mars/spirit.glb';
const OPPORTUNITY_GLB = '/models/mars/opportunity.glb';
const SOJOURNER_GLB   = '/models/mars/sojourner_pathfinder.glb';
const DAWN_GLB        = '/models/deep-space/dawn.glb';
const NEAR_GLB        = '/models/deep-space/near_shoemaker.glb';
const PIONEER_GLB     = '/models/deep-space/pioneer_10.glb';

// ─── All 13 missions ──────────────────────────────────────────────────────────
export const MISSION_DATA: Record<string, MissionData> = {

  // ════════════════════════════════════════════════════════════════════════════
  //  MOON — 4 MISSIONS
  // ════════════════════════════════════════════════════════════════════════════

  eq_moon_apollo11_lm: {
    id: 'eq_moon_apollo11_lm',
    missionTitle: 'Apollo 11',
    equipmentName: 'Lunar Module Eagle & EASEP',
    category: 'Moon',
    destination: 'Tranquility Base, Sea of Tranquility',
    badgeVariant: 'moon',
    accentColor: '#60a5fa',
    introduction:
      'On 20 July 1969, the Apollo 11 Lunar Module Eagle touched down at Tranquility Base, making Neil Armstrong and Buzz Aldrin the first humans to walk on another world. The mission fulfilled President Kennedy\'s goal and changed humanity\'s understanding of its place in the cosmos.',
    modelUrl: APOLLO_GLB,
    modelNote: 'Apollo Lunar Module model — shared asset across Apollo 11, 12 and 15.',
    meta: {
      launchDate: '16 July 1969',
      landingDate: '20 July 1969',
      missionEnd: '24 July 1969',
      launchVehicle: 'Saturn V SA-506',
      agency: 'NASA',
      launchSite: 'Kennedy Space Center LC-39A',
      missionDuration: '8 days, 3 hours, 18 minutes',
      currentStatus: 'Descent stage remains at Tranquility Base',
      coordinates: '0.6741° N, 23.4729° E',
    },
    sections: [
      {
        title: 'Meet the Explorer',
        icon: '🚀',
        content:
          'The Apollo Lunar Module (LM) was a two-stage spacecraft: a descent stage that served as the landing platform and an ascent stage that returned the crew to lunar orbit. Eagle stood 7 m tall, massed 15,095 kg fully fuelled, and was the first crewed vehicle designed exclusively to operate in the vacuum of space. The Early Apollo Scientific Experiment Package (EASEP) was a simplified science station deployed near the landing site.',
      },
      {
        title: 'Mission & Purpose',
        icon: '🎯',
        content:
          'Apollo 11 fulfilled the national goal articulated by President John F. Kennedy in 1961: to land humans on the Moon and return them safely to Earth before the end of the decade. The mission demonstrated the capability of the Saturn V launch vehicle, the Command/Service Module, the Lunar Module, and the spacesuits. It proved humanity could leave Earth and explore another world.',
      },
      {
        title: 'Meet the Technology',
        icon: '⚙️',
        content:
          'The descent engine used a pressure-fed, variable-thrust design capable of throttling between 10% and 100% — essential for the final landing phase. The ascent engine was designed to ignite reliably in the vacuum of deep space with no moving parts. EASEP instruments included a Passive Seismic Experiment (to measure moonquakes), a Laser Ranging Retroreflector (still active today), and a Solar Wind Composition Experiment.',
      },
      {
        title: 'The Journey',
        icon: '🛸',
        content:
          'Saturn V lifted off on 16 July 1969 at 09:32 EDT. After trans-lunar injection, the crew of Neil Armstrong, Buzz Aldrin, and Michael Collins coasted to the Moon over three days. On 20 July, Armstrong and Aldrin entered the LM, undocked from Columbia, and descended. At 102 hours 45 minutes mission elapsed time, Eagle landed with less than 30 seconds of descent propellant remaining. Armstrong stepped onto the surface at 02:56 UTC on 21 July.',
      },
      {
        title: 'Scientific Discoveries',
        icon: '🔬',
        content:
          'The crew collected 21.55 kg of lunar samples, including basaltic rocks from mare deposits and fine-grained regolith. The Passive Seismic Experiment detected shallow moonquakes. The Laser Ranging Retroreflector remains in use to measure the Earth–Moon distance to millimetre precision. Sample analysis confirmed that the Moon was once covered by a global magma ocean.',
      },
      {
        title: 'Where Is It Now?',
        icon: '📍',
        content:
          'The descent stage of Eagle remains at Tranquility Base (0.6741° N, 23.4729° E) exactly where it landed. It has been photographed in high resolution by NASA\'s Lunar Reconnaissance Orbiter. The ascent stage was jettisoned and either crashed on the Moon or entered solar orbit. The EASEP instruments were deactivated in 1977.',
      },
      {
        title: 'Its Legacy',
        icon: '🏛️',
        content:
          'Apollo 11 is the defining event of the Space Age. It demonstrated that any challenge, however immense, can be overcome through engineering, teamwork, and determination. The 382 kg of samples returned by all Apollo missions form the foundation of planetary science. Tranquility Base is the most historically significant off-Earth location in human history. The retroreflector still enables active scientific experiments 55+ years later.',
      },
    ],
  },

  eq_moon_apollo12_lm: {
    id: 'eq_moon_apollo12_lm',
    missionTitle: 'Apollo 12',
    equipmentName: 'Lunar Module Intrepid & ALSEP',
    category: 'Moon',
    destination: 'Ocean of Storms, Surveyor Crater',
    badgeVariant: 'moon',
    accentColor: '#34d399',
    introduction:
      'Apollo 12 demonstrated pinpoint lunar landing precision, touching down just 160 metres from the previously landed Surveyor 3 spacecraft. The mission deployed the first full Apollo Lunar Surface Experiments Package (ALSEP) and retrieved parts from Surveyor 3 for analysis on Earth.',
    modelUrl: APOLLO_GLB,
    modelNote: 'Apollo Lunar Module model — shared asset across Apollo 11, 12 and 15.',
    meta: {
      launchDate: '14 November 1969',
      landingDate: '19 November 1969',
      missionEnd: '24 November 1969',
      launchVehicle: 'Saturn V SA-507',
      agency: 'NASA',
      launchSite: 'Kennedy Space Center LC-39A',
      missionDuration: '10 days, 4 hours, 36 minutes',
      currentStatus: 'Descent stage at Ocean of Storms; ALSEP active 1969–1977',
      coordinates: '3.0128° S, 23.4219° W',
    },
    sections: [
      {
        title: 'Meet the Explorer',
        icon: '🚀',
        content:
          'Intrepid was the second Lunar Module to land on the Moon. It carried Pete Conrad and Alan Bean to the Ocean of Storms while Richard Gordon orbited above in Yankee Clipper. The ALSEP was a full science station left operating on the lunar surface after the crew departed.',
      },
      {
        title: 'Mission & Purpose',
        icon: '🎯',
        content:
          'Apollo 12\'s primary objective was to demonstrate the ability to land at a precise target location. The secondary objective was to retrieve components from the Surveyor 3 lander (arrived April 1967) for materials science study, and to deploy the full ALSEP science network.',
      },
      {
        title: 'Meet the Technology',
        icon: '⚙️',
        content:
          'The ALSEP included a Passive Seismic Experiment, Suprathermal Ion Detector, Cold Cathode Ion Gauge, Lunar Dust Detector, and Magnetometer. For navigation, the crew used an upgraded onboard guidance computer with refined landing radar. Conrad and Bean performed two EVAs totalling 7 hours 45 minutes.',
      },
      {
        title: 'The Journey',
        icon: '🛸',
        content:
          'The mission launched on 14 November 1969 during a lightning strike that temporarily knocked out the electrical systems (the Saturn V kept flying). After a 3.5-day journey, Intrepid separated from Yankee Clipper and descended to Surveyor Crater. Conrad manually piloted past a crater and landed 163 metres from Surveyor 3 on 19 November 1969.',
      },
      {
        title: 'Scientific Discoveries',
        icon: '🔬',
        content:
          'The crew collected 34.35 kg of samples, primarily from mare basalt flows distinctly different in composition from Apollo 11 samples. Surveyor 3 camera retrieved to Earth showed microorganisms (Streptococcus mitis from Earth contamination) had survived 2.5 years in the lunar environment inside the camera — a significant finding for contamination control. ALSEP seismic data recorded the ascent stage impact.',
      },
      {
        title: 'Where Is It Now?',
        icon: '📍',
        content:
          'The descent stage of Intrepid rests at 3.0128° S, 23.4219° W in the Ocean of Storms — 160 metres from Surveyor 3. The ascent stage was deliberately crashed onto the Moon on 20 November 1969 to calibrate the ALSEP seismometers, generating measurable seismic waves. The ALSEP remained active until it was shut down in September 1977 to reduce NASA operational costs.',
      },
      {
        title: 'Its Legacy',
        icon: '🏛️',
        content:
          'Apollo 12 proved that the Moon is not a homogeneous body — its volcanic history produced distinctly different basalts at different sites. The precision landing capability demonstrated by Conrad proved that future Apollo missions could target specific scientific sites of interest. The ALSEP geophysical network provided years of seismic, magnetic, and atmospheric data.',
      },
    ],
  },

  eq_moon_apollo15_lm: {
    id: 'eq_moon_apollo15_lm',
    missionTitle: 'Apollo 15',
    equipmentName: 'Lunar Module Falcon, ALSEP & Lunar Roving Vehicle',
    category: 'Moon',
    destination: 'Hadley–Apennine, Rima Hadley',
    badgeVariant: 'moon',
    accentColor: '#f59e0b',
    introduction:
      'Apollo 15 was the first of the "J-class" extended-duration missions, introducing the Lunar Roving Vehicle that allowed astronauts David Scott and James Irwin to explore kilometres from the landing site. The mission returned the most scientifically valuable samples of the Apollo programme, including the 4.5-billion-year-old Genesis Rock.',
    modelUrl: APOLLO_GLB,
    modelNote: 'Apollo Lunar Module model — shared asset across Apollo 11, 12 and 15.',
    meta: {
      launchDate: '26 July 1971',
      landingDate: '30 July 1971',
      missionEnd: '7 August 1971',
      launchVehicle: 'Saturn V SA-510',
      agency: 'NASA',
      launchSite: 'Kennedy Space Center LC-39A',
      missionDuration: '12 days, 7 hours, 11 minutes',
      currentStatus: 'Descent stage and LRV remain at Hadley–Apennine',
      coordinates: '26.1322° N, 3.6339° E',
    },
    sections: [
      {
        title: 'Meet the Explorer',
        icon: '🚀',
        content:
          'Falcon carried David Scott and James Irwin to Hadley–Apennine, one of the most geologically varied sites on the Moon. The Boeing Lunar Roving Vehicle (LRV) was stored folded in the descent stage and deployed after landing, providing 27.9 km of surface traverses across three EVAs.',
      },
      {
        title: 'Mission & Purpose',
        icon: '🎯',
        content:
          'Apollo 15 was the first J-class mission, designed for extended lunar surface stays (up to 3 days), longer EVAs with the LRV, and a larger science payload. The mission targeted the Hadley Rille — a sinuous channel carved by ancient lava flows — and the Apennine mountain front for geological exploration.',
      },
      {
        title: 'Meet the Technology',
        icon: '⚙️',
        content:
          'The LRV was powered by two 36-volt silver-zinc batteries, had a top speed of 13 km/h, and folded to fit into a 1.5 m² area. The ALSEP included a Heat Flow Experiment, Lunar Mass Spectrometer, and Solar Wind Spectrometer. Scott and Irwin performed three EVAs totalling 18 hours 35 minutes, the longest surface time of any lunar mission to that point.',
      },
      {
        title: 'The Journey',
        icon: '🛸',
        content:
          'Saturn V lifted off on 26 July 1971. Falcon separated and descended toward the Hadley–Apennine site, landing on 30 July. The site presented challenging terrain: the landing site was a tilted plain near a 1.5 km-deep rille. Scott performed a stand-up EVA through the ascent hatch before the first full EVA to survey the terrain.',
      },
      {
        title: 'Scientific Discoveries',
        icon: '🔬',
        content:
          'The 77.3 kg of samples collected included the "Genesis Rock" — an anorthosite sample dating to 4.5 billion years ago representing the original lunar crust from the magma ocean period. The crew confirmed the volcanic origin of Hadley Rille. Heat flow measurements showed the Moon retains internal warmth. The mass spectrometer detected argon and other gases in the tenuous lunar atmosphere.',
      },
      {
        title: 'Where Is It Now?',
        icon: '📍',
        content:
          'The Falcon descent stage and LRV remain at 26.1322° N, 3.6339° E on the flank of Hadley–Apennine. LRO images show both artifacts in exceptional detail, including tracks left by the LRV. The LRV\'s TV camera still points at the descent stage. The ALSEP operated until September 1977.',
      },
      {
        title: 'Its Legacy',
        icon: '🏛️',
        content:
          'Apollo 15 fundamentally advanced understanding of the Moon\'s geological history, proving the magma ocean hypothesis through the Genesis Rock. The LRV concept pioneered planetary surface mobility, directly influencing later rover designs for Mars. The mission\'s extended surface operations and high-quality science return established the template for future planetary exploration.',
      },
    ],
  },

  eq_moon_surveyor3: {
    id: 'eq_moon_surveyor3',
    missionTitle: 'Surveyor 3',
    equipmentName: 'Surveyor 3 Lunar Soft-Lander',
    category: 'Moon',
    destination: 'Ocean of Storms (later visited by Apollo 12)',
    badgeVariant: 'moon',
    accentColor: '#a78bfa',
    introduction:
      'Surveyor 3 landed on the Moon on 20 April 1967, becoming one of the first spacecraft to soft-land on the lunar surface and the only spacecraft from the pre-Apollo era to be physically visited by later human explorers — Apollo 12 astronauts Pete Conrad and Alan Bean in November 1969.',
    modelUrl: SURVEYOR_GLB,
    meta: {
      launchDate: '17 April 1967',
      landingDate: '20 April 1967',
      missionEnd: '3 May 1967',
      launchVehicle: 'Atlas-Centaur AC-12',
      agency: 'NASA / JPL',
      launchSite: 'Cape Canaveral LC-36B',
      missionDuration: '16 days (operations)',
      currentStatus: 'Remains at Ocean of Storms — visited by Apollo 12 crew (1969)',
      coordinates: '2.9942° S, 23.3313° W',
    },
    sections: [
      {
        title: 'Meet the Explorer',
        icon: '🚀',
        content:
          'Surveyor 3 was a robotic soft-lander designed to study the properties of the lunar surface in preparation for the Apollo programme. It stood 3 m tall and had a mass of 296 kg at landing. It featured a television camera, a surface-sampler arm with a clamshell scoop, and strain gauges to measure soil bearing strength.',
      },
      {
        title: 'Mission & Purpose',
        icon: '🎯',
        content:
          'The Surveyor programme (7 missions, 1966–1968) was designed to demonstrate that a spacecraft could soft-land on the Moon and that the lunar surface could support the weight of an Apollo Lunar Module. Surveyor 3\'s specific goals included sampling the regolith with its surface sampler arm and imaging the surrounding terrain.',
      },
      {
        title: 'Meet the Technology',
        icon: '⚙️',
        content:
          'The spacecraft used a vernier propulsion system of three throttleable engines for descent and landing. The surface-sampler arm could dig, scrape, and scoop lunar soil, with onboard force sensors transmitting data to Earth. The television camera transmitted over 6,300 images. After Apollo 12 visited, the camera was removed and returned to Earth for analysis.',
      },
      {
        title: 'The Journey',
        icon: '🛸',
        content:
          'Surveyor 3 launched on 17 April 1967 and reached the Moon after a 65-hour transit. The landing involved a bouncing touchdown: the craft bounced twice before finally settling. Despite the unplanned bouncing, all systems survived and the mission was declared a success. Surface operations continued until 3 May 1967 when the lunar night ended communications.',
      },
      {
        title: 'Scientific Discoveries',
        icon: '🔬',
        content:
          'Surveyor 3 dug trenches up to 18 cm deep and found the regolith had a bearing strength easily capable of supporting an Apollo Lunar Module. The images revealed a cohesive, fine-grained surface. When Apollo 12 retrieved the camera 2.5 years later, samples from its interior were found to contain dormant terrestrial bacteria (Streptococcus mitis from Earth contamination) — a significant lesson for planetary protection.',
      },
      {
        title: 'Where Is It Now?',
        icon: '📍',
        content:
          'Surveyor 3 rests at 2.9942° S, 23.3313° W in the Ocean of Storms, approximately 160 metres from where the Apollo 12 LM Intrepid landed in November 1969. It is the only pre-Apollo robotic spacecraft visited by human astronauts. The spacecraft has been photographed from lunar orbit by LRO and is in a remarkable state of preservation for a 55+ year old artifact.',
      },
      {
        title: 'Its Legacy',
        icon: '🏛️',
        content:
          'Surveyor 3 was essential to the confidence needed to commit to Apollo landings. Its surface-sampler data confirmed that the lunar surface was solid and could support spacecraft. It is an extraordinary artefact — a bridge between robotic and human planetary exploration. The contamination found in its returned camera established fundamental protocols for spacecraft sterilisation that apply to all planetary missions today.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  //  MARS — 6 MISSIONS
  // ════════════════════════════════════════════════════════════════════════════

  eq_mars_ingenuity: {
    id: 'eq_mars_ingenuity',
    missionTitle: 'Mars 2020 — Ingenuity',
    equipmentName: 'Ingenuity Mars Helicopter',
    category: 'Mars',
    destination: 'Jezero Crater (Wright Brothers Field)',
    badgeVariant: 'mars',
    accentColor: '#38bdf8',
    introduction:
      'Ingenuity became the first powered, controlled aircraft to fly on another planet when it lifted off from the Martian surface in Jezero Crater on 19 April 2021. Originally planned for five flights, it exceeded all expectations with 72 flights before its final landing on 18 January 2024.',
    modelUrl: INGENUITY_GLB,
    meta: {
      launchDate: '30 July 2020',
      landingDate: '18 February 2021',
      missionEnd: '18 January 2024',
      launchVehicle: 'Atlas V 541',
      agency: 'NASA / JPL-Caltech',
      launchSite: 'Cape Canaveral SLC-41',
      missionDuration: '72 flights over ~1,000 Martian sols',
      currentStatus: 'Retired at Jezero Crater — rotor blade damage on final landing',
      coordinates: '18.4447° N, 77.4508° E',
    },
    sections: [
      {
        title: 'Meet the Explorer',
        icon: '🚀',
        content:
          'Ingenuity was a small rotorcraft helicopter: 0.49 m tall, with two counter-rotating carbon-fiber blades spanning 1.2 m. It weighed 1.8 kg and was designed to fly in the Martian atmosphere, which is about 1% the density of Earth\'s. It was carried to Mars attached to the belly of the Perseverance rover and deployed onto the surface after landing.',
      },
      {
        title: 'Mission & Purpose',
        icon: '🎯',
        content:
          'Ingenuity was a technology demonstration mission: its goal was to prove that powered, controlled flight was possible in the Martian atmosphere. The thin air required the rotor blades to spin at approximately 2,537 RPM — far faster than Earth helicopters. If successful, it would open the door to aerial exploration of Mars.',
      },
      {
        title: 'Meet the Technology',
        icon: '⚙️',
        content:
          'The helicopter used six lithium-ion batteries charged by a solar panel. Its flight computer used a Qualcomm Snapdragon 801 — the same processor family used in smartphones. Navigation used onboard cameras and an inertial measurement unit. Radio communications relayed through Perseverance to Earth. Its lightweight carbon-fiber blades were critical to achieving flight in the thin Martian atmosphere.',
      },
      {
        title: 'The Journey',
        icon: '🛸',
        content:
          'Perseverance landed on 18 February 2021. Ingenuity was deployed onto the surface on 3 April 2021 after Perseverance drove off to give it clearance. The first flight was on 19 April 2021 — a 39.1-second hover reaching 3 m altitude. Over the next three years, Ingenuity completed 72 flights, covering 17.24 km, reaching altitudes up to 24 m, and scouting terrain ahead of Perseverance.',
      },
      {
        title: 'Scientific Discoveries',
        icon: '🔬',
        content:
          'Ingenuity demonstrated unequivocally that powered flight in the Martian atmosphere is feasible, validating decades of theoretical and engineering work. Its aerial imagery provided unprecedented perspectives on Martian geology, identifying ancient river delta deposits, rock formations, and optimal traversal routes for Perseverance. Its data has directly informed designs for future Mars aerial explorers.',
      },
      {
        title: 'Where Is It Now?',
        icon: '📍',
        content:
          'Ingenuity rests at its final landing site in Jezero Crater near the base of the ancient delta. Its last flight (Flight 72) on 18 January 2024 resulted in a hard landing that damaged one rotor blade. Ground controllers confirmed the helicopter cannot fly again. Perseverance has photographed the stationary helicopter. Its final location is 18.4447° N, 77.4508° E.',
      },
      {
        title: 'Its Legacy',
        icon: '🏛️',
        content:
          'Ingenuity is the Wright Brothers moment of planetary exploration. It proved that aerial platforms can serve as scouts, mappers, and science vehicles on other worlds. Future missions to Mars include more capable helicopters (Dragonfly for Titan is a direct descendant of this concept). Ingenuity\'s flight computers and sensors are now being studied for the next generation of planetary aerial vehicles.',
      },
    ],
  },

  eq_mars_spirit: {
    id: 'eq_mars_spirit',
    missionTitle: 'Mars Exploration Rover Spirit (MER-A)',
    equipmentName: 'Mars Exploration Rover Spirit',
    category: 'Mars',
    destination: 'Gusev Crater — Columbia Memorial Station',
    badgeVariant: 'mars',
    accentColor: '#fb923c',
    introduction:
      'Spirit (MER-A) landed in Gusev Crater on 4 January 2004, beginning a surface mission planned to last 90 Martian sols. It lasted 2,208 sols — 24 times its design lifetime — before becoming immobile in soft soil in 2009. Spirit operated as a stationary science platform until 22 March 2010 when contact was lost.',
    modelUrl: SPIRIT_GLB,
    meta: {
      launchDate: '10 June 2003',
      landingDate: '4 January 2004',
      missionEnd: '22 March 2010 (last contact)',
      launchVehicle: 'Delta II 7925',
      agency: 'NASA / JPL',
      launchSite: 'Cape Canaveral SLC-17A',
      missionDuration: '2,208 Martian sols (over 6 Earth years)',
      currentStatus: 'Silent at Troy, Gusev Crater — trapped in soft soil',
      coordinates: '14.5684° S, 175.4726° E',
    },
    sections: [
      {
        title: 'Meet the Explorer',
        icon: '🚀',
        content:
          'Spirit was a six-wheeled solar-powered rover 1.6 m long and 180 kg in mass. Its "rocker-bogie" suspension allowed it to traverse rocks up to 25 cm high. It carried a robotic arm with a Rock Abrasion Tool, microscopic imager, Mössbauer spectrometer, Alpha Particle X-ray Spectrometer, and navigation cameras.',
      },
      {
        title: 'Mission & Purpose',
        icon: '🎯',
        content:
          'The Mars Exploration Rover mission\'s primary goal was to investigate whether Mars ever had liquid water in its past — a prerequisite for life. Gusev Crater was selected because orbital images suggested it may once have held a lake fed by an ancient river channel (Ma\'adim Vallis).',
      },
      {
        title: 'Meet the Technology',
        icon: '⚙️',
        content:
          'Spirit\'s power came from solar panels generating up to 900 Wh/sol and rechargeable lithium-ion batteries. Its onboard computer used a 20-MHz RAD6000 processor. The Rock Abrasion Tool (RAT) could grind into rocks to expose fresh surfaces. Communications used a UHF link to Mars orbiters relaying to Earth. All six wheels could steer independently.',
      },
      {
        title: 'The Journey',
        icon: '🛸',
        content:
          'Spirit launched on 10 June 2003 and landed on 4 January 2004. After initial operations in Gusev crater plain (which proved geologically dull), it drove 3 km to the Columbia Hills, where volcanic rocks told a story of ancient water activity. Spirit climbed Husband Hill, explored the Home Plate volcanic formation, and drove 7.73 km total before becoming stuck in soft soil at a site called "Troy" in 2009.',
      },
      {
        title: 'Scientific Discoveries',
        icon: '🔬',
        content:
          'Spirit found evidence that the Columbia Hills rocks had been altered by water, with minerals like goethite and hematite indicating hydrothermal activity. Home Plate was identified as an ancient hydrothermal feature — the first on Mars — containing silica-rich soil consistent with hot spring deposits. These findings suggested Gusev Crater hosted habitable environments billions of years ago.',
      },
      {
        title: 'Where Is It Now?',
        icon: '📍',
        content:
          'Spirit rests silent at "Troy" (14.5684° S, 175.4726° E) in Gusev Crater, where it became embedded in soft sulfate-rich soil in May 2009. Without the ability to tilt toward the winter sun, it could not generate enough power to survive its third Martian winter. The last transmission was received on 22 March 2010. NASA ended recovery attempts on 25 May 2011.',
      },
      {
        title: 'Its Legacy',
        icon: '🏛️',
        content:
          'Spirit operated for more than 24 times its planned mission life, returning over 124,000 images and 36 Gb of science data. Its discovery of hydrothermal deposits at Home Plate dramatically expanded the range of ancient Martian habitable environments. Spirit proved that rovers could survive and operate on Mars for years, establishing the template for all subsequent Mars surface missions.',
      },
    ],
  },

  eq_mars_opportunity: {
    id: 'eq_mars_opportunity',
    missionTitle: 'Mars Exploration Rover Opportunity (MER-B)',
    equipmentName: 'Mars Exploration Rover Opportunity',
    category: 'Mars',
    destination: 'Meridiani Planum — Challenger Memorial Station',
    badgeVariant: 'mars',
    accentColor: '#facc15',
    introduction:
      'Opportunity (MER-B) landed in Meridiani Planum on 25 January 2004 and operated for an extraordinary 5,111 Martian sols — 14.5 Earth years. It drove 45.16 km, the longest distance ever driven by an off-Earth surface vehicle, and returned definitive evidence that ancient Mars had liquid water.',
    modelUrl: OPPORTUNITY_GLB,
    meta: {
      launchDate: '8 July 2003',
      landingDate: '25 January 2004',
      missionEnd: '10 June 2018 (global dust storm)',
      launchVehicle: 'Delta II 7925H',
      agency: 'NASA / JPL',
      launchSite: 'Cape Canaveral SLC-17B',
      missionDuration: '5,111 Martian sols (14.5 Earth years)',
      currentStatus: 'Silent at Perseverance Valley, Endeavour Crater rim',
      coordinates: '1.9462° S, 5.5266° W',
    },
    sections: [
      {
        title: 'Meet the Explorer',
        icon: '🚀',
        content:
          'Opportunity was identical in design to its twin Spirit — a six-wheeled solar rover with a rocker-bogie suspension, robotic arm, Rock Abrasion Tool, and suite of spectrometers and cameras. Its airbag-cushioned landing dropped it inside a small crater (Eagle Crater) by exceptional luck — directly beside an exposed bedrock outcrop.',
      },
      {
        title: 'Mission & Purpose',
        icon: '🎯',
        content:
          'Opportunity\'s goal matched Spirit\'s: to investigate the history of water on Mars. Meridiani Planum was selected because orbital data from Mars Global Surveyor detected grey hematite — a mineral that on Earth forms in liquid water. The site proved even richer than predicted.',
      },
      {
        title: 'Meet the Technology',
        icon: '⚙️',
        content:
          'Opportunity\'s design was identical to Spirit\'s, but its science was largely shaped by its location. The Mössbauer spectrometer confirmed hematite-rich spherules ("blueberries") in exposed bedrock. The Mini-Thermal Emission Spectrometer identified minerals. The Rock Abrasion Tool exposed fresh interior surfaces of rocks for spectral analysis.',
      },
      {
        title: 'The Journey',
        icon: '🛸',
        content:
          'Opportunity landed in January 2004 inside Eagle Crater and immediately found layered bedrock indicating sedimentary deposition in standing water. It explored Endurance Crater, reached the giant Endeavour Crater in 2011 (after a 21 km drive), and explored its ancient rim. A global dust storm in June 2018 blocked sunlight from its solar panels; Opportunity transmitted its last signal on 10 June 2018.',
      },
      {
        title: 'Scientific Discoveries',
        icon: '🔬',
        content:
          'Opportunity found jarosite (a sulfate mineral requiring acidic water to form) and hematite spherules ("blueberries") that confirmed ancient Mars had persistent liquid water. At Endeavour Crater, it found phyllosilicate (clay) minerals suggesting neutral-pH water more conducive to life than the acidic water evidence at earlier sites. These discoveries fundamentally shaped our understanding of Mars as an ancient habitable world.',
      },
      {
        title: 'Where Is It Now?',
        icon: '📍',
        content:
          'Opportunity rests at Perseverance Valley on the western rim of Endeavour Crater (1.9462° S, 5.5266° W). It was photographed from orbit by MRO after the dust storm. NASA engineers made over 1,000 recovery attempts before declaring the mission complete on 13 February 2019. The final communication from Opportunity is remembered as "my battery is low and it\'s getting dark."',
      },
      {
        title: 'Its Legacy',
        icon: '🏛️',
        content:
          'Opportunity holds the record for the longest distance driven on another world: 45.16 km. It operated 60 times longer than its design lifetime. Its water evidence transformed Mars from a potentially once-wet world to an ancient world with complex hydrological history. Opportunity\'s longevity proved that robotic Mars missions could conduct decade-scale science programmes, directly inspiring the design goals of Curiosity and Perseverance.',
      },
    ],
  },

  eq_mars_sojourner_pathfinder: {
    id: 'eq_mars_sojourner_pathfinder',
    missionTitle: 'Mars Pathfinder — Sojourner',
    equipmentName: 'Sojourner Rover & Mars Pathfinder Lander',
    category: 'Mars',
    destination: 'Ares Vallis — Carl Sagan Memorial Station',
    badgeVariant: 'mars',
    accentColor: '#f43f5e',
    introduction:
      'On 4 July 1997, Mars Pathfinder landed in Ares Vallis and deployed Sojourner — the first Mars rover. It was a technology demonstration mission that proved rovers could survive landing, deploy, and roam on Mars. The mission captivated the public and laid the foundation for all subsequent Mars rover missions.',
    modelUrl: SOJOURNER_GLB,
    modelNote: 'Sojourner and Mars Pathfinder lander are represented as named objects within the combined Pathfinder GLB model.',
    meta: {
      launchDate: '4 December 1996',
      landingDate: '4 July 1997',
      missionEnd: '27 September 1997 (contact lost)',
      launchVehicle: 'Delta II 7925',
      agency: 'NASA / JPL',
      launchSite: 'Cape Canaveral SLC-17B',
      missionDuration: '83 Martian sols',
      currentStatus: 'Silent at Carl Sagan Memorial Station, Ares Vallis',
      coordinates: '19.33° N, 33.55° W',
    },
    sections: [
      {
        title: 'Meet the Explorer',
        icon: '🚀',
        content:
          'Sojourner was a 10.6 kg, six-wheeled microwave-oven-sized rover — the smallest Mars rover ever. The Mars Pathfinder lander (renamed Carl Sagan Memorial Station after landing) served as a fixed communication relay and science platform. Together, they were a combined mission studying the Martian surface and atmosphere.',
      },
      {
        title: 'Mission & Purpose',
        icon: '🎯',
        content:
          'Mars Pathfinder was primarily a technology demonstration mission for a new, low-cost direct-entry landing system using airbags — a radical departure from Viking\'s retrorocket approach. Sojourner demonstrated that a small rover could be built, survive landing, and perform science on Mars within a constrained budget.',
      },
      {
        title: 'Meet the Technology',
        icon: '⚙️',
        content:
          'Pathfinder used a unique airbag landing system that bounced approximately 15 times before coming to rest. Sojourner was powered by solar panels supplemented by non-rechargeable primary batteries. It carried an Alpha Proton X-ray Spectrometer (APXS) for elemental analysis of rocks. The lander carried a stereo imager (IMP), meteorology sensors, and an accelerometer.',
      },
      {
        title: 'The Journey',
        icon: '🛸',
        content:
          'Mars Pathfinder launched on 4 December 1996 and arrived on 4 July 1997 — American Independence Day. After bouncing to a stop, the petal lander deployed. Sojourner drove off its ramp on 6 July and immediately began analysing rocks named "Barnacle Bill" and "Yogi Bear". The mission returned over 16,500 lander images, 550 rover images, and 8.5 million weather measurements over 83 sols.',
      },
      {
        title: 'Scientific Discoveries',
        icon: '🔬',
        content:
          'Sojourner\'s APXS revealed that the rocks at Ares Vallis had different compositions from Martian meteorites found on Earth, suggesting geological diversity. The meteorology sensors documented a cold, gusty early-morning atmosphere with dust devils. The rocks were found to resemble andesite — consistent with ancient volcanic activity and possible water-driven transport by the ancient flood that carved Ares Vallis.',
      },
      {
        title: 'Where Is It Now?',
        icon: '📍',
        content:
          'Sojourner and the Carl Sagan Memorial Station rest at 19.33° N, 33.55° W in Ares Vallis. The mission ended on 27 September 1997 when the lander failed to respond, cutting off Sojourner\'s relay communications. Sojourner was designed to continue operating but had no direct-to-Earth link. MRO has photographed the landing site from orbit.',
      },
      {
        title: 'Its Legacy',
        icon: '🏛️',
        content:
          'Mars Pathfinder and Sojourner demonstrated that small, affordable Mars surface missions were technically feasible. They captivated a global public audience and created the template of airbag-entry Mars missions used by Spirit and Opportunity. Sojourner is the ancestor of every Mars rover ever built. The mission\'s public engagement model — daily rock name announcements, live mission coverage — established modern planetary mission communication.',
      },
    ],
  },

  eq_mars_viking1: {
    id: 'eq_mars_viking1',
    missionTitle: 'Viking 1',
    equipmentName: 'Viking 1 Lander',
    category: 'Mars',
    destination: 'Chryse Planitia — Thomas Mutch Memorial Station',
    badgeVariant: 'mars',
    accentColor: '#a855f7',
    introduction:
      'Viking 1 became the first spacecraft to successfully land on Mars and conduct science operations on 20 July 1976 — exactly 7 years after Apollo 11\'s Moon landing. It operated for 2,245 Martian sols and conducted the first search for life on another planet through three biological experiments.',
    modelUrl: VIKING_GLB,
    modelNote: 'Viking lander model — shared asset for Viking 1 and Viking 2.',
    meta: {
      launchDate: '20 August 1975',
      landingDate: '20 July 1976',
      missionEnd: '13 November 1982',
      launchVehicle: 'Titan IIIE-Centaur',
      agency: 'NASA / Langley / JPL',
      launchSite: 'Cape Canaveral LC-41',
      missionDuration: '2,245 Martian sols',
      currentStatus: 'Silent at Chryse Planitia',
      coordinates: '22.697° N, 48.222° W',
    },
    sections: [
      {
        title: 'Meet the Explorer',
        icon: '🚀',
        content:
          'The Viking 1 lander was a hexagonal bus 1.5 m in diameter and 574 kg at landing. It carried a biology package, gas chromatograph-mass spectrometer (GCMS), X-ray fluorescence spectrometer (XRFS), two cameras, a seismometer, meteorology instruments, and a soil sampler arm. It was powered by two radioisotope thermoelectric generators (RTGs).',
      },
      {
        title: 'Mission & Purpose',
        icon: '🎯',
        content:
          'The Viking mission was designed to search for life on Mars, characterise the Martian surface and atmosphere, and study the geology of the landing site. The Biology Instrument carried three experiments: the Pyrolytic Release Experiment, Labeled Release Experiment, and Gas Exchange Experiment — each designed to detect metabolic activity by Martian microorganisms.',
      },
      {
        title: 'Meet the Technology',
        icon: '⚙️',
        content:
          'Viking 1 used RTGs for continuous power (unlike solar-powered missions). Its retrorocket descent system used 18 small engines to soft-land without airbags. The Biology Instrument was self-contained with its own automated laboratory — a remarkable engineering achievement for 1976. The lander\'s cameras produced the first colour photographs from the Martian surface.',
      },
      {
        title: 'The Journey',
        icon: '🛸',
        content:
          'Viking 1 launched on 20 August 1975 and reached Mars on 19 June 1976, entering orbit. After extensive surface mapping to find a safe landing site, the lander separated and descended on 20 July 1976 — the 7th anniversary of Apollo 11. It successfully soft-landed at Chryse Planitia and transmitted the first photographs from the Martian surface within minutes.',
      },
      {
        title: 'Scientific Discoveries',
        icon: '🔬',
        content:
          'The Biology Instrument produced ambiguous results: the Labeled Release experiment showed initial positive signs of metabolic activity, but the GCMS found no organic molecules — which are essential for life. The scientific consensus is that the reactive results were caused by inorganic chemistry (possibly perchlorate minerals) rather than biology. Viking found Mars to be geochemically active but showed no definitive evidence of life. It characterised the Martian atmosphere and detected weather patterns.',
      },
      {
        title: 'Where Is It Now?',
        icon: '📍',
        content:
          'Viking 1 rests silently at Thomas Mutch Memorial Station (22.697° N, 48.222° W) in Chryse Planitia. The lander was last heard on 13 November 1982 after a software upload corrupted its antenna-pointing system. MRO has photographed the landing site from orbit, and the lander hardware is visible from space. The RTGs may still produce some residual heat after 48 years.',
      },
      {
        title: 'Its Legacy',
        icon: '🏛️',
        content:
          'Viking 1 proved that soft-landing on Mars was achievable and conducted the most sophisticated automated biological experiments ever attempted on another planet. Its ambiguous biology results drove decades of Mars research and directly shaped the science goals of every subsequent Mars mission. Viking\'s atmospheric data and surface chemistry measurements remain foundational references for Martian science.',
      },
    ],
  },

  eq_mars_viking2: {
    id: 'eq_mars_viking2',
    missionTitle: 'Viking 2',
    equipmentName: 'Viking 2 Lander',
    category: 'Mars',
    destination: 'Utopia Planitia',
    badgeVariant: 'mars',
    accentColor: '#34d399',
    introduction:
      'Viking 2 landed at Utopia Planitia on 3 September 1976, 45 days after Viking 1, to give a second, different location for surface science. Together, the two Vikings provided the first comprehensive characterisation of the Martian surface and conducted the first controlled search for life beyond Earth.',
    modelUrl: VIKING_GLB,
    modelNote: 'Viking lander model — shared asset for Viking 1 and Viking 2.',
    meta: {
      launchDate: '9 September 1975',
      landingDate: '3 September 1976',
      missionEnd: '11 April 1980',
      launchVehicle: 'Titan IIIE-Centaur',
      agency: 'NASA / Langley / JPL',
      launchSite: 'Cape Canaveral LC-41',
      missionDuration: '1,316 Martian sols',
      currentStatus: 'Silent at Utopia Planitia',
      coordinates: '48.269° N, 134.01° W',
    },
    sections: [
      {
        title: 'Meet the Explorer',
        icon: '🚀',
        content:
          'Viking 2 was identical in design to Viking 1 — a 574 kg hexagonal lander with RTG power, Biology Instrument, GCMS, XRFS, cameras, seismometer, and meteorology instruments. Its higher-latitude landing site (48.3° N) gave access to weather patterns and seasonal changes not observed by Viking 1.',
      },
      {
        title: 'Mission & Purpose',
        icon: '🎯',
        content:
          'Viking 2\'s goals were identical to Viking 1\'s: search for life, characterise the surface, and study the atmosphere. The second landing site was chosen at higher latitude to compare the composition and biology results with Chryse Planitia, and to study high-latitude seasonal phenomena including possible water ice.',
      },
      {
        title: 'Meet the Technology',
        icon: '⚙️',
        content:
          'Viking 2\'s seismometer — which malfunctioned on Viking 1 — functioned properly and detected a Marsquake. Its meteorological boom recorded temperature, pressure, and wind data continuously. At high northern latitude, it had the opportunity to observe seasonal changes including frost deposition, which Viking 1 at lower latitude did not.',
      },
      {
        title: 'The Journey',
        icon: '🛸',
        content:
          'Viking 2 launched 20 days after Viking 1 (9 September 1975) and reached Mars on 7 August 1976. It orbited for 25 days while the landing site was evaluated. The lander descended on 3 September 1976, landing at Utopia Planitia after a nominal entry and descent. The landing site was at higher northern latitude than Viking 1, among a rockier terrain.',
      },
      {
        title: 'Scientific Discoveries',
        icon: '🔬',
        content:
          'Viking 2 confirmed Viking 1\'s biology result ambiguity with similar results. Its seismometer detected a seismic event (the first recorded Marsquake) on 22 November 1976. In winter 1977, Viking 2\'s cameras recorded thin frost deposits — the first observation of frost on Mars from the surface. Its atmospheric data confirmed a CO2 cycle with seasonal polar ice cap variations.',
      },
      {
        title: 'Where Is It Now?',
        icon: '📍',
        content:
          'Viking 2 rests at Utopia Planitia (48.269° N, 134.01° W). Its last contact was on 11 April 1980 when its batteries failed — earlier than Viking 1 due to its higher-latitude site receiving less solar power to maintain battery condition. MRO has photographed the landing site from orbit.',
      },
      {
        title: 'Its Legacy',
        icon: '🏛️',
        content:
          'The twin Vikings established Mars exploration as a long-term scientific endeavour. Viking 2\'s frost observation was the first evidence of near-surface water ice at Mars mid-latitudes, later confirmed by Phoenix (2008). The Viking programme cost approximately \$1 billion in 1970s dollars but returned data that shaped Martian science for 40+ years. Viking 2\'s seismometer began Mars seismology — a field extended by InSight in 2018.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  //  DEEP SPACE — 3 MISSIONS
  // ════════════════════════════════════════════════════════════════════════════

  eq_deep_space_dawn: {
    id: 'eq_deep_space_dawn',
    missionTitle: 'Dawn Mission',
    equipmentName: 'Dawn Spacecraft',
    category: 'Deep Space',
    destination: 'Asteroid Belt — Protoplanet Vesta & Dwarf Planet Ceres',
    badgeVariant: 'deep-space',
    accentColor: '#38bdf8',
    introduction:
      'Dawn was the first spacecraft to orbit two separate extraterrestrial bodies and the first to orbit a dwarf planet. Using ion propulsion, it visited the two largest objects in the Asteroid Belt — Vesta (2011–2012) and Ceres (2015–2018) — transforming our understanding of the early Solar System.',
    modelUrl: DAWN_GLB,
    meta: {
      launchDate: '27 September 2007',
      landingDate: 'N/A (orbiter)',
      missionEnd: '1 November 2018',
      launchVehicle: 'Delta II 7925H',
      agency: 'NASA / JPL',
      launchSite: 'Cape Canaveral SLC-17B',
      missionDuration: '11 years, 1 month',
      currentStatus: 'In stable orbit around Ceres — no fuel remaining',
      coordinates: 'Ceres orbit: Asteroid Belt ~2.77 AU',
    },
    sections: [
      {
        title: 'Meet the Explorer',
        icon: '🚀',
        content:
          'Dawn was a 1,217 kg spacecraft with two large solar arrays spanning 19.7 m — necessary to generate the electricity powering its three ion thrusters. It carried a Framing Camera, Visible and Infrared Mapping Spectrometer (VIR), and Gamma Ray and Neutron Detector (GRaND) for surface composition mapping.',
      },
      {
        title: 'Mission & Purpose',
        icon: '🎯',
        content:
          'Dawn was designed to characterise the conditions and processes of the early Solar System by studying two protoplanets that formed at different times and under different conditions. Vesta is a dry, rocky protoplanet similar to inner solar system bodies; Ceres is a water-rich dwarf planet. Together they reveal the diversity of the early solar system.',
      },
      {
        title: 'Meet the Technology',
        icon: '⚙️',
        content:
          'Dawn\'s three xenon-ion thrusters were its defining feature: they produced extremely low thrust (0.09 N) but operated continuously for years, achieving a total velocity change of 11.5 km/s — more than any other spacecraft except Deep Space 1. This made it possible to orbit one body, leave, and orbit another — normally impossible with chemical propulsion.',
      },
      {
        title: 'The Journey',
        icon: '🛸',
        content:
          'Dawn launched in September 2007, flew past Mars for a gravity assist in February 2009, and arrived at Vesta in July 2011. It orbited Vesta for 14 months before departing in September 2012. It arrived at Ceres in March 2015 — the first spacecraft to orbit a dwarf planet — and conducted close orbital observations until its fuel ran out in November 2018.',
      },
      {
        title: 'Scientific Discoveries',
        icon: '🔬',
        content:
          'At Vesta, Dawn discovered the giant Rheasilvia crater covering the south pole and revealed Vesta is a differentiated body with a metal core — confirming it is a surviving protoplanet. At Ceres, Dawn discovered bright salt spots in Occator Crater — hydrothermal brine deposits showing that Ceres harbours liquid water beneath its surface even today. Dawn revealed the Asteroid Belt contains worlds of unexpected geological complexity.',
      },
      {
        title: 'Where Is It Now?',
        icon: '📍',
        content:
          'Dawn remains in a stable orbit around Ceres where it will stay for at least 20 years — perhaps 50 years — before orbital perturbations could cause it to impact the surface. NASA policy requires this extended quarantine to protect Ceres from possible Earth contamination because of the potential for subsurface liquid water. Dawn is silent but orbiting.',
      },
      {
        title: 'Its Legacy',
        icon: '🏛️',
        content:
          'Dawn is the only spacecraft to orbit two extraterrestrial bodies and the first to visit a dwarf planet. Its ion propulsion technology demonstrated a new paradigm for solar system exploration. Its discovery of active briny water at Ceres elevated the dwarf planet to the category of worlds that might harbour conditions for life — a profound shift for astrobiology. Dawn\'s data continues to be published and analysed.',
      },
    ],
  },

  eq_deep_space_near_shoemaker: {
    id: 'eq_deep_space_near_shoemaker',
    missionTitle: 'NEAR Shoemaker',
    equipmentName: 'NEAR Shoemaker Spacecraft',
    category: 'Deep Space',
    destination: 'Near-Earth Asteroid 433 Eros',
    badgeVariant: 'deep-space',
    accentColor: '#f59e0b',
    introduction:
      'NEAR Shoemaker (Near Earth Asteroid Rendezvous) was the first spacecraft to orbit an asteroid and the first to successfully land on one. On 12 February 2001, it touched down on Asteroid 433 Eros — the first soft landing on a small body — and continued transmitting from the surface for 16 days.',
    modelUrl: NEAR_GLB,
    meta: {
      launchDate: '17 February 1996',
      landingDate: '12 February 2001',
      missionEnd: '28 February 2001',
      launchVehicle: 'Delta II 7925-8',
      agency: 'NASA / APL (Johns Hopkins)',
      launchSite: 'Cape Canaveral SLC-17B',
      missionDuration: '5 years, 12 days',
      currentStatus: 'On the surface of Asteroid 433 Eros',
      coordinates: 'Asteroid 433 Eros (varies; ~1.46 AU perihelion)',
    },
    sections: [
      {
        title: 'Meet the Explorer',
        icon: '🚀',
        content:
          'NEAR Shoemaker was a 805 kg spacecraft (at launch) with four solar panels arranged in a pinwheel configuration. It carried an X-ray/Gamma-ray Spectrometer, Near-Infrared Spectrograph, Multi-Spectral Imager, Magnetometer, Laser Rangefinder (NLR), and Radio Science experiment — a comprehensive instrument suite for characterising an asteroid.',
      },
      {
        title: 'Mission & Purpose',
        icon: '🎯',
        content:
          'NEAR was designed to rendezvous with, orbit, and study a near-Earth asteroid to understand the composition, structure, and geology of a primitive solar system body. Eros — an S-type chondrite-like asteroid — was selected as a target accessible with available propulsion. The mission\'s unplanned soft landing extended its science return dramatically.',
      },
      {
        title: 'Meet the Technology',
        icon: '⚙️',
        content:
          'NEAR used bipropellant thrusters for orbital manoeuvres and monopropellant hydrazine for attitude control. The Laser Rangefinder built the first-ever topographic map of a small body. The X-ray spectrometer measured elemental abundances during solar flare events. The soft landing was an improvised mission extension — the spacecraft was not designed to land but survived the descent by using its thrusters as retrorockets.',
      },
      {
        title: 'The Journey',
        icon: '🛸',
        content:
          'NEAR launched in February 1996. It flew past asteroid 253 Mathilde in June 1997 — returning the first images of a C-type asteroid — then received an Earth gravity assist in January 1998. An engine burn failure forced an extended transit before finally achieving orbit around Eros in February 2000. After a year of orbital science, mission controllers improvised a landing on 12 February 2001, after which the spacecraft transmitted gamma-ray spectra from the surface for 16 days.',
      },
      {
        title: 'Scientific Discoveries',
        icon: '🔬',
        content:
          'NEAR\'s orbital data showed Eros is a solid, homogeneous body — not a rubble pile — with a composition similar to ordinary chondrite meteorites. The surface was heavily cratered and covered in regolith. The laser rangefinder produced a detailed topographic map. From the surface, gamma-ray measurements provided the first in-situ elemental abundance data for an asteroid, showing composition similar to the Sun minus volatile elements.',
      },
      {
        title: 'Where Is It Now?',
        icon: '📍',
        content:
          'NEAR Shoemaker rests on the surface of Asteroid 433 Eros near the Himeros depression. Its last transmission was received on 28 February 2001. Eros itself orbits the Sun in a 1.76-year period with a perihelion of ~1.13 AU and aphelion of ~1.78 AU — it regularly comes close to Earth\'s orbit. In 2012, astronomers briefly attempted to regain contact; no signals were detected.',
      },
      {
        title: 'Its Legacy',
        icon: '🏛️',
        content:
          'NEAR Shoemaker proved that spacecraft could orbit and land on small, low-gravity bodies — a capability essential for asteroid defence missions and resource extraction. It established the science and engineering foundation for Japan\'s Hayabusa sample-return missions and NASA\'s OSIRIS-REx. Its improvised landing is a landmark moment in mission operations, demonstrating creative problem-solving to extend science beyond the original plan.',
      },
    ],
  },

  eq_deep_space_pioneer10: {
    id: 'eq_deep_space_pioneer10',
    missionTitle: 'Pioneer 10',
    equipmentName: 'Pioneer 10 Spacecraft',
    category: 'Deep Space',
    destination: 'Outer Solar System & Interstellar Space',
    badgeVariant: 'deep-space',
    accentColor: '#c084fc',
    introduction:
      'Pioneer 10 was the first spacecraft to traverse the Asteroid Belt, conduct a direct flyby of Jupiter, and achieve solar escape velocity — becoming the first human-made object to leave the inner Solar System. It carries the Pioneer Plaque, humanity\'s first physical message intended for extraterrestrial intelligence.',
    modelUrl: PIONEER_GLB,
    meta: {
      launchDate: '3 March 1972',
      landingDate: 'N/A (flyby spacecraft)',
      missionEnd: '23 January 2003 (last signal)',
      launchVehicle: 'Atlas-Centaur / TE364-4',
      agency: 'NASA / Ames Research Center',
      launchSite: 'Cape Canaveral LC-36A',
      missionDuration: 'Signal received for 30+ years; mission ongoing (no contact)',
      currentStatus: 'In interstellar space — heading toward Aldebaran (~68 light-years)',
      coordinates: 'Heliocentric escape — ~133 AU from Sun (est. 2024)',
    },
    sections: [
      {
        title: 'Meet the Explorer',
        icon: '🚀',
        content:
          'Pioneer 10 was a 258 kg spacecraft with a 2.74 m high-gain dish antenna and a hexagonal bus. Its instruments included a magnetometer, plasma analyser, charged particle instrument, cosmic ray telescope, Geiger tube telescope, trapped radiation detector, meteoroid detectors, celestial mechanics experiment, and imaging photopolarimeter. Power came from four SNAP-19 RTGs.',
      },
      {
        title: 'Mission & Purpose',
        icon: '🎯',
        content:
          'Pioneer 10\'s primary goal was to traverse the Asteroid Belt (whose particle density was then unknown), conduct a close flyby of Jupiter, characterise the Jovian magnetic field and radiation environment, and demonstrate that spacecraft could reach the outer Solar System. It was also designed to test whether Jupiter was a solid body or composed entirely of gas.',
      },
      {
        title: 'Meet the Technology',
        icon: '⚙️',
        content:
          'Pioneer 10 was spin-stabilised, rotating 4.8 rpm for thermal control, with the antenna pointed at Earth. The imaging photopolarimeter produced the first close-up images of Jupiter by scanning across the planet as the spacecraft rotated. The RTGs provided ~155 W at launch, decaying to ~65 W by 1997 when contact became marginal. The Pioneer Plaque (designed by Carl Sagan and Frank Drake) was a gold-anodised aluminium plate showing the spacecraft origin.',
      },
      {
        title: 'The Journey',
        icon: '🛸',
        content:
          'Pioneer 10 launched on 3 March 1972 and became the fastest human-made object at the time. It crossed the Asteroid Belt without incident (proving it was traversable) in July 1972. It reached Jupiter on 3 December 1973, passing within 130,000 km — the closest approach then achieved. Jupiter\'s gravity accelerated it onto a solar escape trajectory. It crossed Neptune\'s orbit in 1983 and became the first spacecraft to leave the outer Solar System. The last detectable signal was received on 23 January 2003.',
      },
      {
        title: 'Scientific Discoveries',
        icon: '🔬',
        content:
          'Pioneer 10 confirmed Jupiter is a predominantly liquid hydrogen planet — not solid. It discovered Jupiter\'s intense radiation belts (damaging several instruments). It measured the Jovian magnetic field (the largest planetary magnetic field in the Solar System). Its long cruise to the outer Solar System revealed the Pioneer Anomaly — a small, unexplained deceleration later attributed to anisotropic thermal radiation from the RTGs, resolved only in 2012 through careful modelling.',
      },
      {
        title: 'Where Is It Now?',
        icon: '📍',
        content:
          'Pioneer 10 is in interstellar space, estimated at approximately 133 AU from the Sun (2024), heading in the direction of the constellation Taurus toward Aldebaran — a red giant star approximately 68 light-years away. It will reach Aldebaran\'s vicinity in approximately 2 million years. No signals have been detected since 2003 as its RTG power has decayed below the communication threshold.',
      },
      {
        title: 'Its Legacy',
        icon: '🏛️',
        content:
          'Pioneer 10 fundamentally opened the outer Solar System to exploration. Its success enabled the Voyager programme and all subsequent outer planet missions. The Pioneer Plaque is humanity\'s first intentional message to other civilisations — a profound statement of human existence and curiosity. The resolution of the Pioneer Anomaly improved our models of spacecraft thermal dynamics, with applications across the space industry. Pioneer 10 is an everlasting human artifact in interstellar space.',
      },
    ],
  },
};

/** Returns mission data or null for unknown IDs */
export function getMissionData(id: string): MissionData | null {
  return MISSION_DATA[id] ?? null;
}
