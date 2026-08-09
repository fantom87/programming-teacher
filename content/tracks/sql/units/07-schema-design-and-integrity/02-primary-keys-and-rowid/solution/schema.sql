-- Fernwood Library: the tables that already exist when your query.sql runs.
-- Read it, don't edit it.

CREATE TABLE members (
  id        INTEGER PRIMARY KEY,
  name      TEXT NOT NULL,
  card_no   TEXT NOT NULL UNIQUE,
  joined_on TEXT NOT NULL
);

INSERT INTO members (id, name, card_no, joined_on) VALUES
  (1, 'Ada Fern',    '004', '2023-01-14'),
  (2, 'Marcus Wood', '017', '2023-06-02'),
  (3, 'Priya Rao',   '021', '2024-02-20'),
  (4, 'Dana Okoye',  '032', '2024-11-05');
