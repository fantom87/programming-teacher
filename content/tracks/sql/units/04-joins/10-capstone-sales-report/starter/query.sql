-- Rivertown Books — the sales report. Four statements, four result sets.
-- Build them one at a time and run after each; every number must be
-- computed from the tables, never typed in.

-- Part 1 — the headline. One row: orders, copies, revenue.
--   orders  = COUNT(DISTINCT o.id)   (the guest checkout counts too)
--   copies  = SUM(oi.quantity)
--   revenue = printf('%.2f', SUM(b.price * oi.quantity))


-- Part 2 — by category: category, copies, revenue.
--   Every category appears, including the one that has sold nothing (0 and
--   0.00, not a missing row). Order by revenue descending, then category.


-- Part 3 — by customer: customer, orders, spent.
--   Every customer appears, including the one who has never ordered.
--   Order by amount spent descending, then customer.


-- Part 4 — shelf-warmers: title, category of every book no order has
--   ever included. Order by title.

