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

// 1. reachable(graph, entry) — walk the graph from entry following
//    .imports, with a visited Set so cycles can't loop you forever.
//    Return the reached names, sorted. (The tests feed you a cycle.)

// 2. Compute what got tree-shaken: every key of the graph the walk
//    never reached.

// 3. Print the build report — count, lists comma-joined, size summed
//    from the included modules' kb and rounded with toFixed(1):
//      entry: main.js
//      included (N): ...
//      tree-shaken: ...
//      dist/app.js <size> kB
