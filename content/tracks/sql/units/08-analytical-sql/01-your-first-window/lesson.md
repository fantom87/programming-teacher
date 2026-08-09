---
id: 01-your-first-window
title: Your First Window
language: sql
runner: browser
estMinutes: 14
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "List every sale with two window columns beside it — the company's total revenue from SUM(revenue) OVER (), and its own region's total from SUM(revenue) OVER (PARTITION BY region) — without collapsing a single row."
docs: [sql/window-functions, sql/aggregate-functions]
checks:
  - id: window-report
    type: stdout
    entry: query.sql
    match: exact
    value: "id | region | revenue | company_total | region_total\n----------------------------------------------------\n1 | North | 120 | 1022 | 500\n3 | North | 44 | 1022 | 500\n5 | North | 120 | 1022 | 500\n7 | North | 72 | 1022 | 500\n9 | North | 44 | 1022 | 500\n11 | North | 100 | 1022 | 500\n2 | South | 60 | 1022 | 522\n4 | South | 96 | 1022 | 522\n6 | South | 22 | 1022 | 522\n8 | South | 80 | 1022 | 522\n10 | South | 168 | 1022 | 522\n12 | South | 96 | 1022 | 522\n"
  - id: really-windows
    type: ai-judge
    rubric: "Both totals come from window functions written as SUM(revenue) OVER (...) in the SELECT list — company_total with an empty OVER (), region_total with PARTITION BY region. There is no GROUP BY, no join back to an aggregated table, no subquery computing the totals, and the numbers 1022, 500 and 522 are never typed as literals."
hints:
  - "A window function is an ordinary aggregate with OVER after it: SUM(revenue) OVER () AS company_total. The empty parentheses mean \"every row in the result\"."
  - "For the second column, narrow the window to the rows sharing this row's region: SUM(revenue) OVER (PARTITION BY region) AS region_total."
  - "Add both columns to the existing SELECT list — don't add a GROUP BY. The row count must stay at 12; if it drops to 2 you've collapsed the table instead of windowing it."
---
## Detail and summary, together

An aggregate collapses. `SELECT SUM(revenue) FROM sales` turns twelve
rows into one, and that single row can no longer tell you which sale was
which. Usually that's the point. Sometimes it's exactly wrong: you want
each sale *and* the total it belongs to, side by side, so you can see how
each part relates to the whole.

That's a **window function** — the same aggregate, plus one word:

```sql
SELECT id, revenue, SUM(revenue) OVER () AS company_total
FROM sales;
```

`OVER ()` says: compute this sum across a *window* of rows, then paste
the answer onto every row without collapsing anything. Twelve rows in,
twelve rows out, each one carrying the 1022.

Empty parentheses mean "the window is the whole result". Put
`PARTITION BY` inside them and the window shrinks to just the rows that
share a value with the current row:

```sql
SUM(revenue) OVER (PARTITION BY region)
```

Now every North row sees North's total and every South row sees South's.
That reads like `GROUP BY`, but it is not one, and the difference is
worth saying out loud: `GROUP BY` **replaces** your rows with one row per
group. `PARTITION BY` **keeps** your rows and only decides which
neighbours each row is allowed to look at.

You can stack as many windows in one `SELECT` as you like, each with its
own `OVER (...)`, and none of them change the row count. Every aggregate
you already know — `SUM`, `AVG`, `COUNT`, `MIN`, `MAX` — becomes a window
function the moment you write `OVER` after it.

### Your goal

Add the two window columns to `query.sql` so it prints exactly:

```
id | region | revenue | company_total | region_total
----------------------------------------------------
1 | North | 120 | 1022 | 500
3 | North | 44 | 1022 | 500
5 | North | 120 | 1022 | 500
7 | North | 72 | 1022 | 500
9 | North | 44 | 1022 | 500
11 | North | 100 | 1022 | 500
2 | South | 60 | 1022 | 522
4 | South | 96 | 1022 | 522
6 | South | 22 | 1022 | 522
8 | South | 80 | 1022 | 522
10 | South | 168 | 1022 | 522
12 | South | 96 | 1022 | 522
```

The `ORDER BY region, id` is already there. Leave it — without a
deterministic `ORDER BY`, rows can come back in any order at all.
