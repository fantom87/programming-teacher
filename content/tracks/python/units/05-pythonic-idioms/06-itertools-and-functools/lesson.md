---
id: 06-itertools-and-functools
title: Itertools and Functools
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Use chain to number a two-list schedule, combinations inside pair_menu(toppings) to list every 2-topping pizza, and functools.reduce inside product(numbers) to multiply a list down to one value."
docs: [python/stdlib-tour, python/functions, python/comprehensions]
checks:
  - id: menu-and-product-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-schedule-menu-product
    type: stdout
    entry: main.py
    match: exact
    value: "1. review PRs\n2. standup\n3. deep work\n4. code review\npesto + olive\npesto + feta\nolive + feta\n24\n"
  - id: batteries-actually-used
    type: ai-judge
    rubric: "The schedule loop iterates enumerate(chain(morning, afternoon), start=1) — chain does the joining, not morning + afternoon list concatenation. pair_menu builds its list from combinations(toppings, 2), unpacking each pair — no nested index loops. product uses functools.reduce with 1 as the initializer (a lambda or operator.mul both count) — no for loop, and 24 is never hardcoded."
hints:
  - "chain(morning, afternoon) yields one list's items then the other's — feed it straight into enumerate(..., start=1)."
  - "combinations(toppings, 2) yields PAIRS, so unpack: [f\"{a} + {b}\" for a, b in combinations(toppings, 2)]."
  - "reduce folds a list to one value: reduce(lambda total, n: total * n, numbers, 1) — the 1 is the starting total, and why product([]) is 1."
---
## Batteries for iteration

Last lesson you built lazy streams by hand. The standard library ships
two modules full of machines that work on them — `itertools` for
slicing and dicing iterables, `functools` for working on functions.
Today: one tool from each, plus one for the road.

**`chain`** glues iterables end to end — lazily, without building a
combined list:

```python
from itertools import chain

for task in chain(morning, afternoon):
    ...
```

It streams the first list, then the second. And because `enumerate`
accepts *any* iterable, `enumerate(chain(...), start=1)` numbers the
whole day in one line — last lesson's tools snapping together.

**`combinations`** answers "every way to pick k of these" — a question
that's a headache with nested loops and a one-liner here:

```python
from itertools import combinations

combinations(["a", "b", "c"], 2)   # ('a','b'), ('a','c'), ('b','c')
```

Each result is a tuple, begging for the unpacking you know:
`for a, b in combinations(...)`.

From `functools`: **`reduce`**, which folds a whole sequence into one
value by applying a two-argument function again and again — running
total in, next item in, new total out:

```python
from functools import reduce

total = reduce(lambda total, n: total * n, [2, 3, 4], 1)   # 24
```

That `lambda` is just a nameless one-line function — `lambda total, n:
total * n` reads "given total and n, produce total * n". The trailing
`1` is the starting total; always pass it, so an empty list folds to a
sane answer instead of crashing. (Prefer names? `from operator import
mul` does the same job.)

These modules go deep — `cycle`, `islice`, `groupby`, `cache` — and the
docs tour is worth a wander. Today's three earn their keep daily.

### Your goal

1. Number the whole day with `enumerate(chain(morning, afternoon),
   start=1)` — print `1. review PRs` style lines.
2. `pair_menu(toppings)` — return `["pesto + olive", ...]` for every
   2-topping combination, then print each entry.
3. `product(numbers)` — multiply the list down with `reduce` (start at
   1), then print `product([2, 3, 4])`:

```
1. review PRs
2. standup
3. deep work
4. code review
pesto + olive
pesto + feta
olive + feta
24
```
