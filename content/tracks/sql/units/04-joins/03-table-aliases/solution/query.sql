SELECT c.name AS customer, o.id AS order_id, o.order_date AS placed
FROM customers AS c
INNER JOIN orders AS o ON o.customer_id = c.id
WHERE c.city = 'Austin'
ORDER BY o.id;
