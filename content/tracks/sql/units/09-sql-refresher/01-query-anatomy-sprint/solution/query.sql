-- 1. Sale sheet
SELECT
  title,
  year,
  printf('%.2f', price * 0.9) AS sale_price
FROM albums
WHERE price > 22
ORDER BY price DESC, title;

-- 2. Countries we stock
SELECT DISTINCT country
FROM artists
ORDER BY country;

-- 3. Three priciest
SELECT id, title, price
FROM albums
ORDER BY price DESC, id
LIMIT 3;
