import * as THREE from 'three';
import {
    createSolarPanelTexture,
    createGoldFoilTexture,
    createSilverFoilTexture,
    createStripedBumperTexture
} from './textures.js';

export function buildSojourner() {
    const rover = new THREE.Group();
    rover.name = 'Sojourner_Rover';

    // Textures & Materials
    const goldFoilTex = createGoldFoilTexture(256, 256);
    const solarTex = createSolarPanelTexture(256, 256, 10, 8);
    const silverFoilTex = createSilverFoilTexture(256, 256);
    const bumperTex = createStripedBumperTexture(256, 32);

    const matGoldChassis = new THREE.MeshStandardMaterial({
        map: goldFoilTex,
        metalness: 0.85,
        roughness: 0.35,
        color: 0xffd700,
        name: 'Sojourner_Gold_MLI'
    });

    const matSolarPanel = new THREE.MeshStandardMaterial({
        map: solarTex,
        metalness: 0.7,
        roughness: 0.25,
        name: 'Sojourner_Solar_Panel'
    });

    const matBumper = new THREE.MeshStandardMaterial({
        map: bumperTex,
        metalness: 0.2,
        roughness: 0.6,
        name: 'Sojourner_Bumper'
    });

    const matTitaniumSuspension = new THREE.MeshStandardMaterial({
        color: 0x90959a,
        metalness: 0.9,
        roughness: 0.35,
        name: 'Sojourner_Suspension_Titanium'
    });

    const matAluminumWheel = new THREE.MeshStandardMaterial({
        color: 0xb5bcc4,
        metalness: 0.85,
        roughness: 0.3,
        name: 'Sojourner_Wheel_Aluminum'
    });

    const matCleats = new THREE.MeshStandardMaterial({
        color: 0x687078,
        metalness: 0.95,
        roughness: 0.4,
        name: 'Sojourner_Wheel_Cleats'
    });

    const matBronzeActuator = new THREE.MeshStandardMaterial({
        color: 0xb8860b,
        metalness: 0.9,
        roughness: 0.3,
        name: 'Sojourner_Actuator_Bronze'
    });

    const matDarkMetal = new THREE.MeshStandardMaterial({
        color: 0x22252a,
        metalness: 0.8,
        roughness: 0.5,
        name: 'Sojourner_Dark_Metal'
    });

    const matSensorOptics = new THREE.MeshStandardMaterial({
        color: 0x111115,
        metalness: 0.95,
        roughness: 0.1,
        name: 'Sojourner_Optics'
    });

    const matAntenna = new THREE.MeshStandardMaterial({
        color: 0xdde2e8,
        metalness: 0.95,
        roughness: 0.2,
        name: 'Sojourner_Antenna_Whip'
    });

    const matRedStandoff = new THREE.MeshStandardMaterial({
        color: 0xa82828,
        metalness: 0.6,
        roughness: 0.4,
        name: 'Sojourner_Standoff'
    });

    // -------------------------------------------------------------------------
    // 1. Chassis / Warm Electronics Box (WEB)
    // Real Sojourner: length ~0.48m, width ~0.32m, height ~0.16m
    // -------------------------------------------------------------------------
    const chassisGroup = new THREE.Group();
    chassisGroup.name = 'Chassis_Assembly';

    const chassisGeo = new THREE.BoxGeometry(0.32, 0.16, 0.46);
    const chassisMesh = new THREE.Mesh(chassisGeo, matGoldChassis);
    chassisMesh.position.y = 0.19; // ground clearance ~0.11m + half height
    chassisGroup.add(chassisMesh);

    // Chassis corner structural rails & mounting brackets
    const railMat = matTitaniumSuspension;
    const cornerRailGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.165, 8);
    const railPositions = [
        [-0.155, 0.19, -0.225],
        [0.155, 0.19, -0.225],
        [-0.155, 0.19, 0.225],
        [0.155, 0.19, 0.225]
    ];
    railPositions.forEach(([rx, ry, rz]) => {
        const rail = new THREE.Mesh(cornerRailGeo, railMat);
        rail.position.set(rx, ry, rz);
        chassisGroup.add(rail);
    });

    // Standoff posts holding solar panel above chassis
    const standoffGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.05, 8);
    const standoffPositions = [
        [-0.14, 0.295, -0.20],
        [0.14, 0.295, -0.20],
        [-0.14, 0.295, 0.20],
        [0.14, 0.295, 0.20]
    ];
    standoffPositions.forEach(([sx, sy, sz]) => {
        const standoff = new THREE.Mesh(standoffGeo, matRedStandoff);
        standoff.position.set(sx, sy, sz);
        chassisGroup.add(standoff);
    });

    rover.add(chassisGroup);

    // -------------------------------------------------------------------------
    // 2. Solar Panel Array (Top Deck)
    // Dimensions: 0.48m wide, 0.65m long, 0.015m thick
    // -------------------------------------------------------------------------
    const solarGroup = new THREE.Group();
    solarGroup.name = 'Solar_Panel_Assembly';
    solarGroup.position.set(0, 0.32, 0);

    // Main substrate board
    const panelSubstrateGeo = new THREE.BoxGeometry(0.48, 0.012, 0.64);
    const panelSubstrate = new THREE.Mesh(panelSubstrateGeo, matTitaniumSuspension);
    solarGroup.add(panelSubstrate);

    // Top photovoltaic face
    const panelFaceGeo = new THREE.PlaneGeometry(0.46, 0.62);
    const panelFace = new THREE.Mesh(panelFaceGeo, matSolarPanel);
    panelFace.rotation.x = -Math.PI / 2;
    panelFace.position.y = 0.007;
    solarGroup.add(panelFace);

    // Characteristic black & white striped perimeter bumper
    const bumperFrontBackGeo = new THREE.BoxGeometry(0.486, 0.02, 0.012);
    const bumperFB1 = new THREE.Mesh(bumperFrontBackGeo, matBumper);
    bumperFB1.position.set(0, 0, 0.323);
    solarGroup.add(bumperFB1);

    const bumperFB2 = new THREE.Mesh(bumperFrontBackGeo, matBumper);
    bumperFB2.position.set(0, 0, -0.323);
    solarGroup.add(bumperFB2);

    const bumperSideGeo = new THREE.BoxGeometry(0.012, 0.02, 0.658);
    const bumperSide1 = new THREE.Mesh(bumperSideGeo, matBumper);
    bumperSide1.position.set(0.243, 0, 0);
    solarGroup.add(bumperSide1);

    const bumperSide2 = new THREE.Mesh(bumperSideGeo, matBumper);
    bumperSide2.position.set(-0.243, 0, 0);
    solarGroup.add(bumperSide2);

    // UHF Whip Antenna (distinctive bent rod on solar panel rear-center)
    const antennaGroup = new THREE.Group();
    antennaGroup.name = 'UHF_Antenna';
    antennaGroup.position.set(0, 0.01, -0.22);

    const antBaseGeo = new THREE.CylinderGeometry(0.01, 0.012, 0.03, 12);
    const antBase = new THREE.Mesh(antBaseGeo, matDarkMetal);
    antennaGroup.add(antBase);

    // Segmented curved antenna rod
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.015, 0),
        new THREE.Vector3(0, 0.12, 0),
        new THREE.Vector3(0.03, 0.20, 0.02),
        new THREE.Vector3(0.01, 0.28, -0.01),
        new THREE.Vector3(0.01, 0.48, 0)
    ]);
    const antRodGeo = new THREE.TubeGeometry(curve, 24, 0.0035, 8, false);
    const antRod = new THREE.Mesh(antRodGeo, matAntenna);
    antennaGroup.add(antRod);

    solarGroup.add(antennaGroup);
    rover.add(solarGroup);

    // -------------------------------------------------------------------------
    // 3. Rocker-Bogie Suspension & Wheels (6 Wheels)
    // -------------------------------------------------------------------------
    const suspensionGroup = new THREE.Group();
    suspensionGroup.name = 'Rocker_Bogie_Suspension';

    // Helper: Build a detailed Sojourner wheel with conical dish, hub bolts & 3D cleats
    function createWheel(name) {
        const wheel = new THREE.Group();
        wheel.name = name;

        const wheelRadius = 0.065; // diameter 13 cm
        const wheelWidth = 0.07;   // width 7 cm

        // Outer cylinder rim
        const rimGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 24, 1, true);
        rimGeo.rotateZ(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, matAluminumWheel);
        wheel.add(rim);

        // Inner concave dish
        const dishGeo = new THREE.CylinderGeometry(wheelRadius * 0.95, wheelRadius * 0.4, wheelWidth * 0.8, 16);
        dishGeo.rotateZ(Math.PI / 2);
        const dish = new THREE.Mesh(dishGeo, matAluminumWheel);
        wheel.add(dish);

        // Central hub axle cap
        const hubGeo = new THREE.CylinderGeometry(0.022, 0.022, wheelWidth + 0.006, 12);
        hubGeo.rotateZ(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeo, matDarkMetal);
        wheel.add(hub);

        // Axle bolts (4 small cylinders)
        for (let b = 0; b < 4; b++) {
            const angle = (b * Math.PI) / 2;
            const boltGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.006, 6);
            boltGeo.rotateZ(Math.PI / 2);
            const bolt = new THREE.Mesh(boltGeo, matTitaniumSuspension);
            bolt.position.set(0.038, Math.sin(angle) * 0.012, Math.cos(angle) * 0.012);
            wheel.add(bolt);
        }

        // 3D Conical cleats / spikes around perimeter (2 rows of 16 cleats)
        const cleatGeo = new THREE.ConeGeometry(0.005, 0.01, 5);
        cleatGeo.rotateZ(-Math.PI / 2);
        const cleatCount = 14;
        for (let r = 0; r < 2; r++) {
            const offsetZ = (r === 0 ? -0.02 : 0.02);
            for (let i = 0; i < cleatCount; i++) {
                const angle = (i * Math.PI * 2) / cleatCount + (r * 0.2);
                const cleat = new THREE.Mesh(cleatGeo, matCleats);
                cleat.position.set(
                    offsetZ,
                    Math.cos(angle) * (wheelRadius + 0.004),
                    Math.sin(angle) * (wheelRadius + 0.004)
                );
                cleat.rotation.x = -angle;
                wheel.add(cleat);
            }
        }

        return wheel;
    }

    // Helper: Build a suspension side (left or right)
    function buildSuspensionSide(isLeft) {
        const sideGroup = new THREE.Group();
        const sign = isLeft ? 1 : -1;
        sideGroup.name = isLeft ? 'Suspension_Left' : 'Suspension_Right';

        const chassisSideX = 0.165 * sign;
        const wheelTrackX = 0.245 * sign;

        // Central rocker pivot on side of chassis
        const pivotGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.03, 16);
        pivotGeo.rotateZ(Math.PI / 2);
        const pivot = new THREE.Mesh(pivotGeo, matDarkMetal);
        pivot.position.set(chassisSideX + 0.015 * sign, 0.19, -0.02);
        sideGroup.add(pivot);

        // Main rocker arm extending backward to rear wheel and forward to bogie joint
        const rockerMat = matTitaniumSuspension;
        const rockerGeo = new THREE.BoxGeometry(0.012, 0.026, 0.38);
        const rockerArm = new THREE.Mesh(rockerGeo, rockerMat);
        rockerArm.position.set(wheelTrackX - 0.025 * sign, 0.16, -0.02);
        rockerArm.rotation.x = 0.05 * sign;
        sideGroup.add(rockerArm);

        // Circular lightening holes in rocker arm
        for (let h = -0.12; h <= 0.14; h += 0.07) {
            const holeCyl = new THREE.Mesh(
                new THREE.CylinderGeometry(0.007, 0.007, 0.015, 12),
                matDarkMetal
            );
            holeCyl.rotation.z = Math.PI / 2;
            holeCyl.position.set(wheelTrackX - 0.025 * sign, 0.16, -0.02 + h);
            sideGroup.add(holeCyl);
        }

        // Front bogie arm pivoted from forward part of rocker
        const bogieGeo = new THREE.BoxGeometry(0.01, 0.02, 0.24);
        const bogieArm = new THREE.Mesh(bogieGeo, rockerMat);
        bogieArm.position.set(wheelTrackX - 0.018 * sign, 0.11, 0.14);
        bogieArm.rotation.x = -0.15;
        sideGroup.add(bogieArm);

        // Steering actuators (bronze vertical cylinders on front and rear wheel mounts)
        const actuatorGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.045, 12);

        // Front wheel & actuator
        const frontAct = new THREE.Mesh(actuatorGeo, matBronzeActuator);
        frontAct.position.set(wheelTrackX - 0.015 * sign, 0.09, 0.24);
        sideGroup.add(frontAct);

        const wheelFront = createWheel(isLeft ? 'Wheel_Front_Left' : 'Wheel_Front_Right');
        wheelFront.position.set(wheelTrackX, 0.065, 0.24);
        sideGroup.add(wheelFront);

        // Middle wheel (fixed, no steering actuator)
        const midStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.04, 8), matTitaniumSuspension);
        midStrut.position.set(wheelTrackX - 0.015 * sign, 0.085, 0.04);
        sideGroup.add(midStrut);

        const wheelMid = createWheel(isLeft ? 'Wheel_Mid_Left' : 'Wheel_Mid_Right');
        wheelMid.position.set(wheelTrackX, 0.065, 0.04);
        sideGroup.add(wheelMid);

        // Rear wheel & actuator
        const rearAct = new THREE.Mesh(actuatorGeo, matBronzeActuator);
        rearAct.position.set(wheelTrackX - 0.015 * sign, 0.09, -0.21);
        sideGroup.add(rearAct);

        const wheelRear = createWheel(isLeft ? 'Wheel_Rear_Left' : 'Wheel_Rear_Right');
        wheelRear.position.set(wheelTrackX, 0.065, -0.21);
        sideGroup.add(wheelRear);

        return sideGroup;
    }

    suspensionGroup.add(buildSuspensionSide(true));
    suspensionGroup.add(buildSuspensionSide(false));

    // Top differential crossbar / linkage spanning the chassis width
    const diffBarGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.36, 12);
    diffBarGeo.rotateZ(Math.PI / 2);
    const diffBar = new THREE.Mesh(diffBarGeo, matTitaniumSuspension);
    diffBar.position.set(0, 0.28, -0.02);
    suspensionGroup.add(diffBar);

    rover.add(suspensionGroup);

    // -------------------------------------------------------------------------
    // 4. Scientific Instruments & Sensors
    // -------------------------------------------------------------------------
    const instGroup = new THREE.Group();
    instGroup.name = 'Instruments_Assembly';

    // Forward Stereo Cameras (Stereo monochrome navcams on front face)
    const cameraHousingGeo = new THREE.BoxGeometry(0.12, 0.035, 0.04);
    const cameraHousing = new THREE.Mesh(cameraHousingGeo, matDarkMetal);
    cameraHousing.position.set(0, 0.24, 0.24);
    instGroup.add(cameraHousing);

    // Dual optics apertures
    [-0.035, 0.035].forEach((camX) => {
        const lensMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.009, 0.009, 0.012, 12),
            matSensorOptics
        );
        lensMesh.rotation.x = Math.PI / 2;
        lensMesh.position.set(camX, 0.24, 0.262);
        instGroup.add(lensMesh);
    });

    // Front Laser Stripers (for obstacle triangulation)
    [-0.07, 0.07].forEach((lasX) => {
        const laser = new THREE.Mesh(
            new THREE.CylinderGeometry(0.005, 0.005, 0.015, 8),
            matBronzeActuator
        );
        laser.rotation.x = Math.PI / 2;
        laser.position.set(lasX, 0.20, 0.245);
        instGroup.add(laser);
    });

    // Rear APXS (Alpha Proton X-ray Spectrometer)
    const apxsGroup = new THREE.Group();
    apxsGroup.name = 'APXS_Instrument';
    apxsGroup.position.set(0, 0.17, -0.25);

    // Mounting deployment linkage
    const apxsLink1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.06), matDarkMetal);
    apxsLink1.position.set(0, 0, -0.02);
    apxsGroup.add(apxsLink1);

    // Sensor sensor head canister
    const apxsBodyGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.065, 16);
    apxsBodyGeo.rotateX(Math.PI / 2);
    const apxsBody = new THREE.Mesh(apxsBodyGeo, matTitaniumSuspension);
    apxsBody.position.set(0, -0.01, -0.06);
    apxsGroup.add(apxsBody);

    // Sensor bronze collimator ring
    const apxsRingGeo = new THREE.TorusGeometry(0.024, 0.006, 8, 20);
    const apxsRing = new THREE.Mesh(apxsRingGeo, matBronzeActuator);
    apxsRing.position.set(0, -0.01, -0.095);
    apxsGroup.add(apxsRing);

    instGroup.add(apxsGroup);

    // Towing & lifting handles (front and rear)
    const handleGeo = new THREE.TorusGeometry(0.02, 0.004, 6, 12, Math.PI);
    const handleFront = new THREE.Mesh(handleGeo, matTitaniumSuspension);
    handleFront.rotation.x = Math.PI / 2;
    handleFront.position.set(0, 0.16, 0.24);
    instGroup.add(handleFront);

    rover.add(instGroup);

    return rover;
}
