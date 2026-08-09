-- Step 1 is done for you: one row per order, priced out.
-- Run it to see what the pipeline starts with.
--
-- TODO: add two more CTEs after line_totals, separated by commas —
--   by_customer:  customer_id and ROUND(SUM(revenue), 2) AS revenue,
--                 grouped by customer_id
--   top_spenders: by_customer joined to customers for the name,
--                 keeping only revenue >= 90
-- Then finish with a main query over top_spenders, sorted by
-- revenue DESC, then name.

WITH line_totals AS (
  SELECT o.customer_id AS customer_id, o.bags * k.price AS revenue
  FROM orders o
  JOIN coffees k ON k.id = o.coffee_id
)
SELECT customer_id, revenue
FROM line_totals
ORDER BY customer_id, revenue;
