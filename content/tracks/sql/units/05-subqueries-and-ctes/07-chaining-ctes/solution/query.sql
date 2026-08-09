-- Three named steps: price out each order, total per customer, keep the big ones.
WITH line_totals AS (
  SELECT o.customer_id AS customer_id, o.bags * k.price AS revenue
  FROM orders o
  JOIN coffees k ON k.id = o.coffee_id
),
by_customer AS (
  SELECT customer_id, ROUND(SUM(revenue), 2) AS revenue
  FROM line_totals
  GROUP BY customer_id
),
top_spenders AS (
  SELECT c.name AS name, b.revenue AS revenue
  FROM by_customer b
  JOIN customers c ON c.id = b.customer_id
  WHERE b.revenue >= 90
)
SELECT name, revenue
FROM top_spenders
ORDER BY revenue DESC, name;
