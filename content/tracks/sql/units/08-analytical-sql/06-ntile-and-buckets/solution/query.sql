-- Split the quarter's sales into four equal-sized revenue buckets.
SELECT
  id,
  customer,
  revenue,
  NTILE(4) OVER (ORDER BY revenue DESC, id) AS quartile
FROM sales
ORDER BY revenue DESC, id;
