-- 1. Everyone the shop knows about.
SELECT id, name, city
FROM customers
ORDER BY id;

-- 2. Mara is id 1 — her orders live in the other table, found by that id.
SELECT id, customer_id, order_date
FROM orders
WHERE customer_id = 1
ORDER BY id;
