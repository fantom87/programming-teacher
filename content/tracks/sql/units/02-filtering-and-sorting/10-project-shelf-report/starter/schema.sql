-- The Corner Shelf — a small shop's product catalog.
-- This file runs before your query on every Run. Read it; don't edit it.
CREATE TABLE products (
  id       INTEGER PRIMARY KEY,
  name     TEXT    NOT NULL,
  category TEXT    NOT NULL,   -- 'kitchen', 'home', or 'paper'
  price    REAL    NOT NULL,
  stock    INTEGER NOT NULL,   -- units on the shelf right now
  rating   REAL,               -- NULL until a product has been reviewed
  added    TEXT    NOT NULL    -- 'YYYY-MM-DD'
);

INSERT INTO products (id, name, category, price, stock, rating, added) VALUES
  (1,  'Cast Iron Skillet', 'kitchen', 34.95,  12,  4.8,  '2026-01-14'),
  (2,  'Bamboo Board',      'kitchen', 18.75,  40,  4.2,  '2026-02-02'),
  (3,  'Espresso Cups',     'kitchen', 22.25,   0,  NULL, '2026-03-19'),
  (4,  'Ceramic Mug',       'kitchen',  9.45,  64,  4.5,  '2026-01-27'),
  (5,  'Wool Blanket',      'home',    89.95,   5,  4.9,  '2026-02-11'),
  (6,  'Beeswax Candle',    'home',     7.25, 120,  4.1,  '2026-03-03'),
  (7,  'Linen Napkins',     'home',    26.55,  18,  NULL, '2026-03-28'),
  (8,  'Leather Journal',   'paper',   24.75,  30,  4.6,  '2026-01-05'),
  (9,  'Fountain Pen',      'paper',   45.35,   8,  4.4,  '2026-02-22'),
  (10, 'Kraft Notebook',    'paper',    6.15, 200,  3.8,  '2026-03-11');
