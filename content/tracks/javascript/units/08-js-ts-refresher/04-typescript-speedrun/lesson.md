---
id: 04-typescript-speedrun
title: "TypeScript Speedrun"
language: javascript
runner: local
estMinutes: 18
files:
  - path: main.ts
    starter: starter/main.ts
goal: "TypeScript at speed in a real .ts file: a Player interface with an optional badge, a Shape discriminated union with an exhaustive area(), and a generic firstOr<T> — annotated end to end, no any."
docs: [javascript/typescript-basics]
checks:
  - id: optional-badge-path
    type: stdout
    entry: main.ts
    match: contains
    value: "Lin — 80"
  - id: circle-area
    type: stdout
    entry: main.ts
    match: contains
    value: "12.57"
  - id: whole-run-exact
    type: stdout
    entry: main.ts
    match: exact
    value: "Ada — 120 [pro]\nLin — 80\n12.57\n12.00\na\nempty\n"
  - id: typed-throughout
    type: ai-judge
    rubric: "Player is an interface (or type alias) with name: string, score: number, and badge marked optional via badge?: string. describePlayer takes (p: Player) and returns string, handling a missing badge with a ternary or nullish check so the word 'undefined' can never leak into output. Shape is a two-member discriminated union tagged by kind literals circle/rect; area(shape: Shape): number switches (or if-chains) on shape.kind so r is only read in the circle branch and w/h only in the rect branch, and its default/else assigns shape to a never-typed binding as an exhaustiveness net. firstOr is genuinely generic — <T>(items: T[], fallback: T): T — and decides on items.length (an explicit emptiness check), with the one T linking parameter and return. Every function has parameter and return annotations, and no any appears anywhere."
hints:
  - "badge?: string means maybe-missing — and p.badge ? ` [${p.badge}]` : \"\" keeps the word undefined out of the string."
  - "switch (shape.kind) narrows per case: circle knows r, rect knows w and h. default: { const impossible: never = shape; throw new Error(...); } is the compile-time net."
  - "function firstOr<T>(items: T[], fallback: T): T { return items.length > 0 ? items[0] : fallback; } — call it with strings or numbers and T follows along."
---
## The type system at speed

Everything TypeScript adds in one drill: interfaces, optional
properties, discriminated unions with narrowing, `never`, and generics.
This runs as a real `.ts` file on your machine — the runner strips the
types to execute it, so write every annotation like `tsc --strict` is
watching. The reviewer is.

Rapid recall:

```ts
interface Player { name: string; score: number; badge?: string }
type Shape =
  | { kind: "circle"; r: number }
  | { kind: "rect"; w: number; h: number };
function firstOr<T>(items: T[], fallback: T): T { ... }
```

- `badge?:` makes a property optional — every read must survive
  `undefined`.
- Switch on the `kind` tag and TypeScript narrows per case; a `default`
  that assigns to a `never`-typed binding turns "forgot a case" into a
  compile error.
- One `<T>` ties argument and return together — no `any`, ever.

### Your goal

1. `interface Player` as above; `describePlayer(p: Player): string` —
   `"Ada — 120 [pro]"` with a badge, `"Lin — 80"` without.
2. `type Shape` as above; `area(shape: Shape): number` — circle
   `Math.PI * r ** 2`, rect `w * h`, `never` net in the `default`.
3. `firstOr<T>(items: T[], fallback: T): T` — first element, or the
   fallback when empty.

The starter's drill prints exactly:

```
Ada — 120 [pro]
Lin — 80
12.57
12.00
a
empty
```
