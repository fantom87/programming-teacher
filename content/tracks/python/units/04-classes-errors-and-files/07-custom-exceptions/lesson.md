---
id: 07-custom-exceptions
title: Custom Exceptions
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Define EmptyDeckError(Exception), make draw(deck) raise it when the deck is empty (popping the top card otherwise), then draw the deck dry and catch the error."
docs: [python/errors-and-exceptions, python/classes]
checks:
  - id: custom-error-works
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-draws-and-stop
    type: stdout
    entry: main.py
    match: exact
    value: "king\nace\nStop: the deck is empty\n"
hints:
  - "The whole class is two lines: class EmptyDeckError(Exception): then an indented pass — inheriting from Exception is what makes it raisable."
  - "In draw: if len(deck) == 0: raise EmptyDeckError(\"the deck is empty\") — otherwise return deck.pop()."
  - "Draw twice with print(draw(deck)), then a third time inside try: ... except EmptyDeckError as error: print(f\"Stop: {error}\")."
---
## Errors with your name on them

`ValueError` is fine for "bad number", but real programs fail in ways
Python has never heard of: the deck is empty, the save file is corrupt,
the user's session expired. For those you make your own exception — and
it's almost embarrassingly easy, because exceptions are just **classes**
that inherit from `Exception`:

```python
class EmptyDeckError(Exception):
    pass
```

That's the whole thing. `pass` means "no extra body" — everything an
exception needs (carrying a message, working with `raise` and `except`)
is inherited from `Exception`, exactly the way `Manager` inherited from
`Employee`. The convention: name it after what went wrong, end it with
`Error`.

Why bother, when `ValueError` was right there? Because `except` catches
**by type**. With your own type, a caller can react to *your* failure
precisely, while everything else stays loud:

```python
try:
    card = draw(deck)
except EmptyDeckError:
    reshuffle()              # this one we know how to handle
```

A genuine bug — a typo, a `TypeError` — still crashes with a full
traceback instead of being quietly mistaken for an empty deck. Precise
error types are a gift to whoever calls your code. (Usually: future
you.)

Raising one looks exactly like raising the built-ins:

```python
raise EmptyDeckError("the deck is empty")
```

### Your goal

1. Define `EmptyDeckError`, inheriting from `Exception`, with a `pass`
   body.
2. Write `draw(deck)` — raise `EmptyDeckError("the deck is empty")` if
   the deck has no cards, otherwise return `deck.pop()`.
3. The starter deck holds `["ace", "king"]`. Draw and print twice, then
   draw a third time inside `try`/`except EmptyDeckError as error`,
   printing `Stop: {error}`:

```
king
ace
Stop: the deck is empty
```
