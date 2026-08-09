-- Part 1 — a JOIN: columns from three tables, side by side.
SELECT c.name AS customer, k.name AS coffee, o.bags
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN coffees k ON k.id = o.coffee_id
WHERE o.ordered_on >= '2026-05-01'
ORDER BY o.id;

-- Part 2 — a subquery: a yes/no membership test, nothing to display from orders.
SELECT name, city
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
)
ORDER BY name;

-- Part 3 — CTEs: a multi-step pipeline, each step named.
WITH line_totals AS (
  SELECT k.origin AS origin, o.bags * k.price AS revenue
  FROM orders o
  JOIN coffees k ON k.id = o.coffee_id
),
by_origin AS (
  SELECT origin, ROUND(SUM(revenue), 2) AS revenue
  FROM line_totals
  GROUP BY origin
)
SELECT origin, revenue
FROM by_origin
WHERE revenue >= 50
ORDER BY revenue DESC, origin;
