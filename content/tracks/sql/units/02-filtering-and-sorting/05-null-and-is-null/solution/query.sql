-- Products nobody has reviewed yet.
SELECT name
FROM products
WHERE rating IS NULL
ORDER BY id;

-- Products rated below 4.5 — note who is missing.
SELECT name, rating
FROM products
WHERE rating < 4.5
ORDER BY id;
