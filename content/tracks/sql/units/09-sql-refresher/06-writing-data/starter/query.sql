-- Writing data. Six steps, in this order. Only the SELECTs print.

-- 1. Sign artist 6: Juno Vale, CA.


-- 2. Add albums 8 "Fathom" (2025, 27.50) and 9 "Undertow" (2025, 21.00),
--    both by artist 6 — ONE statement, and have it RETURNING id, title.


-- 3. Reprice everything released before 2020: price up 10%,
--    rounded to two decimals.


-- 4. A restock delivery arrives: 5 more of album 1, 2 of album 6 (which has
--    no stock row yet). One upsert — bump what exists, insert what doesn't.


-- 5. Delete any stock row that has hit zero.


-- 6. Verify. First: id, title, price (two decimals) and artist name for the
--    new signing's albums and everything you repriced, by id.
--    Then: album_id and on_hand for the whole stock table, by album_id.
