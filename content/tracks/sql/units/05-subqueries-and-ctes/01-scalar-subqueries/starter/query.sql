-- Every coffee, priciest first. Two things are missing.
--
-- TODO 1: keep only the coffees whose price beats the average price
--         of all coffees. You may not type the average as a number.
-- TODO 2: add a third column, avg_price, showing that same average
--         rounded to 2 decimal places: ROUND(<subquery>, 2) AS avg_price

SELECT name, price
FROM coffees
ORDER BY price DESC;
