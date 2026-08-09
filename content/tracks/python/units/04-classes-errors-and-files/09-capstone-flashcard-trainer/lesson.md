---
id: 09-capstone-flashcard-trainer
title: "Capstone: Flashcard Trainer"
language: python
runner: local
estMinutes: 35
files:
  - path: main.py
    starter: starter/main.py
  - path: cards.txt
    starter: starter/cards.txt
goal: "Build the flashcard trainer: a Flashcard class with a forgiving check method, a DeckError exception, load_deck reading cards.txt via pathlib, a scoring quiz loop, and missed cards written to review.txt."
docs: [python/classes, python/errors-and-exceptions, python/files]
checks:
  - id: trainer-parts-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: header
    type: stdout
    entry: main.py
    match: contains
    value: "== Flashcard Trainer =="
  - id: miss-line
    type: stdout
    entry: main.py
    match: contains
    value: "MISS: 2 + 2 (answer: 4)"
  - id: score-line
    type: stdout
    entry: main.py
    match: contains
    value: "Score: 4/5"
  - id: saved-line
    type: stdout
    entry: main.py
    match: contains
    value: "Saved 1 missed card(s) to review.txt"
  - id: real-architecture
    type: ai-judge
    rubric: "main.py defines a Flashcard class storing prompt and answer with a check(guess) method doing a case-insensitive, whitespace-stripping comparison, plus a DeckError class inheriting from Exception. A load_deck function reads cards.txt via pathlib (or open), raises DeckError when the file is missing, and builds Flashcard objects by splitting each line on '|' — the card data must come from cards.txt, not from literals in main.py. The quiz loop computes the score by calling check on each card (not hardcoded counts), collects missed cards, and writes them to review.txt. Printed OK/MISS/Score/Saved lines are built from computed values."
hints:
  - "Work in order: DeckError first (two lines), then Flashcard — check is return guess.strip().lower() == self.answer.strip().lower()."
  - "load_deck: if not path.exists(): raise DeckError(...). Then for each line of path.read_text(encoding=\"utf-8\").splitlines(), split on \"|\" with prompt, answer = line.split(\"|\", 1) and append Flashcard(prompt, answer)."
  - "The quiz: for i in range(len(deck)): card = deck[i] — if card.check(guesses[i]): score up and print the OK line, else append to missed and print the MISS line. Afterwards build one string of str(card) + \"\\n\" per missed card and write_text it to review.txt."
---
## Ship the whole unit

This is the Core capstone — classes, dunders, custom exceptions, and
files, assembled into one honest little app: a flashcard trainer that
quizzes you, scores you, and saves what you missed for tomorrow.

The deck lives in `cards.txt` (check its tab): one card per line,
`prompt|answer`. The study session's answers are already in `main.py` as
the `guesses` list — one guess per card, in order. One of them is wrong.
That's the point.

Build it in four parts:

**1. `DeckError`** — your own exception, subclassing `Exception`.

**2. `Flashcard`** — stores `prompt` and `answer`. Its `check(guess)`
method is *forgiving*: strip whitespace, compare case-insensitively, so
`" PARIS "` counts for `Paris`. Give it `__str__` returning
`prompt|answer` — you'll reuse it when saving.

**3. `load_deck(path)`** — raises `DeckError` if the file is missing;
otherwise reads it with `pathlib`, splits each line on `|`, and returns
a list of `Flashcard`s. Use `line.split("|", 1)` — the `1` means "split
once", so answers containing `|` can't break you.

**4. The session** — pair each card with its guess by index, print an
`OK:` or `MISS:` line per card, count the score, collect the missed
cards, write them to `review.txt` (one `prompt|answer` line each — your
`__str__` earns its keep), and close with the summary lines.

The full expected output:

```
== Flashcard Trainer ==
OK: capital of France
MISS: 2 + 2 (answer: 4)
OK: keyword to define a function
OK: exception for a bad value
OK: method that runs when an object is created
Score: 4/5
Saved 1 missed card(s) to review.txt
```

An AI reviewer checks the architecture too: data loaded from the file
(never hardcoded), the score computed by `check`, real classes doing
real work.

### Your goal

Match the output above exactly, with `review.txt` containing
`2 + 2|4` — built by the four parts described, not hardcoded prints.
