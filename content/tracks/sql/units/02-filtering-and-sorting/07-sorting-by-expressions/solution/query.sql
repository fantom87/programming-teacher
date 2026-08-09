-- How much money is sitting on each shelf?
SELECT name, ROUND(price * stock, 2) AS shelf_value
FROM products
ORDER BY shelf_value DESC, name;
