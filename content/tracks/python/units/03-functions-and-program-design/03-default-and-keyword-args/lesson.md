---
id: 03-default-and-keyword-args
title: Default and Keyword Arguments
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Write ticket(name, row=\"general\", price=25) returning the formatted ticket string, then print three tickets: all defaults, all positional, and one keyword call that skips row."
docs: [python/functions, python/strings]
checks:
  - id: ticket-works
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-three-tickets
    type: stdout
    entry: main.py
    match: exact
    value: "Ada | general | $25\nGrace | balcony | $40\nLinus | general | $60\n"
hints:
  - "Defaults live in the def line: def ticket(name, row=\"general\", price=25): — parameters with defaults come after ones without."
  - "The return is one f-string: return f\"{name} | {row} | ${price}\""
  - "To change price but keep row's default, name it at the call: ticket(\"Linus\", price=60)."
---
## Sensible defaults

Most tickets to your theatre are general seating at $25. Forcing every
call to spell that out is busywork — so give the parameters **default
values** right in the `def` line:

```python
def ticket(name, row="general", price=25):
    ...
```

Now callers supply what's different and inherit the rest:

```python
ticket("Ada")                      # row → "general", price → 25
ticket("Grace", "balcony", 40)     # all three, by position
```

One rule: parameters *with* defaults come after ones *without* —
`name` has no sensible default, so it stays first and stays required.

### Calling by name

Here's the awkward case: Linus wants a general seat, but at the $60
supporter price. By position you'd have to re-type `"general"` just to
reach the third slot. Instead, name the argument you mean:

```python
ticket("Linus", price=60)          # skips row entirely
```

These are **keyword arguments**, and they work on any parameter — even
ones without defaults — in any order:

```python
ticket(price=60, name="Linus")     # same ticket
```

Keywords earn their keep in two ways: they let you skip over defaults
you're happy with, and they make calls self-documenting.
`ticket("Ada", "balcony", 40)` forces the reader to remember the
parameter order; `ticket("Ada", row="balcony", price=40)` reads itself.

### Your goal

1. Define `ticket(name, row="general", price=25)` that **returns**
   `f"{name} | {row} | ${price}"`.
2. Print three tickets:
   - `ticket("Ada")` — pure defaults
   - `ticket("Grace", "balcony", 40)` — all positional
   - Linus: general row, price 60 — use a **keyword** so you don't
     re-type the row

   ```
   Ada | general | $25
   Grace | balcony | $40
   Linus | general | $60
   ```
