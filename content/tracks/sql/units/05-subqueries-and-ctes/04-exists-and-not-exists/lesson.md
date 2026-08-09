---
id: 04-exists-and-not-exists
title: EXISTS and NOT EXISTS
language: sql
runner: browser
estMinutes: 15
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Write two correlated existence tests: the customers who have ordered at least one dark roast (EXISTS over a join of orders and coffees), then the customers who have never ordered anything (NOT EXISTS) — both sorted by name."
docs: [sql/subqueries, sql/joins]
checks:
  - id: dark-drinkers-then-dormant
    type: stdout
    entry: query.sql
    match: exact
    value: "name | city\n-----------\nMarisol Vega | Portland\nNadia Okafor | Portland\nTheo Brandt | Seattle\n\nname | city\n-----------\nIvan Petrov | Boise\nOwen Hale | Portland\n"
  - id: exists-not-in
    type: ai-judge
    rubric: "The first query uses EXISTS and the second uses NOT EXISTS. Both subqueries are correlated — each has a condition linking orders back to the outer customer row, such as o.customer_id = c.id — rather than being self-contained IN or NOT IN lists. The dark-roast test reaches the roast column by joining coffees inside the subquery (or with a nested subquery on coffee_id), not by hardcoding coffee ids. Neither query enumerates customer names literally, and both end with ORDER BY name."
hints:
  - "EXISTS takes a whole subquery and answers yes or no: WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id). The SELECT 1 is a convention — nothing is read from it."
  - "For the dark-roast test, put a join inside the subquery: SELECT 1 FROM orders o JOIN coffees k ON k.id = o.coffee_id WHERE o.customer_id = c.id AND k.roast = 'dark'."
  - "Question two is the same subquery as the first hint with NOT in front: WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)."
---
## Asking a yes-or-no question

`IN` compares a value against a list. Sometimes you do not care about any
value at all — you just want to know whether a matching row *is out
there*. That is `EXISTS`:

```sql
SELECT name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
```

The subquery is correlated, exactly like the previous lesson: `c.id`
means *this customer*. `EXISTS` runs it and reports one bit — did it
produce at least one row? The columns inside are irrelevant, which is why
the convention is `SELECT 1`. You could write `SELECT *` or
`SELECT 'anything'` and get identical results; SQLite stops looking the
moment it finds a single match.

Put `NOT` in front and you have the cleanest way in SQL to ask *what has
no match*:

```sql
SELECT name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
```

Customers who have never ordered. Compare that with `NOT IN`, which does
the same job right up until a `NULL` sneaks into the list and silently
empties your result. `NOT EXISTS` has no such failure mode: a row either
matched or it did not. When you are hunting for missing things, reach for
`NOT EXISTS` first and you will never get bitten.

The subquery is a full query, so it can join, filter, and nest as much as
the question needs:

```sql
WHERE EXISTS (
  SELECT 1 FROM orders o
  JOIN coffees k ON k.id = o.coffee_id
  WHERE o.customer_id = c.id AND k.roast = 'dark'
)
```

*Has this customer ever bought a dark roast?* — one condition tying the
subquery to the outer row, one condition describing what counts.

### Your goal

Two statements, in this order:

```
name | city
-----------
Marisol Vega | Portland
Nadia Okafor | Portland
Theo Brandt | Seattle

name | city
-----------
Ivan Petrov | Boise
Owen Hale | Portland
```

First the dark-roast drinkers, then the customers who never ordered.
