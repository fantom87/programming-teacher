---
id: 02-collections-and-comprehensions
title: Collections and Comprehensions
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Rebuild four data-shapers as comprehensions — lengths, initials (a set), flat (nested), and top(counts, n) with a tuple sort key — checked against edge cases."
docs: [python/comprehensions, python/dicts, python/lists]
checks:
  - id: shapers-hold-up
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: drill-output
    type: stdout
    entry: main.py
    match: exact
    value: "{'kestrel': 7, 'owl': 3, 'kite': 4, 'osprey': 6}\n['K', 'O']\n[1, 2, 3, 4, 5]\n[('kite', 5), ('kestrel', 3)]\n"
  - id: comprehensions-not-loops
    type: ai-judge
    rubric: "lengths, initials, and flat are each a single comprehension of the right bracket type — dict, set, and list respectively — with no for/append loops and no dict()/set() built by mutation. flat is one comprehension with two for clauses in outer-then-inner order. top calls sorted on counts.items() with a key returning a tuple like (-count, word) (or an equivalent stable two-pass sort) and slices [:n] — no manual selection loops, no popping items out of the dict. The drill prints at the bottom are intact."
hints:
  - "The bracket type decides what you build: {w: len(w) for w in words} is a dict, {expr for ...} a set, [expr for ...] a list."
  - "Nested comprehensions read like stacked for lines: [x for row in grid for x in row] — outer loop first."
  - "A tuple key gives two-level sorting: key=lambda kv: (-kv[1], kv[0]) — negative count for descending, word for the alphabetical tie-break — then slice [:n]."
---
## Data shaping, one line at a time

Comprehensions are Python's data-shaping syntax: a transform, an
iterable, an optional filter, wrapped in the brackets of whatever
you're building.

```python
{w: len(w) for w in words}              # dict
{name[0].upper() for name in names}     # set — duplicates vanish
[x for row in grid for x in row]        # nested: outer loop first
```

The other half of shaping is **sorting with a key**. `sorted` takes any
function; return a tuple and you get multi-level ordering for free —
descending numbers with an alphabetical tie-break is one key:

```python
sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))
```

Ground rules worth re-caching: dicts keep insertion order; sets promise
none; `sorted` is stable and always returns a new list; and a
comprehension should stay one honest transform — if it wants three
clauses and two conditions, you wanted a loop.

### Your goal

Four shapers, comprehensions mandatory:

1. `lengths(words)` — dict of word → length.
2. `initials(names)` — **set** of uppercased first letters.
3. `flat(grid)` — flatten a list of lists with one nested
   comprehension.
4. `top(counts, n)` — the `n` (word, count) pairs with the biggest
   counts, ties broken alphabetically: `sorted` + tuple key + slice.

The starter's drill prints exactly:

```
{'kestrel': 7, 'owl': 3, 'kite': 4, 'osprey': 6}
['K', 'O']
[1, 2, 3, 4, 5]
[('kite', 5), ('kestrel', 3)]
```
