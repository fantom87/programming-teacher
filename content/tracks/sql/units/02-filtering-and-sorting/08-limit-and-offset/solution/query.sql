-- The three priciest products.
SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 3;

-- Page 2 of the same list.
SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 3 OFFSET 3;
