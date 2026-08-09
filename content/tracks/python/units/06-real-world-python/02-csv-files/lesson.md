---
id: 02-csv-files
title: CSV Files
language: python
runner: local
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
  - path: scores.csv
    starter: starter/scores.csv
goal: "Read scores.csv with csv.DictReader, print each player's points + bonus total (converted to real numbers), and write a totals.csv with csv.writer — opened with newline=\"\"."
docs: [python/stdlib-tour, python/files]
checks:
  - id: totals-csv-correct
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-totals
    type: stdout
    entry: main.py
    match: exact
    value: "Mira: 85\nDeshi: 95\nKai: 87\ntotals.csv written\n"
  - id: uses-the-csv-module
    type: ai-judge
    rubric: "scores.csv is read with csv.DictReader (not manual .split(\",\") parsing), each total is computed as int(row[\"points\"]) + int(row[\"bonus\"]) — never hardcoded 85/95/87 — and totals.csv is produced by csv.writer writerow calls on a file opened with newline=\"\". The printed lines and the written rows come from the same computed totals."
hints:
  - "Open for reading with open(\"scores.csv\", encoding=\"utf-8\", newline=\"\") — then csv.DictReader(f) yields one dict per row: {\"name\": \"Mira\", \"points\": \"80\", \"bonus\": \"5\"}."
  - "Those values are STRINGS. int(row[\"points\"]) + int(row[\"bonus\"]) is the real total — print it, and collect (name, total) pairs in a list for step 3."
  - "Write with open(\"totals.csv\", \"w\", encoding=\"utf-8\", newline=\"\") as f: writer = csv.writer(f); writer.writerow([\"name\", \"total\"]); then one writerow per pair. Skip newline=\"\" and Windows sneaks a blank line between rows."
---
## Spreadsheets without the spreadsheet

An enormous share of the world's data moves as **CSV** — comma-separated
values, the format every spreadsheet exports. It looks so simple you'll
be tempted to parse it with `.split(",")`. Resist: the moment a field
contains a comma (`"Lee, Jr."`) that approach shreds the row. Python
ships a `csv` module that gets all the edge cases right.

The nicest way in is `DictReader`, which uses the header row as keys:

```python
import csv

with open("scores.csv", encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):
        print(row["name"], row["points"])
```

Each row arrives as a dict — `{"name": "Mira", "points": "80", ...}` —
and there's the classic trap, in plain sight: **every value is a
string**. `"80" + "5"` is `"805"`, not `85`. CSV has no idea what a
number is, so converting with `int()` (or `float()`) is *your* job,
every time.

Writing goes through `csv.writer`, one `writerow` per line:

```python
with open("totals.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "total"])   # header first
```

Two habits in that snippet are non-negotiable. `with` closes the file
for you, as always. And `newline=""` in *every* `open` involving csv:
without it, Windows translates the module's line endings a second time
and your file grows a blank line between every row — a bug you'd only
spot when a colleague opens the file. The checker looks for it.

### Your goal

The starter `scores.csv` holds three players with `points` and `bonus`
columns.

1. Read it with `csv.DictReader` and print each player's total —
   `points + bonus`, as real numbers.
2. Write `totals.csv`: a `name,total` header, then one row per player,
   via `csv.writer` with `newline=""`.
3. Finish with a confirmation line:

```
Mira: 85
Deshi: 95
Kai: 87
totals.csv written
```
