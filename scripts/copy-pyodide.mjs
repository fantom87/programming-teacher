// Copies browser-runner runtime assets from node_modules into web/public so
// the app serves them from its own origin (both are gitignored — a fresh
// clone has no copy). Runs from web's postinstall; a no-op when current.
//   - pyodide/            → web/public/pyodide (browser Python runner)
//   - sql.js wasm builds  → web/public/*.wasm  (browser SQL runner)

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(repoRoot, "package.json"));

function findPackage(name) {
  try {
    return path.dirname(require.resolve(`${name}/package.json`));
  } catch {
    const fallback = path.join(repoRoot, "node_modules", name);
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

function copyPyodide() {
  const dest = path.join(repoRoot, "web", "public", "pyodide");
  const src = findPackage("pyodide");
  if (!src) {
    console.warn("[copy-pyodide] pyodide not found in node_modules — skipping (browser Python won't load).");
    return;
  }

  const srcVersion = readVersion(src);
  const destVersion = readVersion(dest);
  if (srcVersion !== null && destVersion === srcVersion) {
    console.log(`[copy-pyodide] web/public/pyodide already at ${srcVersion} — nothing to do.`);
    return;
  }

  console.log(
    destVersion
      ? `[copy-pyodide] updating web/public/pyodide ${destVersion} -> ${srcVersion}…`
      : `[copy-pyodide] copying pyodide ${srcVersion} into web/public/pyodide…`,
  );
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log("[copy-pyodide] done.");
}

function copySqlWasm() {
  const src = findPackage("sql.js");
  if (!src) {
    console.warn("[copy-pyodide] sql.js not found in node_modules — skipping (browser SQL won't load).");
    return;
  }
  // Vite resolves sql.js via its "browser" export condition (sql-wasm-browser),
  // so that's the wasm the app fetches; sql-wasm.wasm is copied too so both
  // build flavors work.
  for (const name of ["sql-wasm.wasm", "sql-wasm-browser.wasm"]) {
    const from = path.join(src, "dist", name);
    const to = path.join(repoRoot, "web", "public", name);
    if (!fs.existsSync(from)) {
      console.warn(`[copy-pyodide] ${name} missing from sql.js dist — skipping.`);
      continue;
    }
    const current = fs.existsSync(to) && fs.statSync(to).size === fs.statSync(from).size;
    if (current) {
      console.log(`[copy-pyodide] web/public/${name} already current — nothing to do.`);
      continue;
    }
    fs.copyFileSync(from, to);
    console.log(`[copy-pyodide] copied ${name} into web/public.`);
  }
}

copyPyodide();
copySqlWasm();
