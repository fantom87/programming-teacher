-- 1. Name and origin only — every other column takes its default.
INSERT INTO coffees (name, origin)
VALUES ('Fog Line', 'Rwanda');

-- 2. Some columns given, the rest left to the table.
INSERT INTO coffees (name, origin, roast, price)
VALUES ('Quarry Road', 'Yemen', 'dark', 21.55);

-- 3. What did the table fill in?
SELECT name, roast, price, bags, notes
FROM coffees
WHERE id > 4
ORDER BY id;
