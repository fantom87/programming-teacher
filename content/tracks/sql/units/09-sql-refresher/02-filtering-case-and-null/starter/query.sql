-- Filtering, CASE and NULL logic. Three queries, in this order.

-- 1. title, year, price for albums released 2019..2022 by artist 1 or 2,
--    newest first, ties broken by title. Use BETWEEN and IN.


-- 2. name and country of every artist who is NOT a US artist —
--    and unknown counts as not-US. Sorted by name.


-- 3. title, year (the word "unknown" when it is missing) and a tier:
--    "premium" at 30 and up, "standard" at 24 and up, otherwise "budget".
--    Sorted by tier, then title.
