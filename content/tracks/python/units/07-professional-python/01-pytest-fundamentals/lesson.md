---
id: 01-pytest-fundamentals
title: pytest Fundamentals
language: python
runner: browser
estMinutes: 16
files:
  - path: main.py
    starter: starter/main.py
goal: "Write three pytest-style tests for slugify — test_ names, one bare assert each — then build run_tests(): collect every test_ function out of globals(), run them, and print dots and a computed summary the way pytest does."
docs: [python/functions, python/errors-and-exceptions, python/debugging]
checks:
  - id: tests-and-collector-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: pytest-style-report
    type: stdout
    entry: main.py
    match: exact
    value: "...\n3 passed\n"
  - id: real-pytest-discipline
    type: ai-judge
    rubric: "Each of the three test functions is named test_<something>, takes no parameters, and contains exactly one bare assert comparing slugify's return value to an expected string — no try/except inside a test body, no unittest.TestCase, no print-based checking, no return statement. run_tests discovers its tests by scanning globals() for callables whose names start with 'test_' (a hardcoded list of the three names is wrong), snapshots them into a list before running any of them, runs each inside try/except AssertionError, prints '.' or 'F' with end=\"\" so they share one line, and builds the summary line from the pass/fail counters — the literal text '3 passed' never appears in the source. slugify itself is left unmodified."
hints:
  - "A pytest test is startlingly plain: def test_lowercases(): assert slugify(\"Hello\") == \"hello\". No return, no print — it passes by not raising."
  - "Collect the way pytest does, in one comprehension: collected = [fn for name, fn in list(globals().items()) if name.startswith(\"test_\") and callable(fn)]. Build the whole list before running anything."
  - "Then loop: try: fn(); print(\".\", end=\"\"); passed += 1 / except AssertionError: print(\"F\", end=\"\"); failed += 1. After the loop print() to end the line, then f\"{failed} failed, {passed} passed\" if failed else f\"{passed} passed\"."
---
## The contract behind pytest

Professional Python teams don't check their code with scattered
`print` calls — they run **pytest**, and its contract is almost
invisible. Files named `test_*.py`. Functions named `test_*`. Plain
`assert` statements. No base class, no registration, no imports beyond
what you're testing:

```python
# test_slugs.py
from blog.slugs import slugify

def test_lowercases():
    assert slugify("Hello") == "hello"
```

You type `pytest` in the project root and it walks the tree, *collects*
every matching function, and runs each one:

```
$ pytest -q
...F
______________________ test_punctuation ________________________
    def test_punctuation():
>       assert slugify("Hello, World!") == "hello-world"
E       AssertionError: assert 'hello,-world' == 'hello-world'

1 failed, 3 passed in 0.02s
```

That failure block is the payoff. pytest rewrites your `assert` so it
can show both sides when it breaks — which is why you almost never
write an assertion message. Two flags earn their keep immediately:
`pytest -k slug` runs only tests whose names match, and `pytest -x`
stops at the first failure.

The mental model is one sentence: **a test passes by not raising.**
`assert` raises `AssertionError` when its condition is false; pytest
catches that per test, so one failure never stops the suite.

There's no pytest binary inside this runner, so you'll internalize the
model by building its core: a collector that finds `test_` functions
**by name** in `globals()` — exactly how pytest finds yours — and a
reporter that prints the dots and the tally. Ten lines, and pytest
stops being magic forever.

The code under test is `slugify`, already written and working.

### Your goal

1. Three tests, one bare `assert` each: `test_lowercases`
   (`"Hello"` → `"hello"`), `test_punctuation_dropped`
   (`"Hello, World!"` → `"hello-world"`), `test_spaces_become_hyphens`
   (`"deep work wins"` → `"deep-work-wins"`).
2. `run_tests()` — collect, run, print `.` or `F`, then a summary
   computed from the counts.
3. The call at the bottom must print exactly:

```
...
3 passed
```

The checks inject extra tests into `globals()` at runtime, so a
hardcoded list of three names can't pass — and they swap in a broken
`slugify` to prove your asserts can actually fail.
