---
id: 01-hello-world
title: Hello, World!
language: python
runner: browser
estMinutes: 10
files:
  - path: main.py
    starter: starter/main.py
goal: "Print exactly: Hello, world!"
docs: [concepts/what-is-a-program, python/syntax-cheatsheet]
checks:
  - id: prints-hello
    type: stdout
    entry: main.py
    match: exact
    value: "Hello, world!\n"
hints:
  - "Python's printing instruction is print(...)"
  - "Text needs quotes: print(\"like this\")"
  - "The exact line is: print(\"Hello, world!\")"
---
## Your first program

A **program** is a list of instructions the computer follows from top to bottom.
You're about to write your first one — the same first program almost every
programmer in history has written.

In Python, the instruction that prints text to the screen is `print`:

```python
print("hi")
```

The parentheses hold what to print. The quotes say "this is text, not code."

### Your goal

Make the program print exactly:

```
Hello, world!
```

Capital H, lowercase w, comma, exclamation mark — computers are wonderfully
literal. Press **Run** when you're ready. Wrong output isn't failure; it's
information.
