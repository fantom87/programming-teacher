-- Capstone: clean the overnight import, then merge it into the shelf.
-- Order matters — each part depends on the one before it.

-- Part 1 — normalize. One UPDATE over every row of imports: TRIM the
-- name, TRIM and lowercase the roast, and TRIM the origin into the
-- house style (first letter capital, rest lowercase).


-- Part 2 — backfill. Rows with a NULL price get the house price for
-- their roast, read from roast_prices. Only touch the NULL ones.


-- Part 3 — dedupe. The file contains the same coffee twice. Keep the
-- lowest id for each name and delete the rest.


-- Part 4 — merge. Upsert every cleaned import row into coffees: new
-- names get inserted, known names get their bags added and their price
-- refreshed. (Add WHERE true to the SELECT so SQLite can parse ON.)


-- Part 5 — clear the staging table, then verify:
--   a. name, origin, roast, price, bags from coffees ordered by name
--   b. COUNT(*) AS coffees and SUM(bags) AS bags_on_hand
--   c. COUNT(*) AS leftover_imports
