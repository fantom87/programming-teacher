-- schema.sql just grew: categories, books, and order_items — the junction
-- table that pairs an order with a book (and records how many copies).

-- 1. Every line of every order: o.id AS order_id, b.title, oi.quantity.
--    Join orders -> order_items -> books. Order by order_id, then title.


-- 2. The same links from the book side: b.title, oi.order_id.
--    Order by title, then order_id.

