EXPLAIN QUERY PLAN
SELECT id, borrowed_on FROM loans WHERE member_id = 2;

CREATE INDEX idx_loans_member ON loans(member_id);

EXPLAIN QUERY PLAN
SELECT id, borrowed_on FROM loans WHERE member_id = 2;

SELECT id, borrowed_on
FROM loans
WHERE member_id = 2
ORDER BY id;

CREATE UNIQUE INDEX idx_copies_barcode ON copies(barcode);

SELECT name
FROM sqlite_master
WHERE type = 'index' AND name LIKE 'idx_%'
ORDER BY name;
