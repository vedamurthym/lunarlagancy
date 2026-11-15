import * as THREE from 'three';
import {
    createSolarPanelTexture,
    createWhiteThermalBlanketTexture,
    createElectronicsPCBTexture,
    createGoldFoilTexture,
    createSilverFoilTexture
} from './textures.js';

export function buildPathfinder() {
    const lander = new THREE.Group();
    lander.name = 'Mars_Pathfinder_Lander';

    // Textures & Materials
    const solarTex = createSolarPanelTexture(512, 512, 12, 12);
    const whiteBlanketTex = createWhiteThermalBlanketTexture(256, 256);
    const pcbTex = createElectronicsPCBTexture(256, 256);
    const goldTex = createGoldFoilTexture(256, 256);
    const silverTex = createSilverFoilTexture(256, 256);

    const matSolarPetal = new THREE.MeshStandardMaterial({
        map: solarTex,
        metalness: 0.75,
        roughness: 0.25,
        name: 'Pathfinder_Solar_Petal'
    });

    const matWhiteBlanket = new THREE.MeshStandardMaterial({
        map: whiteBlanketTex,
        metalness: 0.15,
        roughness: 0.7,
        name: 'Pathfinder_Thermal_Blanket'
    });

    const matPCB = new THREE.MeshStandardMaterial({
        map: pcbTex,
        metalness: 0.6,
        roughness: 0.4,
        name: 'Pathfinder_Electronics_PCB'
    });

    const matStructure = new THREE.MeshStandardMaterial({
        color: 0xc8cdd4,
        metalness: 0.85,
        roughness: 0.35,
        name: 'Pathfinder_Structural_Alloy'
    });

    const matDarkFrame = new THREE.MeshStandardMaterial({
        color: 0x444a52,
        metalness: 0.8,
        roughness: 0.5,
        name: 'Pathfinder_Dark_Frame'
    });

    const matGoldHardware = new THREE.MeshStandardMaterial({
        map: goldTex,
        metalness: 0.9,
        roughness: 0.3,
        color: 0xffd700,
        name: 'Pathfinder_Gold_Hardware'
    });

    const matRampTrack = new THREE.MeshStandardMaterial({
        color: 0x8a929c,
        metalness: 0.9,
        roughness: 0.4,
        name: 'Pathfinder_Rover_Ramp'
    });

    const matOptics = new THREE.MeshStandardMaterial({
        color: 0x0a0c10,
        metalness: 0.95,
        roughness: 0.1,
        name: 'Pathfinder_Optics'
    });

    // -------------------------------------------------------------------------
    // 1. Central Triangular Base & Landing Structure
    // Real Pathfinder base: equilateral triangle ~0.9m side length, height ~0.08m
    // -------------------------------------------------------------------------
    const baseGroup = new THREE.Group();
    baseGroup.name = 'Base_Assembly';

    // Triangular base platform
    const baseShape = new THREE.Shape();
    const baseRadius = 0.55;
    for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
        const bx = Math.cos(angle) * baseRadius;
        const bz = Math.sin(angle) * baseRadius;
        if (i === 0) baseShape.moveTo(bx, bz);
        else baseShape.lineTo(bx, bz);
    }
    baseShape.closePath();

    const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
    baseGeo.rotateX(Math.PI / 2);
    const basePlate = new THREE.Mesh(baseGeo, matStructure);
    basePlate.position.y = 0.05;
    baseGroup.add(basePlate);

    // Three corner footpads underneath the base
    for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
        const fx = Math.cos(angle) * (baseRadius * 0.9);
        const fz = Math.sin(angle) * (baseRadius * 0.9);

        const footpad = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.09, 0.03, 16),
            matDarkFrame
        );
        footpad.position.set(fx, 0.015, fz);
        baseGroup.add(footpad);

        // Airbag retention loops & corner brackets
        const loop = new THREE.Mesh(
            new THREE.TorusGeometry(0.025, 0.006, 6, 12),
            matGoldHardware
        );
        loop.position.set(fx * 1.08, 0.06, fz * 1.08);
        baseGroup.add(loop);
    }

    lander.add(baseGroup);

    // -------------------------------------------------------------------------
    // 2. Central Electronics Enclosure (WEB)
    // Truncated pyramid with quilted white thermal blanket & exposed PCB panels
    // -------------------------------------------------------------------------
    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'Central_Electronics_Body';
    bodyGroup.position.set(0, 0.06, 0);

    // Main insulated equipment body
    const bodyGeo = new THREE.CylinderGeometry(0.24, 0.36, 0.32, 6);
    const bodyMesh = new THREE.Mesh(bodyGeo, matWhiteBlanket);
    bodyMesh.position.y = 0.16;
    bodyGroup.add(bodyMesh);

    // Top deck plate
    const topDeckGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.015, 6);
    const topDeck = new THREE.Mesh(topDeckGeo, matStructure);
    topDeck.position.y = 0.325;
    bodyGroup.add(topDeck);

    // Side Electronics Bays (Exposed PCB boards as seen in Image 2!)
    const pcbBay1 = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.16), matPCB);
    pcbBay1.position.set(0.26, 0.16, 0.08);
    pcbBay1.rotation.y = Math.PI / 2.8;
    bodyGroup.add(pcbBay1);

    const pcbBay2 = new THREE.Mesh(new THREE.PlaneGeometry(0.10, 0.16), matPCB);
    pcbBay2.position.set(0.22, 0.16, -0.12);
    pcbBay2.rotation.y = Math.PI / 2.2;
    bodyGroup.add(pcbBay2);

    // Cabling harness & wiring conduit bundles (gold/copper bundles routing to petals)
    for (let c = 0; c < 5; c++) {
        const wireCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.18, 0.06 + c * 0.03, -0.05 + c * 0.04),
            new THREE.Vector3(0.28, 0.03, 0.05 + c * 0.03),
            new THREE.Vector3(0.38, 0.02, 0.15 + c * 0.02)
        ]);
        const wireGeo = new THREE.TubeGeometry(wireCurve, 12, 0.005, 6, false);
        const wire = new THREE.Mesh(wireGeo, matGoldHardware);
        bodyGroup.add(wire);
    }

    lander.add(bodyGroup);

    // -------------------------------------------------------------------------
    // 3. Three Deployed Solar Panel Petals
    // Arranged symmetrically at 120° angles (deployed flat on the ground)
    // -------------------------------------------------------------------------
    const petalsGroup = new THREE.Group();
    petalsGroup.name = 'Solar_Petals_Assembly';

    // Petal geometry: trapezoid extending outwards
    function createPetal(index) {
        const petal = new THREE.Group();
        const angle = (index * 2 * Math.PI) / 3 - Math.PI / 2;
        petal.name = `Petal_${index + 1}`;
        petal.rotation.y = -angle + Math.PI / 2;
        petal.position.set(Math.cos(angle) * (baseRadius * 0.75), 0.045, Math.sin(angle) * (baseRadius * 0.75));

        // Petal shape (trapezoid extending 1.1 meters out)
        const innerW = 0.52;
        const outerW = 0.76;
        const petalL = 1.05;

        const pShape = new THREE.Shape();
        pShape.moveTo(-innerW / 2, 0);
        pShape.lineTo(innerW / 2, 0);
        pShape.lineTo(outerW / 2, petalL);
        pShape.lineTo(-outerW / 2, petalL);
        pShape.closePath();

        const pExtrude = new THREE.ExtrudeGeometry(pShape, { depth: 0.03, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008 });
        pExtrude.rotateX(Math.PI / 2);

        // Petal structural frame
        const petalFrame = new THREE.Mesh(pExtrude, matStructure);
        petal.add(petalFrame);

        // Top solar array face
        const solarFace = new THREE.Mesh(pExtrude, matSolarPetal);
        solarFace.position.y = 0.016;
        solarFace.scale.set(0.96, 1, 0.96);
        petal.add(solarFace);

        // Structural longitudinal and transverse stiffener ribs
        const ribGeo = new THREE.BoxGeometry(0.015, 0.012, petalL * 0.95);
        const centerRib = new THREE.Mesh(ribGeo, matStructure);
        centerRib.position.set(0, 0.02, petalL * 0.5);
        petal.add(centerRib);

        const crossRibGeo = new THREE.BoxGeometry(outerW * 0.85, 0.012, 0.015);
        const crossRib = new THREE.Mesh(crossRibGeo, matStructure);
        crossRib.position.set(0, 0.02, petalL * 0.5);
        petal.add(crossRib);

        // Petal hinge cylinders connecting to central base
        const hingeGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.12, 12);
        hingeGeo.rotateZ(Math.PI / 2);
        [-0.18, 0.18].forEach(hx => {
            const hinge = new THREE.Mesh(hingeGeo, matDarkFrame);
            hinge.position.set(hx, 0.01, 0.02);
            petal.add(hinge);
        });

        // Airbag tie-down brackets and guide handles along outer perimeter
        [-outerW / 2 + 0.05, 0, outerW / 2 - 0.05].forEach(ox => {
            const bracket = new THREE.Mesh(
                new THREE.BoxGeometry(0.03, 0.025, 0.04),
                matStructure
            );
            bracket.position.set(ox, 0.015, petalL);
            petal.add(bracket);
        });

        // If this is the Front Petal (index 0), attach the Rover Deployment Ramps!
        if (index === 0) {
            const rampGroup = new THREE.Group();
            rampGroup.name = 'Rover_Deployment_Ramps';

            // Two parallel deployment track rails
            const trackWidth = 0.11;
            const trackSpacing = 0.24; // matches Sojourner wheel track!
            const rampLength = 1.15;

            [-trackSpacing / 2, trackSpacing / 2].forEach(tx => {
                // Ramp base surface
                const rampGeo = new THREE.BoxGeometry(trackWidth, 0.008, rampLength);
                const rampMesh = new THREE.Mesh(rampGeo, matRampTrack);
                rampMesh.position.set(tx, 0.03, rampLength * 0.48);
                rampGroup.add(rampMesh);

                // Raised side guide flanges
                [-trackWidth / 2, trackWidth / 2].forEach(fx => {
                    const flange = new THREE.Mesh(
                        new THREE.BoxGeometry(0.006, 0.025, rampLength),
                        matStructure
                    );
                    flange.position.set(tx + fx, 0.04, rampLength * 0.48);
                    rampGroup.add(flange);
                });

                // Anti-slip transverse traction ribs across the ramp
                for (let r = 0.1; r < rampLength; r += 0.08) {
                    const treadRib = new THREE.Mesh(
                        new THREE.BoxGeometry(trackWidth - 0.01, 0.004, 0.008),
                        matDarkFrame
                    );
                    treadRib.position.set(tx, 0.035, r);
                    rampGroup.add(treadRib);
                }
            });

            petal.add(rampGroup);
        }

        // Radiometric calibration target on petal 2
        if (index === 1) {
            const calibTarget = new THREE.Group();
            calibTarget.name = 'Radiometric_Calibration_Target';
            calibTarget.position.set(0.15, 0.035, 0.4);

            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.06, 8), matStructure);
            calibTarget.add(post);

            const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.008, 16), matGoldHardware);
            disk.position.y = 0.03;
            calibTarget.add(disk);

            petal.add(calibTarget);
        }

        return petal;
    }

    for (let i = 0; i < 3; i++) {
        petalsGroup.add(createPetal(i));
    }

    lander.add(petalsGroup);

    // -------------------------------------------------------------------------
    // 4. IMP (Imager for Mars Pathfinder) Camera Mast
    // Tall telescoping mast extending ~1.0m above central deck
    // -------------------------------------------------------------------------
    const impMastGroup = new THREE.Group();
    impMastGroup.name = 'IMP_Camera_Mast';
    impMastGroup.position.set(-0.06, 0.38, -0.04);

    // Base collar mounting ring
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.05, 16), matStructure);
    impMastGroup.add(collar);

    // Telescoping mast tubes (3 concentric sections)
    const mastTube1 = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.35, 16), matStructure);
    mastTube1.position.y = 0.18;
    impMastGroup.add(mastTube1);

    const mastTube2 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.35, 16), matStructure);
    mastTube2.position.y = 0.48;
    impMastGroup.add(mastTube2);

    const mastTube3 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.25, 16), matStructure);
    mastTube3.position.y = 0.74;
    impMastGroup.add(mastTube3);

    // IMP Stereo Camera Head Unit (at ~0.9m height)
    const cameraHead = new THREE.Group();
    cameraHead.name = 'IMP_Stereo_Camera_Head';
    cameraHead.position.y = 0.88;

    // Azimuth/elevation pivot yoke
    const yoke = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.05), matDarkFrame);
    cameraHead.add(yoke);

    // Main camera housing body
    const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.07, 0.08), matStructure);
    camBody.position.y = 0.04;
    cameraHead.add(camBody);

    // Dual stereo optical lenses with sun hoods
    [-0.042, 0.042].forEach(cx => {
        const lensHood = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.035, 16), matDarkFrame);
        lensHood.rotation.x = Math.PI / 2;
        lensHood.position.set(cx, 0.04, 0.05);
        cameraHead.add(lensHood);

        const lensGlass = new THREE.Mesh(new THREE.CircleGeometry(0.012, 16), matOptics);
        lensGlass.position.set(cx, 0.04, 0.068);
        cameraHead.add(lensGlass);
    });

    impMastGroup.add(cameraHead);
    lander.add(impMastGroup);

    // -------------------------------------------------------------------------
    // 5. Antennas & Meteorology (ASI/MET) Mast
    // -------------------------------------------------------------------------
    const commsGroup = new THREE.Group();
    commsGroup.name = 'Communications_Assembly';
    commsGroup.position.set(0.12, 0.38, -0.06);

    // High-Gain Antenna mast with white cylindrical radome
    const hgaPost = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.22, 12), matStructure);
    hgaPost.position.y = 0.11;
    commsGroup.add(hgaPost);

    const hgaRadome = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 16), matWhiteBlanket);
    hgaRadome.position.y = 0.28;
    commsGroup.add(hgaRadome);

    // Low-gain whip antenna
    const lgaWhip = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.45, 8), matStructure);
    lgaWhip.position.set(0.04, 0.35, 0.02);
    commsGroup.add(lgaWhip);

    lander.add(commsGroup);

    // ASI/MET (Atmospheric Structure Investigation / Meteorology) Mast
    const metMastGroup = new THREE.Group();
    metMastGroup.name = 'ASI_MET_Meteorology_Mast';
    metMastGroup.position.set(0.16, 0.38, 0.12);

    const metMastRod = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.008, 0.75, 8), matStructure);
    metMastRod.position.y = 0.375;
    metMastGroup.add(metMastRod);

    // Three thermocouple flags at 0.25m, 0.50m, 0.75m heights
    [0.25, 0.50, 0.70].forEach((my, idx) => {
        const flag = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.015, 0.004),
            matGoldHardware
        );
        flag.position.set(0.025, my, 0);
        metMastGroup.add(flag);

        const sensorProbe = new THREE.Mesh(
            new THREE.CylinderGeometry(0.003, 0.003, 0.025, 6),
            matDarkFrame
        );
        sensorProbe.rotation.z = Math.PI / 2;
        sensorProbe.position.set(0.012, my, 0);
        metMastGroup.add(sensorProbe);
    });

    lander.add(metMastGroup);

    return lander;
}
