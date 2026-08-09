---
id: 05-derived-tables
title: Derived Tables
language: sql
runner: browser
estMinutes: 15
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Wrap a GROUP BY of bags per customer in a FROM clause as a derived table named totals, then filter that result down to customers with 5 bags or more, sorted by bags_total descending then name."
docs: [sql/subqueries, sql/group-by-and-having]
checks:
  - id: five-bags-or-more
    type: stdout
    entry: query.sql
    match: exact
    value: "name | bags_total\n-----------------\nGrace Lin | 7\nTheo Brandt | 7\nNadia Okafor | 5\n"
  - id: filters-a-derived-table
    type: ai-judge
    rubric: "The FROM clause contains a parenthesised SELECT with its own GROUP BY, given an alias (totals or similar), and the outer query filters on the derived column with WHERE bags_total >= 5 — not with HAVING inside the inner query and not against a re-computed SUM. Totals come from SUM(o.bags) over a join of customers and orders; no bag counts are typed as literals. The outer query ends with ORDER BY bags_total DESC, name."
hints:
  - "A subquery in FROM behaves like a table, and it must be named: FROM ( SELECT ... ) AS totals."
  - "Once it is named, the outer query only sees its output columns — so WHERE bags_total >= 5 works even though bags_total is an alias for SUM(o.bags)."
  - "Shape: SELECT name, bags_total FROM (SELECT c.name AS name, SUM(o.bags) AS bags_total FROM customers c JOIN orders o ON o.customer_id = c.id GROUP BY c.name) AS totals WHERE bags_total >= 5 ORDER BY bags_total DESC, name;"
---
## A subquery that acts like a table

So far your subqueries have produced *values* — a number for `WHERE`, a
column for `IN`, a yes or no for `EXISTS`. A subquery can also produce a
whole **table**, and then you can query that:

```sql
SELECT name, bags_total
FROM (
  SELECT c.name AS name, SUM(o.bags) AS bags_total
  FROM customers c
  JOIN orders o ON o.customer_id = c.id
  GROUP BY c.name
) AS totals
WHERE bags_total >= 5;
```

That parenthesised block in `FROM` is a **derived table**. It runs first,
produces a small two-column result — one row per customer — and the outer
query treats it exactly like a table called `totals`. The alias is not
optional: an unnamed table is unaddressable, and SQL says no.

The reason to do this is stacking. `WHERE` cannot see `SUM(o.bags)`
because `WHERE` runs before grouping; `HAVING` can, but only inside the
same query. Once the group-by finishes and its result becomes a table,
`bags_total` is just an ordinary column, and every tool you own works on
it again — `WHERE`, `ORDER BY`, another join, even another derived table.
That is the real pattern: **summarize, then treat the summary as data.**

Two things to notice. The alias `AS bags_total` inside is what gives the
outer query a column name to grab; without it you would be filtering on
something called `SUM(o.bags)`. And the outer query only sees what the
inner one selected — `c.city` is invisible out here unless the inner
query passes it up.

The downside shows up fast. Nest a derived table inside a derived table
inside a third and you get a query you read inside-out, with the most
important line buried deepest. That problem has a name and a fix, and the
fix is the next lesson.

### Your goal

Customers who have taken home five bags or more:

```
name | bags_total
-----------------
Grace Lin | 7
Theo Brandt | 7
Nadia Okafor | 5
```

Ties are broken by name, so the `ORDER BY` needs both columns.
