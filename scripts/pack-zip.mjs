// Zips the built desktop app so it extracts as ONE folder.
//
// electron-builder's own `zip` target archives the *contents* of win-unpacked,
// so "Extract Here" splatters 20 loose files into whatever folder you're in.
// This packs `win-unpacked` as `Programming Teacher/` instead — one folder,
// exe inside, data written beside it, delete-the-folder to uninstall.
//
// The inner folder deliberately carries no version number: extracting a newer
// zip over an older install merges into the same folder, so `data/` (progress,
// journal, snapshots) survives the update.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "app", "dist");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "app", "package.json"), "utf8"));

const unpacked = path.join(DIST, "win-unpacked");
const folder = pkg.productName; // the name the user sees after extracting
const staged = path.join(DIST, folder);
const zip = path.join(DIST, `${pkg.productName} ${pkg.version}.zip`);

if (!fs.existsSync(unpacked)) {
  console.error(`[zip] no built app at ${unpacked} — run npm run app:dist first.`);
  process.exit(1);
}

// 7-Zip is ~5 MB smaller on a 145 MB archive and worth the extra 90 s for a
// file people download; bsdtar ships with Windows 10+, so there's always a
// fallback and the script never hard-depends on an install.
function archiver() {
  const sevenZip = [
    "C:\\Program Files\\7-Zip\\7z.exe",
    "C:\\Program Files (x86)\\7-Zip\\7z.exe",
  ].find((p) => fs.existsSync(p));
  if (sevenZip) return { command: sevenZip, args: ["a", "-tzip", "-mx=9", "-mmt=on", zip, folder], label: "7-Zip" };
  return { command: "tar", args: ["-a", "-cf", zip, folder], label: "bsdtar" };
}

fs.rmSync(zip, { force: true });
fs.renameSync(unpacked, staged); // rename, not copy — 364 MB, same volume, instant
try {
  const { command, args, label } = archiver();
  console.log(`[zip] packing ${folder}/ with ${label}...`);
  execFileSync(command, args, { cwd: DIST, stdio: ["ignore", "ignore", "inherit"], windowsHide: true });
} finally {
  // Always hand win-unpacked back: make-shortcut.mjs points at it, and a
  // failed archive shouldn't leave the build tree renamed.
  fs.renameSync(staged, unpacked);
}

const mb = (fs.statSync(zip).size / 1024 ** 2).toFixed(1);
console.log(`[zip] wrote ${zip} (${mb} MB)`);
