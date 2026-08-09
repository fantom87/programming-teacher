-- TODO 1: this returns nothing at all. Fix the way it tests for NULL.
SELECT name
FROM products
WHERE rating = NULL
ORDER BY id;

-- TODO 2: a second query — name and rating for products rated
--         below 4.5, ordered by id. Then count the rows you get back.
