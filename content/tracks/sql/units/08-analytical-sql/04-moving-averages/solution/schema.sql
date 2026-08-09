-- Ridgeline Roasters: one quarter of coffee-bag sales, one row per order.
-- Every lesson in this unit queries this same table.
CREATE TABLE sales (
  id       INTEGER PRIMARY KEY,
  sold_on  TEXT    NOT NULL,  -- ISO date: YYYY-MM-DD
  region   TEXT    NOT NULL,
  roast    TEXT    NOT NULL,
  customer TEXT    NOT NULL,
  bags     INTEGER NOT NULL,
  revenue  INTEGER NOT NULL   -- whole dollars
);

INSERT INTO sales (id, sold_on, region, roast, customer, bags, revenue) VALUES
  (1,  '2026-01-05', 'North', 'Espresso', 'Ada',  5, 120),
  (2,  '2026-01-12', 'South', 'Filter',   'Bo',   3,  60),
  (3,  '2026-01-19', 'North', 'Decaf',    'Cleo', 2,  44),
  (4,  '2026-01-27', 'South', 'Espresso', 'Ada',  4,  96),
  (5,  '2026-02-03', 'North', 'Filter',   'Dev',  6, 120),
  (6,  '2026-02-11', 'South', 'Decaf',    'Bo',   1,  22),
  (7,  '2026-02-18', 'North', 'Espresso', 'Cleo', 3,  72),
  (8,  '2026-02-24', 'South', 'Filter',   'Dev',  4,  80),
  (9,  '2026-03-02', 'North', 'Decaf',    'Ada',  2,  44),
  (10, '2026-03-09', 'South', 'Espresso', 'Dev',  7, 168),
  (11, '2026-03-17', 'North', 'Filter',   'Bo',   5, 100),
  (12, '2026-03-25', 'South', 'Espresso', 'Cleo', 4,  96);
