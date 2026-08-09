BEGIN;

INSERT INTO loans (copy_id, member_id, borrowed_on, returned_on)
VALUES (6, 3, '2025-04-22', NULL);

UPDATE copies SET on_shelf = 0 WHERE id = 6;

COMMIT;

SELECT id, barcode, on_shelf
FROM copies
WHERE id = 6;

BEGIN;

DELETE FROM loans WHERE returned_on IS NOT NULL;

SELECT COUNT(*) AS loans_inside FROM loans;

ROLLBACK;

SELECT COUNT(*) AS loans_after FROM loans;

SELECT id, barcode, on_shelf
FROM copies
WHERE on_shelf = 0
ORDER BY id;
