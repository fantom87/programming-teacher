---
id: 01-defining-functions
title: Defining Functions
language: python
runner: browser
estMinutes: 12
files:
  - path: main.py
    starter: starter/main.py
goal: "Define a function welcome() that prints the two greeting lines, then call it twice — once per customer."
docs: [python/functions]
checks:
  - id: welcome-works
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: greets-twice
    type: stdout
    entry: main.py
    match: exact
    value: "Welcome to the Snack Shack!\nWhat can I get you?\nWelcome to the Snack Shack!\nWhat can I get you?\n"
hints:
  - "def welcome(): starts the definition — colon at the end, body indented underneath, just like if and for."
  - "A def by itself prints nothing. You have to CALL it afterwards: welcome() with parentheses, not indented."
  - "The body is the two print lines indented under def welcome(): — then two un-indented welcome() calls at the bottom."
---
## Teach Python a new trick

So far, every line you've written runs once, top to bottom. A **function**
lets you bundle lines up, give the bundle a name, and run it whenever you
like — as many times as you like.

```python
def cheer():
    print("Hip hip!")
    print("Hooray!")
```

`def` means *define*. This snippet teaches Python a new command called
`cheer` — but here's the surprise: **it prints nothing**. A `def` is a
recipe, not a meal. The indented body is saved for later, exactly like the
indented block under an `if` waits for its condition.

To actually run it, you *call* the function by name, with parentheses:

```python
cheer()
cheer()
```

Now it prints all four lines. One definition, two calls — that's the whole
economy of functions: write it once, use it everywhere. If the greeting
ever changes, you fix one place and every call gets the update for free.

Two details that bite beginners:

- The parentheses are the "go" signal. `cheer` alone names the recipe;
  `cheer()` cooks it.
- Python reads top to bottom, so the `def` must appear **before** the
  first call.

### Your goal

You run the Snack Shack, and greeting customers by hand is getting old.

1. Define a function `welcome()` whose body prints these two lines:

   ```
   Welcome to the Snack Shack!
   What can I get you?
   ```

2. Below the definition, call `welcome()` **twice** — two customers just
   walked in.
