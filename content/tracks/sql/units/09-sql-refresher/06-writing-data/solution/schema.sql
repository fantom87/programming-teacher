-- Nightjar Records — a small independent record shop.
-- Every lesson in this refresher runs against this exact database.

CREATE TABLE artists (
  id      INTEGER PRIMARY KEY,
  name    TEXT NOT NULL,
  country TEXT
);

CREATE TABLE albums (
  id        INTEGER PRIMARY KEY,
  artist_id INTEGER NOT NULL REFERENCES artists(id),
  title     TEXT NOT NULL,
  year      INTEGER,
  price     REAL NOT NULL
);

CREATE TABLE stock (
  album_id INTEGER PRIMARY KEY REFERENCES albums(id),
  on_hand  INTEGER NOT NULL
);

CREATE TABLE customers (
  id     INTEGER PRIMARY KEY,
  name   TEXT NOT NULL,
  city   TEXT,
  joined TEXT NOT NULL
);

CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  ordered_on  TEXT NOT NULL
);

CREATE TABLE order_items (
  order_id INTEGER NOT NULL REFERENCES orders(id),
  album_id INTEGER NOT NULL REFERENCES albums(id),
  qty      INTEGER NOT NULL
);

INSERT INTO artists (id, name, country) VALUES
  (1, 'Nina Kestrel',    'US'),
  (2, 'Solaine',         'FR'),
  (3, 'The Ember Hours', 'UK'),
  (4, 'Marek Duval',     NULL),
  (5, 'Halcyon Bay',     'US');

INSERT INTO albums (id, artist_id, title, year, price) VALUES
  (1, 1, 'Paper Lantern', 2019, 23.95),
  (2, 1, 'Slow Tide',     2022, 28.75),
  (3, 2, 'Verre',         2021, 21.45),
  (4, 3, 'Ash & Ivory',   2018, 18.25),
  (5, 3, 'Long Winter',   2023, 31.25),
  (6, 4, 'Nocturne',      NULL, 26.95),
  (7, 2, 'Bleu Nuit',     2023, 34.75);

INSERT INTO stock (album_id, on_hand) VALUES
  (1, 4), (2, 2), (3, 7), (4, 0), (5, 3);

INSERT INTO customers (id, name, city, joined) VALUES
  (1, 'Dara Okon',    'Lagos',   '2024-02-11'),
  (2, 'Priya Raman',  'Toronto', '2024-06-03'),
  (3, 'Tomas Beck',   'Berlin',  '2025-01-19'),
  (4, 'Ines Duarte',  'Lisbon',  '2025-03-27'),
  (5, 'Wes Fontaine', NULL,      '2025-08-02');

INSERT INTO orders (id, customer_id, ordered_on) VALUES
  (1, 1, '2025-01-14'),
  (2, 2, '2025-02-02'),
  (3, 1, '2025-02-19'),
  (4, 3, '2025-03-08'),
  (5, 4, '2025-03-22'),
  (6, 2, '2025-04-05');

INSERT INTO order_items (order_id, album_id, qty) VALUES
  (1, 1, 1), (1, 4, 2),
  (2, 2, 1),
  (3, 5, 1), (3, 3, 1),
  (4, 7, 2),
  (5, 1, 1), (5, 2, 2),
  (6, 5, 1), (6, 3, 1);
