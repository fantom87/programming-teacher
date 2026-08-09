-- 1. customers meets itself: each buyer beside whoever referred them.
SELECT c.name AS customer, r.name AS referred_by
FROM customers AS c
LEFT JOIN customers AS r ON r.id = c.referred_by
ORDER BY c.name;

-- 2. No ON condition: every customer paired with every order.
SELECT COUNT(*) AS pairs
FROM customers
CROSS JOIN orders;
