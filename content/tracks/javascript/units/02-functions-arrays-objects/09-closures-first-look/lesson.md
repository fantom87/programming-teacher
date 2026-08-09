---
id: 09-closures-first-look
title: "Closures: First Look"
language: javascript
runner: browser
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
goal: "Write makeCounter() and makeTagger(tag) — function factories whose returned functions remember variables from their birthplace — and prove two counters count independently."
docs: [javascript/functions-and-closures]
checks:
  - id: closures-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-proof
    type: stdout
    entry: main.js
    match: exact
    value: "1\n2\n1\n[WARN] low battery\n"
  - id: real-closures
    type: ai-judge
    rubric: "makeCounter declares its count variable INSIDE makeCounter (not at module/global level) and returns a function that increments and returns it — so separate counters cannot share state. makeTagger closes over its tag parameter and returns a function that combines the remembered tag with its message argument. Neither factory's returned value is hardcoded per call."
hints:
  - "Inside makeCounter: let count = 0; then return a function that does count = count + 1; return count; — count must live INSIDE makeCounter."
  - "Each makeCounter() call runs the factory fresh, making a brand-new count — that's why clicks and visits don't interfere."
  - "makeTagger returns an arrow that uses BOTH the remembered tag and its own message: return (message) => `[${tag}] ${message}`;"
---
## Functions that remember

Here's the trick that ties the whole unit together — and genuinely
surprises most programmers the first time. A function created inside
another function **keeps access to its birthplace's variables**, even
after the outer function has finished. That bond is called a
**closure**.

```js
function makeCounter() {
  let count = 0;              // born inside makeCounter
  return () => {
    count = count + 1;        // the inner function still reaches it
    return count;
  };
}

const clicks = makeCounter();
clicks();   // 1
clicks();   // 2
```

Walk through it slowly. `makeCounter()` runs, creates a fresh `count`,
builds an inner function, and returns that inner function. By every rule
of "functions end when they return," `count` should be gone. But the
inner function *closed over* it — so the variable lives on, private,
reachable only through that function. No other code can read or reset
`clicks`'s count. It's the tidiest data-hiding tool JavaScript has.

Now the real magic: **each call to the factory makes a fresh memory.**

```js
const clicks = makeCounter();
const visits = makeCounter();
clicks();  // 1
clicks();  // 2
visits();  // 1  — its own count, untouched by clicks
```

Two counters, two private `count`s. If you'd used one shared variable at
the top of the file, they'd trample each other — the tests check exactly
this, and an AI reviewer confirms the counter's memory lives *inside*
the factory.

Factories can also remember a *setting*. `makeTagger("WARN")` bakes the
tag in once, and the returned function stamps it on every message —
closures as tools you configure, then reuse.

### Your goal

1. Write `makeCounter()` — returns a function that adds 1 to its own
   private count and returns the new value.
2. Prove independence — create `clicks` and `visits` counters, then
   print `clicks()`, `clicks()`, `visits()`.
3. Write `makeTagger(tag)` — returns a function that takes a `message`
   and returns `` `[${tag}] ${message}` ``.
4. Create `warn = makeTagger("WARN")` and print
   `warn("low battery")`:

```
1
2
1
[WARN] low battery
```
