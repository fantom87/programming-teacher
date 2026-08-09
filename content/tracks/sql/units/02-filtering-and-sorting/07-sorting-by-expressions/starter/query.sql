-- The two ingredients, straight from the table.
-- TODO: replace price and stock with one computed column,
--       ROUND(price * stock, 2) aliased as shelf_value,
--       and sort by that alias descending (name breaks ties).
SELECT name, price, stock
FROM products
ORDER BY id;
