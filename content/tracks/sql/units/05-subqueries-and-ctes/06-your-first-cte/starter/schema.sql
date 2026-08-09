-- Ravenswood Roasters — the roastery you'll query all unit long.
-- This file runs before query.sql on every Run. Read it; don't edit it.

CREATE TABLE coffees (
  id     INTEGER PRIMARY KEY,
  name   TEXT NOT NULL,
  origin TEXT NOT NULL,
  roast  TEXT NOT NULL,   -- 'light', 'medium', or 'dark'
  price  REAL NOT NULL    -- dollars per 12oz bag
);

INSERT INTO coffees (id, name, origin, roast, price) VALUES
  (1, 'Morning Anthem', 'Ethiopia',  'light',  17.43),
  (2, 'Cloud Ladder',   'Ethiopia',  'light',  18.91),
  (3, 'Copper Kettle',  'Colombia',  'medium', 15.29),
  (4, 'Night Shift',    'Sumatra',   'dark',   16.35),
  (5, 'Harbor Blend',   'Brazil',    'medium', 12.78),
  (6, 'Quiet Hours',    'Kenya',     'light',  20.95),
  (7, 'Old Foundry',    'Guatemala', 'dark',   14.55),
  (8, 'Paper Moon',     'Colombia',  'medium', 13.74);

CREATE TABLE customers (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL
);

INSERT INTO customers (id, name, city) VALUES
  (1, 'Nadia Okafor', 'Portland'),
  (2, 'Theo Brandt',  'Seattle'),
  (3, 'Marisol Vega', 'Portland'),
  (4, 'Ivan Petrov',  'Boise'),
  (5, 'Grace Lin',    'Seattle'),
  (6, 'Owen Hale',    'Portland');

CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  coffee_id   INTEGER NOT NULL REFERENCES coffees(id),
  bags        INTEGER NOT NULL,
  ordered_on  TEXT NOT NULL   -- 'YYYY-MM-DD'
);

INSERT INTO orders (id, customer_id, coffee_id, bags, ordered_on) VALUES
  ( 1, 1, 1, 2, '2026-03-02'),
  ( 2, 1, 4, 1, '2026-03-11'),
  ( 3, 2, 3, 3, '2026-03-05'),
  ( 4, 3, 1, 1, '2026-03-07'),
  ( 5, 3, 6, 2, '2026-03-19'),
  ( 6, 5, 5, 4, '2026-03-08'),
  ( 7, 1, 3, 1, '2026-04-02'),
  ( 8, 2, 7, 2, '2026-04-05'),
  ( 9, 3, 4, 1, '2026-04-14'),
  (10, 5, 1, 3, '2026-04-21'),
  (11, 1, 6, 1, '2026-05-03'),
  (12, 2, 1, 2, '2026-05-09');

CREATE TABLE staff (
  id         INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL,
  manager_id INTEGER REFERENCES staff(id)   -- NULL for the owner
);

INSERT INTO staff (id, name, role, manager_id) VALUES
  (1, 'Dana Whitlock', 'owner',      NULL),
  (2, 'Priya Raman',   'roast lead', 1),
  (3, 'Marcus Bell',   'cafe lead',  1),
  (4, 'Sofia Ruiz',    'roaster',    2),
  (5, 'Jonah Kim',     'roaster',    2),
  (6, 'Elle Byrne',    'barista',    3),
  (7, 'Rosa Delgado',  'barista',    3),
  (8, 'Kwame Osei',    'apprentice', 4);
