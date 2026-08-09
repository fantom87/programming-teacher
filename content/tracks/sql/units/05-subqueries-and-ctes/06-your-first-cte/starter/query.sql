-- TODO: lift this GROUP BY into a CTE named customer_bags using WITH,
--       then write a main query that selects from customer_bags and
--       keeps only the customers whose bags_total is above the average
--       bags_total — reading customer_bags a second time to get it.
-- Sort by bags_total DESC, then name.

SELECT c.name AS name, SUM(o.bags) AS bags_total
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.name
ORDER BY bags_total DESC, name;
