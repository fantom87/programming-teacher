-- Right now this returns every product in the shop.
-- TODO: add a WHERE clause so only products under 20.00 come back.
SELECT name, price
FROM products
ORDER BY id;
