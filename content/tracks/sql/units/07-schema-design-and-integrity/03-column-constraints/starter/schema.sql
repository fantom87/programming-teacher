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
