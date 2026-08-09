-- Query 1 — Portland customers. Stack the leads underneath them with
-- UNION ALL so both lists share the kind and name columns.
-- The staff half: SELECT 'staff' AS kind, name FROM staff WHERE role LIKE '%lead%'
-- Sort by kind, then name.
SELECT 'customer' AS kind, name FROM customers WHERE city = 'Portland'
ORDER BY kind, name;

-- Query 2 — light roasts. Keep only the ones that also appear in the
-- list of coffees that have sold, using INTERSECT.
SELECT name FROM coffees WHERE roast = 'light'
ORDER BY name;

-- Query 3 — every coffee. Subtract the ones that have sold, using EXCEPT.
SELECT name FROM coffees
ORDER BY name;
