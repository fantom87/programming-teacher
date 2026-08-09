---
id: 03-unpacking
title: Unpacking
language: python
runner: browser
estMinutes: 12
files:
  - path: main.py
    starter: starter/main.py
goal: "Unpack a record tuple into name/year/city, swap gold and silver in one tuple-swap line, and star-unpack scores into first and rest — printing each result."
docs: [python/tuples-and-sets, python/variables-and-types]
checks:
  - id: names-hold-the-pieces
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-all-three
    type: stdout
    entry: main.py
    match: exact
    value: "Ada Lovelace (1815, London)\ngold: python, silver: perl\nfirst: 92, rest: [75, 88, 60]\n"
  - id: genuinely-unpacked
    type: ai-judge
    rubric: "The record is unpacked in one line (name, year, city = record) with no record[0]-style indexing anywhere; the swap is a single tuple swap (gold, silver = silver, gold) with no temporary variable; first and rest come from star-unpacking (first, *rest = scores), not scores[0] and scores[1:] slicing. The printed strings are built from those variables, not typed as literals."
hints:
  - "Match the shape on both sides: name, year, city = record — three names, three slots, one line."
  - "The swap is the famous one-liner: gold, silver = silver, gold. Python builds the right side first, THEN assigns."
  - "A star soaks up the leftovers: first, *rest = scores makes rest a list of everything after the first."
---
## Both sides of the equals sign

You've been unpacking without ceremony since your tuples lesson — but
Python lets the *left side* of `=` be a whole pattern, and that pattern
is one of the language's favorite idioms.

Give a tuple as many names as it has slots, and each slot lands in its
name:

```python
point = (3, 8)
x, y = point
```

No `point[0]`, no `point[1]` — the shape on the left mirrors the shape
on the right, and the names say what each piece *means*. This is why
Python functions often return tuples: the caller unpacks the result into
tidy variables in one line.

The same trick gives Python its famous **swap**:

```python
a, b = b, a
```

The right side is built first — a temporary tuple `(b, a)` — and then
unpacked onto the left. No `temp` variable, no shuffle dance. Other
languages need three lines for this; Python considers it a warm-up
stretch.

When the counts *don't* match, a **star** soaks up the extra:

```python
first, *rest = [92, 75, 88, 60]
# first -> 92        rest -> [75, 88, 60]
```

The starred name always collects a **list**, however many items remain
— even zero. It works in any position: `*most, last = scores` grabs the
end instead. One star per unpacking, and the plain names always win
first.

You'll meet unpacking again next lesson, where `for` loops unpack pairs
on every trip. First, get the three moves under your fingers.

### Your goal

Using the starter's data — and no indexing, slicing, or temp variables:

1. Unpack `record` into `name`, `year`, `city`; print
   `f"{name} ({year}, {city})"`.
2. Swap `gold` and `silver` in one line; print
   `f"gold: {gold}, silver: {silver}"`.
3. Star-unpack `scores` into `first` and `rest`; print
   `f"first: {first}, rest: {rest}"`.

```
Ada Lovelace (1815, London)
gold: python, silver: perl
first: 92, rest: [75, 88, 60]
```
