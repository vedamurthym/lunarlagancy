import * as THREE from 'three';
import {
    createSolarPanelTexture,
    createMirrorTilesTexture,
    createGoldFoilTexture,
    createSilverFoilTexture
} from './textures.js';

export function buildSurveyor3() {
    const surveyor = new THREE.Group();
    surveyor.name = 'Surveyor_3';

    // Textures & Materials
    const solarTex = createSolarPanelTexture(256, 256, 8, 8);
    const mirrorTex = createMirrorTilesTexture(256, 256);
    const goldTex = createGoldFoilTexture(256, 256);
    const silverTex = createSilverFoilTexture(256, 256);

    const matSolarPanel = new THREE.MeshStandardMaterial({
        map: solarTex,
        metalness: 0.8,
        roughness: 0.25,
        name: 'Surveyor3_Solar_Panel'
    });

    const matMirrorTiles = new THREE.MeshStandardMaterial({
        map: mirrorTex,
        metalness: 0.95,
        roughness: 0.1,
        color: 0xf5f8ff,
        name: 'Surveyor3_Thermal_Mirrors'
    });

    const matAluminumPipes = new THREE.MeshStandardMaterial({
        color: 0xd8dde4,
        metalness: 0.9,
        roughness: 0.3,
        name: 'Surveyor3_Aluminum_Tubing'
    });

    const matDarkFrame = new THREE.MeshStandardMaterial({
        color: 0x383e46,
        metalness: 0.85,
        roughness: 0.45,
        name: 'Surveyor3_Dark_Frame'
    });

    const matGoldFoil = new THREE.MeshStandardMaterial({
        map: goldTex,
        metalness: 0.88,
        roughness: 0.35,
        color: 0xffd700,
        name: 'Surveyor3_Gold_MLI'
    });

    const matSilverFoil = new THREE.MeshStandardMaterial({
        map: silverTex,
        metalness: 0.9,
        roughness: 0.3,
        name: 'Surveyor3_Silver_Foil'
    });

    const matFootpad = new THREE.MeshStandardMaterial({
        color: 0xbac0c8,
        metalness: 0.85,
        roughness: 0.5,
        name: 'Surveyor3_Footpad_Honeycomb'
    });

    const matCameraBody = new THREE.MeshStandardMaterial({
        color: 0x4a525d,
        metalness: 0.85,
        roughness: 0.35,
        name: 'Surveyor3_Camera_Body'
    });

    const matOptics = new THREE.MeshStandardMaterial({
        color: 0x08090c,
        metalness: 0.98,
        roughness: 0.05,
        name: 'Surveyor3_Optics_Glass'
    });

    const matSamplerScoop = new THREE.MeshStandardMaterial({
        color: 0x6e7682,
        metalness: 0.92,
        roughness: 0.35,
        name: 'Surveyor3_Sampler_Scoop'
    });

    // -------------------------------------------------------------------------
    // 1. Open Triangular Tubular Aluminum Spaceframe
    // Real Surveyor spaceframe: upright inverted pyramid with 3 main corner vertices
    // Span across corners: ~1.5m at base, height of frame: ~1.2m
    // Total lander height: ~3.3m with mast, footpad span: ~4.2m
    // -------------------------------------------------------------------------
    const frameGroup = new THREE.Group();
    frameGroup.name = 'Spaceframe_Assembly';

    const cornerRadius = 0.85;
    const lowerY = 0.85; // spaceframe base height above ground
    const upperY = 1.95; // apex/upper ring height
    const topRadius = 0.38;

    // Corner vertex coordinates
    const lowerCorners = [];
    const upperCorners = [];
    for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
        lowerCorners.push(new THREE.Vector3(
            Math.cos(angle) * cornerRadius,
            lowerY,
            Math.sin(angle) * cornerRadius
        ));
        upperCorners.push(new THREE.Vector3(
            Math.cos(angle) * topRadius,
            upperY,
            Math.sin(angle) * topRadius
        ));
    }

    // Helper: Build tubular strut between two 3D points
    function createStrut(p1, p2, radius = 0.014, mat = matAluminumPipes) {
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

        const strutGeo = new THREE.CylinderGeometry(radius, radius, len, 8);
        const strut = new THREE.Mesh(strutGeo, mat);
        strut.position.copy(mid);

        // Align cylinder (default along Y) with dir vector
        const axis = new THREE.Vector3(0, 1, 0);
        strut.quaternion.setFromUnitVectors(axis, dir.clone().normalize());
        return strut;
    }

    // Lower triangle ring struts
    for (let i = 0; i < 3; i++) {
        frameGroup.add(createStrut(lowerCorners[i], lowerCorners[(i + 1) % 3]));
    }
    // Upper triangle ring struts
    for (let i = 0; i < 3; i++) {
        frameGroup.add(createStrut(upperCorners[i], upperCorners[(i + 1) % 3]));
    }
    // Vertical / diagonal spaceframe trusses connecting lower and upper corners
    for (let i = 0; i < 3; i++) {
        frameGroup.add(createStrut(lowerCorners[i], upperCorners[i]));
        frameGroup.add(createStrut(lowerCorners[i], upperCorners[(i + 1) % 3]));
    }

    // Internal structural cross-brace members
    const centerBase = new THREE.Vector3(0, lowerY + 0.1, 0);
    for (let i = 0; i < 3; i++) {
        frameGroup.add(createStrut(centerBase, lowerCorners[i], 0.012));
    }

    // Corner node fittings (machined aluminum collar clamps)
    [...lowerCorners, ...upperCorners].forEach((c) => {
        const fitting = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 12), matDarkFrame);
        fitting.position.copy(c);
        frameGroup.add(fitting);
    });

    surveyor.add(frameGroup);

    // -------------------------------------------------------------------------
    // 2. Central Solid Propellant Retro-Rocket & Propellant Tanks
    // -------------------------------------------------------------------------
    const propulsionGroup = new THREE.Group();
    propulsionGroup.name = 'Propulsion_Assembly';

    // Central solid retro-rocket spherical motor casing
    const retroGeo = new THREE.SphereGeometry(0.38, 20, 20);
    const retroMesh = new THREE.Mesh(retroGeo, matSilverFoil);
    retroMesh.position.set(0, lowerY + 0.42, 0);
    propulsionGroup.add(retroMesh);

    // Retro-rocket conical nozzle facing downward
    const nozzleGeo = new THREE.CylinderGeometry(0.08, 0.22, 0.32, 16, 1, true);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, matDarkFrame);
    nozzleMesh.position.set(0, lowerY + 0.12, 0);
    propulsionGroup.add(nozzleMesh);

    // Spherical propellant tanks (3 helium/fuel/oxidizer spheres mounted in frame)
    for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3 + Math.PI / 6;
        const tank = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), matGoldFoil);
        tank.position.set(
            Math.cos(angle) * 0.45,
            lowerY + 0.38,
            Math.sin(angle) * 0.45
        );
        propulsionGroup.add(tank);
    }

    // Three Vernier liquid rocket engines (small nozzles at each lower corner)
    for (let i = 0; i < 3; i++) {
        const c = lowerCorners[i];
        const vernier = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.055, 0.12, 12),
            matDarkFrame
        );
        vernier.position.set(c.x * 0.9, lowerY - 0.05, c.z * 0.9);
        propulsionGroup.add(vernier);
    }

    // Planar radar altimeter antenna (RADVS) underneath spaceframe
    const radvsGeo = new THREE.BoxGeometry(0.28, 0.025, 0.28);
    const radvs = new THREE.Mesh(radvsGeo, matDarkFrame);
    radvs.position.set(0, lowerY - 0.08, 0);
    propulsionGroup.add(radvs);

    surveyor.add(propulsionGroup);

    // -------------------------------------------------------------------------
    // 3. Thermal Electronics Compartments A & B (Mirror Glass Tiles)
    // -------------------------------------------------------------------------
    const electronicsGroup = new THREE.Group();
    electronicsGroup.name = 'Thermal_Electronics_Compartments';

    // Compartment A (Box with top thermal mirrors)
    const compAGeo = new THREE.BoxGeometry(0.42, 0.28, 0.32);
    const compAMesh = new THREE.Mesh(compAGeo, matMirrorTiles);
    compAMesh.position.set(-0.35, lowerY + 0.52, -0.15);
    compAMesh.rotation.y = 0.4;
    electronicsGroup.add(compAMesh);

    // Compartment B
    const compBGeo = new THREE.BoxGeometry(0.38, 0.25, 0.30);
    const compBMesh = new THREE.Mesh(compBGeo, matMirrorTiles);
    compBMesh.position.set(0.35, lowerY + 0.50, -0.15);
    compBMesh.rotation.y = -0.4;
    electronicsGroup.add(compBMesh);

    // Flight control electronics bay & auxiliary battery on third side
    const compCGeo = new THREE.BoxGeometry(0.28, 0.22, 0.24);
    const compCMesh = new THREE.Mesh(compCGeo, matGoldFoil);
    compCMesh.position.set(0, lowerY + 0.48, 0.40);
    electronicsGroup.add(compCMesh);

    surveyor.add(electronicsGroup);

    // -------------------------------------------------------------------------
    // 4. Three Landing Legs and Honeycomb Footpads
    // -------------------------------------------------------------------------
    const legsGroup = new THREE.Group();
    legsGroup.name = 'Landing_Legs_Assembly';

    const footpadRadius = 2.10; // total footpad radial distance from center
    const footpadDiam = 0.26;

    for (let i = 0; i < 3; i++) {
        const legGroup = new THREE.Group();
        legGroup.name = `Landing_Leg_${i + 1}`;

        const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
        const corner = lowerCorners[i];
        const footX = Math.cos(angle) * footpadRadius;
        const footZ = Math.sin(angle) * footpadRadius;
        const footY = 0.04; // ground level

        const footPos = new THREE.Vector3(footX, footY, footZ);

        // Circular honeycomb footpad
        const footpadGeo = new THREE.CylinderGeometry(footpadDiam, footpadDiam * 1.1, 0.05, 20);
        const footpad = new THREE.Mesh(footpadGeo, matFootpad);
        footpad.position.copy(footPos);
        legGroup.add(footpad);

        // Primary landing gear tubular strut
        legGroup.add(createStrut(corner, footPos, 0.024, matAluminumPipes));

        // Oleo pneumatic shock absorber strut (inverted V-struts)
        const midLegPoint = new THREE.Vector3().addVectors(corner, footPos).multiplyScalar(0.5);
        midLegPoint.y += 0.22;

        const shockCylinder = new THREE.Mesh(
            new THREE.CylinderGeometry(0.032, 0.032, 0.42, 12),
            matDarkFrame
        );
        shockCylinder.position.copy(midLegPoint);
        const strutDir = new THREE.Vector3().subVectors(footPos, corner).normalize();
        shockCylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), strutDir);
        legGroup.add(shockCylinder);

        // A-frame side stabilizer struts
        const sideOffset = new THREE.Vector3(-Math.sin(angle) * 0.35, 0, Math.cos(angle) * 0.35);
        const anchorLeft = new THREE.Vector3().addVectors(corner, sideOffset);
        const anchorRight = new THREE.Vector3().subVectors(corner, sideOffset);

        legGroup.add(createStrut(anchorLeft, midLegPoint, 0.014, matAluminumPipes));
        legGroup.add(createStrut(anchorRight, midLegPoint, 0.014, matAluminumPipes));

        // Crushable aluminum honeycomb block mounted directly under frame corner
        const blockGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
        const block = new THREE.Mesh(blockGeo, matFootpad);
        block.position.set(corner.x, lowerY - 0.12, corner.z);
        legGroup.add(block);

        legsGroup.add(legGroup);
    }

    surveyor.add(legsGroup);

    // -------------------------------------------------------------------------
    // 5. Central Mast, Planar Solar Array & High-Gain Antenna
    // -------------------------------------------------------------------------
    const mastGroup = new THREE.Group();
    mastGroup.name = 'Mast_Solar_Antenna_Assembly';

    // Central mast tubular column extending upwards to 3.2m
    const mastGeo = new THREE.CylinderGeometry(0.035, 0.045, 1.45, 16);
    const mast = new THREE.Mesh(mastGeo, matAluminumPipes);
    mast.position.set(0, upperY + 0.65, 0);
    mastGroup.add(mast);

    // Steerable azimuth/elevation gimbal drive unit at mast apex
    const gimbal = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.18), matDarkFrame);
    gimbal.position.set(0, upperY + 1.35, 0);
    mastGroup.add(gimbal);

    // Planar Solar Array panel (0.85m x 1.25m rectangular panel)
    const solarGroup = new THREE.Group();
    solarGroup.name = 'Planar_Solar_Array';
    solarGroup.position.set(0.48, upperY + 1.40, 0);
    solarGroup.rotation.z = -0.35; // realistic deployed tilt toward sun

    const solarPanelSubstrate = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.25, 0.02), matDarkFrame);
    solarGroup.add(solarPanelSubstrate);

    const solarPanelCells = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 1.22), matSolarPanel);
    solarPanelCells.position.z = 0.012;
    solarGroup.add(solarPanelCells);

    // Support bracket
    const solarArm = createStrut(new THREE.Vector3(0, upperY + 1.35, 0), solarGroup.position, 0.02, matAluminumPipes);
    mastGroup.add(solarArm);
    mastGroup.add(solarGroup);

    // High-Gain Planar Array Antenna (mounted adjacent to solar panel)
    const hgaGroup = new THREE.Group();
    hgaGroup.name = 'High_Gain_Antenna';
    hgaGroup.position.set(-0.42, upperY + 1.38, 0);
    hgaGroup.rotation.z = 0.35;

    const hgaDish = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.025), matMirrorTiles);
    hgaGroup.add(hgaDish);

    const hgaFeed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8), matDarkFrame);
    hgaFeed.position.z = 0.08;
    hgaFeed.rotation.x = Math.PI / 2;
    hgaGroup.add(hgaFeed);

    const hgaArm = createStrut(new THREE.Vector3(0, upperY + 1.35, 0), hgaGroup.position, 0.02, matAluminumPipes);
    mastGroup.add(hgaArm);
    mastGroup.add(hgaGroup);

    // Two Omnidirectional Conical Antennas on extended horizontal booms
    for (let o = 0; o < 2; o++) {
        const oAngle = (o === 0 ? 0.8 : -0.8);
        const boomEnd = new THREE.Vector3(Math.cos(oAngle) * 1.45, lowerY + 0.65, Math.sin(oAngle) * 1.45);
        mastGroup.add(createStrut(new THREE.Vector3(0, lowerY + 0.65, 0), boomEnd, 0.01, matAluminumPipes));

        const omniCone = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 12), matDarkFrame);
        omniCone.position.copy(boomEnd);
        omniCone.rotation.x = Math.PI / 2;
        mastGroup.add(omniCone);
    }

    surveyor.add(mastGroup);

    // -------------------------------------------------------------------------
    // 6. Iconic Surveyor 3 Television Survey Camera
    // Vertical cylinder (~0.55m tall) with rotating mirror hood (retrieved by Apollo 12!)
    // Mounted on leg 1 upper frame truss
    // -------------------------------------------------------------------------
    const cameraGroup = new THREE.Group();
    cameraGroup.name = 'Surveyor3_Television_Camera';
    cameraGroup.position.set(-0.32, lowerY + 0.72, 0.35);

    // Camera mounting bracket & electronics base
    const camBase = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.14), matDarkFrame);
    cameraGroup.add(camBase);

    // Camera cylindrical housing
    const camHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.42, 16), matCameraBody);
    camHousing.position.y = 0.24;
    cameraGroup.add(camHousing);

    // Rotating mirror hood assembly at the top
    const hoodGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.14, 16);
    const hood = new THREE.Mesh(hoodGeo, matCameraBody);
    hood.position.y = 0.50;
    cameraGroup.add(hood);

    // 45-degree elliptical optical mirror inside hood
    const mirrorGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.008, 16);
    mirrorGeo.rotateX(Math.PI / 4);
    const mirrorMesh = new THREE.Mesh(mirrorGeo, matOptics);
    mirrorMesh.position.set(0, 0.50, 0.02);
    cameraGroup.add(mirrorMesh);

    // Camera lens aperture
    const aperture = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.04, 16), matDarkFrame);
    aperture.position.set(0, 0.50, 0.076);
    cameraGroup.add(aperture);

    surveyor.add(cameraGroup);

    // -------------------------------------------------------------------------
    // 7. Soil Mechanics Surface Sampler (SMSS)
    // Pantograph motorized scissor-arm mechanism & scoop bucket
    // Mounted on leg 2 / spaceframe side
    // -------------------------------------------------------------------------
    const samplerGroup = new THREE.Group();
    samplerGroup.name = 'Soil_Mechanics_Surface_Sampler';
    samplerGroup.position.set(0.45, lowerY + 0.35, 0.30);

    // Base motor drive gearbox
    const samplerGearbox = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.12), matDarkFrame);
    samplerGroup.add(samplerGearbox);

    // Pantograph scissor extension linkages extending down toward lunar ground
    const p1 = new THREE.Vector3(0, 0, 0);
    const p2 = new THREE.Vector3(0.25, -0.25, 0.20);
    const p3 = new THREE.Vector3(0.50, -0.55, 0.38);
    const p4 = new THREE.Vector3(0.72, -0.80, 0.52);

    samplerGroup.add(createStrut(p1, p2, 0.012, matAluminumPipes));
    samplerGroup.add(createStrut(p2, p3, 0.012, matAluminumPipes));
    samplerGroup.add(createStrut(p3, p4, 0.012, matAluminumPipes));

    // Parallel stabilizer scissor rods
    const p1b = new THREE.Vector3(0, 0.06, 0);
    const p2b = new THREE.Vector3(0.25, -0.19, 0.20);
    const p3b = new THREE.Vector3(0.50, -0.49, 0.38);
    samplerGroup.add(createStrut(p1b, p2b, 0.008, matAluminumPipes));
    samplerGroup.add(createStrut(p2b, p3b, 0.008, matAluminumPipes));

    // Pantograph joint pivot pins
    [p1, p2, p3, p4].forEach(pt => {
        const joint = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), matGoldFoil);
        joint.position.copy(pt);
        samplerGroup.add(joint);
    });

    // Mechanical scoop / bucket with cutting blade at the tip (touching ground regolith!)
    const scoopGroup = new THREE.Group();
    scoopGroup.position.copy(p4);
    scoopGroup.name = 'Sampler_Scoop_Bucket';

    // Scoop bucket housing
    const bucketGeo = new THREE.BoxGeometry(0.08, 0.06, 0.12);
    const bucket = new THREE.Mesh(bucketGeo, matSamplerScoop);
    scoopGroup.add(bucket);

    // Sharp scraper cutting blade
    const bladeGeo = new THREE.BoxGeometry(0.082, 0.008, 0.04);
    const blade = new THREE.Mesh(bladeGeo, matAluminumPipes);
    blade.position.set(0, -0.028, 0.06);
    scoopGroup.add(blade);

    samplerGroup.add(scoopGroup);
    surveyor.add(samplerGroup);

    return surveyor;
}
