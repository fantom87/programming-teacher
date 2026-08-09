// A small app's module graph, as a bundler sees it after parsing every
// import statement. legacy.js imports utils.js — but nobody imports
// legacy.js, and that difference is the whole lesson.
const MODULES = {
  "main.js": { imports: ["router.js", "store.js"], kb: 2.1 },
  "router.js": { imports: ["utils.js"], kb: 4.8 },
  "store.js": { imports: ["utils.js"], kb: 3.4 },
  "utils.js": { imports: [], kb: 1.2 },
  "legacy.js": { imports: ["utils.js"], kb: 9.6 },
};

const ENTRY = "main.js";

// The walk every bundler runs: start at the entry, follow imports,
// and let a visited Set make cycles harmless.
function reachable(graph, entry) {
  const seen = new Set();
  const stack = [entry];
  while (stack.length > 0) {
    const name = stack.pop();
    if (seen.has(name)) continue; // already bundled — the cycle-breaker
    seen.add(name);
    stack.push(...graph[name].imports);
  }
  return [...seen].sort();
}

const included = reachable(MODULES, ENTRY);
const includedSet = new Set(included);

// Tree-shaken = declared but never reached.
const shaken = Object.keys(MODULES)
  .filter((name) => !includedSet.has(name))
  .sort();

// The bundle's weight, summed from what actually ships.
const totalKb = included.reduce((sum, name) => sum + MODULES[name].kb, 0);

console.log(`entry: ${ENTRY}`);
console.log(`included (${included.length}): ${included.join(", ")}`);
console.log(`tree-shaken: ${shaken.join(", ")}`);
console.log(`dist/app.js ${totalKb.toFixed(1)} kB`);
