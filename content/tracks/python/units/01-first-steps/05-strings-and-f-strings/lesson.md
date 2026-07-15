---
id: 05-strings-and-f-strings
title: Strings and F-Strings
language: python
runner: browser
estMinutes: 12
files:
  - path: main.py
    starter: starter/main.py
goal: "Build `intro` with + concatenation and `status` with an f-string, using the given name and language variables, then print both."
docs: [python/strings, python/variables-and-types]
checks:
  - id: string-variables
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-both
    type: stdout
    entry: main.py
    match: exact
    value: "Hello, Ada!\nAda is learning Python\n"
hints:
  - "Concatenation glues strings with +: \"Hello, \" + name + \"!\""
  - "An f-string starts with the letter f and drops values in with braces: f\"{name} is learning {language}\""
  - "Print the variables, not quoted text: print(intro) then print(status)."
---
## Gluing text together

Strings can be joined with `+`, exactly like adding numbers — except it's
called **concatenation**:

```python
name = "Grace"
line = "Hi, " + name + "."
print(line)   # Hi, Grace.
```

It works, but it gets clumsy fast — all those quotes and plus signs, and
you have to remember the spaces yourself.

### The modern way: f-strings

Put an `f` right before the opening quote, and the string gains a
superpower: anything inside `{curly braces}` is swapped for its value.

```python
name = "Grace"
year = 1952
print(f"{name} wrote a compiler in {year}")
# Grace wrote a compiler in 1952
```

No plus signs, no juggling quotes, and the spaces are exactly where you
see them. F-strings are how working Python programmers build text —
you'll use them in nearly every program from here on.

You'll practice both today: concatenation once (so you recognize it in
other people's code), then an f-string (so you never look back).

### Your goal

The starter code gives you `name` and `language`. Using those variables:

1. Build `intro` with `+` concatenation so it holds `Hello, Ada!`
2. Build `status` with an f-string so it holds `Ada is learning Python`
3. Print both, one per line:

```
Hello, Ada!
Ada is learning Python
```
