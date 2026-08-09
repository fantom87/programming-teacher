-- Fernwood Roastery: what's on the shelf this week.
-- name is UNIQUE — the roastery never stocks two coffees under one name.
CREATE TABLE coffees (
  id     INTEGER PRIMARY KEY,
  name   TEXT NOT NULL UNIQUE,
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

-- Last night's supplier file, loaded exactly as it arrived. Nobody cleaned
-- it: stray spaces, inconsistent casing, missing prices, a duplicated row.
CREATE TABLE imports (
  id     INTEGER PRIMARY KEY,
  name   TEXT,
  origin TEXT,
  roast  TEXT,
  price  REAL,
  bags   INTEGER
);

INSERT INTO imports (id, name, origin, roast, price, bags) VALUES
  (1, '  Deep Well ',  'sumatra',  'DARK',   NULL,  10),
  (2, 'Harbor Light',  'honduras', 'Medium', 15.95, 20),
  (3, 'Harbor Light',  'honduras', 'Medium', 15.95, 20),
  (4, 'Fog Line  ',    'rwanda',   'light',  NULL,  12),
  (5, ' Night Shift',  'brazil',   'dark',   13.45,  6),
  (6, 'Quarry Road',   'yemen',    'DARK',   21.55,  4);

-- The house price list, used to fill in anything the supplier left blank.
CREATE TABLE roast_prices (
  roast TEXT PRIMARY KEY,
  price REAL NOT NULL
);

INSERT INTO roast_prices (roast, price) VALUES
  ('light',  17.45),
  ('medium', 15.45),
  ('dark',   18.95);
