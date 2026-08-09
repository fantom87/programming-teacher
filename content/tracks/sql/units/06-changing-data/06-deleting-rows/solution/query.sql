-- 1. Count first — this is the rehearsal.
SELECT COUNT(*) AS doomed FROM coffees WHERE origin = 'Brazil';

-- 2. Same WHERE, for real.
DELETE FROM coffees WHERE origin = 'Brazil';

-- 3. Emptying a staging table is the one time no WHERE is correct.
DELETE FROM staging_deliveries;

-- 4. Verify both tables.
SELECT id, name, origin FROM coffees ORDER BY id;
SELECT COUNT(*) AS staged FROM staging_deliveries;
