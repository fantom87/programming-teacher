---
id: 02-indexing-and-slicing
title: Indexing and Slicing
language: python
runner: browser
estMinutes: 12
files:
  - path: main.py
    starter: starter/main.py
goal: "Use indexing ([0] and [-1]) and a slice to pull the winner, last place, and podium out of the finishers list, then print them."
docs: [python/lists, python/strings]
checks:
  - id: index-and-slice-variables
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-race-report
    type: stdout
    entry: main.py
    match: exact
    value: "Winner: Mira\nLast place: Ken\nPodium:\nMira\nJosh\nPriya\n"
hints:
  - "Positions start at 0: finishers[0] is the first name. Negative counts from the end: finishers[-1] is the last."
  - "A slice copies a range: finishers[0:3] (or just finishers[:3]) is the first three — it stops BEFORE index 3, like range."
  - "winner = finishers[0], last = finishers[-1], podium = finishers[:3] — print the first two with f-strings, then loop over podium."
---
## Grabbing one thing — or a few

A list keeps its items in order, and every item has a numbered position
— its **index**. The catch every programmer memorizes on day one:
**counting starts at 0**.

```python
finishers = ["Mira", "Josh", "Priya", "Tomas", "Ken"]
print(finishers[0])    # Mira  — the FIRST item
print(finishers[2])    # Priya — the third
```

Negative numbers count from the far end — `finishers[-1]` is the last
item, `finishers[-2]` the one before it — no need to know how long the
list is.

### Slicing: a copy of a stretch

Square brackets with a colon take a **slice** — a new list copied from
a range of positions:

```python
finishers[0:3]   # ["Mira", "Josh", "Priya"]
finishers[:3]    # same — a missing start means "from the beginning"
```

The stop number is where the slice **stops, not the last item
included** — the same rule as `range(0, 3)`. Index 3 never makes the
cut. It feels odd for a day, then the symmetry pays off: `[:3]` means
"the first three", exactly.

Strings play the same game, because a string is a sequence of
characters:

```python
word = "python"
word[0]     # "p"
word[-1]    # "n"
word[:3]    # "pyt"
```

One index gives you a single item; one slice gives you a smaller copy.
Between them, you can reach anything a sequence holds.

### Your goal

The starter records the `finishers` of a race, in order. Using indexing
and one slice:

1. `winner` — the first finisher; print `Winner: Mira`
2. `last` — the last finisher, via a **negative** index; print
   `Last place: Ken`
3. `podium` — the first three, via a slice; print `Podium:` then loop
   over `podium` printing each name.

```
Winner: Mira
Last place: Ken
Podium:
Mira
Josh
Priya
```
