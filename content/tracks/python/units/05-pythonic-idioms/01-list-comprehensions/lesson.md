---
id: 01-list-comprehensions
title: List Comprehensions
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Write to_fahrenheit(temps) and long_words(words, n) as one-line list comprehensions — one transforms, one filters — then print both results for the starter data."
docs: [python/comprehensions, python/lists]
checks:
  - id: comprehensions-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-both-lists
    type: stdout
    entry: main.py
    match: exact
    value: "[32.0, 50.0, 71.6, 87.8, 62.6]\n['comprehension', 'pythonic']\n"
  - id: really-comprehensions
    type: ai-judge
    rubric: "Both functions return a single list comprehension: to_fahrenheit maps t * 9 / 5 + 32 over its parameter, and long_words uses an if clause to keep words longer than n. Neither builds its list with a for loop plus append, and no result list is hardcoded."
hints:
  - "The shape is [expression for item in items] — read it back to front: for each item, produce expression."
  - "to_fahrenheit: return [t * 9 / 5 + 32 for t in temps] — the math runs once per temperature."
  - "Filtering adds an if at the end: [w for w in words if len(w) > n]. No else — the if only decides what gets in."
---
## From loop to comprehension

You've written this dance dozens of times by now:

```python
fahrenheit = []
for t in temps_c:
    fahrenheit.append(t * 9 / 5 + 32)
```

Three lines that say one thing: *build a new list by transforming each
item.* Python has a dedicated shape for exactly that job — the **list
comprehension**:

```python
fahrenheit = [t * 9 / 5 + 32 for t in temps_c]
```

Read it back to front: *for each `t` in `temps_c`, produce
`t * 9 / 5 + 32`.* The whole list arrives at once — no empty list, no
`append`, nothing to initialize. This is probably the single most-used
idiom in Python; from here on you'll spot it in every codebase you read.

Want to *select* instead of transform? Add an `if` at the end:

```python
failing = [s for s in scores if s < 50]
```

Only items that pass the test get in. And the two moves combine —
transform on the left, filter on the right:

```python
loud = [w.upper() for w in words if len(w) > 6]
```

One taste rule keeps comprehensions readable: if it doesn't fit on a
line you can read aloud, it wants to be a regular loop. Comprehensions
replace *simple* loops, not all loops.

One more habit: a comprehension always builds a **new** list. The input
stays untouched — which is exactly what a well-behaved function should
do to its arguments.

### Your goal

1. `to_fahrenheit(temps)` — return a new list with every Celsius value
   converted via `t * 9 / 5 + 32`, as a one-line comprehension.
2. `long_words(words, n)` — return only the words longer than `n`
   letters, also one line.
3. Print `to_fahrenheit(temps_c)`, then `long_words(words, 6)`:

```
[32.0, 50.0, 71.6, 87.8, 62.6]
['comprehension', 'pythonic']
```
