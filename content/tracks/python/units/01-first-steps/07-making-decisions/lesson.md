---
id: 07-making-decisions
title: Making Decisions
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Write an if/elif/else chain that turns the given score of 85 into a grade variable holding B, then print it."
docs: [python/conditionals]
checks:
  - id: grade-correct
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-grade
    type: stdout
    entry: main.py
    match: exact
    value: "B\n"
hints:
  - "The shape is: if score >= 90:  then an indented line that sets grade."
  - "elif means \"otherwise, if...\" — Python checks each condition top to bottom and runs the FIRST match only."
  - "if score >= 90: grade = \"A\" / elif score >= 80: grade = \"B\" / elif score >= 70: grade = \"C\" / else: grade = \"F\" — each assignment indented under its condition."
---
## Programs that choose

So far your programs run every line, top to bottom, every time. The `if`
statement changes that — it runs a block of code **only when** a condition
is `True`:

```python
temperature = 35
if temperature > 30:
    print("It's hot!")
```

Two details matter enormously:

- the **colon** at the end of the `if` line
- the **indentation** (4 spaces) — that's how Python knows which lines
  belong to the `if`

### More than one path

`elif` ("else if") and `else` extend the choice. Python walks down the
chain and runs the **first** block whose condition is `True` — then skips
the rest:

```python
if temperature > 30:
    print("Hot")
elif temperature > 15:
    print("Mild")
else:
    print("Cold")
```

Notice the order does the work: by the time Python reaches `elif
temperature > 15`, it already knows the temperature isn't above 30.

Branches can set variables, not just print:

```python
if temperature > 30:
    label = "hot"
else:
    label = "not hot"
```

### Your goal

The starter sets `score = 85` (leave it alone). Write one `if/elif/else`
chain that sets a variable `grade`:

- 90 or above → `"A"`
- 80 to 89 → `"B"`
- 70 to 79 → `"C"`
- below 70 → `"F"`

Then print `grade`. With a score of 85, your output should be exactly `B`.
