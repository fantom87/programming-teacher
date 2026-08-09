---
id: 03-array-methods-tour
title: Array Methods Tour
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Use includes, indexOf, slice, and join on the inventory array to build hasRope, mapSpot, firstThree, and packed — then print three of them."
docs: [javascript/arrays, javascript/strings]
checks:
  - id: tour-complete
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-findings
    type: stdout
    entry: main.js
    match: exact
    value: "true\n1\nsword | map | rope | lantern | coin\n"
hints:
  - "Each method is called with a dot on the array: inventory.includes(\"rope\") asks a question and answers with a boolean."
  - "slice(0, 3) copies from position 0 UP TO (not including) 3. indexOf hands back a position — remember positions start at 0."
  - "join's separator goes in the quotes: inventory.join(\" | \") — space, bar, space."
---
## The toolbelt

You know `push`, `length`, and `for...of`. Arrays come with dozens more
built-in methods — today you'll meet four you'll reach for constantly.
All of them are *questions you ask the array*; none of them need a loop.

**`includes(item)`** — "is this in there?" Answers with a boolean:

```js
const pets = ["cat", "dog", "fish"];
pets.includes("dog");     // true
pets.includes("dragon");  // false
```

**`indexOf(item)`** — "*where* is it?" Answers with a position (starting
at 0, as always), or `-1` if it's not there at all:

```js
pets.indexOf("fish");     // 2
pets.indexOf("dragon");   // -1
```

**`slice(start, end)`** — "copy me a piece." From `start` up to — but
*not including* — `end`:

```js
pets.slice(0, 2);         // ["cat", "dog"]
```

Important: `slice` **copies**. The original array is untouched — the
tests will check you didn't chop up the inventory.

**`join(separator)`** — "squash yourself into one string," gluing the
items together with whatever separator you choose:

```js
pets.join(", ");          // "cat, dog, fish"
```

Notice the pattern: each method *returns* its answer — it doesn't print
anything. You catch the answer in a variable, then decide what to do
with it. That's the same return-don't-print discipline your own
functions follow.

### Your goal

The starter has an adventurer's `inventory`. Build four variables:

1. `hasRope` — use `includes` to ask if `"rope"` is in the inventory.
2. `mapSpot` — use `indexOf` to find the position of `"map"`.
3. `firstThree` — use `slice` to copy the first three items.
4. `packed` — use `join(" | ")` to squash the inventory into one string.

Then print `hasRope`, `mapSpot`, and `packed` — one per line:

```
true
1
sword | map | rope | lantern | coin
```
