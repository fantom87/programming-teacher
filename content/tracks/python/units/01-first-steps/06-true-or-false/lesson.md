---
id: 06-true-or-false
title: True or False
language: python
runner: browser
estMinutes: 12
files:
  - path: main.py
    starter: starter/main.py
goal: "Using the given age and has_ticket variables, build four boolean variables with comparisons and and/or/not."
docs: [python/conditionals, python/variables-and-types]
checks:
  - id: boolean-variables
    type: tests
    entry: main.py
    testFile: tests/test_main.py
hints:
  - "A comparison like age >= 18 produces a value: True or False. Store it like any other value."
  - "and needs both sides True; or needs at least one; not flips the answer."
  - "is_teen = age >= 13 and age <= 19 — the other three follow the same shape."
---
## A third kind of value

You know numbers and strings. Meet the smallest type in Python: **booleans**.
There are exactly two of them, `True` and `False` (capital letters matter).

You rarely type them directly — you *make* them with comparisons:

```python
age = 16
print(age >= 18)    # False
print(age == 16)    # True   (== asks "equal?" — one = would *assign*)
print(age != 99)    # True   (!= asks "not equal?")
```

A comparison is an expression like `2 + 3` — it produces a value you can
store in a variable:

```python
is_adult = age >= 18   # is_adult now holds False
```

### Combining answers

Real questions are compound: "old enough **and** has a ticket?" Python has
three words for this:

```python
age >= 13 and age <= 19   # True only if BOTH sides are True
age >= 18 or has_ticket   # True if AT LEAST ONE side is True
not is_adult              # flips True to False and back
```

These read almost like English — that's on purpose. Next lesson, these
True/False answers will steer your program down different paths. Today,
just get comfortable making them.

### Your goal

The starter gives you `age = 16` and `has_ticket = True`. Build these four
variables from them (write comparisons — don't type `True`/`False` yourself):

1. `is_teen` — age is between 13 and 19 (use `and`)
2. `can_enter` — age is at least 18 *or* there's a ticket (use `or`)
3. `is_adult` — age is at least 18
4. `still_minor` — the opposite of `is_adult` (use `not`)
