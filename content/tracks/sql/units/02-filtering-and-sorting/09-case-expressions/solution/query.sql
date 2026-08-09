-- Give every product a price tier.
SELECT name,
       price,
       CASE
         WHEN price < 10 THEN 'budget'
         WHEN price < 30 THEN 'standard'
         ELSE 'premium'
       END AS tier
FROM products
ORDER BY price;
