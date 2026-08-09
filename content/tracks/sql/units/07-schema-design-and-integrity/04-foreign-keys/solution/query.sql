PRAGMA foreign_keys = ON;

CREATE TABLE loans (
  id          INTEGER PRIMARY KEY,
  copy_id     INTEGER NOT NULL REFERENCES copies(id),
  member_id   INTEGER NOT NULL REFERENCES members(id),
  borrowed_on TEXT NOT NULL,
  returned_on TEXT
);

INSERT INTO loans (copy_id, member_id, borrowed_on, returned_on) VALUES
  (1, 1, '2025-03-02', '2025-03-20'),
  (4, 2, '2025-03-05', NULL),
  (2, 3, '2025-03-11', '2025-03-25'),
  (5, 1, '2025-04-01', NULL),
  (7, 4, '2025-04-03', NULL),
  (3, 2, '2025-04-08', '2025-04-19');

PRAGMA foreign_key_check;

DELETE FROM holds WHERE id = 3;

PRAGMA foreign_key_check;

SELECT l.id, m.name AS member, c.barcode
FROM loans l
JOIN members m ON m.id = l.member_id
JOIN copies  c ON c.id = l.copy_id
ORDER BY l.id;
