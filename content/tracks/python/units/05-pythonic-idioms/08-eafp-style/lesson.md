---
id: 08-eafp-style
title: EAFP Style
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Write parse_age(text) and lookup(stock, item) in EAFP style — try the real operation, catch the specific exception (ValueError, KeyError), return the fallback — then print the four demo calls."
docs: [python/errors-and-exceptions, python/dicts]
checks:
  - id: forgiveness-works
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-the-four-calls
    type: stdout
    entry: main.py
    match: exact
    value: "42\nNone\n2\n0\n"
  - id: asks-forgiveness
    type: ai-judge
    rubric: "Both functions are EAFP: the try block attempts the real operation (int(text); stock[item]) and the except names the specific exception — ValueError in parse_age, KeyError in lookup — returning None and 0 respectively. No pre-checks like text.isdigit() or if item in stock, no bare except, and lookup uses try/except rather than .get (this lesson practices the general pattern). The printed values all come from calling the functions."
hints:
  - "EAFP shape: try: return int(text) — then except ValueError: return None. The attempt IS the check."
  - "lookup is the same shape with different names: try stock[item], except KeyError return 0."
  - "Catch the SPECIFIC exception. A bare except would also swallow typos like sotck[item] — bugs you want to see, not silence."
---
## Easier to ask forgiveness

Here's how many languages approach a risky operation — check first,
then act:

```python
if text.isdigit():
    age = int(text)
else:
    age = None
```

Python folk call that **LBYL** — *look before you leap* — and the
community mostly avoids it, for a practical reason: the check is a
*second implementation* of the rule, and it drifts out of sync.
`isdigit()` isn't actually int's rule — `int(" 42 ")` and `int("-7")`
both work fine, and `isdigit` rejects both. Your guard just made the
function wrong.

The Pythonic stance is **EAFP** — *easier to ask forgiveness than
permission*. Attempt the real operation; if it objects, catch the
specific exception you expected:

```python
def parse_age(text):
    try:
        return int(text)
    except ValueError:
        return None
```

One source of truth: `int` itself decides what's valid, and there is no
gap for a mismatched pre-check to hide in. Everything you learned in
your exceptions unit applies — catch the *narrow* exception, never a
bare `except:` that would also swallow real bugs like a typo'd variable
name.

The same shape handles missing dict keys — try `stock[item]`, catch
`KeyError`, return a fallback. (For that one common case dicts ship a
shortcut, `.get(item, 0)` — use it in real code, but write the
try/except form today; it's the pattern that works for *everything*,
not just dicts.)

EAFP is the mindset behind this whole unit, and the machinery has been
under your nose all along: `for` runs on catching `StopIteration` —
iteration itself asks forgiveness. Idiomatic Python assumes things
usually work, and handles the exception when they don't.

### Your goal

1. `parse_age(text)` — `try` to return `int(text)`; on `ValueError`
   return `None`.
2. `lookup(stock, item)` — `try` to return `stock[item]`; on `KeyError`
   return `0`.
3. Print `parse_age("42")`, `parse_age("forty-two")`,
   `lookup(pantry, "flour")`, `lookup(pantry, "saffron")`:

```
42
None
2
0
```
