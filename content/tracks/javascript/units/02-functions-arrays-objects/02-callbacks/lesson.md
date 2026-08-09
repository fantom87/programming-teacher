---
id: 02-callbacks
title: "Callbacks: Functions as Values"
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Write applyTwice(fn, value) that applies a function twice, and forEachItem(items, action) that loops an array calling action on each item — then use both."
docs: [javascript/functions-and-closures, javascript/loops]
checks:
  - id: callbacks-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-story
    type: stdout
    entry: main.js
    match: exact
    value: "25\nI like apples\nI like pretzels\nI like cocoa\n"
hints:
  - "Inside applyTwice, fn is a normal function — call it like one: const once = fn(value); then return fn(once);"
  - "forEachItem is a for...of loop that calls action(item) on each item — it doesn't need to return anything."
  - "Step 4 passes an arrow right into your function: forEachItem(snacks, (snack) => console.log(`I like ${snack}`));"
---
## Handing a function to a function

Last lesson you stored a function in a variable. Here's the payoff: if a
function is a value, you can **pass it to another function** — the same
way you'd pass a number. A function passed in like that is called a
**callback**, because the receiver *calls it back*.

```js
const addTen = (n) => n + 10;

function applyTwice(fn, value) {
  return fn(fn(value));   // call fn, then call fn on THAT result
}

applyTwice(addTen, 5);    // 5 -> 15 -> 25
```

Look closely at `applyTwice`: it never mentions `addTen`. It works with
*whatever* function you hand it — a doubler, a shouter, anything. The
caller supplies the behavior; `applyTwice` supplies the plumbing. That
division of labor is the single most important idea in this unit.

One pitfall: pass the function itself, **without parentheses**.
`applyTwice(addTen, 5)` hands over the recipe; `applyTwice(addTen(5), 5)`
would cook it first and hand over `15` — not what you want.

You'll also build `forEachItem(items, action)` — a loop with a socket
where the body should be. It visits every item and calls `action(item)`.
JavaScript's built-in array methods (`forEach`, `map`, `filter` — coming
next) work exactly like this, so you're about to build your own before
you meet theirs.

### Your goal

1. Write `applyTwice(fn, value)` — returns `fn(fn(value))`.
2. Write `forEachItem(items, action)` — loops `items` with `for...of`,
   calling `action(item)` for each one.
3. Print `applyTwice(addTen, 5)` — should print `25`.
4. Use `forEachItem` with an arrow callback to print `I like ${snack}`
   for every snack in the starter array:

```
25
I like apples
I like pretzels
I like cocoa
```
