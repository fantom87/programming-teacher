-- 1. The new coffee exists, but no stock yet.
INSERT INTO coffees (name, origin, roast, price, bags)
VALUES ('Harbor Light', 'Honduras', 'medium', 15.95, 0);

-- 2. The pallet lands — this UPDATE needs step 1 to have happened.
UPDATE coffees SET bags = bags + 24 WHERE name = 'Harbor Light';

-- 3. Today's sales.
UPDATE coffees SET bags = bags - 4 WHERE roast = 'light';

-- 4. Supplier gone.
DELETE FROM coffees WHERE origin = 'Brazil';

-- 5. The receipt.
SELECT name, bags FROM coffees ORDER BY name;
SELECT COUNT(*) AS shelf_items, SUM(bags) AS bags_on_hand FROM coffees;
