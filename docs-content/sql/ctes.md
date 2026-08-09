# CTEs (WITH)

A *common table expression* (CTE) names a subquery up front, so the main query reads like a sentence instead of a nest of parentheses.

## WITH: name a query, then use it

```sql
WITH big_orders AS (
  SELECT * FROM orders WHERE total > 100
)
SELECT customer_id, COUNT(*) AS big_order_count
FROM big_orders
GROUP BY customer_id;
```

`big_orders` behaves like a temporary table that exists only for this one statement. Compare that to cramming the same subquery into `FROM` — same result, far easier to read, and you can reference the name more than once.

## Chaining CTEs into a pipeline

Multiple CTEs, separated by commas, can each build on the previous ones. This turns a hairy query into named steps:

```sql
WITH monthly AS (
  SELECT strftime('%Y-%m', order_date) AS month,
         SUM(total) AS revenue
  FROM orders
  GROUP BY month
),
ranked AS (
  SELECT month, revenue
  FROM monthly
  ORDER BY revenue DESC
)
SELECT * FROM ranked LIMIT 3;   -- best three months
```

Read it top to bottom: summarize, then rank, then take three. Debugging is pleasant too — replace the final `SELECT` with `SELECT * FROM monthly` to inspect any intermediate step.

## Recursive CTEs

A CTE can reference *itself*, which lets SQL generate sequences and walk hierarchies:

```sql
WITH RECURSIVE numbers(n) AS (
  SELECT 1                          -- start
  UNION ALL
  SELECT n + 1 FROM numbers         -- step
  WHERE n < 10                      -- stop
)
SELECT n FROM numbers;              -- 1 through 10
```

The same shape climbs an employee → manager tree or a category tree: start with the root rows, repeatedly join children on, stop when nothing new appears.

## Join vs subquery vs CTE

All three overlap; a rough guide:

- **Join** — you need columns from both tables side by side.
- **Subquery** — a small, one-off value or membership test (`IN`, `EXISTS`).
- **CTE** — multi-step logic, anything you'd want to name, or anything used twice.

CTEs cost nothing to reach for. When a query stops fitting in your head, break it into `WITH` steps.
