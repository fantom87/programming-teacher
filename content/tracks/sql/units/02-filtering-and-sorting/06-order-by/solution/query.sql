-- Aisle by aisle, priciest first inside each aisle.
SELECT name, category, price
FROM products
ORDER BY category ASC, price DESC;
