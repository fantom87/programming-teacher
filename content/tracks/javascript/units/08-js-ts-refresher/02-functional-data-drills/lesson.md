---
id: 02-functional-data-drills
title: "Functional Data Drills"
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Rebuild four data-shapers over an orders array: revenue via one reduce, unshipped via filter-then-map, byId via Object.fromEntries, and topByValue sorting a spread copy — the caller's array never mutates."
docs: [javascript/arrays, javascript/objects]
checks:
  - id: shapers-hold-up
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: drill-output
    type: stdout
    entry: main.js
    match: exact
    value: "344\nmouse, cable\nmonitor\nmonitor > keyboard\nkeyboard\n"
  - id: functional-not-loops
    type: ai-judge
    rubric: "revenue is a single reduce with a 0 seed (so the empty array returns 0, not undefined) summing price * qty — no for loops, no forEach accumulation. unshipped chains filter (on !shipped) then map (to item) — not a loop pushing into an array. byId is Object.fromEntries over orders.map to [id, order] pairs, or an equivalent single reduce into an object — no standalone loop mutating a shared object. topByValue never touches its input: it sorts a COPY ([...orders].sort or toSorted) with a numeric comparator on price * qty descending, then slices n and maps to item names — sorting orders itself fails the mutation test. The drill prints at the bottom are intact."
hints:
  - "revenue: orders.reduce((sum, o) => sum + o.price * o.qty, 0) — the 0 seed is what makes revenue([]) come back 0 instead of crashing."
  - "Chains read left to right: orders.filter((o) => !o.shipped).map((o) => o.item) — and byId is one line: Object.fromEntries(orders.map((o) => [o.id, o]))."
  - "Sort a copy: [...orders].sort((a, b) => b.price * b.qty - a.price * a.qty).slice(0, n).map((o) => o.item) — .sort mutates in place, so the spread protects your caller."
---
## Data shaping, the JS way

Arrays and objects do the daily work; `map`/`filter`/`reduce` are how
professionals shape them. Second drill: four shapers, no loops.

Rapid recall:

```js
orders.reduce((sum, o) => sum + o.price * o.qty, 0)   // fold to one value
orders.filter((o) => !o.shipped).map((o) => o.item)   // narrow, then transform
Object.fromEntries(orders.map((o) => [o.id, o]))      // array -> lookup object
[...orders].sort((a, b) => b.price - a.price)         // sort a COPY
```

Ground rules worth re-caching: `reduce` without a seed crashes on empty
arrays — always pass one. Chains read left to right, narrow before you
transform. `.sort` **mutates** and compares as strings without a
comparator — spread first, subtract inside. And a function that reorders
its caller's array is a bug factory; the checks test for it.

### Your goal

Four shapers over the starter's `orders`:

1. `revenue(orders)` — total of `price * qty`, one `reduce`.
2. `unshipped(orders)` — item names of unshipped orders,
   `filter` + `map`.
3. `byId(orders)` — lookup object mapping each `id` to its order.
4. `topByValue(orders, n)` — the `n` item names with the highest
   `price * qty`, descending — sorted on a **copy**.

The starter's drill prints exactly:

```
344
mouse, cable
monitor
monitor > keyboard
keyboard
```
