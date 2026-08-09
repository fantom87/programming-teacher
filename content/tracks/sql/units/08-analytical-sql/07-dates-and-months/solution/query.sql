-- One row per calendar month of the quarter.
SELECT
  strftime('%Y-%m', sold_on) AS month,
  COUNT(*)                   AS orders,
  SUM(revenue)               AS revenue,
  CAST(julianday(MAX(sold_on)) - julianday(MIN(sold_on)) AS INTEGER) AS days_span
FROM sales
GROUP BY month
ORDER BY month;
