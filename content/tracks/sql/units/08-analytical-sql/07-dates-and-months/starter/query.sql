-- One row per calendar month of the quarter.
-- TODO: replace sold_on with a month column built by strftime, group by it,
-- and add orders (COUNT), revenue (SUM) and days_span — whole days between
-- the month's first and last sale, via julianday.
SELECT
  sold_on
FROM sales
ORDER BY sold_on;
