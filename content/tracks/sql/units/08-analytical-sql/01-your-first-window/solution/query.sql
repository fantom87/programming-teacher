-- Every sale, with the company total and its own region's total beside it.
SELECT
  id,
  region,
  revenue,
  SUM(revenue) OVER ()                    AS company_total,
  SUM(revenue) OVER (PARTITION BY region) AS region_total
FROM sales
ORDER BY region, id;
