---
id: 05-tuples
title: Tuples
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Unpack the point tuple into x and y, then loop over the (name, score) pairs in high_scores — unpacking each — to print every score and the total."
docs: [python/tuples-and-sets, python/lists]
checks:
  - id: unpacked-values
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-scores
    type: stdout
    entry: main.py
    match: exact
    value: "x=3, y=7\nMira scored 12\nJosh scored 9\nPriya scored 15\nTotal: 36\n"
hints:
  - "Unpacking mirrors the shape: x, y = point puts 3 in x and 7 in y — two names, two slots."
  - "The loop can unpack too: for name, score in high_scores: hands you both halves of each pair, already split."
  - "Inside the loop: print(f\"{name} scored {score}\") then total = total + score. The Total line prints after the loop, un-indented."
---
## The list that can't change

A **tuple** is a list's locked sibling: ordered, indexable... and
frozen. Parentheses instead of square brackets:

```python
point = (3, 7)
point[0]        # 3 — indexing works exactly like a list
point[0] = 99   # TypeError! tuples refuse changes
```

No `append`, no swapping slots. Why would you *want* a container that
refuses to change? Because some values belong together as a **fixed
shape**: an x and a y. A name and a score. Width and height. The tuple
says: these travel as one unit, and nothing rearranges them by
accident.

### Unpacking

The signature move. Give a tuple as many names as it has slots, and
Python deals the values out:

```python
x, y = point
print(x)   # 3
print(y)   # 7
```

Two names, two slots — the left side mirrors the shape of the right.
No `point[0]` bookkeeping; each value lands in an honest name.

### Tuples inside lists

Real data loves this combination — a list of same-shaped records:

```python
high_scores = [("Mira", 12), ("Josh", 9)]
```

And the `for` loop unpacks each pair for you, right in the loop line:

```python
for name, score in high_scores:
    print(f"{name}: {score}")
```

Each trip grabs one tuple and splits it into `name` and `score`.
That's your first taste of **nested data** — collections inside
collections — which this unit's mini-project builds on.

### Your goal

The starter gives `point`, `high_scores`, and `total = 0`.

1. Unpack `point` into `x` and `y`; print `x=3, y=7`.
2. Loop over `high_scores`, unpacking each pair; print
   `<name> scored <score>` and add each score to `total`.
3. After the loop, print the total:

```
x=3, y=7
Mira scored 12
Josh scored 9
Priya scored 15
Total: 36
```
