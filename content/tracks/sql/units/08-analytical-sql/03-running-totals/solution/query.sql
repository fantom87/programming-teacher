-- Revenue to date after every sale of the quarter.
SELECT
  sold_on,
  revenue,
  SUM(revenue) OVER (
    ORDER BY sold_on
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM sales
ORDER BY sold_on;
