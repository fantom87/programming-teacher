-- Mid-priced stock in the two paper-and-kitchen aisles.
SELECT name, category, price
FROM products
WHERE category IN ('kitchen', 'paper')
  AND price BETWEEN 10 AND 30
ORDER BY id;

-- Everything the shop added in February.
SELECT name, added
FROM products
WHERE added BETWEEN '2026-02-01' AND '2026-02-28'
ORDER BY id;
