CREATE TABLE books (
  id     INTEGER PRIMARY KEY,
  title  TEXT,
  author TEXT,
  year   INTEGER
);

INSERT INTO books (title, author, year) VALUES
  ('The Shipping News',          'Annie Proulx',          1993),
  ('Braiding Sweetgrass',        'Robin Wall Kimmerer',   2013),
  ('Piranesi',                   'Susanna Clarke',        2020),
  ('The Overstory',              'Richard Powers',        2018),
  ('Station Eleven',             'Emily St. John Mandel', 2014),
  ('A Psalm for the Wild-Built', 'Becky Chambers',        2021);

SELECT id, title, year
FROM books
ORDER BY id;

SELECT rowid AS rowid_col, id AS id_col, title
FROM books
WHERE title = 'Piranesi';
