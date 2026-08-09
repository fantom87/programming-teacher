---
id: 01-your-first-class
title: Your First Class
language: python
runner: browser
estMinutes: 12
files:
  - path: main.py
    starter: starter/main.py
goal: "Define a Book class whose __init__ stores title, author, and pages, create favorite = Book(\"Deep Work\", \"Cal Newport\", 304), and print its details in one f-string line."
docs: [python/classes]
checks:
  - id: book-class-works
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-details
    type: stdout
    entry: main.py
    match: exact
    value: "Deep Work by Cal Newport (304 pages)\n"
hints:
  - "The skeleton: class Book: with an indented def __init__(self, title, author, pages): inside it."
  - "Inside __init__, store each piece on self: self.title = title — one line per attribute."
  - "Build the line with an f-string: print(f\"{favorite.title} by {favorite.author} ({favorite.pages} pages)\")"
---
## Blueprints

So far, related data has traveled in loose variables: `book_title`,
`book_author`, `book_pages`. Three variables, one idea. Python lets you
declare that idea directly with a **class** — a blueprint for objects
that belong together.

```python
class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages
```

Reading it line by line:

- `class Book:` starts the blueprint. Class names are capitalized by
  convention.
- `__init__` is the *initializer* — Python runs it automatically every
  time a new Book is created.
- `self` is the object being built. `self.title = title` means "store
  the `title` I was given on **this particular book**."

The blueprint makes nothing by itself. You build objects — *instances* —
by calling the class like a function:

```python
favorite = Book("Deep Work", "Cal Newport", 304)
print(favorite.pages)    # 304
```

The arguments go straight to `__init__` (Python passes `self` for you),
and the dot reads any attribute back out. Each instance keeps its own
data — a second book has a life of its own:

```python
borrowed = Book("Dune", "Frank Herbert", 412)
```

Same blueprint, different data. That's the whole trick: one definition,
as many objects as you need.

### Your goal

1. Define the `Book` class — `__init__` takes `title`, `author`, and
   `pages` and stores all three on `self`.
2. Create `favorite = Book("Deep Work", "Cal Newport", 304)`.
3. Print one line built from the attributes:

```
Deep Work by Cal Newport (304 pages)
```
