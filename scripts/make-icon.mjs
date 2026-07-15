// Generates app/build/icon.ico (a 256px PNG-in-ICO): dark rounded tile with a
// graduation-cap mark. No image libraries — raw PNG encoding via zlib.
import zlib from "node:zlib";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SIZE = 256;

// ---- draw ----
const px = new Uint8Array(SIZE * SIZE * 4);

function put(x, y, r, g, b, a = 255) {
  const i = (y * SIZE + x) * 4;
  px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = a;
}

const R = 44; // corner radius
function insideRoundedRect(x, y) {
  const cx = Math.min(Math.max(x, R), SIZE - 1 - R);
  const cy = Math.min(Math.max(y, R), SIZE - 1 - R);
  return (x - cx) ** 2 + (y - cy) ** 2 <= R * R;
}

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    if (!insideRoundedRect(x, y)) continue;
    // subtle vertical gradient: #1e2128 -> #262a33
    const t = y / SIZE;
    put(x, y, Math.round(30 + 8 * t), Math.round(33 + 9 * t), Math.round(40 + 11 * t));

    // mortarboard diamond
    const dx = Math.abs(x - 128) / 86;
    const dy = Math.abs(y - 110) / 46;
    if (dx + dy <= 1) put(x, y, 122, 162, 247); // accent blue

    // cap base (under the board)
    if (x >= 96 && x <= 160 && y >= 118 && y <= 156 && dx + dy > 1) put(x, y, 91, 130, 217);

    // tassel cord + knob (gold)
    if (x >= 196 && x <= 201 && y >= 112 && y <= 168) put(x, y, 251, 191, 36);
    if ((x - 198) ** 2 + (y - 174) ** 2 <= 64) put(x, y, 251, 191, 36);
  }
}

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
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // RGBA

const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE * 4 + 1)] = 0; // filter: none
  Buffer.from(px.buffer, y * SIZE * 4, SIZE * 4).copy(raw, y * (SIZE * 4 + 1) + 1);
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

// ---- ICO wrap (PNG entry, Vista+) ----
const header = Buffer.from([0, 0, 1, 0, 1, 0]);
const entry = Buffer.alloc(16);
entry[0] = 0; // 256 wide
entry[1] = 0; // 256 tall
entry[4] = 1; // planes
entry[6] = 32; // bpp
entry.writeUInt32LE(png.length, 8);
entry.writeUInt32LE(22, 12); // offset

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(__dirname, "..", "app", "build", "icon.ico");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, Buffer.concat([header, entry, png]));
console.log(`wrote ${out} (${png.length} bytes png)`);
