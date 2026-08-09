---
id: 03-running-totals
title: Running Totals
language: sql
runner: browser
estMinutes: 15
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Add a running_total column that accumulates revenue sale by sale down the quarter, using SUM(revenue) OVER (ORDER BY sold_on ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)."
docs: [sql/window-functions, sql/aggregate-functions]
checks:
  - id: revenue-to-date
    type: stdout
    entry: query.sql
    match: exact
    value: "sold_on | revenue | running_total\n---------------------------------\n2026-01-05 | 120 | 120\n2026-01-12 | 60 | 180\n2026-01-19 | 44 | 224\n2026-01-27 | 96 | 320\n2026-02-03 | 120 | 440\n2026-02-11 | 22 | 462\n2026-02-18 | 72 | 534\n2026-02-24 | 80 | 614\n2026-03-02 | 44 | 658\n2026-03-09 | 168 | 826\n2026-03-17 | 100 | 926\n2026-03-25 | 96 | 1022\n"
  - id: framed-window
    type: ai-judge
    rubric: "running_total is a single SUM(revenue) window function whose OVER clause orders by sold_on and states an explicit ROWS frame running from UNBOUNDED PRECEDING to CURRENT ROW. It is not computed by a correlated subquery, a self-join, or any hardcoded list of totals."
hints:
  - "Ordering the window is what makes an accumulation possible: SUM(revenue) OVER (ORDER BY sold_on) already gives you revenue-to-date."
  - "Say the frame out loud so the intent is on the page: OVER (ORDER BY sold_on ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)."
  - "The clause spans several lines happily — put ORDER BY on one line and ROWS BETWEEN on the next inside the parentheses. The last row's total should read 1022, the quarter's whole revenue."
---
## Windows that remember

Last lesson the window's `ORDER BY` decided who ranked first. It does
something else too, something less obvious: **ordering a window turns it
into a running window.** Once rows have an order, "the rows up to this
one" becomes a meaningful phrase, and that phrase is a running total.

```sql
SUM(revenue) OVER (ORDER BY sold_on)
```

Row one sees only itself. Row two sees rows one and two. Row twelve sees
everything. The last value is the grand total, and every value above it
is revenue-to-date at that moment in the quarter.

The set of rows a window function can actually see is called the
**frame**, and you can spell it out:

```sql
SUM(revenue) OVER (
  ORDER BY sold_on
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
)
```

`UNBOUNDED PRECEDING` means "from the very first row of the window";
`CURRENT ROW` means "stop here". That is exactly what the bare
`ORDER BY` version did — so why type it?

Because the default is not quite `ROWS`. Without a frame clause SQL uses
`RANGE`, and `RANGE` includes every **peer** of the current row — every
row with the same `ORDER BY` value. If two sales landed on the same date,
`RANGE` would give both of them the same running total (each already
including the other), while `ROWS` would step through them one at a time.
Our dates are all distinct, so the two agree here. On real data they
won't, and the bug is nasty precisely because it only appears when
duplicates show up.

Write the frame. It costs one line and it says what you meant.

The frame is also a dial, not a switch: change the two ends and the same
window becomes a moving average, a look-back, a look-ahead. That's the
next lesson.

### Your goal

Add `running_total` so `query.sql` prints exactly:

```
sold_on | revenue | running_total
---------------------------------
2026-01-05 | 120 | 120
2026-01-12 | 60 | 180
2026-01-19 | 44 | 224
2026-01-27 | 96 | 320
2026-02-03 | 120 | 440
2026-02-11 | 22 | 462
2026-02-18 | 72 | 534
2026-02-24 | 80 | 614
2026-03-02 | 44 | 658
2026-03-09 | 168 | 826
2026-03-17 | 100 | 926
2026-03-25 | 96 | 1022
```
