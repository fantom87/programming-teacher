// Generates app/build/icon.ico and icon.png: a rubber duck on a dark rounded
// tile. No image libraries — shapes are drawn from maths, anti-aliased by
// supersampling, and PNG-encoded through zlib.
import zlib from "node:zlib";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SIZE = 256;
const SS = 4; // subsamples per axis; 16 coverage tests per pixel

const px = new Uint8Array(SIZE * SIZE * 4);

// Source-over compositing. Everything is drawn onto a transparent canvas, so
// the rounded tile's own edge antialiases against nothing and stays clean when
// the icon sits on a light taskbar.
function blend(x, y, [r, g, b], a) {
  if (a <= 0) return;
  const i = (y * SIZE + x) * 4;
  const dstA = px[i + 3] / 255;
  const outA = a + dstA * (1 - a);
  if (outA <= 0) return;
  px[i] = Math.round((r * a + px[i] * dstA * (1 - a)) / outA);
  px[i + 1] = Math.round((g * a + px[i + 1] * dstA * (1 - a)) / outA);
  px[i + 2] = Math.round((b * a + px[i + 2] * dstA * (1 - a)) / outA);
  px[i + 3] = Math.round(outA * 255);
}

/** Fill `inside`, optionally clipped, with a flat colour or a per-pixel one. */
function paint(inside, color, clip) {
  const colorAt = typeof color === "function" ? color : () => color;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let hits = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px_ = x + (sx + 0.5) / SS;
          const py_ = y + (sy + 0.5) / SS;
          if (inside(px_, py_) && (!clip || clip(px_, py_))) hits++;
        }
      }
      if (hits > 0) blend(x, y, colorAt(x, y), hits / (SS * SS));
    }
  }
}

const ellipse = (cx, cy, rx, ry) => (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
const circle = (cx, cy, r) => ellipse(cx, cy, r, r);

function triangle(a, b, c) {
  const side = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
  return (x, y) => {
    const p = [x, y];
    const d1 = side(p, a, b);
    const d2 = side(p, b, c);
    const d3 = side(p, c, a);
    return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
  };
}

const RADIUS = 44;
const tile = (x, y) => {
  const cx = Math.min(Math.max(x, RADIUS), SIZE - RADIUS);
  const cy = Math.min(Math.max(y, RADIUS), SIZE - RADIUS);
  return (x - cx) ** 2 + (y - cy) ** 2 <= RADIUS * RADIUS;
};

const YELLOW = [250, 204, 60];
const SHADE = [231, 172, 32]; // wing and the crease under the head
const BEAK = [244, 138, 36];
const EYE = [24, 27, 34];

// ---- draw ----
// Tile first, with the app's dark-theme gradient (#1e2128 -> #262a33).
paint(tile, (_x, y) => {
  const t = y / SIZE;
  return [Math.round(30 + 8 * t), Math.round(33 + 9 * t), Math.round(40 + 11 * t)];
});

const body = ellipse(104, 178, 76, 55);
const head = circle(150, 96, 48);

// Tail first. Both base points sit well inside the body — a wedge that merely
// touches the body's curve leaves a hairline of background showing through.
paint(triangle([104, 170], [16, 124], [96, 122]), YELLOW, tile);
paint(body, YELLOW, tile);
paint(head, YELLOW, tile);
// The bill sits in front of the cheek, as a moulded one does.
paint(ellipse(206, 108, 30, 17), BEAK, tile);

// A wing, and a thin crease where the head meets the body — without them the
// silhouette reads as one yellow blob rather than a duck.
paint(ellipse(110, 188, 42, 26), SHADE, body);
paint(circle(150, 96, 54), SHADE, (x, y) => body(x, y) && !head(x, y));

paint(circle(162, 82, 10), EYE, tile);
paint(circle(165, 78, 3.5), [255, 255, 255], tile); // catchlight

// ---- PNG encode ----
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body_ = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body_));
  return Buffer.concat([len, body_, crc]);
}

function encodePng(pixels, size) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA

  const stride = size * 4 + 1;
  const raw = Buffer.alloc(size * stride);
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0; // filter: none
    Buffer.from(pixels.buffer, pixels.byteOffset + y * size * 4, size * 4).copy(raw, y * stride + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/**
 * Box-filter downsample, averaging in premultiplied alpha so the transparent
 * area outside the tile doesn't bleed dark pixels into the rounded corners.
 * Windows scales a lone 256px entry itself and makes a mush of it at 16px, so
 * the small sizes are rendered here instead.
 */
function downsample(size) {
  const out = new Uint8Array(size * size * 4);
  const scale = SIZE / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const x0 = Math.floor(x * scale);
      const x1 = Math.min(SIZE, Math.ceil((x + 1) * scale));
      const y0 = Math.floor(y * scale);
      const y1 = Math.min(SIZE, Math.ceil((y + 1) * scale));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const i = (sy * SIZE + sx) * 4;
          const sa = px[i + 3] / 255;
          r += px[i] * sa;
          g += px[i + 1] * sa;
          b += px[i + 2] * sa;
          a += sa;
          n++;
        }
      }
      const o = (y * size + x) * 4;
      if (a > 0) {
        out[o] = Math.round(r / a);
        out[o + 1] = Math.round(g / a);
        out[o + 2] = Math.round(b / a);
        out[o + 3] = Math.round((a / n) * 255);
      }
    }
  }
  return out;
}

// ---- write ----
const SIZES = [256, 128, 64, 48, 32, 16];
const images = SIZES.map((size) => ({
  size,
  png: encodePng(size === SIZE ? px : downsample(size), size),
}));

// ICO: 6-byte header, one 16-byte directory entry each, then the PNG payloads.
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);

let offset = 6 + images.length * 16;
const entries = images.map(({ size, png }) => {
  const e = Buffer.alloc(16);
  e[0] = size === 256 ? 0 : size; // 0 means 256
  e[1] = size === 256 ? 0 : size;
  e[4] = 1; // colour planes
  e[6] = 32; // bits per pixel
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.resolve(__dirname, "..", "app", "build");
fs.mkdirSync(buildDir, { recursive: true });

const ico = path.join(buildDir, "icon.ico");
fs.writeFileSync(ico, Buffer.concat([header, ...entries, ...images.map((i) => i.png)]));
console.log(`wrote ${ico} (${SIZES.join(", ")} px)`);

// Linux packaging wants the bare PNG — electron-builder reads icon.png for
// AppImage/deb and derives the sizes it needs from a 256px source.
const pngOut = path.join(buildDir, "icon.png");
fs.writeFileSync(pngOut, images[0].png);
console.log(`wrote ${pngOut}`);
