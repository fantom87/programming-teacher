-- Query 1 — every customer. Keep only those with at least one order
-- for a dark roast. Inside EXISTS, join orders to coffees and tie the
-- order back to the outer customer with o.customer_id = c.id.
SELECT name, city
FROM customers c
ORDER BY name;

-- Query 2 — every customer. Keep only those with no orders at all,
-- using NOT EXISTS.
SELECT name, city
FROM customers c
ORDER BY name;
