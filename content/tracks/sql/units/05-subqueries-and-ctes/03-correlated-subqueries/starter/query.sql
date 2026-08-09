-- Every coffee with its roast level and price.
--
-- TODO: keep only the coffees that cost more than the average price
--       of their OWN roast level. Give the outer table the alias c,
--       then let the inner query mention c.roast.
-- Sort by roast, then name.

SELECT name, roast, price
FROM coffees c
ORDER BY roast, name;
