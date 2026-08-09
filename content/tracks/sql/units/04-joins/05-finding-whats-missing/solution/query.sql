-- 1. Customers who have never ordered.
SELECT c.name
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
WHERE o.id IS NULL
ORDER BY c.name;

-- 2. Orders with no customer account behind them.
SELECT o.id, o.order_date
FROM orders AS o
LEFT JOIN customers AS c ON c.id = o.customer_id
WHERE c.id IS NULL
ORDER BY o.id;
