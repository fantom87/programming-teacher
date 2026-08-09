---
id: 06-declaration-files
title: Declaration Files
language: javascript
runner: local
estMinutes: 20
files:
  - path: main.ts
    starter: starter/main.ts
  - path: replay.js
    starter: starter/replay.js
  - path: replay.d.ts
    starter: starter/replay.d.ts
goal: "Give an untyped JavaScript module a typed public face: write replay.d.ts declaring a Play interface and two function signatures, then consume it from TypeScript with a type-only import that vanishes at runtime."
docs: [javascript/typescript-basics, javascript/modules, javascript/objects]
checks:
  - id: typed-consumer-runs
    type: stdout
    entry: main.ts
    match: exact
    value: "top track: Aurora\ntotal: 15 minutes\n"
  - id: honest-declarations
    type: ai-judge
    rubric: "replay.d.ts contains ONLY declarations — no function bodies, no runtime statements: an exported interface Play with title: string and minutes: number, plus signatures for topTrack(plays: Play[]): string and totalMinutes(plays: Play[]): number (with or without the declare keyword — both are valid in a .d.ts). The signatures must truthfully match what replay.js does; replay.js itself stays untouched, plain JS with no annotations. main.ts imports the two FUNCTIONS with a normal import from \"./replay.js\" and the Play TYPE with a separate `import type` (or inline type specifiers) — never a runtime import of the .d.ts path. rotation is annotated Play[] and holds three plays whose minutes sum to 15 with Aurora the longest, and both printed lines interpolate the imported functions' return values — no hardcoded 'Aurora' or 15 in main.ts. (Node never reads .d.ts files — your editor and this review are the type-checkers here.)"
hints:
  - "A .d.ts holds signatures only — declarations end at the semicolon: export interface Play { title: string; minutes: number; } then export function topTrack(plays: Play[]): string;"
  - "Values and types travel separately: import { topTrack, totalMinutes } from \"./replay.js\"; for the functions, import type { Play } from \"./replay.js\"; for the interface — TypeScript matches the .js import to your replay.d.ts sibling."
  - "import type is erased before the code runs — which is why importing an interface this way can never crash Node: nothing is left to execute."
---
## Types for code you can't touch

`replay.js` is the kind of file every team owns: plain JavaScript,
written years ago, works fine, nobody's rewriting it. Your new
TypeScript code wants to call it — and gets `any`, the type that turns
the compiler off.

The professional fix is a **declaration file**. A `.d.ts` contains *no
running code* — only signatures, a typed table of contents for a `.js`
module:

```ts
// replay.d.ts
export interface Play {
  title: string;
  minutes: number;
}
export function topTrack(plays: Play[]): string;
```

Note what's missing: the body. A declaration ends at the `;`. When
TypeScript sees `import ... from "./replay.js"`, it looks for a
`replay.d.ts` sibling and uses it as the module's public face — the
implementation stays untyped, the callers get full checking and
autocomplete. This is exactly how the npm ecosystem works: packages
ship `.d.ts` files alongside their JS, and the `@types/*` packages on
DefinitelyTyped are nothing but community-written declaration files for
packages that don't.

One honesty warning before you write yours: **a declaration file is a
promise the compiler cannot verify.** Declare `totalMinutes` as
returning `string` and tsc will happily believe you while every caller
breaks at runtime. Read the implementation, then declare what it
actually does.

The consumer side has one new move — the **type-only import**:

```ts
import { topTrack } from "./replay.js";      // real, survives to runtime
import type { Play } from "./replay.js";     // erased before Node runs
```

`Play` exists only in `replay.d.ts`, so importing it as a value would
crash Node — `import type` is compile-time-only by definition, which
also makes it self-documenting: this line costs nothing.

(Our runner executes with types stripped and never opens the `.d.ts` —
your editor and the AI reviewer are the compiler here, as usual.)

### Your goal

1. In `replay.d.ts`: the exported `Play` interface (`title: string`,
   `minutes: number`) and truthful signatures for `topTrack` and
   `totalMinutes`. Don't touch `replay.js`.
2. In `main.ts`: import the functions normally and `Play` via
   `import type`; build a `Play[]` rotation — Ember 4, Aurora 6,
   Jade River 5 — and print:

```
top track: Aurora
total: 15 minutes
```
