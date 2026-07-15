---
id: 04-numbers-and-math
title: Numbers and Math
language: python
runner: browser
estMinutes: 12
files:
  - path: main.py
    starter: starter/main.py
goal: "Split 17 cookies among 5 kids: compute `each` with //, `left` with %, and `exact` with /, then print all three."
docs: [python/numbers-and-math]
checks:
  - id: division-variables
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-results
    type: stdout
    entry: main.py
    match: exact
    value: "3\n2\n3.4\n"
hints:
  - "Python has three kinds of division: / (exact), // (whole number), % (remainder)."
  - "each = cookies // kids gives whole cookies per kid; % gives what's left over."
  - "exact = cookies / kids — the / always produces a float, like 3.4."
---
## Two kinds of numbers

Python has whole numbers (**ints**, like `17`) and decimal numbers
(**floats**, like `3.4`). The everyday operators work as you'd expect:

```python
print(2 + 3)    # 5
print(10 - 4)   # 6
print(7 * 6)    # 42  (* means multiply)
```

Division is where it gets interesting — Python gives you **three** flavors:

```python
print(9 / 2)    # 4.5  exact division — always a float
print(9 // 2)   # 4    floor division — whole part only
print(9 % 2)    # 1    modulo — the remainder
```

`//` and `%` are a team. Sharing 9 candies between 2 people?
Each gets `9 // 2` (4 candies), and `9 % 2` (1 candy) is left on the table.
You'll use `%` constantly later — it's how programs ask "is this number even?"
or "does this repeat every 3rd time?"

### Your goal

You have **17 cookies** and **5 kids**. The starter code sets those variables.
Using them (not raw numbers), compute:

1. `each` — whole cookies per kid, using `//`
2. `left` — cookies left over, using `%`
3. `exact` — the exact share per kid, using `/`

Then print all three, one per line. Your output should be:

```
3
2
3.4
```
