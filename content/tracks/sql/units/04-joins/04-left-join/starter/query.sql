-- 1. Every customer beside every order date they have — including the
--    customer who has none, whose date comes out NULL.
--    Columns: c.name, o.order_date. Order by name, then order_date.


-- 2. One row per customer with their order count (column name order_count).
--    The customer with no orders must show 0, not 1.
--    Order by order_count descending, then name.

