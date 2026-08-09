-- 1. Which tables live in this database?
SELECT name
FROM sqlite_master
ORDER BY name;

-- 2. What columns does trade_ins have?
PRAGMA table_info(trade_ins);

-- 3. Peek at the first three trade-ins.
SELECT *
FROM trade_ins
ORDER BY id
LIMIT 3;

-- 4. Which conditions turn up?
SELECT DISTINCT condition
FROM trade_ins
ORDER BY condition;

-- 5. The shelf listing.
SELECT title || ' (' || condition || ')' AS listing,
       ROUND(offer * 2.5, 2) AS shelf_price
FROM trade_ins
ORDER BY id;
