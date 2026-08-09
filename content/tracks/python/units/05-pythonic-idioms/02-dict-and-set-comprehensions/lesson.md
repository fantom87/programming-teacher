---
id: 02-dict-and-set-comprehensions
title: Dict and Set Comprehensions
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Write word_lengths(words) as a dict comprehension and unique_initials(names) as a set comprehension, then print the dict and the sorted initials."
docs: [python/comprehensions, python/dicts, python/tuples-and-sets]
checks:
  - id: both-shapes-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-dict-and-initials
    type: stdout
    entry: main.py
    match: exact
    value: "{'idiom': 5, 'generator': 9, 'zip': 3}\n['a', 'g', 'l']\n"
  - id: curly-comprehensions
    type: ai-judge
    rubric: "word_lengths returns a single dict comprehension {w: len(w) for ...} and unique_initials returns a single set comprehension over each name's first letter — no loops with [] = or .add, no dict()/set() built by hand, no hardcoded results. sorted() appears only at the print, never inside unique_initials, which must return a set."
hints:
  - "A dict comprehension pairs a key WITH a value: {w: len(w) for w in words} — the colon is what makes it a dict."
  - "Braces without a colon build a set: {name[0] for name in names}. Duplicates vanish on their own."
  - "Sets have no order, so print sorted(unique_initials(crew)) — sorted() turns any collection into an ordered list."
---
## Curly-brace comprehensions

The comprehension shape you learned last lesson isn't just for lists.
Swap the square brackets for curly braces and you can pour data straight
into the other two collection types you know.

Give each item a **key and a value**, and you get a **dict
comprehension**:

```python
menu = {dish: len(dish) for dish in dishes}
# {'pad thai': 8, 'pho': 3, ...}
```

Same back-to-front reading — *for each `dish`, map `dish` to
`len(dish)`* — and it replaces the familiar three-line
empty-dict-then-assign loop in one stroke. Building a lookup table from
a list is everyday work, and this is the everyday tool for it.

Drop the colon and the braces build a **set comprehension**:

```python
suffixes = {f.split(".")[-1] for f in filenames}
```

A set keeps one copy of each value, so duplicates vanish without any
effort on your part — perfect for "what *distinct* things are in here?"
questions.

One catch you already know from your sets lesson: sets have **no
order**. Print one directly and Python may show its elements in any
arrangement, which makes for a flaky program. The idiom for displaying a
set is `sorted(the_set)` — it returns an ordered *list* of the elements,
stable every run. Do the sorting at the print, though: a function called
`unique_initials` should honestly return a set and let the caller decide
how to show it.

### Your goal

1. `word_lengths(words)` — a dict comprehension mapping each word to its
   length.
2. `unique_initials(names)` — a set comprehension of each name's first
   letter (`name[0]`).
3. Print `word_lengths(tools)`, then `sorted(unique_initials(crew))`:

```
{'idiom': 5, 'generator': 9, 'zip': 3}
['a', 'g', 'l']
```
