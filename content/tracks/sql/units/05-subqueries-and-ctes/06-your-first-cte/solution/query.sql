-- Name the per-customer totals once, then use that name twice.
WITH customer_bags AS (
  SELECT c.name AS name, SUM(o.bags) AS bags_total
  FROM customers c
  JOIN orders o ON o.customer_id = c.id
  GROUP BY c.name
)
SELECT name, bags_total
FROM customer_bags
WHERE bags_total > (SELECT AVG(bags_total) FROM customer_bags)
ORDER BY bags_total DESC, name;
