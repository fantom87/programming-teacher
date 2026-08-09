-- Part 1 — normalize every text column to the house format.
UPDATE imports
SET name   = TRIM(name),
    roast  = LOWER(TRIM(roast)),
    origin = UPPER(SUBSTR(TRIM(origin), 1, 1)) || LOWER(SUBSTR(TRIM(origin), 2));

-- Part 2 — backfill the missing prices from the house list. This needs
-- Part 1: 'DARK' would never have matched roast_prices.
UPDATE imports
SET price = (SELECT rp.price FROM roast_prices rp WHERE rp.roast = imports.roast)
WHERE price IS NULL;

-- Part 3 — one row per name: keep the lowest id, delete the rest.
DELETE FROM imports
WHERE id NOT IN (SELECT MIN(id) FROM imports GROUP BY name);

-- Part 4 — merge the clean rows into the shelf.
INSERT INTO coffees (name, origin, roast, price, bags)
SELECT name, origin, roast, price, bags FROM imports WHERE true
ON CONFLICT(name) DO UPDATE SET
  bags  = coffees.bags + excluded.bags,
  price = excluded.price;

-- Part 5 — the staging table has done its job.
DELETE FROM imports;

SELECT name, origin, roast, price, bags FROM coffees ORDER BY name;
SELECT COUNT(*) AS coffees, SUM(bags) AS bags_on_hand FROM coffees;
SELECT COUNT(*) AS leftover_imports FROM imports;
