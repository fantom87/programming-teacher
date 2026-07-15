---
id: 10-mini-project-pattern-machine
title: "Mini-Project: Pattern Machine"
language: python
runner: browser
estMinutes: 20
files:
  - path: main.py
    starter: starter/main.py
goal: "With size = 6, use one loop and an if/else to print a growing 6-row pattern where odd rows are * and even rows are o."
docs: [python/loops, python/conditionals, python/strings]
checks:
  - id: prints-pattern
    type: stdout
    entry: main.py
    match: exact
    value: "*\noo\n***\noooo\n*****\noooooo\n"
  - id: uses-loop-not-hardcoded
    type: ai-judge
    rubric: "The pattern is produced by a for or while loop driven by the size variable (e.g. range(1, size + 1)), with an if/else on the row number choosing between * and o, and string repetition building each row. It must NOT be a series of hardcoded print calls with literal strings like print(\"*\") / print(\"oo\") — changing size should change the pattern."
hints:
  - "One useful trick: \"*\" * 3 repeats a string, giving \"***\". Each row is a character times the row number."
  - "Loop with for row in range(1, size + 1): — inside, decide the character with if row % 2 == 0 (even) else odd."
  - "Inside the loop: if row % 2 == 0: print(\"o\" * row) else: print(\"*\" * row)"
---
## Your first mini-project

Time to combine everything from this unit — a variable, a loop, a
decision, and strings — into one small machine.

First, a trick you haven't met: `*` on a **string** means *repeat*.

```python
print("ha" * 3)    # hahaha
print("*" * 5)     # *****
```

So a row of any width is one multiplication: `"*" * row`.

### The machine

You're building a pattern printer. The starter sets `size = 6`, and your
program prints `size` rows. Row 1 is 1 character wide, row 2 is 2 wide,
and so on — a staircase. The twist: **odd rows use `*`, even rows use `o`**.

```
*
oo
***
oooo
*****
oooooo
```

The whole point of a machine is that it's *general*: change `size` to 10
and it should print 10 rows without you touching anything else. That means
no hardcoded lines — the loop and the `size` variable do all the work.
(An AI reviewer will check for exactly that.)

Remember your tools:

- `range(1, size + 1)` counts 1 up to and including `size`
- `row % 2 == 0` is `True` exactly when `row` is even
- `if` / `else` picks the character; string `*` builds the row

Sketch it in plain English first if it helps: "for each row number from 1
to size: if the row is even, print that many o's; otherwise, that many stars."

### Your goal

With `size = 6` left as given, print the 6-row pattern above using one
loop and an `if`/`else` — no hardcoded rows.
