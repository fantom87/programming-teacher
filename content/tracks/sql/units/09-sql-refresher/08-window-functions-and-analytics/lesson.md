---
id: 08-window-functions-and-analytics
title: Windows and Analytics
language: sql
runner: browser
estMinutes: 20
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "The closing drill: ROW_NUMBER to rank each artist's own catalogue, a CTE pipeline with a running total and a LAG month-over-month change over strftime months, and the top-N-per-group pattern picking each month's best seller."
docs: [sql/window-functions, sql/ctes, sql/aggregate-functions]
checks:
  - id: analytics-output
    type: stdout
    entry: query.sql
    match: exact
    value: "artist | title | price | rank_in_catalog\n----------------------------------------\nMarek Duval | Nocturne | 26.95 | 1\nNina Kestrel | Slow Tide | 28.75 | 1\nNina Kestrel | Paper Lantern | 23.95 | 2\nSolaine | Bleu Nuit | 34.75 | 1\nSolaine | Verre | 21.45 | 2\nThe Ember Hours | Long Winter | 31.25 | 1\nThe Ember Hours | Ash & Ivory | 18.25 | 2\n\nmonth | revenue | running | change\n----------------------------------\n2025-01 | 60.45 | 60.45 | n/a\n2025-02 | 81.45 | 141.90 | +21.00\n2025-03 | 150.95 | 292.85 | +69.50\n2025-04 | 52.70 | 345.55 | -98.25\n\nmonth | title | units\n---------------------\n2025-01 | Ash & Ivory | 2\n2025-02 | Long Winter | 1\n2025-03 | Bleu Nuit | 2\n2025-04 | Long Winter | 1\n"
  - id: windows-not-workarounds
    type: ai-judge
    rubric: "Query 1 numbers the rows with ROW_NUMBER() OVER (PARTITION BY artist_id ORDER BY price DESC) — not a correlated subquery counting dearer albums and not a self-join. Query 2 derives its month with strftime('%Y-%m', ordered_on), aggregates revenue per month, then computes the running total with a windowed SUM carrying an explicit ORDER BY (and a ROWS frame) and the previous month with LAG — neither is a self-join or a correlated subquery, and the first month's missing previous value is handled by testing the LAG result for NULL rather than by hardcoding 'n/a' against a month literal. Query 3 is the top-per-group pattern: a ranking window function partitioned by month and ordered by units DESC with a title tie-breaker, computed in a CTE or derived table and then filtered to the first place outside it — because window functions cannot appear in WHERE. No months, titles or totals are typed as literals."
hints:
  - "A window function does not collapse rows: SELECT ..., ROW_NUMBER() OVER (PARTITION BY a.artist_id ORDER BY a.price DESC) AS rank_in_catalog. PARTITION BY restarts the numbering; the OVER clause's ORDER BY decides who is first."
  - "Build query 2 in CTE steps: lines (join and project qty * price with strftime('%Y-%m', o.ordered_on) AS month), monthly (GROUP BY month), then a trend step adding LAG(revenue) OVER (ORDER BY month) AS prev and SUM(revenue) OVER (ORDER BY month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running. Format last: CASE WHEN prev IS NULL THEN 'n/a' ELSE printf('%+.2f', revenue - prev) END."
  - "Top-per-group is always two steps, because WHERE runs before the window: rank inside a CTE — RANK() OVER (PARTITION BY month ORDER BY units DESC, title) AS place — then SELECT ... WHERE place = 1 outside it. The title tie-breaker is what makes each month have exactly one winner."
---
## Aggregate without collapsing

`GROUP BY` answers "what is the total per month" and throws the rows
away. A window function answers "what is the total per month, *and*
where does this row sit inside it" and keeps every row. Same aggregates,
different frame:

```sql
SUM(revenue) OVER (ORDER BY month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
```

Three parts of `OVER` do all the work. `PARTITION BY` cuts the rows into
independent groups — the window restarts at each new artist, each new
month. The window's own `ORDER BY` decides what "previous" and "so far"
mean. And the **frame** (`ROWS BETWEEN …`) decides which neighbours are
in scope: unbounded-preceding-to-current-row is the running total; swap
in `2 PRECEDING` and you have a moving average.

The ranking family: `ROW_NUMBER` always gives 1, 2, 3; `RANK` leaves
gaps after a tie (1, 1, 3); `DENSE_RANK` does not (1, 1, 2). If your
window `ORDER BY` cannot produce a tie — add a tie-breaker column —
they behave identically and, more usefully, deterministically.

`LAG` and `LEAD` reach at the neighbouring row's value; `LAG` on the
first row is `NULL`, and that `NULL` is a fact to handle, not an error.

One rule explains the shape of every top-N-per-group query you will ever
write: **window functions are computed after `WHERE`**, so you cannot
filter on one. Rank in a CTE, filter outside it.

For months, `strftime('%Y-%m', ordered_on)` turns an ISO date string
into a groupable bucket — SQLite has no date type, just text that its
date functions understand.

### Your goal

Three queries in `query.sql`, in this order:

1. `artist`, `title`, `price`, `rank_in_catalog` — each album's place
   within its own artist's catalogue, dearest first.
2. `month`, `revenue`, `running`, `change` — monthly revenue, a running
   total, and the signed month-over-month change (`n/a` for the first).
3. `month`, `title`, `units` — each month's best seller, ties going to
   the alphabetically first title.

```
artist | title | price | rank_in_catalog
----------------------------------------
Marek Duval | Nocturne | 26.95 | 1
...

month | revenue | running | change
----------------------------------
2025-01 | 60.45 | 60.45 | n/a
2025-02 | 81.45 | 141.90 | +21.00
...

month | title | units
---------------------
2025-01 | Ash & Ivory | 2
...
```

That is the refresher done — the whole language, back in your hands.
