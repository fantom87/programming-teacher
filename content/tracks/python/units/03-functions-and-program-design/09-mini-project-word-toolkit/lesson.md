---
id: 09-mini-project-word-toolkit
title: "Mini-Project: Word Toolkit"
language: python
runner: local
estMinutes: 30
files:
  - path: main.py
    starter: starter/main.py
  - path: textkit.py
    starter: starter/textkit.py
goal: "Build textkit.py — three documented functions (count_words, longest_word, shout with a default parameter) behind a __main__ guard demo — and a main.py that imports them to print the four-line report."
docs: [python/modules-and-imports, python/functions, python/strings]
checks:
  - id: toolkit-functions-work
    type: tests
    entry: textkit.py
    testFile: tests/test_textkit.py
  - id: report-is-right
    type: stdout
    entry: main.py
    match: exact
    value: "WORD TOOLKIT REPORT:\nWords: 5\nLongest: functions\nDONE!\n"
  - id: demo-behind-guard
    type: stdout
    entry: textkit.py
    match: exact
    value: "textkit demo\nIT WORKS!\n"
  - id: designed-like-a-module
    type: ai-judge
    rubric: "textkit.py defines count_words(text) and longest_word(text) computed from text.split() (longest via a loop or max — not hardcoded results), plus shout(text, punctuation=\"!\") that uses a default parameter and uppercases the text. All three functions have genuine one-line docstrings (not placeholders like TODO). The two demo prints sit under if __name__ == \"__main__\": in textkit.py. main.py imports from textkit and builds every report line by calling those functions on MOTTO — none of the report values (5, functions, the uppercased strings) appear as literals in main.py."
hints:
  - "Start with textkit.py, one function at a time. text.split() gives a list of words — count_words is len() of that list."
  - "longest_word: start with longest = \"\" and loop over text.split(); when len(word) > len(longest), that word becomes the new longest."
  - "In main.py the heading is shout(\"word toolkit report\", \":\") and the closer is shout(\"done\") — the default \"!\" does the rest. Words: and Longest: come from calling the other two on MOTTO."
---
## Ship a module

Time to put the whole unit in one place: functions with parameters,
returns, and defaults; docstrings; a module; imports; and a `__main__`
guard. You're building a small text-statistics library — and a program
that uses it. Two files, two jobs, exactly like lesson 7.

**`textkit.py` — the library.** Three tools, each one function, each
with a one-line docstring:

- `count_words(text)` — how many words? `text.split()` chops a sentence
  into a list of words; the count follows from there.
- `longest_word(text)` — walk the words, keep the longest seen so far,
  return it. (Ties go to the first — your loop does that naturally.)
- `shout(text, punctuation="!")` — the text uppercased with punctuation
  stuck on the end. The default means `shout("done")` yells `DONE!`,
  while `shout("hi", "?")` asks `HI?`.

At the bottom, a demo — guarded, so importing stays silent:

```python
if __name__ == "__main__":
    print("textkit demo")
    print(shout("it works"))
```

**`main.py` — the program.** It imports your tools and reports on the
starter's `MOTTO`. Every line is a function call — the checker's test
sentences will be different, so nothing can be hardcoded:

```
WORD TOOLKIT REPORT:
Words: 5
Longest: functions
DONE!
```

That heading is `shout("word toolkit report", ":")` — the keyword-free
call with a second argument. Spot how each piece of the unit clicks in.

Work like a professional: one function at a time, run after each,
`main.py` last. The checks run both files *and* an AI reviewer reads
your structure — docstrings, guard, real imports.

### Your goal

1. `textkit.py`: `count_words`, `longest_word`, and `shout(text,
   punctuation="!")` — each computing its answer, each with a docstring.
2. Add the guarded two-line demo shown above.
3. `main.py`: import from `textkit` and print the four-line report by
   calling your functions on `MOTTO` — no literal answers allowed.
