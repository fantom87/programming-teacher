-- 1. Insert if new, add to the existing bag count if not.
INSERT INTO coffees (name, origin, roast, price, bags) VALUES
  ('Deep Well',    'Sumatra',  'dark',   18.25, 10),
  ('Night Shift',  'Brazil',   'dark',   13.45,  6),
  ('Harbor Light', 'Honduras', 'medium', 15.95, 20)
ON CONFLICT(name) DO UPDATE SET bags = bags + excluded.bags;

-- 2. Verify.
SELECT id, name, bags FROM coffees ORDER BY id;
