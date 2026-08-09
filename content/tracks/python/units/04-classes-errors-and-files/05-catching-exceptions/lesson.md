---
id: 05-catching-exceptions
title: Catching Exceptions
language: python
runner: browser
estMinutes: 14
files:
  - path: main.py
    starter: starter/main.py
goal: "Loop over the receipt entries adding each int() to total inside try/except ValueError — print \"Skipping: <entry>\" for bad entries, then print the total."
docs: [python/errors-and-exceptions, concepts/reading-error-messages]
checks:
  - id: totals-and-skips
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-skip-then-total
    type: stdout
    entry: main.py
    match: exact
    value: "Skipping: extra cheese\n49\n"
  - id: uses-try-except
    type: ai-judge
    rubric: "The total is computed by looping over entries and converting each with int() inside a try block; a matching except ValueError handler prints the Skipping line. The code must not pre-screen strings instead (no isdigit/isnumeric or character checks), must not hardcode 49, and must not print the Skipping line unconditionally."
hints:
  - "Wrap only the risky line: try: total = total + int(entry) — the except clause below it handles the failure."
  - "Catch the specific error int raises: except ValueError: then print(f\"Skipping: {entry}\")."
  - "Shape inside the loop: try: / total = total + int(entry) / except ValueError: / print(f\"Skipping: {entry}\") — and print(total) after the loop."
---
## When good code meets bad data

Run `int("extra cheese")` and Python doesn't shrug — it **raises an
exception** and, if nobody deals with it, the program dies mid-run with
a traceback:

```
ValueError: invalid literal for int() with base 10: 'extra cheese'
```

In real programs, bad data isn't a rare disaster — it's Tuesday. Files
have typos, users mistype, APIs return junk. Python's answer is
`try`/`except`: *attempt* the risky operation, and if a specific
exception occurs, jump to the handler instead of crashing:

```python
try:
    number = int(text)       # the risky line
except ValueError:
    print("not a number")    # runs ONLY if int() raised ValueError
```

If `int(text)` succeeds, the `except` block is skipped entirely. If it
raises `ValueError`, execution jumps straight into the handler — and
then the program *keeps going*. Inside a loop, that means one rotten
entry can't take down the whole batch.

Two habits worth building from day one:

- **Catch the specific exception.** A bare `except:` swallows
  *everything*, including genuine bugs you needed to see. Name the one
  failure you expect: `except ValueError:`.
- **Keep the `try` small.** Wrap the one risky line, not the whole
  program — otherwise you can't tell what actually failed.

### Your goal

The starter has a receipt scan: `entries = ["12", "7", "extra cheese", "30"]`
and `total = 0`. One entry is clearly not a price.

1. Loop over `entries`, adding `int(entry)` to `total` inside a `try`.
2. On `ValueError`, print `Skipping: <entry>` and carry on.
3. After the loop, print the total:

```
Skipping: extra cheese
49
```
