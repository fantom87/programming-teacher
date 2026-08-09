PRAGMA foreign_keys = ON;

-- Part 1: atomic checkout
BEGIN;

INSERT INTO loans (copy_id, member_id, borrowed_on, returned_on)
VALUES (6, 3, '2025-04-22', NULL);

UPDATE copies SET on_shelf = 0 WHERE id = 6;

COMMIT;

SELECT c.barcode, c.on_shelf, m.name AS borrower
FROM loans l
JOIN copies  c ON c.id = l.copy_id
JOIN members m ON m.id = l.member_id
WHERE l.id = (SELECT MAX(id) FROM loans);

-- Part 2: ... or nothing
BEGIN;

DELETE FROM loans WHERE returned_on IS NOT NULL;
UPDATE copies SET on_shelf = 1;

ROLLBACK;

SELECT (SELECT COUNT(*) FROM loans) AS loans_after,
       (SELECT COUNT(*) FROM copies WHERE on_shelf = 0) AS off_shelf_after;

-- Part 3: consistency the database refuses to break
INSERT OR IGNORE INTO copies (id, book_id, barcode, condition, on_shelf)
VALUES (99, 3, 'FW-9999', 'good', 7);

INSERT OR IGNORE INTO copies (id, book_id, barcode, condition, on_shelf)
VALUES (100, 3, 'FW-1001', 'good', 1);

SELECT COUNT(*) AS copies_total FROM copies;

-- Part 4: the closing audit
PRAGMA foreign_key_check;

SELECT (SELECT COUNT(*) FROM loans WHERE returned_on IS NULL) AS out_now,
       (SELECT COUNT(*) FROM copies WHERE on_shelf = 0) AS off_shelf;
