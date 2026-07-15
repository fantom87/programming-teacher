# Reading error messages

An error message isn't the computer scolding you — it's the computer *helping* you. It tells you what went wrong, where, and often why. Learning to read one calmly is a superpower.

## Anatomy of an error

Run this broken Python:

```python
numbers = [1, 2, 3]
print(numbers[5])
```

You get:

```text
Traceback (most recent call last):
  File "example.py", line 2, in <module>
    print(numbers[5])
IndexError: list index out of range
```

Read it bottom-up:

1. **Last line first**: `IndexError: list index out of range` — the *kind* of error and a plain-English hint. There's no item at position 5.
2. **The line above** shows the exact code that failed: `print(numbers[5])`.
3. **File and line number**: `example.py, line 2` — where to look.

## The traceback is a trail

When errors happen inside functions, the traceback lists every call that led there, top (oldest) to bottom (the crash site). The bottom entry is usually where to start; the entries above show how you got there.

## Common error types

```python
print(nmae)        # NameError: name 'nmae' is not defined (typo)
"5" + 5            # TypeError: can't add str and int
int("hello")       # ValueError: invalid literal for int()
print("hi"         # SyntaxError: '(' was never closed
```

Each name is a clue: `NameError` means an unknown name, `TypeError` means mixing incompatible kinds of values, `SyntaxError` means the code itself is malformed (often a missing bracket or colon on the line *before* the one reported).

## A simple habit

When an error appears: don't panic, don't guess. Read the last line, find the file and line number, and look at that code. If the message is unfamiliar, search the exact error text — thousands of people have hit it before you. Errors are breadcrumbs, and the fix is usually one small change away.
