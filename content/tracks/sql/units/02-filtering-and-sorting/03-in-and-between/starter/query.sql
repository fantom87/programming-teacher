-- This works, but it repeats itself twice over.
-- TODO 1: say the same thing with IN and BETWEEN.
SELECT name, category, price
FROM products
WHERE (category = 'kitchen' OR category = 'paper')
  AND price >= 10 AND price <= 30
ORDER BY id;

-- TODO 2: a second query — name and added for everything the shop
--         added during February 2026, ordered by id.
