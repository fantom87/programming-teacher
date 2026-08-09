---
id: 05-async-and-await
title: Async and Await
language: python
runner: local
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Write your first coroutines: an async step(name, ms) helper on asyncio.sleep, an async main() that awaits three build steps in order and prints their returned values, and one asyncio.run(main()) to drive it all."
docs: [python/functions, python/stdlib-tour]
checks:
  - id: coroutines-behave
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-the-pipeline
    type: stdout
    entry: main.py
    match: exact
    value: "== Build pipeline ==\nrestore done\ncompile done\npublish done\nbuild succeeded\n"
  - id: really-async
    type: ai-judge
    rubric: "step is declared async def, awaits asyncio.sleep(ms / 1000) (time.sleep appears nowhere in the file), and returns the f-string f'{name} done' — the three step lines are printed awaited return values, never retyped literals. main is async def and awaits step('restore', 80), step('compile', 60), step('publish', 40) in that order, each inside its own print. Exactly one asyncio.run(main()) at the bottom drives the program — no bare main() call, no asyncio.run per step."
hints:
  - "The helper: async def step(name, ms): await asyncio.sleep(ms / 1000); return f\"{name} done\" — calling it makes a coroutine object; only await (inside an async def) actually runs it."
  - "main is a coroutine too: async def main(): print the header, then print(await step(\"restore\", 80)) and so on — await pauses main at that line until the sleep finishes and the return value arrives."
  - "Only asyncio.run(main()) at the bottom starts the event loop. If you see 'coroutine was never awaited' in a warning, you called a coroutine somewhere without await."
---
## Pausing without blocking

Real programs spend most of their time *waiting* — for networks,
disks, databases. Python's answer is the coroutine: a function that
can **pause itself** at a marked point, hand control back to an event
loop, and resume when its wait is over.

```python
import asyncio

async def step(name, ms):
    await asyncio.sleep(ms / 1000)   # an async pause — nothing blocks
    return f"{name} done"
```

Two new words, two rules. `async def` makes a **coroutine function**:
calling `step("restore", 80)` runs *none* of its body — it returns a
coroutine object, a paused computation (the same trick generators
pulled with `yield`). `await` is what actually runs it: pause *here*
until that coroutine finishes, then hand me its return value. And
`await` is only legal inside an `async def` — pausing is something
coroutines do to each other.

At the bottom of the stack someone unpaused has to spin the wheel.
That's the **event loop**:

```python
asyncio.run(main())
```

`asyncio.run` starts a loop, runs the `main()` coroutine to
completion, and shuts the loop down. One call, at the bottom of the
file — everything above it is `async def`s awaiting each other.

`asyncio.sleep` stands in for real I/O the way `Task.Delay` and
`setTimeout` do in other languages you may know — every async
library (`aiohttp`, database drivers) hands you awaitables with
exactly this shape. Its blocking cousin `time.sleep` is the one thing
you must never call in async code: it freezes the entire loop, and
every coroutine on it.

Today the awaits run strictly in order — restore, then compile, then
publish — because each step *needs* the previous one. Total wait: the
sum of the sleeps. Next lesson, the steps that don't depend on each
other run at the same time.

### Your goal

1. Write `step(name, ms)` exactly as above.
2. Write `async def main()`: print the header, then print the awaited
   result of `step("restore", 80)`, `step("compile", 60)`,
   `step("publish", 40)` — in that order — then the closing line.
3. Drive it with one `asyncio.run(main())`:

```
== Build pipeline ==
restore done
compile done
publish done
build succeeded
```
