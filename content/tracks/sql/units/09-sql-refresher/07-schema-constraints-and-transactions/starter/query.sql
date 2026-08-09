-- Schema, constraints, indexes, transactions. Five steps, in this order.

-- 1. CREATE TABLE reviews:
--      id       integer primary key
--      album_id not null, referencing albums(id)
--      reviewer not null text
--      rating   not null integer, CHECK it is between 1 and 5
--      source   not null text, DEFAULT 'web'
--      plus a UNIQUE constraint on (album_id, reviewer)


-- 2. Load this batch with INSERT OR IGNORE — the last two rows violate a
--    constraint each and must bounce off without stopping the script:
--      (1, 'dara', 5), (1, 'priya', 4), (2, 'dara', 3),
--      (1, 'dara', 2), (5, 'tomas', 7)
--    Then SELECT id, album_id, reviewer, rating, source ordered by id.


-- 3. Open a transaction, set every rating to 1, and ROLLBACK.
--    Then prove nothing changed: reviewer, album_id, rating, ordered by
--    reviewer then album_id.


-- 4. In one committed transaction: add (5, 'ines', 4, 'in-store'), and set
--    source = 'in-store' for every review by dara.
--    Then count reviews per source, ordered by source.


-- 5. Create index idx_reviews_album on reviews(album_id), then list the
--    name of every index on reviews from sqlite_master, ordered by name.
