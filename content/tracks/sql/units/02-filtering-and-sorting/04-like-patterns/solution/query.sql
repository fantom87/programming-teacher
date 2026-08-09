-- "It had 'boo' in the name... or maybe it started with C?"
SELECT name, category
FROM products
WHERE name LIKE '%boo%' OR name LIKE 'C%'
ORDER BY id;
