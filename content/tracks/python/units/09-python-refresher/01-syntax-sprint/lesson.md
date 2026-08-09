---
id: 01-syntax-sprint
title: Syntax Sprint
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Sprint through core syntax: classify(n) fizzbuzz-style with string returns, clip(text, width) by slicing, and row(name, price) with one f-string of alignment specs — byte-exact output."
docs: [python/syntax-cheatsheet, python/strings, python/conditionals]
checks:
  - id: sprint-functions
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: drill-output
    type: stdout
    entry: main.py
    match: exact
    value: "1 2 fizz 4 buzz fizz 7 8 fizz buzz 11 fizz 13 14 fizzbuzz\nrefac…\ncode\ncoffee  |   4.50\nkeyboard|  90.00\n"
  - id: idiomatic-syntax
    type: ai-judge
    rubric: "classify branches on n % 15 (or n % 3 and n % 5 combined) before the single-divisor cases and returns strings in every branch — str(n) for the fall-through, never a bare int. clip decides with len(text) <= width and builds the short form by slicing text[:width - 1] plus the ellipsis character — no character-by-character loops. row is a single f-string whose format specs do all the alignment ({name:<8} and {price:>7.2f} or equivalent) — no ljust/rjust, no manual space-padding arithmetic. The drill prints at the bottom of the file are intact and unedited."
hints:
  - "Order matters: n % 15 == 0 must win before % 3 or % 5 get a look — and the final branch is str(n), not n."
  - "Slicing is bounds-safe: text[:width - 1] + \"…\" — and the fits-already case is just len(text) <= width."
  - "One f-string does the whole row: f\"{name:<8}|{price:>7.2f}\" — < pads on the right, > pads on the left, .2f rounds to two decimals."
---
## Shake the rust off

You know Python; your fingers need reminding. This unit is six drills —
minimal chatter, demanding checks. First: the syntax you type a hundred
times a day.

Rapid recall:

```python
n % 15 == 0                  # divisibility — check 15 before 3 or 5
text[:5] + "…"               # slicing never raises, even past the end
f"{name:<8}|{price:>7.2f}"   # align left/right, fix the decimals
```

- **Conditionals** run top-down: order `if/elif` from most to least
  specific, and return early instead of nesting.
- **Slices** are forgiving: `"code"[:99]` is `"code"` — no bounds check
  needed before cutting.
- **f-string specs** do the formatting work: `<8` left-aligns in 8
  columns, `>7.2f` right-aligns a two-decimal float in 7.
- Functions that classify should return **strings all the way** —
  mixing `int` and `str` returns is how bugs sneak past `==`.

### Your goal

Three tiny functions, checked hard:

1. `classify(n)` — `"fizzbuzz"` / `"fizz"` / `"buzz"` for multiples of
   15 / 3 / 5, otherwise `str(n)`. Always a string.
2. `clip(text, width)` — `text` untouched if it fits in `width`
   characters; otherwise the first `width - 1` characters plus `"…"`.
3. `row(name, price)` — one f-string: name left-aligned in 8, a `|`,
   price right-aligned in 7 with two decimals.

The starter's drill prints must produce exactly:

```
1 2 fizz 4 buzz fizz 7 8 fizz buzz 11 fizz 13 14 fizzbuzz
refac…
code
coffee  |   4.50
keyboard|  90.00
```
