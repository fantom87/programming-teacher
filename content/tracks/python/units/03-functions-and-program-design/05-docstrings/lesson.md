---
id: 05-docstrings
title: Docstrings
language: python
runner: browser
estMinutes: 10
files:
  - path: main.py
    starter: starter/main.py
goal: "Give c_to_f and clamp a one-line docstring each, keep both functions working, and print c_to_f.__doc__ to see Python hand your words back."
docs: [python/functions]
checks:
  - id: docstrings-present
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: docstrings-genuine
    type: ai-judge
    rubric: "Each of c_to_f and clamp has a triple-quoted docstring as the first statement of its body, and each docstring genuinely describes what THAT function does in plain English (c_to_f: converting a Celsius temperature to Fahrenheit; clamp: limiting/keeping a value within a low..high range). Placeholder text like 'TODO', 'my function', 'does stuff', or a docstring that merely restates the code line-by-line does not pass. The function bodies are otherwise unchanged and still correct."
hints:
  - "A docstring is a \"\"\"triple-quoted string\"\"\" as the FIRST line inside the function body, before any code."
  - "Write it for a stranger: say what goes in and what comes back. \"Convert a Celsius temperature to Fahrenheit.\" beats \"does math\"."
  - "Functions carry their docstring around: print(c_to_f.__doc__) prints exactly what you wrote."
---
## Notes to your future self

These two functions work fine — and six months from now you'll stare at
`clamp` wondering what it was for. Code says *how*; it's terrible at
saying *what* and *why*. That's the docstring's job:

```python
def area(width, height):
    """Return the area of a rectangle."""
    return width * height
```

A **docstring** is a string sitting as the *first* statement of the
function body, by convention triple-quoted. Python doesn't just skim past
it like a comment — it attaches the text to the function itself:

```python
print(area.__doc__)     # Return the area of a rectangle.
help(area)              # the built-in help reads it too
```

Every tool in the Python world taps this: editors show docstrings in
tooltips, `help()` prints them, documentation sites are generated from
them. Write one line and the whole toolchain repeats it back wherever the
function is used.

What makes a docstring *good*? Write for a stranger who can see the name
but not the body:

- Say what the function **does**, not how: "Convert a Celsius temperature
  to Fahrenheit." — not "multiplies by 9/5 and adds 32".
- Lead with a verb, end with a period. One line is plenty for small
  functions.
- Mention what comes back if it isn't obvious.

A comment (`#`) is a note *in* the code; a docstring is the function's
public label. Both have their place — this lesson is about the label.

### Your goal

1. Add a one-line docstring to `c_to_f` and to `clamp` — first line of
   each body, triple quotes.
2. Don't change what the functions do — the tests re-check them.
3. At the bottom, `print(c_to_f.__doc__)` and watch Python hand your own
   words back.

An AI reviewer reads your docstrings too — placeholders like
`"""TODO"""` won't cut it.
