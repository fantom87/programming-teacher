---
id: 10-join-subquery-or-cte
title: "Join, Subquery, or CTE?"
language: sql
runner: browser
estMinutes: 22
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Answer three questions with the tool each one deserves: a join for the May orders that need columns from three tables, a NOT EXISTS subquery for the customers with no orders, and a two-step CTE pipeline for revenue per origin."
docs: [sql/ctes, sql/subqueries, sql/joins]
checks:
  - id: three-questions-three-tools
    type: stdout
    entry: query.sql
    match: exact
    value: "customer | coffee | bags\n------------------------\nNadia Okafor | Quiet Hours | 1\nTheo Brandt | Morning Anthem | 2\n\nname | city\n-----------\nIvan Petrov | Boise\nOwen Hale | Portland\n\norigin | revenue\n----------------\nEthiopia | 139.44\nKenya | 62.85\nColombia | 61.16\nBrazil | 51.12\n"
  - id: right-tool-each-time
    type: ai-judge
    rubric: "Statement one is a join: orders joined to customers and to coffees, selecting c.name AS customer and k.name AS coffee alongside o.bags, filtered on ordered_on and ordered by o.id — it does not fetch the names with scalar subqueries in the SELECT list. Statement two uses NOT EXISTS with a correlated subquery on orders, not a join or NOT IN. Statement three uses a WITH block of two or more chained CTEs — one pricing each order line with its origin, one grouping to ROUND(SUM(...), 2) per origin — with the filter and ORDER BY in the final SELECT; it is not written as nested derived tables in FROM. No customer names, origins, or revenue figures appear as literals in the output columns."
hints:
  - "Part 1: two joins hang off orders — JOIN customers c ON c.id = o.customer_id and JOIN coffees k ON k.id = o.coffee_id. Alias the two name columns so the headers read customer and coffee."
  - "Part 2 needs nothing from orders except the answer to \"is there one?\", so no join belongs here: WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)."
  - "Part 3: WITH line_totals AS (SELECT k.origin AS origin, o.bags * k.price AS revenue FROM orders o JOIN coffees k ON k.id = o.coffee_id), by_origin AS (SELECT origin, ROUND(SUM(revenue), 2) AS revenue FROM line_totals GROUP BY origin) SELECT origin, revenue FROM by_origin WHERE revenue >= 50 ORDER BY revenue DESC, origin;"
---
## Same data, three shapes

You now own three ways to bring a second table into a query, and they
overlap enough that "which one" feels arbitrary. It is not. Ask what the
question actually needs.

**Reach for a join when you need columns from both sides.** An order is
not useful as `customer_id 2`; you want the name next to the coffee next
to the bags. A join is the only tool that widens a row, and any attempt
to fake it with scalar subqueries in the `SELECT` list is slower and
uglier.

**Reach for a subquery when the other table only settles a yes or no.**
"Customers who never ordered" needs nothing *from* `orders` — no column
appears in the output. `NOT EXISTS` says exactly that and stops looking
at the first match. Do it with a join and you are stuck with `LEFT JOIN
... WHERE o.id IS NULL`, which works but says what it means far less
plainly, and duplicates rows the moment a customer has several orders.

**Reach for a CTE when the answer takes more than one step.** Revenue per
origin is really two thoughts — price each line, then total by origin —
and a pipeline of named steps lets you write, run, and check them one at
a time. The moment a query stops fitting in your head, that is the signal.

None of this is a rule you will be graded on later; the shapes just have
different strengths, and the fluent move is picking the one that makes
the query *read* like the question. When two look equally good, prefer
the one you would rather explain to someone at a whiteboard.

### Your goal

Three statements, one per tool, in this order:

```
customer | coffee | bags
------------------------
Nadia Okafor | Quiet Hours | 1
Theo Brandt | Morning Anthem | 2

name | city
-----------
Ivan Petrov | Boise
Owen Hale | Portland

origin | revenue
----------------
Ethiopia | 139.44
Kenya | 62.85
Colombia | 61.16
Brazil | 51.12
```

**Part 1 — join.** Orders from `2026-05-01` onward with the customer and
coffee names, `ORDER BY o.id`.

**Part 2 — subquery.** Customers with no orders, via `NOT EXISTS`,
`ORDER BY name`.

**Part 3 — CTEs.** `line_totals` prices each order line with its origin,
`by_origin` totals and rounds, the final query keeps `revenue >= 50` and
sorts by revenue descending, then origin.

An AI reviewer checks that each part used its intended tool — matching
output alone will not pass this one.
