-- Stack two lists into one directory.
SELECT 'customer' AS kind, name FROM customers WHERE city = 'Portland'
UNION ALL
SELECT 'staff' AS kind, name FROM staff WHERE role LIKE '%lead%'
ORDER BY kind, name;

-- Light roasts that have actually sold: in both lists.
SELECT name FROM coffees WHERE roast = 'light'
INTERSECT
SELECT k.name FROM coffees k JOIN orders o ON o.coffee_id = k.id
ORDER BY name;

-- Every coffee, minus the ones that have sold.
SELECT name FROM coffees
EXCEPT
SELECT k.name FROM coffees k JOIN orders o ON o.coffee_id = k.id
ORDER BY name;
