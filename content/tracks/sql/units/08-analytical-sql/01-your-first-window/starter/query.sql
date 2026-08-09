-- Every sale, with the company total and its own region's total beside it.
-- TODO: add two window columns to this SELECT.
--   company_total: SUM(revenue) over the whole table
--   region_total:  SUM(revenue) over just this row's region
SELECT
  id,
  region,
  revenue
FROM sales
ORDER BY region, id;
