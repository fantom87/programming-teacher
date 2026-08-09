-- 1. RETURNING hands back the row the INSERT created — including the
--    id the database chose for you.
INSERT INTO coffees (name, origin, roast, price, bags)
VALUES ('Harbor Light', 'Honduras', 'medium', 15.95, 20)
RETURNING id, name;

-- 2. The updated row, as it is AFTER the change.
UPDATE coffees SET bags = bags + 12
WHERE name = 'Deep Well'
RETURNING name, bags;

-- 3. A receipt for the row that is now gone.
DELETE FROM coffees
WHERE name = 'Night Shift'
RETURNING name, origin;

-- 4. The shelf.
SELECT id, name, bags FROM coffees ORDER BY id;
