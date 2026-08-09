-- Bluebird Bakery — one week of sales, twelve rows.
-- This file runs before your query on every Run. Read it; don't edit it.
CREATE TABLE sales (
  id         INTEGER PRIMARY KEY,
  item       TEXT    NOT NULL,
  category   TEXT    NOT NULL,  -- pastry | bread | drink
  channel    TEXT    NOT NULL,  -- counter | online
  qty        INTEGER NOT NULL,
  unit_price REAL    NOT NULL,
  rating     INTEGER            -- 1-5 stars, NULL when nobody left one
);

INSERT INTO sales (id, item, category, channel, qty, unit_price, rating) VALUES
  (1,  'croissant',      'pastry', 'counter', 12, 3.25, 5),
  (2,  'croissant',      'pastry', 'online',   9, 3.25, 4),
  (3,  'cinnamon roll',  'pastry', 'counter',  8, 4.00, 5),
  (4,  'scone',          'pastry', 'counter',  7, 2.75, 3),
  (5,  'almond tart',    'pastry', 'online',   4, 5.50, NULL),
  (6,  'sourdough loaf', 'bread',  'counter',  6, 7.50, 4),
  (7,  'sourdough loaf', 'bread',  'online',   3, 7.50, 4),
  (8,  'baguette',       'bread',  'counter', 10, 3.00, NULL),
  (9,  'rye loaf',       'bread',  'counter',  4, 6.75, NULL),
  (10, 'latte',          'drink',  'counter', 20, 4.50, 5),
  (11, 'latte',          'drink',  'online',   5, 4.50, 3),
  (12, 'cold brew',      'drink',  'counter', 14, 5.00, NULL);
