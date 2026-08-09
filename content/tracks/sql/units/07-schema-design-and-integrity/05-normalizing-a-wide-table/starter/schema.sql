-- Fernwood Library: the tables that already exist when your query.sql runs.
-- Read it, don't edit it.

-- Riverside branch is joining the system. This is its spreadsheet, imported
-- one row per checkout — every member's name repeated, every title repeated.
CREATE TABLE riverside_export (
  row_id      INTEGER PRIMARY KEY,
  member_name TEXT NOT NULL,
  member_card TEXT NOT NULL,
  book_title  TEXT NOT NULL,
  book_author TEXT NOT NULL,
  borrowed_on TEXT NOT NULL
);

INSERT INTO riverside_export VALUES
  (1, 'Ada Fern',    '004', 'Piranesi',            'Susanna Clarke',        '2025-05-02'),
  (2, 'Marcus Wood', '017', 'Station Eleven',      'Emily St. John Mandel', '2025-05-03'),
  (3, 'Ada Fern',    '004', 'The Overstory',       'Richard Powers',        '2025-05-09'),
  (4, 'Priya Rao',   '021', 'Piranesi',            'Susanna Clarke',        '2025-05-11'),
  (5, 'Marcus Wood', '017', 'Piranesi',            'Susanna Clarke',        '2025-05-18'),
  (6, 'Dana Okoye',  '032', 'Braiding Sweetgrass', 'Robin Wall Kimmerer',   '2025-05-20'),
  (7, 'Priya Rao',   '021', 'Station Eleven',      'Emily St. John Mandel', '2025-05-22'),
  (8, 'Ada Fern',    '004', 'Piranesi',            'Susanna Clarke',        '2025-05-29');
