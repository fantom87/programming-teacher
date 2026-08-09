-- Names and prices, cheapest first.
-- TODO: add a third column, tier, from a single CASE expression:
--       under 10.00 -> 'budget', under 30.00 -> 'standard', otherwise 'premium'.
SELECT name, price
FROM products
ORDER BY price;
