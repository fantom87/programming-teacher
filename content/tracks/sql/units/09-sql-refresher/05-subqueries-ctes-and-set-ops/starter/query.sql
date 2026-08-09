-- Subqueries, CTEs and set operations. Four queries, in this order.

-- 1. title, price, vs_avg — how far each price sits from the catalog
--    average, signed, two decimals. Dearest first.
--    (printf('%+.2f', x) prints the leading + for you.)


-- 2. The name of every customer who has never placed an order.
--    Use NOT EXISTS.


-- 3. A two-step CTE pipeline: line amounts, then per-customer totals.
--    Output name and spent (two decimals), biggest spender first,
--    ties broken by name.


-- 4. id and title of every album nobody has ever bought — as a set
--    difference, not a NOT IN.
