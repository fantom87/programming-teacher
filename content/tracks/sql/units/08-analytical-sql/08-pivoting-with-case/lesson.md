---
id: 08-pivoting-with-case
title: Pivoting with CASE
language: sql
runner: browser
estMinutes: 18
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Turn the quarter's months from rows into columns — one row per roast with jan, feb and mar columns built from SUM(CASE WHEN ... THEN revenue ELSE 0 END), plus a total."
docs: [sql/group-by-and-having, sql/aggregate-functions]
checks:
  - id: roast-by-month-pivot
    type: stdout
    entry: query.sql
    match: exact
    value: "roast | jan | feb | mar | total\n-------------------------------\nDecaf | 44 | 22 | 44 | 110\nEspresso | 216 | 72 | 264 | 552\nFilter | 60 | 200 | 100 | 360\n"
  - id: conditional-aggregation
    type: ai-judge
    rubric: "Each of jan, feb and mar is one SUM over a CASE (or an equivalent FILTER clause) that only admits revenue from that month, with the month tested via strftime('%Y-%m', sold_on). The query has a single GROUP BY roast and reads the sales table once — it is not three separate queries stitched with UNION, not three subqueries or joins, and no cell value is hardcoded."
hints:
  - "The trick is that CASE runs per row, before the aggregate sees it: SUM(CASE WHEN strftime('%Y-%m', sold_on) = '2026-01' THEN revenue ELSE 0 END) AS jan."
  - "Copy that line twice more for '2026-02' and '2026-03'. Every column is the same SUM over the same rows — only the CASE condition changes."
  - "ELSE 0 matters: without it non-matching rows contribute NULL, and a roast with no sales in a month shows NULL instead of 0. Finish with SUM(revenue) AS total and keep GROUP BY roast ORDER BY roast."
---
## Rows into columns

A `GROUP BY roast, month` gives you nine tidy rows. Correct, and nearly
unreadable — to compare Espresso in January against Espresso in March you
have to scan up and down the page counting.

What a human wants is a grid: roasts down the side, months across the
top. Turning row values into columns is called **pivoting**, and SQL has
no `PIVOT` keyword. It doesn't need one, because a `CASE` inside an
aggregate does the job:

```sql
SUM(CASE WHEN strftime('%Y-%m', sold_on) = '2026-01' THEN revenue ELSE 0 END) AS jan
```

Read it inside out. `CASE` is evaluated **per row**, before the aggregate
sees anything: for a January sale it yields that sale's revenue, for
every other sale it yields `0`. Then `SUM` adds up the whole column —
which, since the non-January rows all contributed nothing, is January's
revenue and nothing else.

One more copy of that line per month, one `GROUP BY roast`, and the table
turns ninety degrees. The whole grid comes from **one pass** over the
data — each output column is just a differently-filtered view of the same
rows, which is why this beats three queries glued together with `UNION`.

`ELSE 0` earns its keep. Without it, non-matching rows contribute `NULL`;
`SUM` ignores NULLs, so totals stay right — but a roast with *no* sales
in a month shows `NULL` instead of `0`, and a report full of NULLs where
zeros belong is a report people misread.

SQLite also offers a tidier spelling of the same idea:

```sql
SUM(revenue) FILTER (WHERE strftime('%Y-%m', sold_on) = '2026-01') AS jan
```

Nicer to read, but it leaves NULL for empty groups and isn't portable to
every database. `CASE` works everywhere — learn it first.

The obvious limit: one typed column per value, so pivoting only works
when you know the values up front. Three roasts, twelve months, four
quarters — fine. A thousand product IDs — that's the application's job.

### Your goal

Rewrite `query.sql` as a pivot that prints exactly:

```
roast | jan | feb | mar | total
-------------------------------
Decaf | 44 | 22 | 44 | 110
Espresso | 216 | 72 | 264 | 552
Filter | 60 | 200 | 100 | 360
```

Check yourself with the grid: each row's three months should add up to
its `total`, and the three totals should add up to 1022.
