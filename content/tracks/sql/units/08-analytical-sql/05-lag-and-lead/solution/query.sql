-- Each sale compared with its neighbours inside the same region.
SELECT
  sold_on,
  region,
  revenue,
  LAG(revenue)  OVER (PARTITION BY region ORDER BY sold_on) AS prev_sale,
  LEAD(revenue) OVER (PARTITION BY region ORDER BY sold_on) AS next_sale,
  revenue - LAG(revenue) OVER (PARTITION BY region ORDER BY sold_on) AS change
FROM sales
ORDER BY region, sold_on;
