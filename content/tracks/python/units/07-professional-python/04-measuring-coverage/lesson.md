---
id: 04-measuring-coverage
title: Measuring Coverage
language: python
runner: browser
estMinutes: 20
files:
  - path: main.py
    starter: starter/main.py
goal: "Build a miniature coverage tool: instrument() wraps every function under test in a counting wrapper, coverage_report() prints the percentage and names the gaps — then write the tests that close them, asserting real values."
docs: [python/functions, python/dicts, python/debugging]
checks:
  - id: coverage-tool-and-suite-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: hundred-percent
    type: stdout
    entry: main.py
    match: exact
    value: "....\n4 passed\ncoverage: 100% (6/6)\n"
  - id: real-coverage-discipline
    type: ai-judge
    rubric: "instrument(names) loops the given names and replaces each module global with make_counter(name, original) — it records nothing at instrument time, only when a wrapped function is actually called, and it is invoked once before the suite runs, mirroring `coverage run -m pytest`. coverage_report computes both numbers from len(HITS) and len(UNDER_TEST): the percentage is calculated, never a literal '100%', and the missing names come from sorting the set difference UNDER_TEST - HITS rather than a hardcoded list. The three added tests assert concrete expected values returned by quote and refund — none of them merely calls a function to light up coverage, and none recomputes the expected answer by calling the function under test on both sides of the assert. The six functions under test, make_counter, run_tests and UNDER_TEST are unmodified."
hints:
  - "instrument is a three-line loop: for name in names: globals()[name] = make_counter(name, globals()[name]). Order matters — instrument before run_tests, the way coverage starts measuring before pytest starts running."
  - "Report from the data: missing = sorted(set(UNDER_TEST) - HITS), then percent = round(len(HITS) / len(UNDER_TEST) * 100). Print f\"coverage: {percent}% ({len(HITS)}/{len(UNDER_TEST)})\" and, only when something is missing, add f\" missing: {', '.join(missing)}\"."
  - "The three gaps need three tests: quote(2.0, \"national\", days=1) is 1490, quote(2.0, \"national\", code=\"SHIP10\") is 801, refund(1000) is 800. Assert those numbers — a test that calls without asserting raises the coverage number and proves nothing."
---
## What ran, not what works

You have a suite. Which lines has it never touched? **coverage.py**
answers that. It watches your code execute, records every line reached,
and reports the ones that weren't:

```
$ coverage run -m pytest
$ coverage report -m
Name          Stmts   Miss  Cover   Missing
---------------------------------------------
shipping.py      18      4    78%   22, 31-33
```

Same thing in one step through the pytest plugin:
`pytest --cov=shipping --cov-report=term-missing`. Add `--cov-branch`
and it also tracks *branches* — an `if` whose false path never ran
counts as a miss even though every line executed. Teams wire a floor
into `pyproject.toml`:

```toml
[tool.coverage.report]
fail_under = 85
```

so the build fails when coverage slips. Genuinely unreachable code gets
a `# pragma: no cover` comment, used sparingly and with a reason.

Now the caveat every professional learns the hard way: **coverage
measures execution, not verification.** A test that calls a function
and asserts nothing scores exactly like a good one. So read coverage in
one direction only — a *missing* line is proof of a gap, but a covered
line is no proof of correctness. 100% coverage with weak assertions is
a comfortable lie.

You'll build the idea at a coarser grain: instead of lines, count
*functions*. A wrapper records the name before calling through — which
is exactly what you practised patching last lesson. Then a report tells
you what your suite never touched, and you close the gaps.

### Your goal

Six functions are under test; the starter's single test reaches three.

1. `instrument(names)` — replace each named global with
   `make_counter(name, original)` (provided). Call it *before* the
   suite runs.
2. `coverage_report()` — print `coverage: 100% (6/6)`, or when there
   are gaps, `coverage: 50% (3/6) missing: a, b, c` with the names
   sorted. Both numbers computed.
3. Add tests until the report says 100%: one exercising express
   delivery, one a `SHIP10` coupon, one `refund`. Each asserts a real
   expected number.

```
....
4 passed
coverage: 100% (6/6)
```
