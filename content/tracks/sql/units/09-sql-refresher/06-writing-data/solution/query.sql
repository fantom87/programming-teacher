-- 1. New signing
INSERT INTO artists (id, name, country) VALUES (6, 'Juno Vale', 'CA');

-- 2. Two titles at once, echoed back
INSERT INTO albums (id, artist_id, title, year, price) VALUES
  (8, 6, 'Fathom',   2025, 27.50),
  (9, 6, 'Undertow', 2025, 21.00)
RETURNING id, title;

-- 3. Reprice the back catalogue (pre-2020) by 10%
UPDATE albums
SET price = ROUND(price * 1.1, 2)
WHERE year < 2020;

-- 4. Restock delivery: bump what we have, add what we don't
INSERT INTO stock (album_id, on_hand) VALUES (1, 5), (6, 2)
ON CONFLICT(album_id) DO UPDATE SET on_hand = stock.on_hand + excluded.on_hand;

-- 5. Drop anything we no longer carry
DELETE FROM stock WHERE on_hand = 0;

-- 6. Verify
SELECT a.id, a.title, printf('%.2f', a.price) AS price, ar.name AS artist
FROM albums a
JOIN artists ar ON ar.id = a.artist_id
WHERE a.artist_id = 6 OR a.year < 2020
ORDER BY a.id;

SELECT album_id, on_hand
FROM stock
ORDER BY album_id;
