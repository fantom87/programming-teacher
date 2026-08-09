---
id: 04-enumerate-and-zip
title: Enumerate and Zip
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Loop with enumerate(podium, start=1) to print a numbered podium, unpack zip(names, langs) to print who wrote what, then build by_name with dict(zip(...)) and print it."
docs: [python/loops, python/dicts]
checks:
  - id: by-name-is-built
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-the-three-sections
    type: stdout
    entry: main.py
    match: exact
    value: "1. gold\n2. silver\n3. bronze\nGuido wrote Python\nDennis wrote C\nGrace wrote COBOL\n{'Guido': 'Python', 'Dennis': 'C', 'Grace': 'COBOL'}\n"
  - id: no-index-bookkeeping
    type: ai-judge
    rubric: "The podium numbering comes from enumerate(podium, start=1) unpacked into two loop variables — no manual counter, no range(len(podium)), no place + 1 arithmetic. The pairing loop unpacks zip(names, langs) directly. by_name is built with dict(zip(names, langs)) — not a hand-typed dict literal and not a loop of key assignments. Nothing printed is hardcoded output."
hints:
  - "enumerate hands you PAIRS, so unpack them in the for line: for place, medal in enumerate(podium, start=1):"
  - "zip walks two lists in lockstep: for name, lang in zip(names, langs): print(f\"{name} wrote {lang}\")"
  - "zip produces (key, value) pairs — exactly what dict() eats: by_name = dict(zip(names, langs))."
---
## Loops without bookkeeping

Somewhere in your past lives this loop:

```python
i = 0
for medal in podium:
    print(f"{i + 1}. {medal}")
    i += 1
```

It works, but the counter is bookkeeping — a second moving part to keep
honest. Python's answer is **`enumerate`**, which hands you the position
*and* the item together, as a pair your `for` line unpacks on the spot
(yesterday's idiom, already paying rent):

```python
for place, medal in enumerate(podium, start=1):
    print(f"{place}. {medal}")
```

`start=1` makes the count human-friendly; leave it off and counting
starts at 0. Any time you catch yourself typing `range(len(...))`,
`enumerate` is almost certainly the tool you wanted.

The second tool answers a different question: two lists whose items
belong together, position by position. **`zip`** walks them in lockstep,
yielding a pair per step:

```python
for name, lang in zip(names, langs):
    print(f"{name} wrote {lang}")
```

No shared index, no `names[i]` reaching — the pairing is the whole
point. If the lists have different lengths, `zip` quietly stops at the
shorter one, so make sure your lists really do line up.

And here's the closer: `zip` produces key–value pairs, and `dict()` will
happily swallow a stream of those whole —

```python
by_name = dict(zip(names, langs))
```

— two parallel lists become one lookup table in a single line. That trio
of moves (`enumerate` for positions, `zip` for pairing, `dict(zip(...))`
for tables) is bread-and-butter Python; you'll use one of them nearly
every day.

### Your goal

1. Print the podium numbered from 1 using `enumerate(podium, start=1)`.
2. Print `NAME wrote LANG` for each pair from `zip(names, langs)`.
3. Build `by_name = dict(zip(names, langs))` and print it:

```
1. gold
2. silver
3. bronze
Guido wrote Python
Dennis wrote C
Grace wrote COBOL
{'Guido': 'Python', 'Dennis': 'C', 'Grace': 'COBOL'}
```
