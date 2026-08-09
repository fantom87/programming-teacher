-- 1. Both sides, unmatched rows included.
SELECT c.name, o.id AS order_id
FROM customers AS c
FULL OUTER JOIN orders AS o ON o.customer_id = c.id
ORDER BY c.name, o.id;

-- 2. The same answer with LEFT JOIN plus the leftovers from the right side.
SELECT c.name, o.id AS order_id
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
UNION ALL
SELECT c.name, o.id
FROM orders AS o
LEFT JOIN customers AS c ON c.id = o.customer_id
WHERE c.id IS NULL
ORDER BY name, order_id;
