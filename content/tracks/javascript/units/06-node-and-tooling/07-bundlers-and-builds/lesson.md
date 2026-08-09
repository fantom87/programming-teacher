---
id: 07-bundlers-and-builds
title: Bundlers and Builds
language: javascript
runner: local
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
goal: "Do what a bundler does: walk the import graph from the entry with a cycle-safe traversal, include only what's reachable, tree-shake the rest, and print a vite-style build report with a computed size."
docs: [javascript/modules, javascript/npm-basics, javascript/arrays]
checks:
  - id: traversal-is-real
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: build-report
    type: stdout
    entry: main.js
    match: exact
    value: "entry: main.js\nincluded (4): main.js, router.js, store.js, utils.js\ntree-shaken: legacy.js\ndist/app.js 11.5 kB\n"
  - id: shaken-not-hardcoded
    type: ai-judge
    rubric: "reachable(graph, entry) is a genuine graph traversal: a visited Set (or equivalent) plus a stack/queue/recursion following each module's imports, immune to cycles (the tests include one), returning the visited names sorted — no hardcoded module lists. The tree-shaken line is computed as the set difference Object.keys(graph) minus the reachable set (filter over keys), so legacy.js is excluded by the algorithm, not by name. The kB total is summed (reduce or loop) over the included modules' kb values and formatted with toFixed(1) — the literal 11.5 appears nowhere. Adding a new unimported module to MODULES must show up in tree-shaken with no other code change."
hints:
  - "reachable: const seen = new Set(); const stack = [entry]; while (stack.length) { const name = stack.pop(); if (seen.has(name)) continue; seen.add(name); stack.push(...graph[name].imports); } return [...seen].sort(); — the seen check is what makes cycles safe."
  - "Tree-shaken is everything the walk never touched: Object.keys(graph).filter((name) => !included.includes(name)) — a Set makes the lookup cleaner."
  - "Size: included.reduce((sum, name) => sum + graph[name].kb, 0).toFixed(1) — floats drift (2.1 + 4.8 is not exactly 6.9), which is why the report rounds."
---
## What `vite build` actually does

Your ES modules lesson ended with a promise: bare imports like
`"react"` come from installed packages. But a browser can't crawl
`node_modules`, and shipping five hundred tiny files makes five hundred
requests. Enter the **bundler** — Vite (powered by Rollup and esbuild),
or esbuild raw, or webpack in older repos. During development,
`npm run dev` serves your real modules with hot reload; when you ship,
`vite build` runs the algorithm you're about to write:

1. **Start at the entry** — `main.js`.
2. **Follow every import**, and the imports of those imports — a graph
   walk, marking each module *reachable*.
3. **Ship only what was reached**, concatenated and minified into
   `dist/`. Everything else — the legacy module nobody imports anymore
   — is dropped. That drop has a famous name: **tree-shaking**.

Then it prints the receipt you've seen in every Vite README:
`dist/app.js  11.5 kB`.

Our runner can't execute Vite itself, so you'll build the honest core
of it: the starter has a module graph — five modules, their `imports`,
their `kb` — and your `reachable(graph, entry)` walks it. One subtlety
makes this real engineering rather than a toy: modules can import each
other in a **cycle** (`a` imports `b`, `b` imports `a` — legal in ESM,
common in real apps). A naive walk loops forever. The fix is the
`visited` set every bundler, crawler, and garbage collector carries:
skip what you've already seen. The tests hand you a cyclic graph, so
an unguarded walk times out red.

One walk, then two computed facts: what's *in* (sorted, with a count)
and what got *shaken* (the keys the walk never reached) — and the
bundle's size, summed from the included modules.

### Your goal

1. `reachable(graph, entry)` — cycle-safe walk, returning sorted
   included names.
2. From it, compute the shaken list and the summed size.
3. Print the build report:

```
entry: main.js
included (4): main.js, router.js, store.js, utils.js
tree-shaken: legacy.js
dist/app.js 11.5 kB
```
