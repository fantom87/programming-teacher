-- Each sale next to the average of itself and the two sales before it.
SELECT
  sold_on,
  revenue,
  ROUND(
    AVG(revenue) OVER (
      ORDER BY sold_on
      ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ),
    2
  ) AS avg_3
FROM sales
ORDER BY sold_on;
