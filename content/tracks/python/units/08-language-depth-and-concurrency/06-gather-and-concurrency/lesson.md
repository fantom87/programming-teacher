---
id: 06-gather-and-concurrency
title: Gather and Concurrency
language: python
runner: local
estMinutes: 20
files:
  - path: main.py
    starter: starter/main.py
goal: "Run three fetches at once with asyncio.gather: each prints its arrival as it completes (fastest first), while gather hands back the results in call order — and the whole trio takes only as long as the slowest."
docs: [python/stdlib-tour, python/loops]
checks:
  - id: gather-behaves
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-both-orders
    type: stdout
    entry: main.py
    match: exact
    value: "firing all three\ncache arrived\napi arrived\ndb arrived\ndb data\ncache data\napi data\n"
  - id: concurrent-not-sequential
    type: ai-judge
    rubric: "fetch is async def, awaits asyncio.sleep(ms / 1000), prints its computed arrival line AFTER the sleep, and returns f'{source} data'. main awaits a single asyncio.gather(fetch('db', 100), fetch('cache', 20), fetch('api', 60)) in exactly that argument order — the three are never awaited one at a time — and the last three lines come from looping over gather's returned list, not from retyped literals. One asyncio.run(main()) drives the file; time.sleep appears nowhere."
hints:
  - "fetch(source, ms): await asyncio.sleep(ms / 1000), then print(f\"{source} arrived\"), then return f\"{source} data\" — the print marks the moment it finishes."
  - "results = await asyncio.gather(fetch(\"db\", 100), fetch(\"cache\", 20), fetch(\"api\", 60)) — gather starts all three immediately and resumes main when the last one lands."
  - "The arrival lines order themselves by speed (cache 20ms first, db 100ms last); the results list ignores speed and follows the call order — loop for r in results: print(r) and don't reorder anything."
---
## Waiting on everything at once

Last lesson's pipeline awaited one step at a time — 180ms of sleeps,
180ms of runtime, because each await parks `main` until that coroutine
finishes. Fine when steps depend on each other. But three *independent*
fetches — a database, a cache, an API — shouldn't queue. The tool for
"start them all, wake me when they're all done" is
**`asyncio.gather`**:

```python
results = await asyncio.gather(
    fetch("db", 100),
    fetch("cache", 20),
    fetch("api", 60),
)
```

Remember: `fetch("db", 100)` merely *creates* a coroutine. Handing all
three to `gather` schedules them on the event loop together — the
first sleep starts, and instead of blocking, the loop leaps to start
the second, then the third. All three clocks tick *simultaneously*.
Total wall time: the slowest fetch (about 100ms), not the sum (180ms).
That's concurrency without threads: one thread, one loop, interleaved
waiting.

Two orders to keep straight — this is the heart of the lesson:

- **Completion order** is by speed: cache (20ms) finishes first, then
  api (60ms), then db (100ms). Anything a coroutine *does* — like
  printing its arrival — happens in this order.
- **Result order** is by *call*: `gather` returns
  `[db_result, cache_result, api_result]`, matching its arguments, no
  matter who finished when. Your code downstream never has to guess
  which result is which.

(Under the hood `gather` wraps each coroutine in a `Task` — the
loop's unit of scheduling. `asyncio.create_task(coro)` is the manual
version, for when you want to start something and await it later.)

### Your goal

1. `fetch(source, ms)` — async: sleep `ms / 1000`, print
   `{source} arrived`, return `{source} data`.
2. `main()` — print `firing all three`, gather `db` (100), `cache`
   (20), `api` (60) *in that call order*, then print each result from
   the returned list.
3. One `asyncio.run(main())`:

```
firing all three
cache arrived
api arrived
db arrived
db data
cache data
api data
```
