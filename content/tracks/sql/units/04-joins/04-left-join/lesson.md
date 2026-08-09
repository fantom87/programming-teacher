---
id: 04-left-join
title: LEFT JOIN
language: sql
runner: browser
estMinutes: 14
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Keep every customer with a LEFT JOIN — Priya included, with a NULL order date — then count each customer's orders with COUNT(o.id) so her zero stays a zero."
docs: [sql/joins, sql/aggregate-functions, sql/group-by-and-having]
checks:
  - id: everyone-stays
    type: stdout
    entry: query.sql
    match: exact
    value: "name | order_date\n-----------------\nDevon | 2026-03-05\nDevon | 2026-03-19\nInes | 2026-03-14\nMara | 2026-03-02\nMara | 2026-03-11\nMara | 2026-04-01\nPriya | NULL\nTom | 2026-03-22\n\nname | order_count\n------------------\nMara | 3\nDevon | 2\nInes | 1\nTom | 1\nPriya | 0\n"
  - id: left-join-and-counted-matches
    type: ai-judge
    rubric: "Both statements start FROM customers and reach orders with a LEFT JOIN (customers on the left), rather than an INNER JOIN plus a UNION of the missing row, or any hardcoded Priya row. The second statement counts with COUNT(o.id) — a column from the joined table — not COUNT(*), and groups by the customer."
hints:
  - "Change one word in the join you already know: INNER JOIN becomes LEFT JOIN. Everything left of it — every customer — survives, matched or not."
  - "For the second query, group by the customer: GROUP BY c.id, c.name, and order by the count descending then the name."
  - "COUNT(*) counts result rows, and Priya still has one — the placeholder the join produced — so it reports 1. COUNT(o.id) counts non-NULL values of a column that only has a value when a match was found, so it reports 0."
---
## Keeping the rows that didn't match

An inner join answers "which rows pair up?" That's the wrong question
for "how is every customer doing?" — because the customers doing worst
are the ones with nothing to pair with, and an inner join deletes them.

`LEFT JOIN` keeps them:

```sql
SELECT c.name, o.order_date
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
ORDER BY c.name, o.order_date;
```

*Left* means the table on the left of the join — the one in `FROM`.
Every one of its rows appears in the result. Rows that find partners
behave exactly as before, one output row per match. Rows that find none
appear once, with every column from the right-hand table filled in as
`NULL`. Priya has never ordered, so she comes out as `Priya | NULL`.

That NULL isn't a gap in your data — it's the join's report that nothing
matched. Which brings the classic trap. Count her orders:

```sql
SELECT c.name, COUNT(*) FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.id;   -- Priya: 1  ✗
```

`COUNT(*)` counts *rows*, and Priya has a row — the placeholder one. To
count *matches*, count a column that only has a value when a match
happened:

```sql
COUNT(o.id)   -- Priya: 0  ✓
```

Aggregates skip NULLs, so `COUNT(o.id)` counts real orders and nothing
else. `COUNT(*)` after a `LEFT JOIN` is one of the most common wrong
answers in SQL — a report where the customer who bought nothing looks
exactly like the customer who bought once. Whenever you count across a
left join, count the joined table's key.

### Your goal

Two statements, producing exactly:

```
name | order_date
-----------------
Devon | 2026-03-05
Devon | 2026-03-19
Ines | 2026-03-14
Mara | 2026-03-02
Mara | 2026-03-11
Mara | 2026-04-01
Priya | NULL
Tom | 2026-03-22

name | order_count
------------------
Mara | 3
Devon | 2
Ines | 1
Tom | 1
Priya | 0
```
