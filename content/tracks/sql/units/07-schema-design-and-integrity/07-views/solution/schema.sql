-- Fernwood Library: the tables that already exist when your query.sql runs.
-- Read it, don't edit it.

CREATE TABLE members (
  id        INTEGER PRIMARY KEY,
  name      TEXT NOT NULL,
  card_no   TEXT NOT NULL UNIQUE,
  joined_on TEXT NOT NULL
);

INSERT INTO members (id, name, card_no, joined_on) VALUES
  (1, 'Ada Fern',    '004', '2023-01-14'),
  (2, 'Marcus Wood', '017', '2023-06-02'),
  (3, 'Priya Rao',   '021', '2024-02-20'),
  (4, 'Dana Okoye',  '032', '2024-11-05');

CREATE TABLE books (
  id     INTEGER PRIMARY KEY,
  title  TEXT NOT NULL,
  author TEXT NOT NULL,
  year   INTEGER
);

INSERT INTO books (id, title, author, year) VALUES
  (1, 'The Shipping News',         'Annie Proulx',        1993),
  (2, 'Braiding Sweetgrass',       'Robin Wall Kimmerer', 2013),
  (3, 'Piranesi',                  'Susanna Clarke',      2020),
  (4, 'The Overstory',             'Richard Powers',      2018),
  (5, 'Station Eleven',            'Emily St. John Mandel', 2014),
  (6, 'A Psalm for the Wild-Built', 'Becky Chambers',     2021);

CREATE TABLE copies (
  id        INTEGER PRIMARY KEY,
  book_id   INTEGER NOT NULL REFERENCES books(id),
  barcode   TEXT NOT NULL UNIQUE,
  condition TEXT NOT NULL DEFAULT 'good'
            CHECK (condition IN ('good', 'worn', 'damaged'))
);

INSERT INTO copies (id, book_id, barcode, condition) VALUES
  (1, 1, 'FW-1001', 'good'),
  (2, 2, 'FW-1002', 'good'),
  (3, 2, 'FW-1003', 'worn'),
  (4, 3, 'FW-1004', 'good'),
  (5, 4, 'FW-1005', 'good'),
  (6, 5, 'FW-1006', 'damaged'),
  (7, 6, 'FW-1007', 'good');

CREATE TABLE loans (
  id          INTEGER PRIMARY KEY,
  copy_id     INTEGER NOT NULL REFERENCES copies(id),
  member_id   INTEGER NOT NULL REFERENCES members(id),
  borrowed_on TEXT NOT NULL,
  returned_on TEXT
);

INSERT INTO loans (id, copy_id, member_id, borrowed_on, returned_on) VALUES
  (1, 1, 1, '2025-03-02', '2025-03-20'),
  (2, 4, 2, '2025-03-05', NULL),
  (3, 2, 3, '2025-03-11', '2025-03-25'),
  (4, 5, 1, '2025-04-01', NULL),
  (5, 7, 4, '2025-04-03', NULL),
  (6, 3, 2, '2025-04-08', '2025-04-19');
