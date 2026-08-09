---
id: 04-generators-decorators-context-managers
title: "Generators, Decorators, Context Managers"
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Re-arm the wrapping trio: a chunks generator, a functools.wraps-correct logged decorator, and a workspace context manager whose close survives an exception."
docs: [python/functions, python/errors-and-exceptions, python/loops]
checks:
  - id: trio-holds-up
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: drill-output
    type: stdout
    entry: main.py
    match: exact
    value: "['abc', 'def', 'g']\nopen scratch\nSCRATCH\nclose scratch\ncall total\n9\n"
  - id: wrapping-done-right
    type: ai-judge
    rubric: "chunks contains yield inside a range(0, len(seq), size) loop (or equivalent stepping) and never materializes the full result as a list. logged defines an inner wrapper taking *args, **kwargs, decorated with @functools.wraps(fn), that prints before calling fn and returns fn's result — and total actually wears @logged rather than printing 'call total' itself. workspace is a @contextmanager generator whose close-print sits in a finally block guarding the yield — not two bare prints hoping nothing raises. The drill lines at the bottom are unmodified."
hints:
  - "for i in range(0, len(seq), size): yield seq[i:i + size] — slicing past the end is safe, so the short last chunk is free."
  - "Decorator skeleton: def logged(fn) → @functools.wraps(fn) on an inner def wrapper(*args, **kwargs) that prints, then return fn(*args, **kwargs) — and logged returns wrapper."
  - "@contextmanager: print the open line, then try: yield name.upper() / finally: print the close line — the finally is what our exploding test checks."
---
## The wrapping trio

Three constructs, one theme — code that wraps other code.

**Generators** pause. `yield` turns a function into a lazy sequence:
each `next` runs to the following `yield` and freezes, locals intact.
Nothing computes until asked.

**Decorators** replace. `@logged` is just `total = logged(total)` — the
wrapper takes `*args, **kwargs`, does its business, and calls through.
One law: `functools.wraps(fn)` on the wrapper, or the function loses
its own `__name__` and docstring.

**Context managers** guarantee. `@contextmanager` builds one from a
generator: code before `yield` is enter, the yielded value lands in
`as`, and the code after runs on the way out — put it in `try/finally`
and it runs even when the body explodes. That guarantee is the whole
point; our tests detonate one on purpose.

### Your goal

1. `chunks(seq, size)` — a **generator** yielding consecutive slices
   of `seq`, `size` at a time (the last may run short). Step with
   `range(0, len(seq), size)`.
2. `logged(fn)` — decorator printing `call <name>` before delegating;
   `functools.wraps` mandatory. Apply it to the starter's `total`.
3. `workspace(name)` — `@contextmanager`: print `open <name>`, yield
   `name.upper()`, print `close <name>` in a `finally`.

Drill output, byte for byte:

```
['abc', 'def', 'g']
open scratch
SCRATCH
close scratch
call total
9
```
