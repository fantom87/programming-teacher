---
id: 05-iterators-and-generators
title: Iterators and Generators
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Step an iterator by hand with iter and next, then write countdown(n) — a generator that yields n down to 1 — loop over countdown(3), print Liftoff!, and print sum(countdown(100))."
docs: [python/loops, python/functions]
checks:
  - id: countdown-generates
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-the-launch
    type: stdout
    entry: main.py
    match: exact
    value: "a\nb\n3\n2\n1\nLiftoff!\n5050\n"
  - id: yields-not-lists
    type: ai-judge
    rubric: "countdown uses yield inside a loop (while n > 0 or equivalent) and never builds or returns a list. The first two lines come from calling next() twice on letters = iter(\"abc\") — not from printing \"a\" and \"b\" literally. The 5050 comes from sum(countdown(100)) consuming the generator directly (not sum(list(...)) and not a hardcoded 5050)."
hints:
  - "letters = iter(\"abc\") gives you the cursor; print(next(letters)) advances it one step and hands back the value."
  - "A generator is a def with yield: while n > 0: yield n, then n -= 1. Each yield pauses the function until someone asks again."
  - "Generators plug into anything that iterates: for number in countdown(3):, and sum(countdown(100)) — no list needed."
---
## The machine inside the for loop

Every `for` loop you've ever written runs on the same hidden machinery.
`for` asks the collection for an **iterator** — a cursor over the items
— then calls `next()` on it until the iterator says it's done. You can
drive that machinery yourself:

```python
letters = iter("abc")
next(letters)    # 'a'
next(letters)    # 'b'
```

Each `next` moves the cursor one step. The iterator remembers where it
is — and when it runs out, it raises `StopIteration`, which is the
signal `for` quietly catches to end the loop. That's the whole secret:
anything that can hand out an iterator works with `for`, `sum`, `list`,
`sorted`, comprehensions — the lot. Python calls such things *iterable*.

Which raises a lovely question: can you build your own? Yes — with the
easiest tool in the language, the **generator**. Put `yield` in a
function and it stops being a normal function:

```python
def countdown(n):
    while n > 0:
        yield n
        n -= 1
```

Calling `countdown(3)` runs *none* of this code. It returns a generator
— an iterator whose `next()` runs the body **up to the next `yield`**,
hands out that value, and freezes in place, local variables intact,
until asked again.

Why care, when a list would do? Because a generator makes values **one
at a time, on demand**. `countdown(1_000_000_000)` starts instantly and
never builds a billion-item list — `sum` can drink from it item by item
in constant memory. Lazy sequences like this are how Python handles
huge files and endless streams, and they're the engine behind tools
you'll meet next lesson.

### Your goal

1. Make `letters = iter("abc")` and print `next(letters)` twice.
2. Write the `countdown(n)` generator — `yield` from `n` down to 1.
3. Loop over `countdown(3)` printing each number, print `Liftoff!`,
   then print `sum(countdown(100))`:

```
a
b
3
2
1
Liftoff!
5050
```
