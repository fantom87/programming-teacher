// Packages app/build/icon-source.png into the icons electron-builder wants:
// a multi-size icon.ico for Windows and a 256px icon.png for Linux.
//
// icon-source.png is the artwork at 768x768 with the area outside the tile
// already transparent. It was cut from a JPEG once, by flood-filling the white
// inward from the four corners so the cut followed the art's own corner shape
// rather than a rounded-rect approximation of it. To replace the icon, drop a
// new PNG in its place (square, transparent outside the tile) and re-run.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { decodePng, encodePng } from "./pngcodec.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.resolve(__dirname, "..", "app", "build");
const sourceFile = path.join(buildDir, "icon-source.png");

if (!fs.existsSync(sourceFile)) {
  console.error(`[icon] missing ${sourceFile}`);
  process.exit(1);
}
const source = decodePng(fs.readFileSync(sourceFile));
if (source.width !== source.height) {
  console.error(`[icon] ${sourceFile} is ${source.width}x${source.height} — it must be square.`);
  process.exit(1);
}

/**
 * Box-filter downsample, averaging in premultiplied alpha. Without the
 * premultiply the transparent corners contribute their (meaningless) colour to
 * the average and fringe the rounded edge.
 *
 * Windows will scale a lone 256px entry itself if you let it, and makes mud of
 * the eye at 16px, so every size is rendered here from the full-resolution art.
 */
function resize(size) {
  const { width, pixels } = source;
  const out = new Uint8Array(size * size * 4);
  const scale = width / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const x0 = Math.floor(x * scale);
      const x1 = Math.min(width, Math.ceil((x + 1) * scale));
      const y0 = Math.floor(y * scale);
      const y1 = Math.min(width, Math.ceil((y + 1) * scale));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const i = (sy * width + sx) * 4;
          const sa = pixels[i + 3] / 255;
          r += pixels[i] * sa;
          g += pixels[i + 1] * sa;
          b += pixels[i + 2] * sa;
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

const SIZES = [256, 128, 64, 48, 32, 16];
const images = SIZES.map((size) => ({ size, png: encodePng(resize(size), size) }));

// ICO: 6-byte header, a 16-byte directory entry per image, then the payloads.
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

const ico = path.join(buildDir, "icon.ico");
fs.writeFileSync(ico, Buffer.concat([header, ...entries, ...images.map((i) => i.png)]));
console.log(`[icon] wrote ${ico} (${SIZES.join(", ")} px)`);

// electron-builder reads icon.png for AppImage and derives its sizes from it.
const pngOut = path.join(buildDir, "icon.png");
fs.writeFileSync(pngOut, images[0].png);
console.log(`[icon] wrote ${pngOut} (256 px)`);
