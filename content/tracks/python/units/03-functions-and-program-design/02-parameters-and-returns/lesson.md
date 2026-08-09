---
id: 02-parameters-and-returns
title: Parameters and Returns
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Write rect_area(width, height) that RETURNS width * height, then use it to compute and print the bedroom, kitchen, and total floor space."
docs: [python/functions]
checks:
  - id: rect-area-works
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-report
    type: stdout
    entry: main.py
    match: exact
    value: "Bedroom: 12\nKitchen: 10\nTotal: 22\n"
hints:
  - "Parameters go in the parentheses of the def: def rect_area(width, height): — they're variables that get filled in at call time."
  - "return width * height hands the answer back. Catch it in a variable: bedroom = rect_area(3, 4)."
  - "print shows a value on screen; return gives it to your code. You need return here so you can ADD the two areas afterwards."
---
## In one door, out the other

`welcome()` did the same thing every call. Real functions take **input**
and hand back **output** — like a little machine.

Input first. Names inside the parentheses of the `def` are
**parameters** — empty boxes that get filled at call time:

```python
def double(n):
    print(n * 2)

double(5)     # n becomes 5 → prints 10
double(21)    # n becomes 21 → prints 42
```

Each call fills `n` with whatever **argument** you passed. One recipe,
different ingredients.

Output is the `return` statement — and it is *not* the same as `print`:

```python
def double(n):
    return n * 2

result = double(5)    # result now holds 10
```

`print` shows a value to a *human* and then it's gone. `return` hands the
value back to your *code*, where you can store it, add it, compare it,
pass it to another function. A function with no `return` gives back
`None` — the classic beginner trap is printing inside a function and then
wondering why `result` is empty.

Rule of thumb: **functions should return their answer** and let the
caller decide what to print.

### Your goal

You're measuring a flat. Every room is a rectangle, so write the machine
once:

1. Define `rect_area(width, height)` that **returns** `width * height`.
2. Use it — no by-hand math:
   - `bedroom = rect_area(3, 4)`
   - `kitchen = rect_area(5, 2)`
3. Print the report, computing the total from your two variables:

   ```
   Bedroom: 12
   Kitchen: 10
   Total: 22
   ```

The tests call `rect_area` with sizes you haven't seen — returning, not
printing, is what makes that possible.
