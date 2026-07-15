---
id: 08-loops-that-count
title: Loops That Count
language: python
runner: browser
estMinutes: 12
files:
  - path: main.py
    starter: starter/main.py
goal: "Use a for loop with range to print the numbers 1 through 5, one per line, then print Go! once after the loop."
docs: [python/loops, concepts/thinking-in-steps]
checks:
  - id: prints-count-and-go
    type: stdout
    entry: main.py
    match: exact
    value: "1\n2\n3\n4\n5\nGo!\n"
hints:
  - "range(1, 6) counts 1, 2, 3, 4, 5 — the end number is where it STOPS, not the last value."
  - "for number in range(1, 6): then print(number) indented underneath."
  - "The print(\"Go!\") must NOT be indented — un-indented lines run after the loop finishes."
---
## Repeat without repeating yourself

You could print 1 through 5 with five `print` lines. But what about 1
through 500? Loops are how programs repeat work, and the `for` loop is
Python's counting machine:

```python
for number in range(3):
    print(number)
```

This prints `0`, `1`, `2`. Each trip around the loop, the variable
`number` holds the next value, and the indented block runs again.

Two surprises to absorb now:

- `range(3)` starts at **0**, not 1
- it stops **before** 3 — you get 3 values, but never 3 itself

Want to start somewhere else? Give `range` two numbers:

```python
for number in range(1, 4):
    print(number)      # 1, 2, 3 — stops before 4
```

### In or out of the loop?

Indentation decides what repeats. Compare:

```python
for number in range(1, 4):
    print(number)
    print("again!")    # indented: runs EVERY trip
print("done")          # not indented: runs ONCE, after the loop
```

That one level of indentation is the difference between "say this every
time" and "say this when finished." It's the same rule as `if` — the
indented block belongs to the line above.

### Your goal

Using a single `for` loop with `range`:

1. Print the numbers **1 through 5**, one per line.
2. After the loop ends, print `Go!` once.

```
1
2
3
4
5
Go!
```
