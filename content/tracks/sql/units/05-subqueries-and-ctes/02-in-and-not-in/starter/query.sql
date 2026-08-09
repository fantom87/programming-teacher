-- Query 1 — every customer. Narrow it to the ones who have ordered
-- at least once, by testing id against the customer ids in orders.
SELECT name
FROM customers
ORDER BY name;

-- Query 2 — every coffee. Narrow it to the ones nobody has ordered,
-- by testing id against the coffee ids in orders.
SELECT name, origin
FROM coffees
ORDER BY name;
