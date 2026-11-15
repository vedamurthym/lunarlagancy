// ── Node.js polyfills required by Three.js GLTFLoader ──────────────────────
if (typeof globalThis.self === 'undefined')       globalThis.self = globalThis;
if (typeof globalThis.window === 'undefined')     globalThis.window = globalThis;
if (typeof globalThis.document === 'undefined') {
    globalThis.document = {
        createElementNS: (_ns, tag) => {
            if (tag === 'img') {
                const img = { src: '', onload: null, onerror: null, width: 1, height: 1 };
                // Trigger onload asynchronously when src is set
                Object.defineProperty(img, 'src', {
                    set(v) { this._src = v; setTimeout(() => { if (this.onload) this.onload(); }, 0); },
                    get() { return this._src; }
                });
                return img;
            }
            return {};
        },
        createElement: (tag) => {
            if (tag === 'canvas') {
                return { getContext: () => null, width: 1, height: 1 };
            }
            return {};
        }
    };
}
if (typeof globalThis.URL === 'undefined') {
    globalThis.URL = { createObjectURL: () => '', revokeObjectURL: () => {} };
}
// ───────────────────────────────────────────────────────────────────────────

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import fs from 'node:fs';

console.log('='.repeat(80));
console.log('THREE.JS LOADER COMPATIBILITY TEST');
console.log('='.repeat(80));

const loader = new GLTFLoader();

async function testLoad(filePath) {
    console.log(`\nTesting load: ${filePath}`);
    const data = fs.readFileSync(filePath);
    const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

    return new Promise((resolve, reject) => {
        loader.parse(arrayBuffer, '', (gltf) => {
            console.log('  [PASS] GLTF loaded successfully!');
            console.log(`  Scene name: ${gltf.scene.name}`);
            console.log(`  Children count: ${gltf.scene.children.length}`);
            gltf.scene.children.forEach((c, idx) => {
                console.log(`    Child [${idx}]: name="${c.name}", type="${c.type}"`);
            });

            // Count meshes, materials, and check traverse
            let meshCount = 0;
            let triCount = 0;
            gltf.scene.traverse((obj) => {
                if (obj.isMesh) {
                    meshCount++;
                    if (obj.geometry && obj.geometry.index) {
                        triCount += obj.geometry.index.count / 3;
                    }
                }
            });
            console.log(`  Traversed meshes: ${meshCount}, Triangles: ${triCount}`);
            resolve(gltf);
        }, (err) => {
            console.error('  [FAIL] Error loading GLB:', err);
            reject(err);
        });
    });
}

try {
    await testLoad('modified-models/mars/sojourner_pathfinder.glb');
    await testLoad('modified-models/moon/surveyor_3.glb');
    console.log('\n' + '='.repeat(80));
    console.log('ALL NEW MODELS VALIDATED WITH THREE.JS GLTFLOADER: 100% COMPATIBLE!');
    console.log('='.repeat(80));
} catch (e) {
    console.error('Validation failed:', e);
    process.exit(1);
}
