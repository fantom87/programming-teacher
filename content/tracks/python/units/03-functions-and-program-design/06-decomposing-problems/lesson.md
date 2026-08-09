---
id: 06-decomposing-problems
title: Decomposing Problems
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Refactor the one-blob receipt program into three functions — subtotal(prices), with_tax(amount), and receipt(prices) — keeping the printed output byte-identical."
docs: [python/functions, python/loops]
checks:
  - id: pieces-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: same-output
    type: stdout
    entry: main.py
    match: exact
    value: "Subtotal: 14.75\nTotal due: 15.93\n"
  - id: genuinely-decomposed
    type: ai-judge
    rubric: "The program is decomposed into three functions: subtotal(prices) sums the list with a loop or sum() and returns the result; with_tax(amount) returns round(amount * 1.08, 2) (or equivalent); receipt(prices) calls the other two and does the printing. The top level is just the prices list plus a single receipt(prices) call. The printed numbers must come from those function calls — not be hardcoded literals in print statements, and not all be computed inline in one function that ignores the other two."
hints:
  - "Work piece by piece: write subtotal(prices) first (move the loop in, return total), and check the program still prints the same thing."
  - "with_tax(amount) is one line: return round(amount * 1.08, 2). It takes ANY amount — that's what makes it reusable."
  - "receipt(prices) is the coordinator: sub = subtotal(prices), then the two prints use sub and with_tax(sub). Top level becomes just receipt(prices)."
---
## Cut the problem, not corners

The starter program works. It's also a blob — math, tax policy, and
printing all tangled in one stream. At ten lines that's survivable. Real
programs are ten *thousand* lines, and blobs at that scale are where
projects go to die.

The core skill of program design is **decomposition**: cutting a problem
into pieces small enough that each piece is obviously right. The tool for
it is the function, and the knife is one question — *what are the
separate jobs here?* This receipt has three:

1. **Add up the prices** → `subtotal(prices)` — loop and return.
2. **Apply the 8% tax** → `with_tax(amount)` — one line of policy.
3. **Present the result** → `receipt(prices)` — calls the other two,
   does all the printing.

Then the top level of the program collapses to:

```python
prices = [4.50, 2.00, 8.25]
receipt(prices)
```

Read that aloud — it's the *plan*, in plain sight. Details live one level
down, each behind a name that says what it does.

What you're doing here has a name: **refactoring** — changing a
program's structure without changing its behavior. The output must stay
byte-identical; that's your safety rail. Refactor in steps and re-run
after each one: carve out `subtotal` first, confirm the output hasn't
moved, then `with_tax`, then `receipt`.

Was the blob "simpler"? It only *looked* it. Now the tax rule lives in
exactly one place, `subtotal` works for any list, and the tests can grill
each piece on inputs the blob never met.

### Your goal

Same output, new bones:

1. `subtotal(prices)` — returns the sum of the list.
2. `with_tax(amount)` — returns `round(amount * 1.08, 2)`.
3. `receipt(prices)` — calls both, prints both lines.
4. Top level: the `prices` list and one `receipt(prices)` call.

An AI reviewer checks it's a real decomposition — no hardcoded numbers.
