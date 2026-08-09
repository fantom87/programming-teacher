---
id: 03-string-methods
title: String Methods
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Build clean with strip, loud with upper, swapped with replace, and words with split, then print the three strings and the word count."
docs: [python/strings, python/lists]
checks:
  - id: cleaned-strings
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-versions
    type: stdout
    entry: main.py
    match: exact
    value: "learn python every day\nLEARN PYTHON EVERY DAY\nlearn python every morning\n4 words\n"
hints:
  - "Methods hang off the value with a dot: raw.strip() hands back a NEW string with the outer spaces gone — raw itself never changes."
  - "Build each variable from the previous one: clean = raw.strip(), loud = clean.upper(), swapped = clean.replace(\"day\", \"morning\")."
  - "clean.split() with no arguments chops on spaces into a list — then print(f\"{len(words)} words\")."
---
## Strings come with tools attached

Every string in Python carries a toolbox of **methods** — you call one
with a dot:

```python
name = "grace hopper"
print(name.upper())    # GRACE HOPPER
print(name.title())    # Grace Hopper
```

The four you'll reach for constantly:

- `.strip()` — cut the whitespace off both ends (typed input is
  *always* messy)
- `.upper()` / `.lower()` — change the case
- `.replace(old, new)` — swap every occurrence of one piece for another
- `.split()` — chop the string into a **list** of words

The big rule hiding underneath: **strings never change**. Every method
hands you a *new* string and leaves the original untouched:

```python
raw = "  hello  "
clean = raw.strip()
print(clean)   # hello
print(raw)     # still "  hello  " — spaces and all!
```

So string methods almost always sit on the right side of an `=`,
catching the new string in a variable. Compare `append` from lesson 1,
which really does change its list — lists are changeable, strings
aren't. Knowing which is which saves you hours of confusion later.

`.split()` is the bridge back to everything this unit has taught: it
turns a sentence into a list, and lists you already know how to measure
and loop.

```python
words = "such easy wow".split()   # ["such", "easy", "wow"]
len(words)                        # 3
```

### Your goal

The starter gives you `raw`, wearing sloppy spaces. Build four
variables, each from the one before:

1. `clean` — `raw` stripped of the outer spaces
2. `loud` — `clean` in ALL CAPS
3. `swapped` — `clean` with `"day"` replaced by `"morning"`
4. `words` — `clean` split into a list

Print `clean`, `loud`, `swapped`, then the word count:

```
learn python every day
LEARN PYTHON EVERY DAY
learn python every morning
4 words
```
