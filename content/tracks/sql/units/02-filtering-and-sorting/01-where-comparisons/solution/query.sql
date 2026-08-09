-- Everything on the shelf under 20.00, cheapest id first.
SELECT name, price
FROM products
WHERE price < 20
ORDER BY id;
