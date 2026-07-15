---
id: 03-variables
title: Variables
language: python
runner: browser
estMinutes: 12
files:
  - path: main.py
    starter: starter/main.py
goal: "Create a variable `answer` holding 6 * 7, and a variable `greeting` holding the text Hello — then print both."
docs: [python/variables-and-types]
checks:
  - id: variables-correct
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-both
    type: stdout
    entry: main.py
    match: regex
    value: "42"
hints:
  - "A variable is made with =  : answer = 6 * 7"
  - "Text goes in quotes: greeting = \"Hello\""
  - "print(answer) prints what's inside the variable — no quotes around the name."
---
## Named boxes

Programs need to remember things. A **variable** is a named box holding a value:

```python
score = 10        # make a box called score, put 10 in it
print(score)      # prints: 10
```

The `=` sign doesn't mean "equals" like in math — it means **"put this value
in that box."** The name goes on the left, the value on the right.

Variables can hold computed results:

```python
total = 4 * 25    # total now holds 100
```

And text too:

```python
name = "Ada"
```

### Your goal

1. Make a variable `answer` holding the result of `6 * 7` (write the math).
2. Make a variable `greeting` holding the text `Hello`.
3. Print them both, one per line.
