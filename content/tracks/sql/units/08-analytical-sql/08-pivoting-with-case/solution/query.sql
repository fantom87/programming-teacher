-- One row per roast, one column per month of the quarter.
SELECT
  roast,
  SUM(CASE WHEN strftime('%Y-%m', sold_on) = '2026-01' THEN revenue ELSE 0 END) AS jan,
  SUM(CASE WHEN strftime('%Y-%m', sold_on) = '2026-02' THEN revenue ELSE 0 END) AS feb,
  SUM(CASE WHEN strftime('%Y-%m', sold_on) = '2026-03' THEN revenue ELSE 0 END) AS mar,
  SUM(revenue) AS total
FROM sales
GROUP BY roast
ORDER BY roast;
