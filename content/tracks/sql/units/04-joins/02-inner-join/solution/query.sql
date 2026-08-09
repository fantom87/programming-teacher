SELECT customers.name, orders.order_date
FROM customers
INNER JOIN orders ON orders.customer_id = customers.id
ORDER BY orders.id;
