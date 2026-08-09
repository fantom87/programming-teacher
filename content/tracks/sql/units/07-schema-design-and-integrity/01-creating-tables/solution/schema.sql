-- Fernwood Library: the tables that already exist when your query.sql runs.
-- Read it, don't edit it.

CREATE TABLE branches (
  id        INTEGER PRIMARY KEY,
  name      TEXT,
  opened_on TEXT
);

INSERT INTO branches (id, name, opened_on) VALUES
  (1, 'Fernwood Main', '1998-04-02'),
  (2, 'Riverside',     '2011-09-15');
