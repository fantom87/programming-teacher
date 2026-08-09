-- 1. The rows come from a query, not from VALUES.
INSERT INTO clearance (name, origin, price)
SELECT name, origin, ROUND(price * 0.75, 2)
FROM coffees
WHERE bags < 15;

-- 2. The clearance shelf.
SELECT name, origin, price FROM clearance ORDER BY name;
