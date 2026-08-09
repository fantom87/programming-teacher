-- The Brazilian supplier is gone, so those coffees leave the shelf.
-- The staging table has been merged already and can be emptied.

-- 1. COUNT the rows your delete will hit. Call the column doomed.


-- 2. Same WHERE, now for real.


-- 3. Empty staging_deliveries — deliberately, with no WHERE.


-- 4. Verify: id, name, origin from coffees ordered by id, then a
--    COUNT(*) AS staged from staging_deliveries.
