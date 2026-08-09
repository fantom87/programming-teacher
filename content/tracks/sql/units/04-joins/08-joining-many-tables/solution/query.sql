-- 1. Five tables, one row per line item.
SELECT c.name AS customer, b.title, cat.name AS category,
       printf('%.2f', b.price * oi.quantity) AS line_total
FROM orders AS o
JOIN customers AS c ON c.id = o.customer_id
JOIN order_items AS oi ON oi.order_id = o.id
JOIN books AS b ON b.id = oi.book_id
JOIN categories AS cat ON cat.id = b.category_id
ORDER BY o.id, b.title;

-- 2. Widen the customer link and the guest order comes back.
SELECT c.name AS customer, b.title,
       printf('%.2f', b.price * oi.quantity) AS line_total
FROM orders AS o
LEFT JOIN customers AS c ON c.id = o.customer_id
JOIN order_items AS oi ON oi.order_id = o.id
JOIN books AS b ON b.id = oi.book_id
ORDER BY o.id, b.title;
