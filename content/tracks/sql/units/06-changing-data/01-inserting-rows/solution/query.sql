-- 1. One row.
INSERT INTO coffees (name, origin, roast, price, bags)
VALUES ('Sunday Slow', 'Kenya', 'light', 17.45, 18);

-- 2. Two rows, one statement.
INSERT INTO coffees (name, origin, roast, price, bags) VALUES
  ('Cold Snap', 'Guatemala', 'medium', 15.25, 30),
  ('Last Call', 'Peru',      'dark',   13.95,  6);

-- 3. See what you did.
SELECT id, name, origin FROM coffees ORDER BY id;
