-- Split the quarter's sales into four equal-sized revenue buckets.
-- TODO: add quartile — NTILE(4) over the sales ordered from biggest revenue
-- to smallest. Give the window a tie-breaker so the split is reproducible.
SELECT
  id,
  customer,
  revenue
FROM sales
ORDER BY revenue DESC, id;
