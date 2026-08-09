-- Customers who have ordered at least one dark roast.
SELECT name, city
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  JOIN coffees k ON k.id = o.coffee_id
  WHERE o.customer_id = c.id AND k.roast = 'dark'
)
ORDER BY name;

-- Customers who have never ordered anything.
SELECT name, city
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
)
ORDER BY name;
