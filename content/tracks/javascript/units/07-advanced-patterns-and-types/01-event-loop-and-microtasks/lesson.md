---
id: 01-event-loop-and-microtasks
title: The Event Loop and Microtasks
language: javascript
runner: browser
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
goal: "Prove you can predict the event loop: schedule two timers, two promise microtasks, and a nested microtask so the seven lines print in the exact order the spec guarantees."
docs: [javascript/async-and-promises, javascript/functions-and-closures]
checks:
  - id: spec-order
    type: stdout
    entry: main.js
    match: exact
    value: "open\nclose\nmicro a\nmicro b\nmicro c\ntimer a\ntimer b\n"
  - id: really-scheduled
    type: ai-judge
    rubric: "The ordering must EMERGE from the event loop, not from sequential console.logs: exactly two setTimeout calls with delay 0 print 'timer a' and 'timer b' from their callbacks; 'micro a' comes from a queueMicrotask callback that itself queues a second microtask printing 'micro c'; 'micro b' arrives through Promise.resolve(...).then whose callback prints the resolved value or a closed-over string. The scheduling calls appear BETWEEN the 'open' and 'close' logs in source order (timer a, micro a, micro b's promise, timer b), so the printed order differs from source order. Zero async lines may be plain top-level console.log calls, and no positive setTimeout delays are used to fake the interleaving."
hints:
  - "Synchronous code always runs to completion first — both plain console.log lines beat every callback, which is why close prints before micro a even though micro a was scheduled earlier."
  - "A microtask queued by a microtask still runs before any timer: queueMicrotask(() => { console.log(\"micro a\"); queueMicrotask(() => console.log(\"micro c\")); });"
  - ".then callbacks join the same microtask queue as queueMicrotask: Promise.resolve(\"micro b\").then((line) => console.log(line)); — the timers only get their turn once that queue is empty."
---
## One thread, two queues

You've awaited promises for two units. Time to learn what the runtime is
actually doing — because JavaScript runs your code on **one thread**,
and everything async is an appointment book, not a second worker.

The **event loop** follows three rules, in order, forever:

1. Run the current script until the call stack is empty.
2. Drain the **entire microtask queue** — promise callbacks and
   `queueMicrotask` — including microtasks queued *by* microtasks.
3. Take **one** task from the macrotask queue (timers, clicks), run it,
   go back to step 2.

That's the whole machine. Now read the classic interview snippet:

```js
setTimeout(() => console.log("timer"), 0);
Promise.resolve().then(() => console.log("promise"));
console.log("sync");
```

`sync` first — rule 1, running code finishes before any callback.
`promise` second — rule 2, microtasks drain before timers get a turn.
`timer` last, despite its `0`. A zero-delay timeout never means *now*;
it means *after the stack empties and every microtask has run*.

Two details make this knowledge professional-grade:

- **Microtasks can starve timers.** Each microtask may queue more, and
  the loop drains them all before step 3. A `.then` chain that keeps
  scheduling work will hold every timer hostage.
- **This ordering is spec-guaranteed.** It isn't a race or an
  implementation quirk — browsers and Node agree byte for byte, which
  is exactly why our checker can demand your output in exact order.

Your job: choreograph seven lines so the queues, not the source order,
decide what prints when.

### Your goal

Between a first `console.log("open")` and a final
`console.log("close")`, schedule — in this source order —

1. a `setTimeout(..., 0)` that prints `timer a`,
2. a `queueMicrotask` that prints `micro a` **and queues a second
   microtask** printing `micro c`,
3. a `Promise.resolve("micro b").then(...)` that prints its value,
4. a `setTimeout(..., 0)` that prints `timer b`.

Run it and confirm the event loop reorders everything:

```
open
close
micro a
micro b
micro c
timer a
timer b
```

Before running, predict *why* `micro c` beats `timer a` — that's the
lesson.
