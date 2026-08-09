-- 1. Five tables, one row per line item:
--      c.name AS customer, b.title, cat.name AS category,
--      printf('%.2f', b.price * oi.quantity) AS line_total
--    Chain orders -> customers, orders -> order_items -> books -> categories.
--    Order by the order id, then the title.


-- 2. Same chain, minus the category column, but the guest order's line
--    must appear too (customer NULL). Change one join, nothing else.

