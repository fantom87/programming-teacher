-- 1. A table that defends itself
CREATE TABLE reviews (
  id       INTEGER PRIMARY KEY,
  album_id INTEGER NOT NULL REFERENCES albums(id),
  reviewer TEXT    NOT NULL,
  rating   INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  source   TEXT    NOT NULL DEFAULT 'web',
  UNIQUE (album_id, reviewer)
);

-- 2. Load the batch; the last two rows bounce off the constraints
INSERT OR IGNORE INTO reviews (album_id, reviewer, rating) VALUES
  (1, 'dara',  5),
  (1, 'priya', 4),
  (2, 'dara',  3),
  (1, 'dara',  2),
  (5, 'tomas', 7);

SELECT id, album_id, reviewer, rating, source FROM reviews ORDER BY id;

-- 3. A transaction that changes its mind
BEGIN;
UPDATE reviews SET rating = 1;
ROLLBACK;

SELECT reviewer, album_id, rating FROM reviews ORDER BY reviewer, album_id;

-- 4. And one that means it
BEGIN;
INSERT INTO reviews (album_id, reviewer, rating, source)
  VALUES (5, 'ines', 4, 'in-store');
UPDATE reviews SET source = 'in-store' WHERE reviewer = 'dara';
COMMIT;

SELECT source, COUNT(*) AS reviews FROM reviews GROUP BY source ORDER BY source;

-- 5. The index we actually look things up by
CREATE INDEX idx_reviews_album ON reviews(album_id);

SELECT name FROM sqlite_master
WHERE type = 'index' AND tbl_name = 'reviews'
ORDER BY name;
