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
