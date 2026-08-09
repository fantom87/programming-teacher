---
id: 03-async-and-the-event-loop
title: "Async and the Event Loop"
language: javascript
runner: browser
estMinutes: 18
files:
  - path: main.js
    starter: starter/main.js
goal: "Drill the event loop: delay(ms) promisifies setTimeout, trace() proves microtasks beat macrotasks, and finishLine() gathers a slow and a fast racer through one Promise.all that keeps list order."
docs: [javascript/async-and-promises]
checks:
  - id: async-shaped
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: queue-order
    type: stdout
    entry: main.js
    match: exact
    value: "sync 1\nsync 2\nscript end\nmicrotask\nmacrotask\ntortoise, hare\nall settled\n"
  - id: real-event-loop
    type: ai-judge
    rubric: "delay wraps setTimeout in new Promise((resolve) => setTimeout(resolve, ms)) — no busy-wait loops, no Date arithmetic. trace logs 'sync 1', schedules the macrotask log with setTimeout(..., 0), queues the microtask log with Promise.resolve().then(...), then logs 'sync 2' — in that construction order, letting the queues (not code reordering) produce the printed sequence. finishLine is an async function that constructs BOTH delay chains — tortoise at 60ms listed first, hare at 20ms second — before a SINGLE await Promise.all([...]), then logs the resolved array joined with ', '. No sequential awaits, no hardcoded 'tortoise, hare' string literal, no extra setTimeout choreography faking the order. The drill lines at the bottom are intact."
hints:
  - "delay: return new Promise((resolve) => setTimeout(resolve, ms)); — resolve IS the timer callback."
  - "The rule to re-cache: when the synchronous script finishes, the microtask queue (promise callbacks) drains completely before the next macrotask (timer callbacks) — hence sync 1, sync 2, script end, microtask, macrotask."
  - "finishLine: const results = await Promise.all([delay(60).then(() => \"tortoise\"), delay(20).then(() => \"hare\")]); console.log(results.join(\", \")); — the hare finishes first, but Promise.all reports in the order you listed."
---
## Two queues, one loop

Async JavaScript is one rule applied everywhere: run the script to the
end, then drain **microtasks** (promise callbacks), then take one
**macrotask** (a timer, an I/O event) and repeat. Every `await` is sugar
for "suspend me; resume as a microtask."

Rapid recall:

```js
new Promise((resolve) => setTimeout(resolve, ms))  // the promisified timer
Promise.resolve().then(fn)   // microtask — runs before any timer
setTimeout(fn, 0)            // macrotask — "0ms" still waits its turn
await Promise.all([a, b])    // results in LIST order, not finish order
```

- A `setTimeout(fn, 0)` never beats a queued promise callback — the
  microtask queue empties first.
- An `async` function runs synchronously until its first `await`, then
  returns a pending promise to its caller.
- `Promise.all` starts nothing — it *watches* promises you already
  started, and fulfills with results in the order you listed them.

### Your goal

Three functions the checks race against each other:

1. `delay(ms)` — a Promise that resolves after `ms` milliseconds.
2. `trace()` — log `sync 1`; schedule `macrotask` via
   `setTimeout(..., 0)`; queue `microtask` via
   `Promise.resolve().then(...)`; log `sync 2`.
3. `finishLine()` — async: start `delay(60).then(() => "tortoise")` and
   `delay(20).then(() => "hare")`, in that order, await them through
   one `Promise.all`, and log the results joined with `", "`.

With the starter's drill lines, the whole run prints exactly:

```
sync 1
sync 2
script end
microtask
macrotask
tortoise, hare
all settled
```
