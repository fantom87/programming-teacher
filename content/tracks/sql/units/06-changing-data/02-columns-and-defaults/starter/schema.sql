-- Fernwood Roastery. This version of the table has DEFAULTs.
CREATE TABLE coffees (
  id     INTEGER PRIMARY KEY,
  name   TEXT    NOT NULL,
  origin TEXT    NOT NULL,
  roast  TEXT    NOT NULL DEFAULT 'medium',
  price  REAL    NOT NULL DEFAULT 14.95,
  bags   INTEGER NOT NULL DEFAULT 0,
  notes  TEXT
);

INSERT INTO coffees (id, name, origin, roast, price, bags, notes) VALUES
  (1, 'Morning Ritual', 'Ethiopia', 'light',  16.95, 24, 'floral'),
  (2, 'Deep Well',      'Sumatra',  'dark',   18.25, 12, 'earthy'),
  (3, 'Half Past Four', 'Colombia', 'medium', 15.75, 40, 'caramel'),
  (4, 'Night Shift',    'Brazil',   'dark',   13.45,  8, 'chocolate');
