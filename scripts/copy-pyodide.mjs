// Copies the pyodide distribution from node_modules into web/public/pyodide so
// the browser Python runner can import /pyodide/pyodide.mjs from the app's own
// origin (web/public/pyodide is gitignored — a fresh clone has no copy).
// Runs from web's postinstall; a no-op when the copy is already current.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dest = path.join(repoRoot, "web", "public", "pyodide");

function findSource() {
  try {
    const require = createRequire(path.join(repoRoot, "package.json"));
    return path.dirname(require.resolve("pyodide/package.json"));
  } catch {
    const fallback = path.join(repoRoot, "node_modules", "pyodide");
    return fs.existsSync(path.join(fallback, "package.json")) ? fallback : null;
  }
}

function readVersion(dir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8")).version ?? null;
  } catch {
    return null;
  }
}

const src = findSource();
if (!src) {
  console.warn("[copy-pyodide] pyodide not found in node_modules — skipping (browser Python won't load).");
  process.exit(0);
}

const srcVersion = readVersion(src);
const destVersion = readVersion(dest);
if (srcVersion !== null && destVersion === srcVersion) {
  console.log(`[copy-pyodide] web/public/pyodide already at ${srcVersion} — nothing to do.`);
  process.exit(0);
}

console.log(
  destVersion
    ? `[copy-pyodide] updating web/public/pyodide ${destVersion} -> ${srcVersion}…`
    : `[copy-pyodide] copying pyodide ${srcVersion} into web/public/pyodide…`,
);
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log("[copy-pyodide] done.");
