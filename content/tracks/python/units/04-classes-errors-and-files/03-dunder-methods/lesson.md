---
id: 03-dunder-methods
title: Dunder Methods
language: python
runner: browser
estMinutes: 14
files:
  - path: main.py
    starter: starter/main.py
goal: "Add __str__ (returning \"title by artist\") and __eq__ (same title AND artist) to the Song class, then print a song and two comparisons."
docs: [python/classes, python/strings]
checks:
  - id: dunders-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-song-and-comparisons
    type: stdout
    entry: main.py
    match: exact
    value: "Holocene by Bon Iver\nTrue\nFalse\n"
hints:
  - "Both dunders are ordinary methods with special names: def __str__(self): and def __eq__(self, other):"
  - "__str__ returns a string built from self.title and self.artist — no print inside."
  - "__eq__ compares both fields: return self.title == other.title and self.artist == other.artist"
---
## The methods Python calls for you

Print a Song object right now and you get gibberish:

```
<__main__.Song object at 0x7f3c...>
```

Python doesn't know what a Song should *look like* — unless you tell it.
That's what **dunder methods** are for (double-underscore, like
`__init__`): methods with special names that Python calls automatically
at the right moment. You never write `song.__str__()` yourself; you
write `print(song)` and Python looks for `__str__`:

```python
    def __str__(self):
        return f"{self.title} by {self.artist}"
```

Now `print(song)` shows `Holocene by Bon Iver`. Same idea with `==`. Out
of the box, Python compares **identity** — two Song objects built from
identical data still count as different, because they're two separate
objects in memory. Define `__eq__` and you decide what equality *means*:

```python
    def __eq__(self, other):
        return self.title == other.title and self.artist == other.artist
```

`other` is whatever sits on the right of the `==`. Return `True` when
the data matches, and suddenly `a == b` compares songs the way a human
would.

There's a whole family of these hooks: `__len__` makes `len(x)` work,
`__add__` gives meaning to `+`, and you've been using `__init__` since
the first lesson. Dunders are how your classes plug into the language
itself.

### Your goal

The starter has a `Song` class and three songs: `a` and `b` are the same
recording, `c` is a different one.

1. Add `__str__` — return `title by artist`.
2. Add `__eq__` — `True` only when title **and** artist both match.
3. Print `a`, then `a == b`, then `a == c`:

```
Holocene by Bon Iver
True
False
```
