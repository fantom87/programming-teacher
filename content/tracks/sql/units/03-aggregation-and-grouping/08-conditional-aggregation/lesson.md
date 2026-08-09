---
id: 08-conditional-aggregation
title: Conditional Aggregation
language: sql
runner: browser
estMinutes: 16
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Put CASE inside your aggregates to turn the channel column into two side-by-side columns of quantities, and count the unrated sales per category — all without a single WHERE clause."
docs: [sql/group-by-and-having, sql/aggregate-functions]
checks:
  - id: channel-columns
    type: stdout
    entry: query.sql
    match: exact
    value: "category | counter_items | online_items | unrated\n-------------------------------------------------\nbread | 20 | 3 | 2\ndrink | 34 | 5 | 1\npastry | 27 | 13 | 1\n"
  - id: case-inside-the-aggregates
    type: ai-judge
    rubric: "One SELECT over sales, grouped by category only, with no WHERE clause. counter_items and online_items are SUM(CASE WHEN channel = ... THEN qty ELSE 0 END) expressions, and unrated is a COUNT over a CASE (or an equivalent SUM of a 1/0 CASE) testing rating IS NULL. The three channel/rating splits are not produced by separate queries, subqueries, or UNION, and no quantities are typed as literals."
hints:
  - "The pattern is SUM(CASE WHEN <condition> THEN <value> ELSE 0 END). Rows that fail the condition contribute zero, so they're present but harmless."
  - "Two channel columns means two CASE expressions in the same SELECT list, differing only in which channel they test. Each one sums qty, not 1."
  - "For unrated, COUNT(CASE WHEN rating IS NULL THEN 1 END) works because there's no ELSE — non-matching rows evaluate to NULL, and COUNT skips NULLs."
---
## A filter that fits inside an aggregate

Last lesson's grouped report split the bakery by category *and* channel, one
row per pair. Readable, but the shape is awkward: comparing counter to online
means hopping between rows. What you actually want is both numbers on the same
line, side by side.

You can't do that with `WHERE`. A `WHERE` clause filters the rows every
aggregate in the query sees — one filter, one query, no room for a column that
counts something different. So put the condition **inside** the aggregate
instead:

```sql
SUM(CASE WHEN channel = 'counter' THEN qty ELSE 0 END) AS counter_items
```

Read it row by row. `CASE` is evaluated once per row: counter sales hand `SUM`
their quantity, everything else hands it `0`. Zeros don't move a total, so the
online rows are physically present and mathematically invisible. Write a second
copy testing `'online'` and you have two independent sums over the same pass of
data. This is conditional aggregation, and it's how one query answers several
questions at once — one column per question.

`COUNT` plays the same game with a shortcut. Drop the `ELSE` and non-matching
rows evaluate to `NULL`, which `COUNT` already ignores:

```sql
COUNT(CASE WHEN rating IS NULL THEN 1 END) AS unrated
```

The `1` is arbitrary — `COUNT` only cares that *something* is there. Some
people prefer `SUM(CASE WHEN ... THEN 1 ELSE 0 END)` for symmetry; both are
fine, but never write `COUNT(CASE WHEN ... THEN 1 ELSE 0 END)`, because that
zero is a value and gets counted, giving you the row count every time.

Turning rows into columns like this is called pivoting, and you'll meet it
again for real in the analytics unit.

### Your goal

One row per category — no `WHERE` anywhere — with the counter quantity, the
online quantity, and how many of that category's sales went unrated. Sorted by
category.

```
category | counter_items | online_items | unrated
-------------------------------------------------
bread | 20 | 3 | 2
drink | 34 | 5 | 1
pastry | 27 | 13 | 1
```
