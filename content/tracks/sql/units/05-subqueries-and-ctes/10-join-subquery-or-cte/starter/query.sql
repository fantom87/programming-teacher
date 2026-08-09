-- Part 1 — a JOIN. Every order placed on or after 2026-05-01, showing
-- the customer name, the coffee name, and the bags. Order by o.id.
-- TODO: join customers and coffees onto orders and select the names.
SELECT o.customer_id, o.coffee_id, o.bags
FROM orders o
WHERE o.ordered_on >= '2026-05-01'
ORDER BY o.id;

-- Part 2 — a subquery. Customers who have never ordered anything.
-- TODO: add the NOT EXISTS test.
SELECT name, city
FROM customers c
ORDER BY name;

-- Part 3 — CTEs. Revenue per origin, keeping origins at 50 or above.
-- TODO: build line_totals (origin and bags * price per order), then
--       by_origin (origin with ROUND(SUM(revenue), 2) AS revenue),
--       then select from by_origin with the filter and the sort.
SELECT origin FROM coffees ORDER BY origin;
