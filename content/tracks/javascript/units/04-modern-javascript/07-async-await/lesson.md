---
id: 07-async-await
title: "Async/Await"
language: javascript
runner: browser
estMinutes: 18
files:
  - path: main.js
    starter: starter/main.js
goal: "Write step(name, ms) and makeBreakfast() with async/await — eggs and toast sequentially, juice and coffee in parallel via Promise.all — and print the seven lines in true kitchen order."
docs: [javascript/async-and-promises]
checks:
  - id: async-shaped
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-in-kitchen-order
    type: stdout
    entry: main.js
    match: exact
    value: "kitchen open\n(taking more orders)\neggs done\ntoast done\njuice done\ncoffee done\nbreakfast served\n"
  - id: real-async-await
    type: ai-judge
    rubric: "step and makeBreakfast are async functions built on await — no .then chains anywhere. Eggs and toast are awaited one after the other; juice and coffee are started together and gathered with a SINGLE await Promise.all([...]) whose result is array-destructured. The printed 'X done' lines come from the values step returned (variables), not retyped literals, and '(taking more orders)' is printed by top-level code after the makeBreakfast() call — not from inside the async function. No setTimeout choreography fakes the ordering."
hints:
  - "step: async function step(name, ms) { await wait(ms); return `${name} done`; } — whatever an async function returns becomes its promise's value."
  - "Sequential is just two awaits in a row: const eggs = await step(\"eggs\", 60); console.log(eggs); — then the same for toast at 40."
  - "Parallel: const [juice, coffee] = await Promise.all([step(\"juice\", 30), step(\"coffee\", 50)]); — both timers run at once, and the array comes back in the order you listed them."
---
## Async that reads like a recipe

`.then` chains work, but even three steps start to zig-zag. Modern
JavaScript has syntax that makes promise code read top-to-bottom:
**`async` / `await`**.

```js
async function makeBreakfast() {
  const eggs = await step("eggs", 60);
  console.log(eggs);
}
```

`await` means *pause this function until that promise settles, then hand
me its value* — the exact `.then` wiring from last lesson, drawn as a
straight line. Two rules govern it:

- `await` only works inside a function marked `async`. (Modules allow it
  at the top level, but our runner executes a plain script — so the
  pattern here is the one you'll use anyway: an async function, called
  at the bottom.)
- An `async` function **always returns a promise**. `return "eggs done"`
  fulfills that promise with the string — which is why `await step(...)`
  produces a value, and why one of today's tests just checks
  `step(...) instanceof Promise`.

Only the async function pauses. The rest of the program keeps moving —
your demo proves it by printing `(taking more orders)` from the top
level while the eggs are still on the stove.

Then the trap every newcomer falls into — awaiting things one at a time
when they could run *at once*:

```js
const juice = await step("juice", 30);    // 30ms…
const coffee = await step("coffee", 50);  // …THEN 50ms — 80ms total
```

Juice doesn't depend on coffee. Start both, await both together:

```js
const [juice, coffee] = await Promise.all([step("juice", 30), step("coffee", 50)]);
```

50ms total — as slow as the *slowest* job, not the sum. `Promise.all`
takes an array of promises and fulfills with an array of results in the
order you listed them (lesson 1's destructuring catches both). Sequential
when steps depend on each other, `Promise.all` when they don't — that
choice is most of professional async code.

### Your goal

1. `step(name, ms)` — async: `await wait(ms)` (provided), return
   `` `${name} done` ``.
2. `makeBreakfast()` — async: print `kitchen open`; await eggs (60) and
   print the result, then toast (40) likewise; run juice (30) and coffee
   (50) through one `Promise.all` and print both results; print
   `breakfast served`.
3. Call `makeBreakfast()`, then print `(taking more orders)` as the
   file's last line:

```
kitchen open
(taking more orders)
eggs done
toast done
juice done
coffee done
breakfast served
```
