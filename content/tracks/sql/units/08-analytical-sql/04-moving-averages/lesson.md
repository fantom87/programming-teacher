---
id: 04-moving-averages
title: Moving Averages
language: sql
runner: browser
estMinutes: 15
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Smooth the quarter's spiky per-sale revenue with a three-row trailing average: AVG(revenue) over a window ordered by sold_on with the frame ROWS BETWEEN 2 PRECEDING AND CURRENT ROW, rounded to two places."
docs: [sql/window-functions, sql/aggregate-functions]
checks:
  - id: three-sale-average
    type: stdout
    entry: query.sql
    match: exact
    value: "sold_on | revenue | avg_3\n-------------------------\n2026-01-05 | 120 | 120\n2026-01-12 | 60 | 90\n2026-01-19 | 44 | 74.67\n2026-01-27 | 96 | 66.67\n2026-02-03 | 120 | 86.67\n2026-02-11 | 22 | 79.33\n2026-02-18 | 72 | 71.33\n2026-02-24 | 80 | 58\n2026-03-02 | 44 | 65.33\n2026-03-09 | 168 | 97.33\n2026-03-17 | 100 | 104\n2026-03-25 | 96 | 121.33\n"
  - id: sliding-frame
    type: ai-judge
    rubric: "avg_3 is AVG(revenue) as a window function ordered by sold_on with a sliding frame of ROWS BETWEEN 2 PRECEDING AND CURRENT ROW, wrapped in ROUND(..., 2). The frame is not UNBOUNDED PRECEDING, the average is not computed by a subquery or self-join, and no averaged value is hardcoded."
hints:
  - "Only the frame changes from the running total: swap UNBOUNDED PRECEDING for 2 PRECEDING and the window stops looking further back than two rows."
  - "AVG(revenue) OVER (ORDER BY sold_on ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) — then wrap the whole thing: ROUND(AVG(...) OVER (...), 2)."
  - "The first two rows are supposed to look different: with nothing behind them the window holds 1 row, then 2, so they read 120 and 90 before the average settles into threes."
---
## Smoothing the noise

Twelve sales, and the per-sale revenue jumps around: 120, then 60, then
44, then 96. Is business up or down? At this resolution you genuinely
cannot tell — a single big order swamps the signal.

A **moving average** trades resolution for a readable trend. Instead of
one row's revenue, show the average of that row and the few before it.
Spikes get diluted, direction becomes visible.

You already have the tool. Last lesson's frame reached all the way back:

```sql
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
```

Change one word and the window stops reaching:

```sql
ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
```

Now the frame is a three-row pane sliding down the table — the current
row plus the two above it. Every row gets its own little window; nothing
else about the query changes.

Two details worth expecting. First, the **edges**: row one has nothing
before it, so its window holds one row and the "average" is just itself;
row two averages two. Only from row three on does the pane fill. A real
trend chart usually hides those warm-up points.

Second, the **arithmetic**: `AVG` over integers produces a real number
with a long tail, so wrap it in `ROUND(..., 2)`. SQLite prints a rounded
value as compactly as it can, so `58.0` comes out as `58`. When you want
every cell showing the same two decimals, `printf('%.2f', x)` does that
instead — at the cost of giving you text rather than a number.

Frames are a dial. `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING` centres the
window on the current row; `ROWS BETWEEN CURRENT ROW AND UNBOUNDED
FOLLOWING` looks only forwards. Same syntax, entirely different question.

### Your goal

Add `avg_3` so `query.sql` prints exactly:

```
sold_on | revenue | avg_3
-------------------------
2026-01-05 | 120 | 120
2026-01-12 | 60 | 90
2026-01-19 | 44 | 74.67
2026-01-27 | 96 | 66.67
2026-02-03 | 120 | 86.67
2026-02-11 | 22 | 79.33
2026-02-18 | 72 | 71.33
2026-02-24 | 80 | 58
2026-03-02 | 44 | 65.33
2026-03-09 | 168 | 97.33
2026-03-17 | 100 | 104
2026-03-25 | 96 | 121.33
```

Read the last column top to bottom: the raw revenue looks like static,
the smoothed line dips through February and climbs hard in March.
