---
id: 04-scope
title: Scope
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Fix the NameError by returning total from add_tip, storing the result in a variable dinner, and printing it — without moving the math out of the function."
docs: [python/functions, python/debugging]
checks:
  - id: add-tip-returns
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-total
    type: stdout
    entry: main.py
    match: exact
    value: "Total with tip: 50.0\n"
hints:
  - "Run the starter first and read the traceback: NameError: name 'total' is not defined. total only exists INSIDE add_tip."
  - "Don't move the math out — send the value out. Add return total as the last line of the function."
  - "Catch what comes back: dinner = add_tip(40.0), then print(\"Total with tip:\", dinner)."
---
## A private workspace

Run the starter code before reading on. It crashes:

```
NameError: name 'total' is not defined
```

But `total` is *right there* in the function! Here's the rule the crash is
teaching you: **variables created inside a function exist only inside that
function.** The moment `add_tip` finishes, its `tip` and `total` vanish.
The outside world never saw them.

This region where a name exists is called its **scope**. Every function
gets its own private workspace, and that's a *feature*: `add_tip` can call
its variable `total`, some other function can too, and neither tramples
the other. In a thousand-line program, that isolation is what keeps you
sane — you never have to wonder whether calling a function silently
rearranged your variables.

So how does anything get out? You already know the doors:

- **Parameters** carry values *in* — `bill` was born from the argument
  `40.0`.
- **`return`** carries one value *out* — back to whoever called.

```python
def add_tip(bill):
    tip = bill * 0.25
    total = bill + tip
    return total          # the value escapes; the NAME total doesn't

dinner = add_tip(40.0)    # outside, we catch it under our own name
```

(For completeness: a function *can* read an outside variable, and a
`global` keyword exists for writing them. Treat both as fire escapes, not
doors — parameters in, return out is the pattern that scales.)

### Your goal

Fix the crash. Keep all the math inside `add_tip`:

1. `return total` from the function.
2. Store the result outside in a variable called `dinner`.
3. Print `Total with tip: 50.0` using that variable.

The tests also verify that `tip` stayed private — the fix is a door, not
a demolition.
