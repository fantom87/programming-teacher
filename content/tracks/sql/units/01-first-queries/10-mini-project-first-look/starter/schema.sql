-- The Bindery, a small used bookshop. Alongside the shop's own stock, a crate
-- of customer trade-ins has just been logged. You don't need to change this file.
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

CREATE TABLE trade_ins (
  id        INTEGER PRIMARY KEY,
  title     TEXT,
  condition TEXT,
  offer     REAL
);

INSERT INTO trade_ins (id, title, condition, offer) VALUES
  (1, 'Kindred',             'good', 3.25),
  (2, 'The Dispossessed',    'fair', 1.75),
  (3, 'Station Eleven',      'good', 4.25),
  (4, 'Watership Down',      'poor', 0.75),
  (5, 'The Overstory',       'mint', 6.25),
  (6, 'Piranesi',            'good', 5.25),
  (7, 'Slaughterhouse-Five', 'fair', 2.25),
  (8, 'The Fifth Season',    'good', 4.75);
