---
id: 05-async-and-concurrency
title: Async and Concurrency
language: python
runner: local
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Re-arm asyncio: a probe coroutine, run_all with one gather proving argument order vs completion order, and with_timeout catching wait_for's TimeoutError — the tests time you."
docs: [python/functions, python/errors-and-exceptions]
checks:
  - id: async-trio-holds-up
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: drill-output
    type: stdout
    entry: main.py
    match: exact
    value: "['db', 'api', 'cache']\n['api', 'cache', 'db']\ntimed out\n"
  - id: genuinely-concurrent
    type: ai-judge
    rubric: "probe, run_all, and with_timeout are all async def. probe awaits asyncio.sleep(delay) — never time.sleep — then appends name to log and returns name. run_all builds one probe coroutine per (name, delay) job and runs them through a single asyncio.gather call unpacked with * (no await-in-a-loop sequencing), returning the (results, log) pair. with_timeout wraps exactly one await asyncio.wait_for(coro, limit) in try/except TimeoutError (or asyncio.TimeoutError) and returns the literal string 'timed out' on expiry — no polling, no extra sleeps. The only asyncio.run calls are the drill lines at the bottom of the file, which are intact."
hints:
  - "probe is three lines: await asyncio.sleep(delay), log.append(name), return name — the append AFTER the sleep is what records completion order."
  - "run_all: log = [], then results = await asyncio.gather(*(probe(n, d, log) for n, d in jobs)), then return results, log — the * unpacking is what makes them run together."
  - "with_timeout: try: return await asyncio.wait_for(coro, limit) / except TimeoutError: return \"timed out\" — since 3.11 the asyncio flavor IS the builtin."
---
## One loop, many waits

`async def` makes a coroutine — calling it builds a paused computation;
only the event loop runs it. `await` is the pause point: this task
sleeps, the loop runs someone else. One thread, overlapping waits — no
threads, no GIL contention, just cooperative scheduling.

Rapid recall:

```python
asyncio.run(main())                  # start the loop, run to completion
await asyncio.sleep(0.02)            # yield to the loop, resume later
await asyncio.gather(a(), b(), c())  # concurrent; results in ARGUMENT order
await asyncio.wait_for(coro, 0.05)   # TimeoutError past the limit
```

Two orderings to keep straight: `gather` returns results in the order
you *passed* the coroutines, while the coroutines *finish* in delay
order — the drill prints both lists so the difference stares back. And
since 3.11, `asyncio.TimeoutError` is the builtin `TimeoutError`.

### Your goal

1. `probe(name, delay, log)` — async: sleep `delay`, append `name` to
   `log`, return `name`.
2. `run_all(jobs)` — async: for a list of `(name, delay)` pairs, run
   every probe **concurrently** with one `gather`; return
   `(results, log)`. The tests clock you — sequential awaits run three
   times too slow and fail.
3. `with_timeout(coro, limit)` — async: the coro's value via
   `wait_for`, or `"timed out"` if it blows the limit.

Drill output, byte for byte:

```
['db', 'api', 'cache']
['api', 'cache', 'db']
timed out
```
