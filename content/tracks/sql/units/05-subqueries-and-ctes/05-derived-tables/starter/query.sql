-- This query already computes bags per customer. It is the inner half
-- of the answer.
--
-- TODO: move it into a FROM clause as a derived table named totals,
--       then select from totals and keep only rows with
--       bags_total >= 5. Sort by bags_total DESC, then name.

SELECT c.name AS name, SUM(o.bags) AS bags_total
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.name
ORDER BY bags_total DESC, name;
