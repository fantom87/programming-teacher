---
id: 07-chaining-ctes
title: Chaining CTEs
language: sql
runner: browser
estMinutes: 18
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Build a three-step CTE pipeline — line_totals prices each order, by_customer sums per customer, top_spenders joins the name and keeps revenue of 90 or more — then select from the last step, highest revenue first."
docs: [sql/ctes, sql/joins]
checks:
  - id: top-spenders
    type: stdout
    entry: query.sql
    match: exact
    value: "name | revenue\n--------------\nTheo Brandt | 109.83\nGrace Lin | 103.41\n"
  - id: real-pipeline
    type: ai-judge
    rubric: "One statement defines three comma-separated CTEs in sequence: the first prices each order as bags * price by joining orders and coffees, the second groups the first by customer with ROUND(SUM(revenue), 2), and the third joins the second to customers for the name and filters revenue >= 90. Each CTE after the first reads from an earlier CTE rather than re-deriving the join from base tables, the final SELECT reads from the last CTE, and no revenue figures are typed as literals. Ends with ORDER BY revenue DESC, name."
hints:
  - "Extra CTEs are commas, not extra WITHs: WITH a AS ( ... ), b AS ( ... ), c AS ( ... ) SELECT ... FROM c."
  - "Each step reads the one before it. by_customer selects FROM line_totals — not from orders again: SELECT customer_id, ROUND(SUM(revenue), 2) AS revenue FROM line_totals GROUP BY customer_id."
  - "top_spenders joins by_customer b to customers c ON c.id = b.customer_id, selects c.name AS name and b.revenue, and filters WHERE b.revenue >= 90. Then the main query is just SELECT name, revenue FROM top_spenders ORDER BY revenue DESC, name."
---
## One query, several named steps

A `WITH` block is not limited to one CTE. Separate them with commas and
each may read the ones defined before it:

```sql
WITH line_totals AS (
  SELECT o.customer_id AS customer_id, o.bags * k.price AS revenue
  FROM orders o
  JOIN coffees k ON k.id = o.coffee_id
),
by_customer AS (
  SELECT customer_id, ROUND(SUM(revenue), 2) AS revenue
  FROM line_totals
  GROUP BY customer_id
)
SELECT * FROM by_customer;
```

Note the comma after the first closing parenthesis and the single `WITH`
at the top — that catches everyone the first time. Read the result as a
**pipeline**: price out each line, then total per customer. Each step is
small enough to hold in your head, and the names carry the meaning
between them.

This is how a genuinely hard query gets written. Instead of nesting three
subqueries and hoping, you add one step at a time. Better still, you can
*inspect* any step: swap the final `SELECT * FROM by_customer` for
`SELECT * FROM line_totals`, hit Run, and see exactly what stage one
produced. That debugging trick alone justifies the syntax.

There is one habit to be deliberate about. Rounding belongs at the end of
the arithmetic, not in the middle — `ROUND(SUM(revenue), 2)` rounds a
sum, while summing pre-rounded values quietly drifts. Money math is where
floating point makes fools of people, so `SUM` first, `ROUND` last.

Steps cost nothing but a name. If a step is worth explaining in a
comment, give it a CTE and let the name do the explaining.

### Your goal

Extend the pipeline to three steps — `line_totals`, `by_customer`,
`top_spenders` — and report the customers who have spent 90 dollars or
more:

```
name | revenue
--------------
Theo Brandt | 109.83
Grace Lin | 103.41
```

The final `SELECT` should read from `top_spenders` and do nothing but
sort.
