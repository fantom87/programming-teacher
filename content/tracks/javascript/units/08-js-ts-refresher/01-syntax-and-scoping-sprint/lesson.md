---
id: 01-syntax-and-scoping-sprint
title: "Syntax and Scoping Sprint"
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Sprint through core JS: kindOf(x) through the typeof gotchas, row(name, price) as one template literal of pad/toFixed calls, and counters() proving let gives each loop turn its own binding."
docs: [javascript/syntax-cheatsheet, javascript/variables-and-types, javascript/functions-and-closures]
checks:
  - id: sprint-functions
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: drill-output
    type: stdout
    entry: main.js
    match: exact
    value: "null array nan string number undefined\ncoffee  |   4.50\nkeyboard|  90.00\n0 1 2\n"
  - id: idiomatic-js
    type: ai-judge
    rubric: "kindOf branches in gotcha-safe order — x === null (strict) before Array.isArray(x) before Number.isNaN(x), with typeof x as the only fall-through — never == null, never typeof to detect null or arrays. row is ONE template literal whose calls do all the alignment: name.padEnd(8) and price.toFixed(2).padStart(7) (or equivalent spec values) — no manual space-counting or concatenation chains. counters builds its closures in a for (let i = ...) loop pushing () => i (or an arrow closing over the block-scoped i) — not var, and not a map over a prebuilt [0, 1, 2] that sidesteps the loop-scoping point. The drill prints at the bottom of the file are intact and unedited."
hints:
  - "Order matters: x === null first (typeof null is \"object\" — the language's oldest bug), then Array.isArray(x), then Number.isNaN(x) — and the final return is just typeof x."
  - "One template literal does the whole row: `${name.padEnd(8)}|${price.toFixed(2).padStart(7)}` — toFixed rounds AND turns the number into a string."
  - "const out = []; for (let i = 0; i < 3; i++) out.push(() => i); return out; — let mints a fresh i each turn; with var all three closures would share one i and answer 3."
---
## Shake the rust off

You know JavaScript; your fingers need reminding. This unit is six
drills — minimal chatter, demanding checks. First: everyday syntax and
the scoping rules, including the gotchas that bite returning developers.

Rapid recall:

```js
typeof null                  // "object" — the language's oldest bug
Array.isArray([1, 2])        // true — typeof says "object" here too
`${name.padEnd(8)}`          // template literal + string padding
for (let i = 0; i < 3; i++)  // a FRESH i every iteration
```

- **Classification order matters**: test `x === null` first, then
  `Array.isArray`, then `Number.isNaN` — only then trust `typeof`.
- **Template literals** carry their own formatting: `padEnd`/`padStart`
  fix the columns, `toFixed(2)` rounds and stringifies in one move.
- **`let` is block-scoped**: closures made in a `let` loop each capture
  their own binding. With `var`, all three would share one `i` and
  answer `3`.

### Your goal

Three tiny functions, checked hard:

1. `kindOf(x)` — `"null"` for `null`, `"array"` for arrays, `"nan"` for
   `NaN`, otherwise `typeof x`. Always a string.
2. `row(name, price)` — one template literal: name padded right to 8
   columns, a `|`, price `toFixed(2)` padded left to 7.
3. `counters()` — three functions from one `for (let ...)` loop, where
   `counters()[i]()` returns `i`.

The starter's drill prints must produce exactly:

```
null array nan string number undefined
coffee  |   4.50
keyboard|  90.00
0 1 2
```
