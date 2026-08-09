import { readFileSync } from "node:fs";

// 1. Read and parse package.json (it's a real file beside this one).

// 2. classifyDeps(deps) — one plain object like { chalk: "^5.6.0" } in,
//    { pinned: [...], floating: [...] } out. Caret ^ and tilde ~ float;
//    a bare version pins. Sort both arrays.

// 3. Print the five-line report — every value computed from the parsed
//    object (names, counts, classifications), nothing retyped:
//      <name> v<version>
//      scripts: <alphabetical, comma-joined>
//      <N> deps + <M> dev deps
//      pinned: <from classifyDeps on deps+devDeps merged>
//      floating: <same call>
