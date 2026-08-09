-- 1. Read the junction from the order side: what was in each order?
SELECT o.id AS order_id, b.title, oi.quantity
FROM orders AS o
JOIN order_items AS oi ON oi.order_id = o.id
JOIN books AS b ON b.id = oi.book_id
ORDER BY o.id, b.title;

-- 2. The same links read from the book side: which orders wanted this book?
SELECT b.title, oi.order_id
FROM books AS b
JOIN order_items AS oi ON oi.book_id = b.id
ORDER BY b.title, oi.order_id;
