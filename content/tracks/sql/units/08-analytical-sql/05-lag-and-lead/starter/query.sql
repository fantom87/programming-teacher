-- Each sale compared with its neighbours inside the same region.
-- TODO: add prev_sale (LAG), next_sale (LEAD) and change (revenue minus the
-- previous sale). Every window partitions by region and orders by sold_on,
-- so the comparison never leaks across regions.
SELECT
  sold_on,
  region,
  revenue
FROM sales
ORDER BY region, sold_on;
