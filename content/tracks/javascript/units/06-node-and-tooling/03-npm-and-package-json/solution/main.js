import { readFileSync } from "node:fs";

// One deps object in, a verdict per package out. Pure — the tests feed
// it manifests this project never had.
function classifyDeps(deps) {
  const pinned = [];
  const floating = [];
  for (const [name, version] of Object.entries(deps)) {
    if (version.startsWith("^") || version.startsWith("~")) floating.push(name);
    else pinned.push(name);
  }
  return { pinned: pinned.sort(), floating: floating.sort() };
}

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

console.log(`${pkg.name} v${pkg.version}`);
console.log(`scripts: ${Object.keys(pkg.scripts).sort().join(", ")}`);

const depCount = Object.keys(pkg.dependencies).length;
const devCount = Object.keys(pkg.devDependencies).length;
console.log(`${depCount} deps + ${devCount} dev deps`);

// Runtime deps and dev tools pin (or float) by the same rules.
const { pinned, floating } = classifyDeps({
  ...pkg.dependencies,
  ...pkg.devDependencies,
});
console.log(`pinned: ${pinned.join(", ")}`);
console.log(`floating: ${floating.join(", ")}`);
