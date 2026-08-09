---
id: 05-reduce
title: Reduce
language: javascript
runner: browser
estMinutes: 18
files:
  - path: main.js
    starter: starter/main.js
goal: "Write sum(numbers) and totalScore(players) with .reduce — each boils an array down to one number — then print sum(dice) and totalScore(party)."
docs: [javascript/arrays, javascript/functions-and-closures]
checks:
  - id: reduce-works
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-totals
    type: stdout
    entry: main.js
    match: exact
    value: "14\n250\n"
  - id: uses-reduce
    type: ai-judge
    rubric: "Both sum and totalScore are computed with .reduce, each passing an accumulator callback and a starting value of 0. No for/while loops build these totals, and nothing is hardcoded (e.g. return 14)."
hints:
  - "The shape: numbers.reduce((total, n) => total + n, 0) — total carries the running answer, 0 is where it starts."
  - "For totalScore the items are OBJECTS — add player.score, not player: (total, player) => total + player.score"
  - "Both functions RETURN what reduce returns. Then console.log(sum(dice)); console.log(totalScore(party));"
---
## Boiling a list down to one value

`map` gives you an array back. `filter` gives you an array back. But
some questions want a *single* answer: what's the **total**? The
**highest score**? For that, arrays have their most powerful method:
**`reduce`**.

```js
const bills = [12, 30, 8];
const total = bills.reduce((sum, bill) => sum + bill, 0);   // 50
```

Two arguments — a callback and a **starting value** (`0` here). The
callback takes *two* parameters: the **running total** so far, and the
current item. Whatever the callback returns becomes the running total
for the next item. Watch it go:

```
start:            sum = 0
visit 12:         0 + 12  -> 12
visit 30:         12 + 30 -> 42
visit 8:          42 + 8  -> 50
reduce returns 50
```

It's the counter-in-a-loop pattern you wrote for the quiz engine — start
at zero, fold each item in — compressed into one line. That's literally
what "reduce" means: fold a whole list down into one value.

Two habits that keep reduce friendly:

- **Always give a starting value.** Skipping it works until someone
  hands you an empty array — with `0`, `sum([])` calmly returns `0`.
- **Name the parameters honestly.** `(total, n)` reads like a sentence;
  `(a, b)` reads like a puzzle.

The items don't have to be numbers, either. Given an array of *objects*,
your callback just reaches in for the field it needs — that's your
second function below.

### Your goal

1. Write `sum(numbers)` — returns the total of a numbers array, using
   `.reduce` with a starting value of `0`.
2. Write `totalScore(players)` — each player is `{ name, score }`;
   return the sum of every player's `score`, also with `.reduce`.
3. Print `sum(dice)` and `totalScore(party)` from the starter data:

```
14
250
```
