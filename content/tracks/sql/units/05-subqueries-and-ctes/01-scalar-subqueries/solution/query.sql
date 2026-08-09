-- Coffees priced above the roastery average, with that average alongside.
SELECT name,
       price,
       ROUND((SELECT AVG(price) FROM coffees), 2) AS avg_price
FROM coffees
WHERE price > (SELECT AVG(price) FROM coffees)
ORDER BY price DESC;
