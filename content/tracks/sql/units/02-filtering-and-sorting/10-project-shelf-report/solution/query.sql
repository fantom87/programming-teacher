-- Part 1 — the featured shelf.
SELECT name,
       price,
       CASE
         WHEN price < 10 THEN 'budget'
         WHEN price < 30 THEN 'standard'
         ELSE 'premium'
       END AS tier
FROM products
WHERE category IN ('kitchen', 'paper')
  AND price BETWEEN 10 AND 50
  AND stock > 0
ORDER BY price DESC;

-- Part 2 — the restock list.
SELECT name, stock
FROM products
WHERE stock < 10
ORDER BY stock, name;

-- Part 3 — top rated, reviewed products only.
SELECT name, rating
FROM products
WHERE rating IS NOT NULL
ORDER BY rating DESC, name
LIMIT 3;
