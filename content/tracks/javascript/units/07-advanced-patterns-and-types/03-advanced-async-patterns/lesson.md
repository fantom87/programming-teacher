---
id: 03-advanced-async-patterns
title: Advanced Async Patterns
language: javascript
runner: browser
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
goal: "Coordinate a fleet of promises: Promise.all for parallel results in argument order, Promise.race for the first answer, and Promise.allSettled to survive a failing service without a try/catch pile."
docs: [javascript/async-and-promises, javascript/arrays]
checks:
  - id: promise-shaped
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: status-page
    type: stdout
    entry: main.js
    match: exact
    value: "api ok | db ok | cache ok\nfirst answer: db ok\napi ok\nrecovered: db down\ncache ok\n"
  - id: real-coordination
    type: ai-judge
    rubric: "wait wraps setTimeout in a promise; ping awaits wait(ms), throws `${name} down` when up is false, and returns `${name} ok` otherwise. The first report awaits ONE Promise.all whose array literal contains three un-awaited ping calls (awaiting them one by one, or pushing already-awaited values, fails) and joins the RESULT array with ' | ' — the argument-order output despite db finishing first must come from Promise.all's ordering guarantee, not sorting or hardcoded strings. 'first answer' awaits Promise.race over three fresh pings. The last section awaits Promise.allSettled with the db ping called with up=false, then loops the results printing r.value for fulfilled entries and 'recovered: ' + r.reason.message for rejected ones — no try/catch around all/allSettled, and no printed line is a hardcoded final string."
hints:
  - "Start every ping BEFORE awaiting: const reports = await Promise.all([ping(\"api\", 60), ping(\"db\", 20), ping(\"cache\", 40)]); — three timers overlap, and reports arrives in ARGUMENT order no matter who finished first."
  - "Promise.race resolves with the first settled value: await Promise.race([...three fresh pings...]) — the 20ms db wins."
  - "allSettled never throws; it describes: for (const r of results) console.log(r.status === \"fulfilled\" ? r.value : `recovered: ${r.reason.message}`);"
---
## Herding promises

`await` handles one promise beautifully — and one at a time is exactly
how production code goes slow. Await three 60ms services in a row and
you've built a 180ms page from 60ms parts. The fix is the pattern
behind every fast dashboard: **start everything, then wait once.**

```js
const reports = await Promise.all([ping("api", 60), ping("db", 20), ping("cache", 40)]);
```

All three calls fire before the `await` — the timers overlap, and the
whole line costs about as much as the slowest ping. Two guarantees make
`Promise.all` dependable: results come back **in argument order** (the
db finishes first but stays in slot two), and one rejection rejects the
lot — all-or-nothing.

Sometimes you want the opposite extremes:

- **`Promise.race`** settles with the *first* promise to finish —
  timeouts, fastest-mirror selection, "whichever cache answers".
- **`Promise.allSettled`** *never rejects*. It waits for everyone and
  hands you `{ status: "fulfilled", value }` or
  `{ status: "rejected", reason }` per entry — the tool for "show every
  service's status, including the broken one" without a try/catch pile.

You'll build a status page that uses all three. The timings (20/40/60ms)
are fixed, so the output is deterministic — but note what it proves:
`db ok` finishes first, yet the `Promise.all` line still lists `api`
first. Order comes from the array you passed, not the finish line.

### Your goal

1. `wait(ms)` — a promise-wrapped `setTimeout` (you've built this
   before; it's muscle memory now).
2. `async function ping(name, ms, up = true)` — awaits `wait(ms)`,
   throws `` `${name} down` `` if `up` is false, else returns
   `` `${name} ok` ``.
3. In an async `main()`:
   - `Promise.all` over `api` (60ms), `db` (20ms), `cache` (40ms) —
     print the results joined with `" | "`.
   - `Promise.race` over three fresh pings — print
     `first answer: <winner>`.
   - `Promise.allSettled` with `db` called as `up = false` — print
     `r.value` per fulfilled entry, `recovered: <reason.message>` per
     rejected one.

```
api ok | db ok | cache ok
first answer: db ok
api ok
recovered: db down
cache ok
```
