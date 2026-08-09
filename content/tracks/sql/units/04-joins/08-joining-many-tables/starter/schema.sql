-- Rivertown Books — the shop database (this file runs before your query).
-- Two tables so far: who buys, and what they ordered.

CREATE TABLE customers (
  id          INTEGER PRIMARY KEY,  -- the primary key: unique per customer
  name        TEXT NOT NULL,
  city        TEXT NOT NULL,
  referred_by INTEGER               -- customers.id of whoever recommended us
);

CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  customer_id INTEGER,              -- foreign key -> customers.id (NULL = guest checkout)
  order_date  TEXT NOT NULL
);

INSERT INTO customers (id, name, city, referred_by) VALUES
  (1, 'Mara',  'Portland', NULL),
  (2, 'Devon', 'Austin',   1),
  (3, 'Priya', 'Boston',   NULL),
  (4, 'Tom',   'Austin',   2),
  (5, 'Ines',  'Portland', 1);

INSERT INTO orders (id, customer_id, order_date) VALUES
  (1, 1,    '2026-03-02'),
  (2, 2,    '2026-03-05'),
  (3, 1,    '2026-03-11'),
  (4, 5,    '2026-03-14'),
  (5, 2,    '2026-03-19'),
  (6, 4,    '2026-03-22'),
  (7, NULL, '2026-03-25'),
  (8, 1,    '2026-04-01');

-- The catalogue, and one row per book on an order.

CREATE TABLE categories (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE books (
  id          INTEGER PRIMARY KEY,
  title       TEXT NOT NULL,
  category_id INTEGER NOT NULL,     -- foreign key -> categories.id
  price       REAL NOT NULL
);

CREATE TABLE order_items (
  order_id INTEGER NOT NULL,        -- foreign key -> orders.id
  book_id  INTEGER NOT NULL,        -- foreign key -> books.id
  quantity INTEGER NOT NULL
);

INSERT INTO categories (id, name) VALUES
  (1, 'Fiction'),
  (2, 'Science'),
  (3, 'Cooking'),
  (4, 'Poetry');

INSERT INTO books (id, title, category_id, price) VALUES
  (1, 'The Silent Tide', 1, 14.95),
  (2, 'Deep Field',      2, 22.75),
  (3, 'Bread Alone',     3, 18.25),
  (4, 'Small Hours',     4, 12.99),
  (5, 'Night Kitchen',   3, 16.45),
  (6, 'Orbit',           2, 9.99);

INSERT INTO order_items (order_id, book_id, quantity) VALUES
  (1, 1, 1),
  (1, 2, 1),
  (2, 3, 2),
  (3, 6, 3),
  (4, 1, 1),
  (5, 5, 1),
  (5, 6, 1),
  (6, 2, 1),
  (7, 3, 1),
  (8, 1, 2),
  (8, 5, 1);
