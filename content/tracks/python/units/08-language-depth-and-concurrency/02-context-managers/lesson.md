---
id: 02-context-managers
title: Context Managers
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Build the with protocol yourself: a Section class with __enter__/__exit__ that brackets a block with header and footer lines, and muted(errors) — a @contextmanager generator that swallows one exception type and prints recovered."
docs: [python/files, python/errors-and-exceptions, python/classes]
checks:
  - id: managers-behave
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-the-sections
    type: stdout
    entry: main.py
    match: exact
    value: "== deploy ==\npushing code\n== end deploy ==\n== cleanup ==\nrecovered\nstill standing\n== end cleanup ==\n"
  - id: real-protocol
    type: ai-judge
    rubric: "Section stores the title in __init__, prints the header in __enter__ and the footer in __exit__(self, exc_type, exc, tb), and returns None/False from __exit__ so exceptions still propagate. muted is a generator decorated with @contextmanager whose body is try: yield / except errors: print('recovered') — not a class, and not contextlib.suppress. The demo at the bottom uses with statements only — no manual __enter__/__exit__ calls — and int('nope') (or an equivalent raising expression) actually raises inside `with muted(ValueError):`."
hints:
  - "Section's three methods: __init__ stores self.title; __enter__ prints f\"== {self.title} ==\" and returns self; __exit__(self, exc_type, exc, tb) prints f\"== end {self.title} ==\" — and returns nothing, so errors keep flying."
  - "@contextmanager turns a generator into a manager: everything before yield is __enter__, everything after is __exit__. Wrap the yield: try: yield / except errors: print(\"recovered\")."
  - "The nesting for cleanup: with Section(\"cleanup\"):, inside it with muted(ValueError): int(\"nope\"), then print(\"still standing\") back at Section level."
---
## What `with` actually calls

You've *used* `with open(...)` since the core tier. Time to own the
machinery. A `with` block speaks a two-method protocol:

```python
with thing as x:   # x = thing.__enter__()
    ...            # the block runs
                   # thing.__exit__(exc_type, exc, tb) — ALWAYS runs
```

`__exit__` is the whole point: it runs whether the block finished or
blew up — it's `finally` wearing an object. The three arguments
describe the exception (`None, None, None` on a clean exit), and if
`__exit__` returns a truthy value, the exception is *swallowed*.
Return `None` like a good citizen and errors propagate normally.
That's the entire trick behind `open` closing files, locks releasing,
and database transactions rolling back.

Writing the class is honest work — `__init__`, `__enter__`, `__exit__`
— but the standard library has a shortcut for the common case:

```python
from contextlib import contextmanager

@contextmanager
def muted(errors):
    try:
        yield          # the with-block runs HERE
    except errors:
        print("recovered")
```

A generator plus last lesson's decorator idea: code before `yield` is
the enter, code after (or around it in `try`) is the exit. Suppressing
in `except` is the one legitimate way to swallow — deliberate and
visible.

### Your goal

1. `Section(title)` — a class-based manager: `__enter__` prints
   `== title ==`, `__exit__` prints `== end title ==` and lets
   exceptions through.
2. `muted(errors)` — the `@contextmanager` generator above, swallowing
   only the given exception type.
3. Demo: a `deploy` section printing `pushing code`; then a `cleanup`
   section where `muted(ValueError)` wraps `int("nope")`, followed by
   `print("still standing")`:

```
== deploy ==
pushing code
== end deploy ==
== cleanup ==
recovered
still standing
== end cleanup ==
```
