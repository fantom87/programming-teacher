---
id: 06-promises
title: Promises
language: javascript
runner: browser
estMinutes: 18
files:
  - path: main.js
    starter: starter/main.js
goal: "Write wait(ms) — a Promise wrapping setTimeout — and brew(drink, ms) built on top of it, then chain .then links so the café prints its lines in true async order."
docs: [javascript/async-and-promises]
checks:
  - id: promise-shaped
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-in-async-order
    type: stdout
    entry: main.js
    match: exact
    value: "order: latte\n(register is free)\nlatte ready\nhave a great day!\n"
  - id: real-promises
    type: ai-judge
    rubric: "wait builds its promise with new Promise((resolve) => setTimeout(resolve, ms)) — the timer's callback IS resolve. brew does not call new Promise at all: it returns wait(ms).then(...) where that link RETURNS the `${drink} ready` string rather than printing it. The demo prints 'latte ready' and 'have a great day!' through a two-link .then chain — the farewell string is returned by the first link and received by the second — not printed synchronously, not nested setTimeouts, and no console.log is placed to fake the async ordering (the '(register is free)' line must be ordinary top-level code at the file's end)."
hints:
  - "wait is one line: return new Promise((resolve) => setTimeout(resolve, ms)); — you're handing resolve to the timer as its callback."
  - "brew doesn't need new Promise at all — build on wait: return wait(ms).then(() => `${drink} ready`);"
  - "The chain: brew(\"latte\", 120).then((msg) => { console.log(msg); return \"have a great day!\"; }).then((line) => console.log(line)); — the return feeds the next link."
---
## An IOU for a value

Run this anywhere and nothing pauses:

```js
setTimeout(() => console.log("later"), 120);
console.log("now");
```

`now` prints first. JavaScript never waits — slow things are *scheduled*,
and the program keeps moving. Wonderful for responsiveness, awkward for
logic, because "the result" doesn't exist yet on the very next line.

A **Promise** is the modern handle on a future value: an IOU that sits
*pending* until it **fulfills** with a value (or **rejects** with an
error — that's lesson 8). You create one by wrapping the old callback
world:

```js
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

Read it slowly. The Promise hands you a `resolve` function; calling it
is how you announce "the IOU is paid." Here the timer's callback *is*
`resolve` — after `ms` milliseconds, the promise fulfills.

`.then` registers what happens next, and here's the rule that makes
promises click: **whatever a `.then` returns becomes the value of the
next link.**

```js
wait(120)
  .then(() => "latte ready")          // returns a value…
  .then((msg) => console.log(msg));   // …which arrives here
```

Return-flows-forward is why chains stay *flat* — step, then step, then
step — where nested callbacks would pile into the pyramid of doom. Your
café below runs on it: `brew` returns a promise of the ready message, the
first link prints it and returns the farewell, the second link prints
that.

And the top level? It places the order and immediately prints
`(register is free)` — the whole point of async. Watch where that line
lands in the output.

### Your goal

1. `wait(ms)` — return a Promise that fulfills after `ms` milliseconds
   (wrap `setTimeout`; `resolve` is its callback).
2. `brew(drink, ms)` — build on `wait`: a promise of `` `${drink} ready` ``.
3. Print `order: latte`, then chain `brew("latte", 120)` — the first
   `.then` prints its message and *returns* `"have a great day!"`; a
   second `.then` prints that.
4. Bottom of the file: print `(register is free)`:

```
order: latte
(register is free)
latte ready
have a great day!
```
