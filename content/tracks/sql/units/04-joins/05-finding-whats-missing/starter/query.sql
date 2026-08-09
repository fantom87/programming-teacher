-- The anti-join pattern: LEFT JOIN, then keep only the rows where the
-- right-hand side came back NULL.

-- 1. Customers who have never ordered. Select c.name, order by name.


-- 2. Orders with no customer account behind them (the guest checkout).
--    Select o.id, o.order_date, order by o.id.

