SELECT title, price, copies, ROUND(price * copies, 2)
FROM books
ORDER BY id;
