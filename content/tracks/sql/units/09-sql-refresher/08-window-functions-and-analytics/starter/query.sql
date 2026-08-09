-- Window functions and analytical patterns. Three queries, in this order.

-- 1. artist, title, price (two decimals) and rank_in_catalog — each album's
--    position within its own artist's catalogue, dearest first.
--    Sorted by artist, then rank.


-- 2. Monthly revenue with a running total and the month-over-month change:
--    month ("YYYY-MM"), revenue, running, change.
--    change is signed to two decimals, or "n/a" for the first month.


-- 3. The best seller of each month: month, title, units.
--    Ties go to the alphabetically first title. Sorted by month.
