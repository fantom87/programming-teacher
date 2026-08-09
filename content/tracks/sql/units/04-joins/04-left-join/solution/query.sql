-- 1. Every customer, matched or not.
SELECT c.name, o.order_date
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
ORDER BY c.name, o.order_date;

-- 2. Order count per customer — COUNT(o.id) counts matches, not rows.
SELECT c.name, COUNT(o.id) AS order_count
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY order_count DESC, c.name;
