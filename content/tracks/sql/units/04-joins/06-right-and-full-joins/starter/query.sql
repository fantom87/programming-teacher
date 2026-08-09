-- Both queries must return the same nine rows: every customer and every
-- order, matched where possible. Columns: c.name, o.id AS order_id.

-- 1. The direct way: FULL OUTER JOIN. Order by name, then order_id.


-- 2. The portable way: a LEFT JOIN from customers, then UNION ALL the
--    orders that matched no customer (the anti-join from last lesson).
--    One ORDER BY at the very end covers the whole compound query.

