---
id: 01-pytest-fundamentals
title: pytest Fundamentals
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Write three pytest-style tests for slugify (test_ names, bare asserts), then build run_tests(): collect every test_ function from globals(), run each, print dots/Fs and a computed pytest-style summary."
docs: [python/functions, python/errors-and-exceptions, python/debugging]
checks:
  - id: tests-and-collection-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: pytest-style-report
    type: stdout
    entry: main.py
    match: exact
    value: "...\n3 passed\n"
  - id: real-test-discipline
    type: ai-judge
    rubric: "The three test functions use one bare assert each on slugify's return value — no try/except inside a test body, no unittest.TestCase, no print-based checking. run_tests discovers tests by scanning globals() for callables whose names start with test_ (a hardcoded list of the three names fails this), snapshots them with sorted(...) into a list before running, runs each under try/except AssertionError, prints '.' per pass and 'F' per failure with end=\"\" on one line, and computes the summary from counts — the literal '3 passed' must not appear in the source. slugify itself is unmodified."
hints:
  - "A pytest-style test is just: def test_lowercases(): assert slugify(\"Hello\") == \"hello\" — no return, no print. It passes by not raising."
  - "Collect like pytest does: collected = [(n, f) for n, f in sorted(globals().items()) if n.startswith(\"test_\") and callable(f)] — build the whole list before running anything."
  - "Run each under try/except AssertionError: print(\".\", end=\"\") on success, print(\"F\", end=\"\") and failed += 1 on failure. After the loop, print() to end the dot line, then f\"{failed} failed, {passed} passed\" if anything failed, else f\"{passed} passed\"."
---
## The industry's test runner

Professional Python teams don't sprinkle `print` checks — they run
**pytest**. Its contract is almost invisible: files named `test_*.py`,
functions named `test_*`, and plain `assert` statements. No classes, no
registration. You run `pytest` in the project root and it *collects*
every matching function, runs each one, and prints a dot per pass:

```
$ pytest
...F
=================== FAILURES ===================
_______________ test_punctuation _______________

    def test_punctuation():
>       assert slugify("Hello, World!") == "hello-world"
E       AssertionError: assert 'hello,-world!' == 'hello-world'

1 failed, 3 passed in 0.02s
```

That failure block is pytest's superpower: it re-inspects the `assert`
expression and shows both sides — no message required. Two flags you'll
use daily: `pytest -k slug` runs only tests whose name matches, and
`pytest -x` stops at the first failure.

A test passes by *not raising*. `assert` raises `AssertionError` when
its condition is false; pytest catches that per test, so one failure
never stops the suite. There's no pytest binary inside our runner, so
you'll internalize the model by building its core loop yourself: a
collector that finds `test_` functions **by name** in `globals()` —
exactly how pytest discovers yours — and a reporter that prints the
dots and the summary. It's about ten lines, and after writing it,
pytest's output will never look like magic again.

The code under test is `slugify`, already written: it turns post titles
into URL slugs.

### Your goal

1. Write three tests, one bare `assert` each:
   `test_lowercases` (`"Hello"` → `"hello"`),
   `test_punctuation_dropped` (`"Hello, World!"` → `"hello-world"`),
   `test_spaces_become_hyphens` (`"deep work wins"` → `"deep-work-wins"`).
2. Write `run_tests()`: collect every callable in `globals()` whose
   name starts with `test_` (sorted by name), run each, print `.` or
   `F`, then a summary line computed from the counts.
3. The call at the bottom must print exactly:

```
...
3 passed
```

The checks inject an extra failing test into `globals()` and expect
your collector to find it — a hardcoded list of three can't pass.
