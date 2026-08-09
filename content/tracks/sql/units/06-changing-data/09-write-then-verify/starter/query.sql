-- Closing time. Write the day's script — statements run top to bottom,
-- each one seeing the state the previous one left behind.

-- 1. Add 'Harbor Light' (Honduras, medium, 15.95) with 0 bags.


-- 2. Its pallet arrives: add 24 bags to Harbor Light.
--    (This only works because step 1 already created the row.)


-- 3. Today's sales: every light roast sold 4 bags.


-- 4. The Brazilian supplier is gone — remove those coffees.


-- 5. The receipt: name and bags ordered by name, then a second SELECT
--    with COUNT(*) AS shelf_items and SUM(bags) AS bags_on_hand.
