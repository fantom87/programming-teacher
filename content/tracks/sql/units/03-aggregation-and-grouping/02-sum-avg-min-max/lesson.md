---
id: 02-sum-avg-min-max
title: Sum, Average, Min, Max
language: sql
runner: browser
estMinutes: 12
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Summarise the whole sales table in one row: SUM(qty) as items_sold, AVG(unit_price) as avg_price, MIN(unit_price) as cheapest, and MAX(unit_price) as priciest."
docs: [sql/aggregate-functions, sql/select-basics]
checks:
  - id: four-aggregates
    type: stdout
    entry: query.sql
    match: exact
    value: "items_sold | avg_price | cheapest | priciest\n--------------------------------------------\n102 | 4.791666666666667 | 2.75 | 7.5\n"
  - id: aggregates-over-the-table
    type: ai-judge
    rubric: "One SELECT over the sales table with four aggregate calls — SUM(qty), AVG(unit_price), MIN(unit_price), MAX(unit_price) — each aliased. None of the values 102, 4.791666666666667, 2.75, or 7.5 is typed as a literal, and the average is not hand-computed as SUM(unit_price)/COUNT(*) or similar."
hints:
  - "All four aggregates share one SELECT list and one FROM: SELECT SUM(qty) AS items_sold, ... FROM sales; — you never need four separate queries."
  - "SUM adds a column up, AVG averages it, MIN and MAX pick the extremes. Watch which column each one gets: items_sold sums qty, the other three all read unit_price."
  - "Order matters only for display, but the checker compares text: items_sold, avg_price, cheapest, priciest, in that order, with exactly those aliases."
---
## The big four

`COUNT` answers *how many*. The other four aggregates answer *how much*, and
they all work the same way — hand each one a column and it chews through every
row to produce a single value:

```sql
SELECT SUM(qty)   FROM sales;   -- add the column up
SELECT AVG(qty)   FROM sales;   -- the mean
SELECT MIN(qty)   FROM sales;   -- the smallest
SELECT MAX(qty)   FROM sales;   -- the largest
```

You almost never want them one at a time. Aggregates are ordinary expressions
in the SELECT list, so stack as many as you like into a single row:

```sql
SELECT SUM(qty) AS units,
       AVG(qty) AS avg_units
FROM sales;
```

One `FROM`, one pass over the table, one row of answers. This is the shape of
practically every summary query you'll ever write — a dashboard tile, a
month-end total, a sanity check after an import.

Two things to expect from the output.

First, `SQLite` prints numbers, not currency. `7.50` in your data comes back as
`7.5`, because trailing zeros aren't part of a number's value. Formatting money
is a display job, and it happens later.

Second, brace yourself for the average. Twelve prices don't divide evenly, so
`AVG` hands you the honest, unrounded truth:
`4.791666666666667`. That long tail is real arithmetic, not a bug — and in a
few lessons `ROUND` will let you trim it to something a human wants to read.
For now, leave it exactly as SQL gives it to you.

### Your goal

Summarise the whole table in one row: how many items the bakery sold, the
average unit price, and the cheapest and priciest things on the menu.

```
items_sold | avg_price | cheapest | priciest
--------------------------------------------
102 | 4.791666666666667 | 2.75 | 7.5
```

Aliases matter — `items_sold`, `avg_price`, `cheapest`, `priciest`, in that
order.
