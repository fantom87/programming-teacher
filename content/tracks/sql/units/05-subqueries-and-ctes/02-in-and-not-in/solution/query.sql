-- Customers who have ordered at least once.
SELECT name
FROM customers
WHERE id IN (SELECT customer_id FROM orders)
ORDER BY name;

-- Coffees nobody has ordered yet.
SELECT name, origin
FROM coffees
WHERE id NOT IN (SELECT coffee_id FROM orders)
ORDER BY name;
