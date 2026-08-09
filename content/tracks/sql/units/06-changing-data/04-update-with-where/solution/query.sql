-- 1. Look before you leap: the SELECT rehearses the UPDATE's WHERE.
SELECT id, name, price
FROM coffees
WHERE origin = 'Ethiopia'
ORDER BY id;

-- 2. Same WHERE, for real. The new price is built from the old one.
UPDATE coffees
SET price = ROUND(price + 1.50, 2)
WHERE origin = 'Ethiopia';

-- 3. Verify the whole shelf.
SELECT id, name, price FROM coffees ORDER BY id;
