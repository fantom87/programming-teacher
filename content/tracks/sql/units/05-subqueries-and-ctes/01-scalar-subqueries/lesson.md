---
id: 01-scalar-subqueries
title: Scalar Subqueries
language: sql
runner: browser
estMinutes: 12
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "List the coffees priced above the roastery average, priciest first, with that average shown in an avg_price column — one scalar subquery in WHERE, another in the SELECT list, and no threshold typed by hand."
docs: [sql/subqueries, sql/aggregate-functions]
checks:
  - id: above-average-coffees
    type: stdout
    entry: query.sql
    match: exact
    value: "name | price | avg_price\n------------------------\nQuiet Hours | 20.95 | 16.25\nCloud Ladder | 18.91 | 16.25\nMorning Anthem | 17.43 | 16.25\nNight Shift | 16.35 | 16.25\n"
  - id: average-is-computed
    type: ai-judge
    rubric: "Both the WHERE threshold and the avg_price column come from a scalar subquery over the coffees table — something of the form (SELECT AVG(price) FROM coffees). The literal 16.25 (or any other hand-computed average) does not appear anywhere in query.sql, and the row list is not hardcoded with a WHERE name IN (...) or similar. The query ends with ORDER BY price DESC."
hints:
  - "A subquery is just a query in parentheses used where a value goes: WHERE price > (SELECT AVG(price) FROM coffees)."
  - "The same parenthesised query works in the SELECT list too. Wrap it for display: ROUND((SELECT AVG(price) FROM coffees), 2) AS avg_price."
  - "Full shape: SELECT name, price, ROUND((SELECT AVG(price) FROM coffees), 2) AS avg_price FROM coffees WHERE price > (SELECT AVG(price) FROM coffees) ORDER BY price DESC;"
---
## The query inside the query

You can ask for an average:

```sql
SELECT AVG(price) FROM coffees;
```

and you can filter:

```sql
SELECT name FROM coffees WHERE price > 16.25;
```

What you cannot do is glue them together. `WHERE price > AVG(price)` is an
error — `WHERE` decides row by row, long before any aggregate has been
computed. So run the average as its own small query and drop the answer
into place:

```sql
SELECT name, price
FROM coffees
WHERE price > (SELECT AVG(price) FROM coffees);
```

Those parentheses hold a **scalar subquery**: a query that returns exactly
one row and one column, which means one value. SQLite runs it, gets
`16.25`, and the outer query compares against that. Notice what you did
*not* do — type `16.25`. Add a coffee tomorrow and the threshold moves on
its own. A hardcoded number would quietly go stale; a subquery never does.

A scalar subquery fits anywhere a value fits, including the `SELECT` list:

```sql
SELECT name, (SELECT COUNT(*) FROM orders) AS total_orders
FROM coffees;
```

Every row carries the same computed number — useful when you want a
headline figure sitting beside each detail row.

One rule keeps this honest: *exactly one value*. If the inner query
returns several rows, SQLite hands you whichever one came out first, and
"first" is not something you get to assume. Which is the habit to start
building right now: **finish every query with `ORDER BY`**. Without it,
row order is undefined — your output can look perfect today and shuffle
tomorrow for no visible reason. Every query in this unit sorts.

### Your goal

Show the coffees priced above the roastery average, most expensive first,
with the average beside each row:

```
name | price | avg_price
------------------------
Quiet Hours | 20.95 | 16.25
Cloud Ladder | 18.91 | 16.25
Morning Anthem | 17.43 | 16.25
Night Shift | 16.35 | 16.25
```

Two subqueries, no typed numbers. `ROUND(..., 2)` keeps `avg_price` tidy.
