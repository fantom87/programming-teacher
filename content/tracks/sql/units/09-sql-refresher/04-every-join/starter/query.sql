-- Every join in one dataset. Four queries, in this order.

-- 1. Order lines: customer, album, qty, line_total (qty * price, two
--    decimals). Four tables. Sorted by order id, then album title.


-- 2. Shelf report: title and on_hand for EVERY album, including the two
--    with no stock row at all. Sorted by title.


-- 3. Anti-join: the name of every artist we carry no albums by.


-- 4. Self-join: artist, first_album, second_album — each pair of albums by
--    the same artist listed once, lower id first. Sorted by artist.
