---
id: 08-migrating-js-to-ts
title: Migrating JS to TS
language: javascript
runner: local
estMinutes: 25
files:
  - path: main.ts
    starter: starter/main.ts
goal: "Migrate a just-renamed JavaScript inventory script: add an Item interface, annotate every function boundary (findItem honestly returns Item | undefined), and fix the crash the types expose."
docs: [javascript/typescript-basics, javascript/arrays, javascript/objects]
checks:
  - id: migrated-report
    type: stdout
    entry: main.ts
    match: exact
    value: "ink: 12 in stock\nglitter: not found\ntotal value: $62.00\n"
  - id: types-tell-the-truth
    type: ai-judge
    rubric: "An Item interface (name: string, qty: number, price: number) exists and supplies is typed Item[]. Every function boundary is annotated: findItem takes Item[] and a string and returns Item | undefined; restock returns void; report returns string; totalValue returns number. report narrows before touching properties — an if/early-return handles the undefined case producing \"not found\" — rather than using ! or as to silence it. No any anywhere, and the total is still computed by reduce (or a loop), not hardcoded."
hints:
  - "Data first: interface Item { name: string; qty: number; price: number } — then const supplies: Item[] = [...] and half the remaining annotations become obvious."
  - "findItem(items: Item[], name: string): Item | undefined — that | undefined is the whole point: .find misses sometimes, and now every caller must face it."
  - "In report: const item = findItem(items, name); if (!item) return `${name}: not found`; — after that guard, item is a plain Item and .qty is safe. Then uncomment the glitter line."
---
## Rename first, type second

Real teams rarely start TypeScript projects — they *migrate* JavaScript
ones. The recipe is calmer than you'd expect, because TypeScript was
designed for exactly this. Your starter is an inventory script fresh
from step one: someone renamed `office-supplies.js` to `main.ts`, and —
since TS is JS — it runs unchanged. Untyped, but valid. Migration is
never a rewrite; it's a gradient. (On a big repo, a `tsconfig` with
`"allowJs": true` lets `.ts` and un-migrated `.js` coexist for months.)

From there, work in a proven order:

**Start with the data.** One `interface Item` at the top and
`supplies: Item[]` — suddenly inference knows what flows through *every*
function. This is always the highest-value annotation in the file.

**Then the boundaries.** Annotate each function's parameters and return
type; leave the bodies to inference. A function that returns nothing
returns `void`.

**Then listen.** Here's the payoff moment of the whole unit: typing
`findItem` honestly forces `Item | undefined` — `.find` returns
`undefined` on a miss, and untyped JS let everyone forget that. Look at
`report`: it charges straight into `item.qty`. Ask for an item that
isn't stocked and the *starter crashes* — that's why the `glitter` line
ships commented out. Under `strict`, `tsc` would flag that line before
the program ever ran: *"item is possibly undefined."* The fix is lesson
4's narrowing — guard, early-return `"not found"`, and the crash is
unrepresentable.

That's the migration experience in one file: rename, type the data,
type the boundaries, and let the compiler point at bugs that were
always there. Teams doing this on real codebases routinely find
dormant crashes on day one — types don't add safety so much as reveal
where it was missing.

### Your goal

1. `interface Item` (`name`, `qty`, `price`) and `supplies: Item[]`.
2. Annotate every function: `findItem(items: Item[], name: string):
   Item | undefined`, `restock(...): void`, `report(...): string`,
   `totalValue(...): number`.
3. Fix `report` to narrow: missing items return `` `${name}: not
   found` ``. Uncomment the `glitter` line.
4. Output:

```
ink: 12 in stock
glitter: not found
total value: $62.00
```
