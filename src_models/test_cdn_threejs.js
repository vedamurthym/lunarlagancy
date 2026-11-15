// Node.js polyfills for Three.js GLTFLoader
if (typeof globalThis.self === 'undefined')       globalThis.self = globalThis;
if (typeof globalThis.window === 'undefined')     globalThis.window = globalThis;
if (typeof globalThis.document === 'undefined') {
    globalThis.document = {
        createElementNS: (_ns, tag) => {
            if (tag === 'img') {
                const img = { src: '', onload: null, onerror: null, width: 1, height: 1 };
                Object.defineProperty(img, 'src', {
                    set(v) { this._src = v; setTimeout(() => { if (this.onload) this.onload(); }, 0); },
                    get() { return this._src; }
                });
                return img;
            }
            return {};
        },
        createElement: (tag) => {
            if (tag === 'canvas') return { getContext: () => null, width: 1, height: 1 };
            return {};
        }
    };
}
if (typeof globalThis.URL === 'undefined') {
    globalThis.URL = { createObjectURL: () => '', revokeObjectURL: () => {} };
}

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

console.log('='.repeat(80));
console.log('TESTING THREE.JS GLTFLOADER PARSE OVER SUPABASE CDN NETWORK URLS');
console.log('='.repeat(80));

const loader = new GLTFLoader();

async function testCdnLoad(label, url) {
    console.log(`\nFetching ${label} from CDN: ${url}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const arrayBuffer = await res.arrayBuffer();
    console.log(`Downloaded ${arrayBuffer.byteLength.toLocaleString()} bytes. Parsing with Three.js GLTFLoader...`);

    return new Promise((resolve, reject) => {
        loader.parse(arrayBuffer, '', (gltf) => {
            console.log(`  [PASS] Successfully parsed ${label}!`);
            console.log(`  Scene name: "${gltf.scene.name}"`);
            console.log(`  Children count: ${gltf.scene.children.length}`);
            gltf.scene.children.forEach((c, idx) => {
                console.log(`    Child [${idx}]: name="${c.name}", type="${c.type}"`);
            });
            resolve(gltf);
        }, reject);
    });
}

try {
    await testCdnLoad(
        'Sojourner + Pathfinder',
        'https://hblojsryggnotcurccra.supabase.co/storage/v1/object/public/3d-models/mars/sojourner_pathfinder.glb'
    );
    await testCdnLoad(
        'Surveyor 3',
        'https://hblojsryggnotcurccra.supabase.co/storage/v1/object/public/3d-models/moon/surveyor_3.glb'
    );
    console.log('\n' + '='.repeat(80));
    console.log('SUPABASE CDN TO THREE.JS GLTFLOADER: 100% OPERATIONAL & VERIFIED!');
    console.log('='.repeat(80));
} catch (e) {
    console.error('Test failed:', e);
    process.exit(1);
}
