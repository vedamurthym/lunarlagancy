import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'node:fs';
import path from 'node:path';

// Import model builders
import { buildSojourner } from './sojourner.js';
import { buildPathfinder } from './pathfinder.js';
import { buildSurveyor3 } from './surveyor3.js';

// Output directories
const marsOutDir = 'modified-models/mars';
const moonOutDir = 'modified-models/moon';
fs.mkdirSync(marsOutDir, { recursive: true });
fs.mkdirSync(moonOutDir, { recursive: true });

// Also mirror to LunarLagancy
const lunarMarsOutDir = 'LunarLagancy/modified-models/mars';
const lunarMoonOutDir = 'LunarLagancy/modified-models/moon';
fs.mkdirSync(lunarMarsOutDir, { recursive: true });
fs.mkdirSync(lunarMoonOutDir, { recursive: true });

const exporter = new GLTFExporter();

console.log('='.repeat(80));
console.log('SPACE HERITAGE EXPLORER — THREE.JS 3D MODEL GENERATOR');
console.log('='.repeat(80));

// =============================================================================
// 1. BUILD MARS COMBINED SCENE: Sojourner Rover + Mars Pathfinder Lander
// =============================================================================
console.log('\n[1/2] Building Mars combined model: Sojourner + Pathfinder...');
const marsScene = new THREE.Scene();
marsScene.name = 'Mars_Exploration_Scene';

const lander = buildPathfinder();
lander.name = 'Mars_Pathfinder_Lander';
lander.position.set(0, 0, 0);
marsScene.add(lander);

const rover = buildSojourner();
rover.name = 'Sojourner_Rover';
// Position Sojourner right at the foot of the deployment ramp on Petal 1
rover.position.set(0, 0.00, 1.45);
rover.rotation.y = Math.PI; // facing forward down the ramp into the Martian terrain!
marsScene.add(rover);

console.log('  -> Mars scene assembled with 2 separate named objects:');
console.log(`     - ${lander.name} (position: ${lander.position.toArray().join(', ')})`);
console.log(`     - ${rover.name} (position: ${rover.position.toArray().join(', ')})`);

console.log('  -> Exporting binary GLB for Mars...');
const marsGLB = await exporter.parseAsync(marsScene, { binary: true });
const marsPath = path.join(marsOutDir, 'sojourner_pathfinder.glb');
const lunarMarsPath = path.join(lunarMarsOutDir, 'sojourner_pathfinder.glb');

fs.writeFileSync(marsPath, Buffer.from(marsGLB));
fs.writeFileSync(lunarMarsPath, Buffer.from(marsGLB));
console.log(`  [SUCCESS] Saved Mars GLB: ${marsPath} (${(marsGLB.byteLength / 1024).toFixed(1)} KB)`);

// =============================================================================
// 2. BUILD MOON SCENE: Surveyor 3
// =============================================================================
console.log('\n[2/2] Building Moon model: Surveyor 3...');
const moonScene = new THREE.Scene();
moonScene.name = 'Moon_Exploration_Scene';

const surveyor = buildSurveyor3();
surveyor.name = 'Surveyor_3';
surveyor.position.set(0, 0, 0);
moonScene.add(surveyor);

console.log('  -> Surveyor 3 model assembled:');
console.log(`     - ${surveyor.name} (position: ${surveyor.position.toArray().join(', ')})`);

console.log('  -> Exporting binary GLB for Moon...');
const moonGLB = await exporter.parseAsync(moonScene, { binary: true });
const moonPath = path.join(moonOutDir, 'surveyor_3.glb');
const lunarMoonPath = path.join(lunarMoonOutDir, 'surveyor_3.glb');

fs.writeFileSync(moonPath, Buffer.from(moonGLB));
fs.writeFileSync(lunarMoonPath, Buffer.from(moonGLB));
console.log(`  [SUCCESS] Saved Moon GLB: ${moonPath} (${(moonGLB.byteLength / 1024).toFixed(1)} KB)`);

console.log('\n' + '='.repeat(80));
console.log('BOTH DELIVERABLES EXPORTED SUCCESSFULLY!');
console.log('='.repeat(80));
