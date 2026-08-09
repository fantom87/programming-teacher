-- Customers who have taken home 5 bags or more.
SELECT name, bags_total
FROM (
  SELECT c.name AS name, SUM(o.bags) AS bags_total
  FROM customers c
  JOIN orders o ON o.customer_id = c.id
  GROUP BY c.name
) AS totals
WHERE bags_total >= 5
ORDER BY bags_total DESC, name;
