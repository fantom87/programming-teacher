SELECT title AS book,
       ROUND(price * copies, 2) AS shelf_value
FROM books
ORDER BY id;
