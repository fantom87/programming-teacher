-- Each sale next to the average of itself and the two sales before it.
-- TODO: add avg_3 — AVG(revenue) over a window ordered by sold_on with a
-- three-row sliding frame, rounded to 2 decimal places.
SELECT
  sold_on,
  revenue
FROM sales
ORDER BY sold_on;
