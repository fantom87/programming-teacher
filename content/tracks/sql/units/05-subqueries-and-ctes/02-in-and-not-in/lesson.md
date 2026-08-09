---
id: 02-in-and-not-in
title: IN and NOT IN
language: sql
runner: browser
estMinutes: 12
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Write two queries: the customers who have ordered at least once (IN a subquery of customer ids), then the coffees nobody has ever ordered (NOT IN a subquery of coffee ids) — both sorted by name."
docs: [sql/subqueries, sql/filtering-with-where]
checks:
  - id: buyers-then-unsold
    type: stdout
    entry: query.sql
    match: exact
    value: "name\n----\nGrace Lin\nMarisol Vega\nNadia Okafor\nTheo Brandt\n\nname | origin\n-------------\nCloud Ladder | Ethiopia\nPaper Moon | Colombia\n"
  - id: membership-via-subquery
    type: ai-judge
    rubric: "The first query uses IN with a subquery selecting customer_id from orders; the second uses NOT IN with a subquery selecting coffee_id from orders. Neither one lists ids or names literally (no IN (1, 2, 3) and no WHERE name = '...' enumerations), and both end with ORDER BY name."
hints:
  - "Replace a hand-typed list with a query: WHERE id IN (SELECT customer_id FROM orders). The subquery returns one column, as many rows as it likes."
  - "The mirror question uses the same shape with NOT: WHERE id NOT IN (SELECT coffee_id FROM orders) — coffees whose id never shows up in that column."
  - "Keep both statements in query.sql, each ending in a semicolon and its own ORDER BY name. Two SELECTs means two result sets, printed in order with a blank line between."
---
## A list you didn't have to type

You have met `IN` with a list you wrote yourself:

```sql
SELECT name FROM coffees WHERE origin IN ('Kenya', 'Brazil');
```

Swap the literal list for a subquery and the list writes itself:

```sql
SELECT name FROM customers
WHERE id IN (SELECT customer_id FROM orders);
```

Read it out loud: *customers whose id appears in the column of customer
ids that `orders` produced.* The inner query returns **one column** and
any number of rows — that is the shape `IN` wants. (Last lesson's scalar
subquery was simply the one-row version of the same idea.)

Flip it to `NOT IN` and you get the far more interesting question — what
is **missing**:

```sql
SELECT name FROM coffees
WHERE id NOT IN (SELECT coffee_id FROM orders);
```

Coffees the roastery has never sold a single bag of. "Which rows have no
match anywhere?" is awkward with a join and obvious with a subquery.

Now the trap, and it catches everyone exactly once. If that inner column
contains even one `NULL`, `NOT IN` returns **no rows at all** — no error,
no warning, just an empty result. The culprit is three-valued logic:
`id NOT IN (3, NULL)` asks "is id different from 3 *and* different from
NULL?", and "different from NULL" is never true, it is *unknown*. Unknown
is not true, so nothing survives the filter.

Two defences: strip the NULLs inside the subquery
(`WHERE coffee_id IS NOT NULL`), or use `NOT EXISTS`, which is immune —
two lessons from here. Our `orders.coffee_id` is declared `NOT NULL`, so
today you are safe. Check the schema before you trust `NOT IN` anywhere
else.

### Your goal

Two statements in `query.sql`, in this order:

```
name
----
Grace Lin
Marisol Vega
Nadia Okafor
Theo Brandt

name | origin
-------------
Cloud Ladder | Ethiopia
Paper Moon | Colombia
```

First the customers who have ordered, then the coffees nobody has.
