---
id: 02-printing-and-strings
title: Printing and Strings
language: python
runner: browser
estMinutes: 12
files:
  - path: main.py
    starter: starter/main.py
goal: "Print three exact lines, choosing the right quote style for an apostrophe and for quotation marks."
docs: [python/strings, concepts/reading-error-messages]
checks:
  - id: prints-three-lines
    type: stdout
    entry: main.py
    match: exact
    value: "Ready?\nIt's alive!\nShe said \"hello\" to the computer.\n"
hints:
  - "Each print(...) makes exactly one line. You need three prints."
  - "A string with an apostrophe is safest in double quotes: print(\"It's alive!\")"
  - "For quotation marks inside, wrap the string in single quotes: print('She said \"hello\" to the computer.')"
---
## More than one line

Every `print` produces one line of output. Stack them and you get a poem,
a receipt, a menu — anything:

```python
print("First line")
print("Second line")
```

The text between the quotes is called a **string**. Python accepts two
quote styles, and they're interchangeable:

```python
print("double quotes")
print('single quotes')
```

Why have both? Because strings sometimes *contain* quote characters.
An apostrophe inside single quotes ends the string too early — so use
double quotes around it:

```python
print("It's fine")     # works
print('It's broken')   # SyntaxError!
```

And the reverse: to print quotation marks, wrap the string in single quotes:

```python
print('They yelled "run!"')
```

### Break it on purpose

Before you finish, try running that broken line — `print('It's broken')` —
and read the error. It says `SyntaxError` and points near the spot where
Python got confused. Errors aren't scoldings; they're the computer telling
you exactly where to look. Meeting one on purpose now makes the accidental
ones much less scary.

### Your goal

Print exactly these three lines, one `print` per line:

```
Ready?
It's alive!
She said "hello" to the computer.
```

Line two needs an apostrophe; line three needs quotation marks. Pick your
quote style for each so Python doesn't get confused.
