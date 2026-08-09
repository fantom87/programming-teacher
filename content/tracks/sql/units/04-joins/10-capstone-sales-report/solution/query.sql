-- Part 1: the headline — every order counts, guest checkout included.
SELECT COUNT(DISTINCT o.id) AS orders,
       SUM(oi.quantity) AS copies,
       printf('%.2f', SUM(b.price * oi.quantity)) AS revenue
FROM orders AS o
JOIN order_items AS oi ON oi.order_id = o.id
JOIN books AS b ON b.id = oi.book_id;

-- Part 2: every category, even the one that sold nothing.
SELECT cat.name AS category,
       COALESCE(SUM(oi.quantity), 0) AS copies,
       printf('%.2f', COALESCE(SUM(b.price * oi.quantity), 0)) AS revenue
FROM categories AS cat
LEFT JOIN books AS b ON b.category_id = cat.id
LEFT JOIN order_items AS oi ON oi.book_id = b.id
GROUP BY cat.id, cat.name
ORDER BY COALESCE(SUM(b.price * oi.quantity), 0) DESC, cat.name;

-- Part 3: every customer, even the one who never ordered.
SELECT c.name AS customer,
       COUNT(DISTINCT o.id) AS orders,
       printf('%.2f', COALESCE(SUM(b.price * oi.quantity), 0)) AS spent
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
LEFT JOIN order_items AS oi ON oi.order_id = o.id
LEFT JOIN books AS b ON b.id = oi.book_id
GROUP BY c.id, c.name
ORDER BY COALESCE(SUM(b.price * oi.quantity), 0) DESC, c.name;

-- Part 4: shelf-warmers — books no order has ever included.
SELECT b.title, cat.name AS category
FROM books AS b
JOIN categories AS cat ON cat.id = b.category_id
LEFT JOIN order_items AS oi ON oi.book_id = b.id
WHERE oi.book_id IS NULL
ORDER BY b.title;
