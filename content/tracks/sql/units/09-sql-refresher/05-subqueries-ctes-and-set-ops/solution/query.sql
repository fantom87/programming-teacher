-- 1. Scalar subquery: each price against the catalog average
SELECT
  title,
  printf('%.2f',  price) AS price,
  printf('%+.2f', price - (SELECT AVG(price) FROM albums)) AS vs_avg
FROM albums
ORDER BY price DESC;

-- 2. NOT EXISTS: customers who have never ordered
SELECT c.name
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
)
ORDER BY c.name;

-- 3. CTE pipeline: line amounts, then per-customer totals
WITH lines AS (
  SELECT o.customer_id, oi.qty * a.price AS amount
  FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  JOIN albums a ON a.id = oi.album_id
),
totals AS (
  SELECT customer_id, SUM(amount) AS spent
  FROM lines
  GROUP BY customer_id
)
SELECT c.name, printf('%.2f', t.spent) AS spent
FROM totals t
JOIN customers c ON c.id = t.customer_id
ORDER BY t.spent DESC, c.name;

-- 4. Set difference: albums nobody has ever bought
SELECT id, title FROM albums
EXCEPT
SELECT a.id, a.title FROM albums a JOIN order_items oi ON oi.album_id = a.id
ORDER BY id;
