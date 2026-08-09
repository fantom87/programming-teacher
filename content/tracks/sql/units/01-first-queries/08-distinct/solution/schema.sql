-- The Bindery, a small used bookshop. This file builds the shop's one table
-- and fills it with stock before your query runs. You don't need to change it.
CREATE TABLE books (
  id     INTEGER PRIMARY KEY,
  title  TEXT,
  author TEXT,
  genre  TEXT,
  year   INTEGER,
  price  REAL,
  copies INTEGER
);

INSERT INTO books (id, title, author, genre, year, price, copies) VALUES
  (1, 'Dune',                      'Frank Herbert',     'sci-fi',     1965, 12.95, 3),
  (2, 'Neuromancer',               'William Gibson',    'sci-fi',     1984,  9.25, 2),
  (3, 'The Left Hand of Darkness', 'Ursula K. Le Guin', 'sci-fi',     1969, 11.75, 1),
  (4, 'Beloved',                   'Toni Morrison',     'literary',   1987, 10.45, 4),
  (5, 'The Hobbit',                'J.R.R. Tolkien',    'fantasy',    1937,  8.99, 6),
  (6, 'A Wizard of Earthsea',      'Ursula K. Le Guin', 'fantasy',    1968,  7.25, 2),
  (7, 'Silent Spring',             'Rachel Carson',     'nonfiction', 1962,  6.75, 1),
  (8, 'The Sixth Extinction',      'Elizabeth Kolbert', 'nonfiction', 2014, 14.99, 5);
