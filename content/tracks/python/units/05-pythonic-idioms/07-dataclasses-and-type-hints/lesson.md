---
id: 07-dataclasses-and-type-hints
title: Dataclasses and Type Hints
language: python
runner: browser
estMinutes: 20
files:
  - path: main.py
    starter: starter/main.py
goal: "Declare a Book dataclass with four annotated fields (finished defaults to False) and a describe() -> str method, then show off the free __repr__ and __eq__ by printing a book and comparing two equal ones."
docs: [python/classes, python/variables-and-types]
checks:
  - id: book-behaves
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-the-showcase
    type: stdout
    entry: main.py
    match: exact
    value: "Fluent Python by Luciano Ramalho, 792 pages\nBook(title='Fluent Python', author='Luciano Ramalho', pages=792, finished=False)\nTrue\n"
  - id: declared-not-hand-rolled
    type: ai-judge
    rubric: "Book is decorated with @dataclass and declares exactly four annotated fields — title: str, author: str, pages: int, finished: bool = False — with NO hand-written __init__, __repr__, or __eq__. describe is a regular method with a -> str return hint building its string from self's fields. The second output line comes from print(favorite) relying on the generated __repr__, and the True line from an actual == comparison of two freshly built equal Books — neither is a hardcoded string."
hints:
  - "The decorator does the lifting: @dataclass above class Book:, then each field is just name: type on its own line."
  - "A default makes a field optional: finished: bool = False — callers can skip it, exactly like a default parameter."
  - "describe is an ordinary method: def describe(self) -> str: return f\"{self.title} by {self.author}, {self.pages} pages\""
---
## Classes that write themselves

Think back to your `__init__` days: for a class holding four fields you
typed each name *three times* — parameter, `self.x = x`, and again in
`__repr__` if you wanted readable printing. Then `__eq__` if you wanted
`==` to compare values instead of identities. All boilerplate, all
places for typos to hide.

First, meet the labels that make the fix possible. A **type hint**
annotates a name with the type you intend:

```python
def describe(self) -> str: ...
pages: int
```

Hints don't change how the code *runs* — Python won't stop you putting
a string in `pages` — but they document intent, power your editor's
autocomplete, and later in this track a checker called `mypy` will read
them and catch type bugs before you run anything. Modern Python code is
hinted by default; start reading and writing them now.

And hints unlock the star of this lesson. The **dataclass** decorator
reads your annotated fields and writes the boilerplate for you:

```python
from dataclasses import dataclass

@dataclass
class Book:
    title: str
    author: str
    pages: int
    finished: bool = False
```

That's the *whole class* — and it comes with `__init__` (in field
order), a readable `__repr__` like `Book(title='Dune', ...)`, and an
`__eq__` that compares field values. The `= False` gives `finished` a
default, exactly like a default parameter. Ordinary methods still work;
just add `def` lines under the fields.

When data is the point of a class — a record, a config, an API result —
reach for a dataclass first and hand-roll dunders only when you need
something custom.

### Your goal

1. Declare the `Book` dataclass above: four annotated fields, `finished`
   defaulting to `False`.
2. Add `describe(self) -> str` returning
   `"TITLE by AUTHOR, PAGES pages"`.
3. Make `favorite = Book("Fluent Python", "Luciano Ramalho", 792)`,
   print `favorite.describe()`, print `favorite` itself, then print the
   result of comparing two identical
   `Book("Dune", "Frank Herbert", 412)` objects with `==`:

```
Fluent Python by Luciano Ramalho, 792 pages
Book(title='Fluent Python', author='Luciano Ramalho', pages=792, finished=False)
True
```
