-- Each coffee that costs more than the average for its own roast level.
SELECT name, roast, price
FROM coffees c
WHERE price > (SELECT AVG(price) FROM coffees WHERE roast = c.roast)
ORDER BY roast, name;
