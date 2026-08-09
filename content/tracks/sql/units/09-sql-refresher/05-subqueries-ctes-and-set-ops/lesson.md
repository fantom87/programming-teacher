---
id: 05-subqueries-ctes-and-set-ops
title: Subqueries, CTEs and Set Ops
language: sql
runner: browser
estMinutes: 18
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Four nesting drills: a scalar subquery comparing each price to the catalog average, a NOT EXISTS anti-join, a two-step CTE pipeline that totals spend per customer, and EXCEPT for the albums nobody ever bought."
docs: [sql/subqueries, sql/ctes, sql/joins]
checks:
  - id: nesting-output
    type: stdout
    entry: query.sql
    match: exact
    value: "title | price | vs_avg\n----------------------\nBleu Nuit | 34.75 | +8.27\nLong Winter | 31.25 | +4.77\nSlow Tide | 28.75 | +2.27\nNocturne | 26.95 | +0.47\nPaper Lantern | 23.95 | -2.53\nVerre | 21.45 | -5.03\nAsh & Ivory | 18.25 | -8.23\n\nname\n----\nWes Fontaine\n\nname | spent\n------------\nDara Okon | 113.15\nInes Duarte | 81.45\nPriya Raman | 81.45\nTomas Beck | 69.50\n\nid | title\n----------\n6 | Nocturne\n"
  - id: right-tool-per-shape
    type: ai-judge
    rubric: "Query 1 computes the catalog average with a scalar subquery embedded in the SELECT list — (SELECT AVG(price) FROM albums) — not a typed-in average and not a join. Query 2 uses NOT EXISTS with a correlated inner query referencing the outer customer row (o.customer_id = c.id), not NOT IN and not a LEFT JOIN. Query 3 defines at least two chained CTEs in one WITH clause, the second selecting FROM the first, with the aggregation done inside a CTE rather than in a subquery in FROM or a repeated join. Query 4 uses the EXCEPT set operator between two SELECTs of matching arity; NOT IN, NOT EXISTS and LEFT JOIN ... IS NULL do not count here. No result rows are hardcoded."
hints:
  - "A subquery returning exactly one row and one column is a value: SELECT title, price - (SELECT AVG(price) FROM albums) AS vs_avg FROM albums. Wrap it in printf('%+.2f', ...) for the sign and the decimals."
  - "NOT EXISTS correlates on the outer row: WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id). What the inner SELECT lists is irrelevant — only whether it finds a row."
  - "Chain the CTEs: WITH lines AS (join order_items to orders and albums, projecting qty * price AS amount), totals AS (SELECT customer_id, SUM(amount) AS spent FROM lines GROUP BY customer_id) SELECT ... FROM totals t JOIN customers c ON c.id = t.customer_id ORDER BY t.spent DESC, c.name. Sort on the number, not the printf'd text."
---
## Four shapes, four tools

Nested queries all look alike on the page and behave nothing alike.
Knowing which shape you are holding is most of the skill.

**Scalar subquery** — one row, one column, used as a value. It can sit
in `SELECT`, `WHERE`, almost anywhere a literal could. Uncorrelated ones
like `(SELECT AVG(price) FROM albums)` are evaluated once, not per row.

**Correlated subquery** — references the outer row, so it is
conceptually evaluated per row. `EXISTS` is the correlated form worth
reaching for: it stops at the first match, ignores what you `SELECT`
inside it, and — unlike `NOT IN` — behaves sanely when the inner query
can produce `NULL`. `NOT IN (…, NULL)` is never TRUE, so it returns
nothing at all. That bug is silent, and it has cost people weekends.

**Derived table / CTE** — a query used as a row source. `WITH` names it,
so a three-step transformation reads top to bottom instead of
inside-out, and each step can be run on its own while you debug. CTEs
chain: the second can select from the first.

**Set operators** — `UNION` (de-duplicates), `UNION ALL` (does not, and
is cheaper), `INTERSECT`, `EXCEPT`. They compare whole rows, so both
sides need the same column count and compatible types. `EXCEPT` states
"in the first set, not the second" more plainly than any anti-join.

One `ORDER BY` at the end governs the whole compound statement.

### Your goal

Four queries in `query.sql`, in this order:

1. `title`, `price`, `vs_avg` — each price minus the catalog average,
   signed, two decimals, dearest first.
2. The `name` of every customer who has never ordered — `NOT EXISTS`.
3. A two-CTE pipeline: line amounts, then per-customer totals. Output
   `name` and `spent`, biggest first, ties broken by name (two customers
   really do land on the same total).
4. `id` and `title` of every album nobody ever bought — as `EXCEPT`.

```
title | price | vs_avg
----------------------
Bleu Nuit | 34.75 | +8.27
...

name
----
Wes Fontaine

name | spent
------------
Dara Okon | 113.15
Ines Duarte | 81.45
...

id | title
----------
6 | Nocturne
```
