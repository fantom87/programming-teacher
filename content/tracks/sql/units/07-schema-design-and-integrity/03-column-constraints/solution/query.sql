CREATE TABLE copies (
  id        INTEGER PRIMARY KEY,
  book_id   INTEGER NOT NULL,
  barcode   TEXT NOT NULL UNIQUE,
  condition TEXT NOT NULL DEFAULT 'good'
            CHECK (condition IN ('good', 'worn', 'damaged'))
);

INSERT INTO copies (book_id, barcode, condition) VALUES
  (1, 'FW-1001', 'good'),
  (2, 'FW-1002', 'good'),
  (2, 'FW-1003', 'worn'),
  (3, 'FW-1004', 'good'),
  (4, 'FW-1005', 'good'),
  (5, 'FW-1006', 'damaged');

INSERT INTO copies (book_id, barcode) VALUES
  (6, 'FW-1007');

INSERT OR IGNORE INTO copies (book_id, barcode, condition) VALUES
  (3, 'FW-1004', 'good'),
  (5, 'FW-1008', 'chewed');

SELECT id, book_id, barcode, condition
FROM copies
ORDER BY id;

SELECT COUNT(*) AS copies_kept FROM copies;
