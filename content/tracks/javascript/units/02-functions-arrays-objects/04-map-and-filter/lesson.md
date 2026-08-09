---
id: 04-map-and-filter
title: Map and Filter
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Write doubleAll(nums) and shoutAll(words) using .map, and evensOnly(nums) using .filter — each returns a new array without touching the original."
docs: [javascript/arrays, javascript/functions-and-closures]
checks:
  - id: map-filter-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-transformed
    type: stdout
    entry: main.js
    match: exact
    value: "2, 4, 6, 8, 10, 12\n2, 4, 6\n"
  - id: uses-map-and-filter
    type: ai-judge
    rubric: "doubleAll and shoutAll are built with .map and evensOnly with .filter, each passing a callback (arrow or named function). No hand-written for/while loops are used to build these three results, and no results are hardcoded."
hints:
  - "map's callback says what ONE item becomes: nums.map((n) => n * 2) — map handles the rest."
  - "filter's callback is a yes/no question per item: nums.filter((n) => n % 2 === 0) keeps items that answer true."
  - "shoutAll maps each word to word.toUpperCase() + \"!\" — and every function should RETURN its new array."
---
## Loops you don't have to write

Last lesson's `forEachItem` took an array and a callback. JavaScript's
arrays have that built in — plus two smarter siblings that don't just
*visit* items, they **build you a new array**.

**`map`** transforms every item. Your callback says what *one* item
becomes; `map` applies it to all of them and returns the new array:

```js
const prices = [10, 25, 40];
const doubledPrices = prices.map((p) => p * 2);   // [20, 50, 80]
```

**`filter`** keeps some items. Your callback is a yes/no question; items
answering `true` make it into the new array:

```js
const cheap = prices.filter((p) => p < 30);       // [10, 25]
```

Read those callbacks again — they're the tiny arrow functions from
lesson one, doing exactly what they were born to do.

Two rules both methods share:

- **They return a new array.** The original is never modified — the
  tests check this. Instead of "loop, push, hope," you *declare* the
  transformation and catch the result.
- **The callback runs once per item.** No counter, no `[i]`, no
  off-by-one bugs. The loop still happens — JavaScript just writes it
  for you.

Once map and filter click, you'll spot them everywhere: rendering lists
on web pages, cleaning data, picking search results. This is the way
working JavaScript handles collections.

### Your goal

Write three functions (arrows encouraged):

1. `doubleAll(nums)` — returns a new array with every number doubled
   (`.map`).
2. `evensOnly(nums)` — returns a new array of just the even numbers
   (`.filter` — even means `n % 2 === 0`).
3. `shoutAll(words)` — returns every word uppercased with `!` on the
   end (`.map` again).

Then print `doubleAll(numbers).join(", ")` and
`evensOnly(numbers).join(", ")` using the starter array:

```
2, 4, 6, 8, 10, 12
2, 4, 6
```
