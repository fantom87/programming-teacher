-- One row per roast, one column per month of the quarter.
-- TODO: turn the three months into three columns — jan, feb and mar — each a
-- SUM over a CASE that only counts revenue from that month. Then add total.
SELECT
  roast,
  SUM(revenue) AS revenue
FROM sales
GROUP BY roast
ORDER BY roast;
