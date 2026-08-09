-- Revenue to date after every sale of the quarter.
-- TODO: add running_total — SUM(revenue) over a window ordered by sold_on,
-- framed from the first row of the window through the current row.
SELECT
  sold_on,
  revenue
FROM sales
ORDER BY sold_on;
