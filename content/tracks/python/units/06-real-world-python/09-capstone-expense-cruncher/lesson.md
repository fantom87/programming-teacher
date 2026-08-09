---
id: 09-capstone-expense-cruncher
title: "Capstone: Expense Cruncher"
language: python
runner: local
estMinutes: 35
files:
  - path: main.py
    starter: starter/main.py
  - path: expenses.csv
    starter: starter/expenses.csv
goal: "Build a data-crunching CLI: argparse takes --month, csv + datetime load and filter the expenses, dict aggregation produces per-category totals, and the tool prints a report and writes summary.json — every number computed."
docs: [python/stdlib-tour, python/files, python/dicts]
checks:
  - id: cruncher-works-for-any-month
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: august-report
    type: stdout
    entry: main.py
    match: exact
    value: "== Expense Report: 2026-08 ==\n4 expenses, 116.75 total\nby category:\n  eating out: 46.40\n  groceries: 61.10\n  transport: 9.25\ntop category: groceries\nsummary.json written\n"
  - id: everything-computed
    type: ai-judge
    rubric: "Every number in the report is computed from expenses.csv: rows read with csv.DictReader, dates parsed with datetime.strptime (not string slicing), amounts converted with float, the month filter compares the parsed date's year-month against args.month, category totals accumulate in a dict (get/defaultdict pattern), the top category comes from max with a key function, and summary.json is produced with json.dumps from the same computed values. build_parser declares --month as required, crunch(argv) parses an explicit argv list, and none of the literals 116.75, 46.40, 61.10, 9.25, 4, or \"groceries\" are typed inside print calls or the summary dict."
hints:
  - "Work part by part, running as you go. In load_expenses, convert while reading: datetime.strptime(row[\"date\"], \"%Y-%m-%d\").date() and float(row[\"amount\"]) — the rest of the program should never see strings."
  - "Filtering is one comparison per expense: e[\"date\"].strftime(\"%Y-%m\") == args.month. Category totals use the dict pattern: totals[cat] = round(totals.get(cat, 0) + e[\"amount\"], 2); the winner is max(totals, key=totals.get)."
  - "Print money with f\"{value:.2f}\" and loop sorted(totals) for the category lines. Then build the summary dict ({\"month\", \"count\", \"total\", \"by_category\", \"top\"}) and Path(\"summary.json\").write_text(json.dumps(summary, indent=2), encoding=\"utf-8\") before the final print."
---
## The cruncher

This is the Intermediate capstone, and it's the real thing: a
command-line tool that eats a CSV, crunches a month of spending, and
leaves both a human report and a machine-readable JSON behind. Every
piece is something you built this unit — csv, datetime, argparse, dict
aggregation, json — composed the way an actual data tool composes them.
The capstone rule, as always: **every number on screen is computed from
the data**. Swap in next year's expenses and nothing changes but the
output.

### Your goal

Running `crunch(["--month", "2026-08"])` (the guarded call at the
bottom of the file) must print exactly:

```
== Expense Report: 2026-08 ==
4 expenses, 116.75 total
by category:
  eating out: 46.40
  groceries: 61.10
  transport: 9.25
top category: groceries
summary.json written
```

**Part 1 — the interface.** `build_parser()` returns an
`ArgumentParser` with one required option: `--month` (a `"YYYY-MM"`
string, `required=True`).

**Part 2 — loading.** `load_expenses(path)` reads the CSV with
`csv.DictReader` and returns a list of dicts with *real types*: `date`
via `strptime(...).date()`, `amount` via `float()`, `category` as-is.
Convert at the edge — nothing downstream should touch a string date.

**Part 3 — crunching.** `crunch(argv)` parses `argv`, keeps only the
expenses whose date falls in `args.month` (format the parsed date back
to `"%Y-%m"` and compare), then computes: the count, the rounded total,
per-category totals via the `dict.get` accumulation pattern, and the
top category via `max(totals, key=totals.get)`. Print the report —
categories alphabetical (`sorted`), money always `:.2f`.

**Part 4 — the artifact.** Build a summary dict — `month`, `count`,
`total`, `by_category`, `top` — and write it to `summary.json` with
`json.dumps(..., indent=2)`. Confirm with the final line.

The tests rerun your cruncher for July, so hardcoding August's numbers
can't pass; the AI reviewer reads the code for the same sins. When it's
green, you've shipped a genuine data tool — that's the Intermediate
tier done.
