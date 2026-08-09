-- No ORDER BY at all: the row order here is the database's choice, not yours.
-- TODO: sort by category (A to Z), then by price from high to low.
SELECT name, category, price
FROM products;
