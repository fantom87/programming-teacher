---
id: 01-arrow-functions
title: Arrow Functions
language: javascript
runner: browser
estMinutes: 12
files:
  - path: main.js
    starter: starter/main.js
goal: "Write three arrow functions — square(n), half(n), and shout(word) — then print square(5), half(10), and shout(\"hi\")."
docs: [javascript/functions-and-closures, javascript/syntax-cheatsheet]
checks:
  - id: arrows-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-results
    type: stdout
    entry: main.js
    match: exact
    value: "25\n5\nHI!\n"
  - id: uses-arrow-syntax
    type: ai-judge
    rubric: "square, half, and shout are all written as arrow functions assigned to const (or let) — not function declarations. At least square and half use the concise expression body: no braces and no return keyword."
hints:
  - "The shape: const square = (n) => n * n; — for a single expression, no braces and no return needed."
  - "shout chains a method and +: const shout = (word) => word.toUpperCase() + \"!\";"
  - "Then print the calls: console.log(square(5)); console.log(half(10)); console.log(shout(\"hi\"));"
---
## Functions, sharpened

You already write functions with the `function` keyword. Modern JavaScript
has a second, shorter way you'll see everywhere: the **arrow function**.

```js
function double(n) {           // the way you know
  return n * 2;
}

const double = (n) => n * 2;   // the arrow way
```

Read the arrow version left to right: *take `n`, arrow it into `n * 2`.*
Two things changed:

- The function is now a **value stored in a variable** — proof that in
  JavaScript, functions are just values like numbers and strings. (Next
  lesson leans hard on that idea.)
- The body is a single expression, so there are **no braces and no
  `return`** — the expression's result is handed back automatically.

Need more than one statement? Add braces — but then `return` comes back:

```js
const describe = (name, score) => {
  const label = name.toUpperCase();
  return `${label}: ${score}`;
};
```

Arrows shine for short, single-job functions — exactly the kind you'll
soon be handing to array methods like `map` and `filter`. Getting fluent
now pays off for the whole unit.

One habit to build: since an arrow lives in a `const`, define it *before*
you call it — the program reads top to bottom.

### Your goal

Write three arrow functions:

1. `square` — takes `n`, returns `n * n`.
2. `half` — takes `n`, returns `n / 2`.
3. `shout` — takes a word, returns it uppercased with `!` on the end,
   so `shout("hi")` returns `"HI!"` (`.toUpperCase()` is your friend).

Then print `square(5)`, `half(10)`, and `shout("hi")` — one per line:

```
25
5
HI!
```
