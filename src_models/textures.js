import * as THREE from 'three';
import zlib from 'node:zlib';

// Polyfill PNG Encoder
export function createPNG(width, height, rgbaBuffer) {
    const crcTable = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        crcTable[i] = c;
    }
    function crc32(buf) {
        let c = 0xFFFFFFFF;
        for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
        return (c ^ 0xFFFFFFFF) >>> 0;
    }
    function makeChunk(type, data) {
        const len = data.length;
        const chunk = Buffer.alloc(12 + len);
        chunk.writeUInt32BE(len, 0);
        chunk.write(type, 4, 4, 'ascii');
        data.copy(chunk, 8);
        const crc = crc32(chunk.subarray(4, 8 + len));
        chunk.writeUInt32BE(crc, 8 + len);
        return chunk;
    }
    const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
    const ihdrChunk = makeChunk('IHDR', ihdr);
    const scanlineLength = width * 4;
    const raw = Buffer.alloc(height * (scanlineLength + 1));
    for (let y = 0; y < height; y++) {
        raw[y * (scanlineLength + 1)] = 0;
        rgbaBuffer.copy(raw, y * (scanlineLength + 1) + 1, y * scanlineLength, (y + 1) * scanlineLength);
    }
    const compressed = zlib.deflateSync(raw);
    const idatChunk = makeChunk('IDAT', compressed);
    const iendChunk = makeChunk('IEND', Buffer.alloc(0));
    return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// Polyfill OffscreenCanvas and FileReader for Node environment
class MockContext2D {
    constructor(canvas) {
        this.canvas = canvas;
        this.data = null;
    }
    translate() {}
    scale() {}
    putImageData(imageData) {
        this.data = Buffer.from(imageData.data);
    }
    drawImage(img) {
        if (img.data) this.data = Buffer.from(img.data);
    }
}

class MockOffscreenCanvas {
    constructor(width, height) {
        this.width = width || 1;
        this.height = height || 1;
        this._ctx = new MockContext2D(this);
    }
    getContext() {
        return this._ctx;
    }
    convertToBlob() {
        const pngBuf = createPNG(this.width, this.height, this._ctx.data);
        return Promise.resolve(new Blob([pngBuf], { type: 'image/png' }));
    }
}

globalThis.OffscreenCanvas = MockOffscreenCanvas;
globalThis.ImageData = class ImageData {
    constructor(data, width, height) {
        this.data = data;
        this.width = width;
        this.height = height;
    }
};

class FileReaderPolyfill {
    readAsArrayBuffer(blob) {
        blob.arrayBuffer().then(buf => {
            this.result = buf;
            if (this.onload) this.onload({ target: this });
            if (this.onloadend) this.onloadend({ target: this });
        }).catch(err => {
            if (this.onerror) this.onerror(err);
            if (this.onloadend) this.onloadend({ target: this });
        });
    }
}
globalThis.FileReader = FileReaderPolyfill;

// Procedural PBR Texture Generators
export function createSolarPanelTexture(width = 256, height = 256, cellCols = 8, cellRows = 8) {
    const data = new Uint8Array(width * height * 4);
    const cellW = width / cellCols;
    const cellH = height / cellRows;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const cx = x % cellW;
            const cy = y % cellH;
            
            // Cell border grid line
            const isBorder = cx < 2 || cy < 2 || cx > cellW - 2 || cy > cellH - 2;
            // Busbar collector lines
            const isBusbar = Math.abs(cx - cellW / 2) < 1 || Math.abs(cy - cellH / 2) < 1;
            // Micro grid lines across wafer
            const isMicroGrid = (Math.floor(cy) % 4 === 0);
            
            if (isBorder) {
                // Silver/grey spacing grid
                data[idx + 0] = 70;
                data[idx + 1] = 80;
                data[idx + 2] = 95;
                data[idx + 3] = 255;
            } else if (isBusbar) {
                // Bright silver metallic collector
                data[idx + 0] = 200;
                data[idx + 1] = 210;
                data[idx + 2] = 225;
                data[idx + 3] = 255;
            } else if (isMicroGrid) {
                // Subtle fine grid line
                data[idx + 0] = 25;
                data[idx + 1] = 40;
                data[idx + 2] = 75;
                data[idx + 3] = 255;
            } else {
                // Dark deep blue / black silicon crystal
                const noise = ((x * 17 + y * 31) % 13) - 6;
                data[idx + 0] = Math.max(10, Math.min(25, 16 + noise));
                data[idx + 1] = Math.max(20, Math.min(45, 30 + noise));
                data[idx + 2] = Math.max(45, Math.min(85, 65 + noise * 2));
                data[idx + 3] = 255;
            }
        }
    }
    const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
}

export function createGoldFoilTexture(width = 256, height = 256) {
    const data = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            // Voronoi / Perlin approximation for crinkles
            const n1 = Math.sin(x * 0.15) * Math.cos(y * 0.15);
            const n2 = Math.sin(x * 0.35 + y * 0.2) * Math.cos(y * 0.35 - x * 0.2);
            const n3 = ((x * 79 + y * 97) % 23) / 23.0;
            const wrinkle = (n1 * 0.4 + n2 * 0.4 + n3 * 0.2);
            
            const r = Math.min(255, Math.max(160, Math.floor(215 + wrinkle * 40)));
            const g = Math.min(255, Math.max(120, Math.floor(165 + wrinkle * 45)));
            const b = Math.min(255, Math.max(20, Math.floor(45 + wrinkle * 30)));
            
            data[idx + 0] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
        }
    }
    const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
}

export function createSilverFoilTexture(width = 256, height = 256) {
    const data = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const n1 = Math.sin(x * 0.18) * Math.cos(y * 0.18);
            const n2 = Math.sin(x * 0.4 + y * 0.25) * Math.cos(y * 0.4 - x * 0.25);
            const wrinkle = (n1 * 0.5 + n2 * 0.5);
            const val = Math.min(255, Math.max(140, Math.floor(205 + wrinkle * 50)));
            
            data[idx + 0] = val;
            data[idx + 1] = val + 2;
            data[idx + 2] = val + 5;
            data[idx + 3] = 255;
        }
    }
    const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
}

export function createWhiteThermalBlanketTexture(width = 256, height = 256) {
    const data = new Uint8Array(width * height * 4);
    const tileSize = 32;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const qx = (x % tileSize) - (tileSize / 2);
            const qy = (y % tileSize) - (tileSize / 2);
            const distCenter = Math.sqrt(qx * qx + qy * qy) / (tileSize * 0.7);
            
            // Diamond stitch seam
            const seamDist = Math.abs((x % tileSize) - (y % tileSize));
            const isSeam = (x % tileSize < 2) || (y % tileSize < 2);
            
            let brightness = 235 - distCenter * 25;
            if (isSeam) brightness = 190;
            
            brightness = Math.min(255, Math.max(170, Math.floor(brightness)));
            data[idx + 0] = brightness;
            data[idx + 1] = brightness - 2;
            data[idx + 2] = brightness - 5;
            data[idx + 3] = 255;
        }
    }
    const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
}

export function createStripedBumperTexture(width = 256, height = 32) {
    const data = new Uint8Array(width * height * 4);
    const stripeW = 16;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const isWhite = (Math.floor(x / stripeW) % 2 === 0);
            const c = isWhite ? 245 : 20;
            data[idx + 0] = c;
            data[idx + 1] = c;
            data[idx + 2] = c;
            data[idx + 3] = 255;
        }
    }
    const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
}

export function createElectronicsPCBTexture(width = 256, height = 256) {
    const data = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            // Base green PCB substrate
            let r = 24, g = 75, b = 40;
            
            // Copper trace lines
            const isTraceX = (y % 16 === 4 || y % 16 === 12);
            const isTraceY = (x % 24 === 6 || x % 24 === 18);
            
            // IC chip packages
            const inIC1 = (x > 30 && x < 90 && y > 30 && y < 70);
            const inIC2 = (x > 120 && x < 200 && y > 100 && y < 180);
            
            if (inIC1 || inIC2) {
                // Black epoxy IC package
                r = 30; g = 30; b = 32;
            } else if (isTraceX || isTraceY) {
                // Gold / copper conductor trace
                r = 185; g = 145; b = 45;
            } else if ((x % 8 === 0) && (y % 8 === 0)) {
                // Silver solder via pin
                r = 180; g = 185; b = 190;
            }
            
            data[idx + 0] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
        }
    }
    const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
}

export function createMirrorTilesTexture(width = 256, height = 256) {
    const data = new Uint8Array(width * height * 4);
    const tileSize = 16;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const isSeam = (x % tileSize === 0) || (y % tileSize === 0);
            if (isSeam) {
                data[idx + 0] = 60;
                data[idx + 1] = 60;
                data[idx + 2] = 65;
            } else {
                data[idx + 0] = 240;
                data[idx + 1] = 245;
                data[idx + 2] = 255;
            }
            data[idx + 3] = 255;
        }
    }
    const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
}
