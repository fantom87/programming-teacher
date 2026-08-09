// Stages everything the packaged server needs into ONE directory that
// electron-builder can copy verbatim: build/server-dist/
//
//   build/server-dist/server.cjs      the bundle (npm run bundle:server)
//   build/server-dist/node_modules/   the packages that CANNOT be bundled
//
// Why a staging dir rather than pointing electron-builder at the repo's
// node_modules: the app must ship exactly three packages plus their
// transitive closure (42 of them), not the 700-odd the repo installs. The
// list of three lives in build/server.externals.json, written by the bundler
// itself, so it can never drift from what the bundle actually externalised.
//
// Run:  node scripts/stage-server-deps.mjs   (after npm run bundle:server)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BUILD = path.join(ROOT, "build");
const STAGE = path.join(BUILD, "server-dist");
const STAGE_MODULES = path.join(STAGE, "node_modules");

const manifestFile = path.join(BUILD, "server.externals.json");
if (!fs.existsSync(manifestFile)) {
  console.error(`[stage] missing ${path.relative(ROOT, manifestFile)} — run \`npm run bundle:server\` first.`);
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
const entryFile = path.join(BUILD, manifest.entry);
if (!fs.existsSync(entryFile)) {
  console.error(`[stage] missing ${path.relative(ROOT, entryFile)} — run \`npm run bundle:server\` first.`);
  process.exit(1);
}

/**
 * Node's own resolution, minus the module loader: walk up from `fromDir`
 * looking for node_modules/<name>. Handles both the hoisted flat layout and
 * the nested one npm falls back to on version conflicts.
 */
function resolvePackageDir(name, fromDir) {
  let dir = fromDir;
  for (;;) {
    const candidate = path.join(dir, "node_modules", ...name.split("/"));
    if (fs.existsSync(path.join(candidate, "package.json"))) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function readPackageJson(dir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8").replace(/^﻿/, ""));
  } catch {
    return {};
  }
}

// Breadth-first over dependencies + optionalDependencies. Optional deps are
// the platform binaries (@anthropic-ai/claude-agent-sdk-win32-x64 and
// friends): only the ones actually installed for THIS platform resolve, and
// a missing one is not an error — that is what "optional" means.
const found = new Map(); // package name -> absolute source dir
const missingOptional = [];
const queue = manifest.externals.map((name) => ({ name, from: ROOT }));

while (queue.length > 0) {
  const { name, from, optional } = queue.shift();
  if (found.has(name)) continue;
  const dir = resolvePackageDir(name, from);
  if (!dir) {
    if (optional) {
      missingOptional.push(name);
      continue;
    }
    console.error(`[stage] cannot resolve required package "${name}" from ${from} — run \`npm install\`.`);
    process.exit(1);
  }
  found.set(name, dir);
  const pkg = readPackageJson(dir);
  for (const dep of Object.keys(pkg.dependencies ?? {})) queue.push({ name: dep, from: dir });
  for (const dep of Object.keys(pkg.optionalDependencies ?? {})) queue.push({ name: dep, from: dir, optional: true });
}

// Fresh start only for entries we own; a full rmSync of 283 MB on every build
// costs more than it saves, so unchanged packages are left in place below.
fs.mkdirSync(STAGE_MODULES, { recursive: true });

let copied = 0;
let reused = 0;
let bytes = 0;

function dirSize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(entry.parentPath ?? dir, entry.name);
    if (entry.isDirectory()) total += dirSize(full);
    else {
      try {
        total += fs.statSync(full).size;
      } catch {
        // vanished mid-scan
      }
    }
  }
  return total;
}

for (const [name, src] of [...found].sort()) {
  const dest = path.join(STAGE_MODULES, ...name.split("/"));
  const srcPkg = readPackageJson(src);
  const destPkg = fs.existsSync(dest) ? readPackageJson(dest) : null;
  // Same name+version already staged → the contents are immutable (npm
  // packages are), so skip the copy. Keeps rebuilds seconds, not minutes.
  if (destPkg && destPkg.version === srcPkg.version && destPkg.name === srcPkg.name) {
    reused++;
    bytes += dirSize(dest);
    continue;
  }
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  // dereference: npm may have symlinked a workspace/store entry, and the
  // packaged app must contain real files.
  fs.cpSync(src, dest, { recursive: true, dereference: true });
  copied++;
  bytes += dirSize(dest);
}

// Drop packages that are no longer part of the closure, so a shrinking
// dependency set actually shrinks the installer.
const wanted = new Set([...found.keys()]);
function pruneModules(dir, prefix = "") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (name.startsWith("@") && !prefix) {
      pruneModules(path.join(dir, entry.name), entry.name);
      continue;
    }
    if (!wanted.has(name)) {
      fs.rmSync(path.join(dir, entry.name), { recursive: true, force: true });
      console.log(`[stage] pruned stale ${name}`);
    }
  }
}
pruneModules(STAGE_MODULES);

fs.copyFileSync(entryFile, path.join(STAGE, manifest.entry));
bytes += fs.statSync(entryFile).size;

console.log(`[stage] ${path.relative(ROOT, STAGE)} — ${found.size} package(s), ${(bytes / 1024 / 1024).toFixed(1)} MB`);
console.log(`[stage] ${copied} copied, ${reused} already current`);
if (missingOptional.length > 0) {
  console.log(`[stage] skipped ${missingOptional.length} optional dep(s) not installed for this platform:`);
  for (const name of missingOptional) console.log(`          ${name}`);
}
