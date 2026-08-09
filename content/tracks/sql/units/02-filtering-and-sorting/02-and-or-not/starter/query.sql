-- This finds everything under 30.00, from every aisle.
-- TODO: also require the product to be in the kitchen OR home category.
--       Mind the parentheses.
SELECT name, category, price
FROM products
WHERE price < 30
ORDER BY id;
