---
id: 08-structuring-a-project
title: Structuring a Small Project
language: python
runner: local
estMinutes: 22
files:
  - path: main.py
    starter: starter/main.py
  - path: storage.py
    starter: starter/storage.py
  - path: stats.py
    starter: starter/stats.py
  - path: readings.txt
    starter: starter/readings.txt
goal: "Split a sensor-report program into three layers: storage.py loads and parses readings.txt, stats.py computes average and spread as pure functions, and main.py imports both to print the report behind a __main__ guard."
docs: [python/modules-and-imports, python/files, python/functions]
checks:
  - id: stats-are-pure-and-correct
    type: tests
    entry: stats.py
    testFile: tests/test_stats.py
  - id: storage-parses-and-loads
    type: tests
    entry: storage.py
    testFile: tests/test_storage.py
  - id: report-is-right
    type: stdout
    entry: main.py
    match: exact
    value: "4 readings loaded\naverage: 21.5\nspread: 4.5\n"
  - id: clean-layers
    type: ai-judge
    rubric: "The layers stay separate: stats.py contains only pure functions (no print, no open, no pathlib, no imports of storage), storage.py does all file access — load_readings reads readings.txt via pathlib and delegates parsing to parse_readings(text), which converts non-blank lines with float() — and does no statistics, and main.py imports from both modules, computes nothing itself beyond len() and :.1f formatting, and runs its three prints inside a main() called under if __name__ == \"__main__\":. Every function has a one-line docstring, and no averages or spreads are hardcoded."
hints:
  - "Bottom layer first. storage.parse_readings(text): loop text.splitlines(), skip blank lines, float() the rest into a list. load_readings() reads readings.txt with Path(...).read_text(encoding=\"utf-8\") and hands the text straight to parse_readings."
  - "stats functions are pure: average is sum(numbers) / len(numbers); spread is max(numbers) - min(numbers). No printing, no files — that's exactly what makes them testable."
  - "main.py: from storage import load_readings / from stats import average, spread. Inside main(): readings = load_readings(), then print the count, f\"average: {average(readings):.1f}\", f\"spread: {spread(readings):.1f}\" — and call main() under if __name__ == \"__main__\":."
---
## Layers, not piles

Everything in this unit so far fit in one file. Real projects don't —
and the difference between a codebase people enjoy and one they dread
is rarely cleverness. It's **structure**: every module has one job, and
you always know where a thing lives. The classic small-project split is
three layers:

```
storage.py   gets data IN            (files, parsing — the messy edge)
stats.py     computes                (pure functions, no side effects)
main.py      talks to the human      (imports both, prints, __main__ guard)
```

The rules that keep the layers honest are all *don'ts*. The logic layer
never prints and never opens files — so you can test it with a plain
function call, and reuse it in a web app tomorrow. The storage layer
parses but doesn't compute. And `main.py` is deliberately boring: load,
call, format, print. If you've ever heard "models, services, views" or
"separation of concerns" — this is that idea at starter size.

One design habit makes storage testable too: split *reading* from
*parsing*.

```python
def parse_readings(text):   # pure — testable with any string
    ...

def load_readings():        # thin — just reads the file, calls the parser
    return parse_readings(Path("readings.txt").read_text(encoding="utf-8"))
```

Tests hand `parse_readings` tricky strings without touching a disk;
`load_readings` stays too thin to break. That one-two shape — thin I/O
wrapper over a pure core — shows up in every professional codebase you
will ever read.

### Your goal

`readings.txt` holds one temperature per line.

1. `storage.py` — `parse_readings(text)` returns a list of floats,
   skipping blank lines; `load_readings()` reads `readings.txt` and
   parses it.
2. `stats.py` — `average(numbers)` and `spread(numbers)` (max minus
   min), both pure, both documented.
3. `main.py` — import from both, and inside a guarded `main()` print:

```
4 readings loaded
average: 21.5
spread: 4.5
```

(Format the two numbers with `:.1f`.) The AI reviewer checks the layer
rules — keep the math out of main.
