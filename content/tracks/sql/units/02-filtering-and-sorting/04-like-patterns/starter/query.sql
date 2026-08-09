-- The whole catalog, unsearched.
-- TODO: keep only the products whose name contains 'boo'
--       or starts with 'C'. One WHERE clause, two LIKE patterns.
SELECT name, category
FROM products
ORDER BY id;
