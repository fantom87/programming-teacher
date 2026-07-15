---
id: 09-loops-that-wait
title: Loops That Wait
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Use a while True loop with break to keep doubling number (counting steps) until it passes 100, then print number and steps."
docs: [python/loops, concepts/debugging-mindset]
checks:
  - id: doubling-variables
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-results
    type: stdout
    entry: main.py
    match: exact
    value: "128\n7\n"
hints:
  - "Inside the loop: double the number, add 1 to steps — then check whether it's time to stop."
  - "break jumps out of the loop instantly. Put it inside an if: if number > 100: break"
  - "while True: / number = number * 2 / steps = steps + 1 / if number > 100: break — then print both after the loop."
---
## Loops that don't know when to stop

A `for` loop counts a known number of trips. But some questions don't come
with a trip count: "keep doubling until you pass 100" — how many doublings
is that? You don't know yet. That's the moment for **`while`**:

```python
fuel = 5
while fuel > 0:
    print(fuel)
    fuel = fuel - 1
```

`while` re-checks its condition before every trip and keeps going as long
as it's `True`. One warning: if the condition never becomes `False`, the
loop runs forever. Something inside the loop must change, or you've built
an infinite loop (every programmer builds one eventually — today, on
purpose, you almost will).

### The emergency exit

`while True:` is a loop that would run forever — its condition is always
`True`. You pair it with **`break`**, which jumps out of the loop the
instant it runs:

```python
while True:
    print("checking...")
    if done:
        break          # out immediately — the loop is over
```

This "loop forever, break when ready" pattern is everywhere in real
software: game loops, servers waiting for requests, retry logic.

### Your goal

The starter sets `number = 1` and `steps = 0`. Using `while True:` and
`break`:

1. Each trip: double `number`, and add 1 to `steps`.
2. When `number` goes **over 100**, `break`.
3. After the loop, print `number`, then `steps`.

```
128
7
```

Seven doublings — 1 becomes 128 fast. That's exponential growth.
