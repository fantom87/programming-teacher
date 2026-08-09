-- Fernwood Roastery: what's on the shelf this week.
CREATE TABLE coffees (
  id     INTEGER PRIMARY KEY,
  name   TEXT NOT NULL,
  origin TEXT NOT NULL,
  roast  TEXT NOT NULL,
  price  REAL NOT NULL,
  bags   INTEGER NOT NULL
);

INSERT INTO coffees (id, name, origin, roast, price, bags) VALUES
  (1, 'Morning Ritual', 'Ethiopia', 'light',  16.95, 24),
  (2, 'Deep Well',      'Sumatra',  'dark',   18.25, 12),
  (3, 'Half Past Four', 'Colombia', 'medium', 15.75, 40),
  (4, 'Night Shift',    'Brazil',   'dark',   13.45,  8),
  (5, 'Cloud Cover',    'Ethiopia', 'light',  19.45, 15);

-- The importer's new price list. It only covers some of our coffees.
CREATE TABLE price_changes (
  coffee_id INTEGER NOT NULL,
  new_price REAL    NOT NULL
);

INSERT INTO price_changes (coffee_id, new_price) VALUES
  (2, 17.35),
  (3, 16.25),
  (5, 20.95);
