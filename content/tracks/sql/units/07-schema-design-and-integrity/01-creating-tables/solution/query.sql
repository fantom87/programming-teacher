CREATE TABLE members (
  id        INTEGER,
  name      TEXT,
  card_no   TEXT,
  joined_on TEXT
);

INSERT INTO members (id, name, card_no, joined_on) VALUES
  (1, 'Ada Fern',    '004', '2023-01-14'),
  (2, 'Marcus Wood', '017', '2023-06-02'),
  (3, 'Priya Rao',   '021', '2024-02-20'),
  (4, 'Dana Okoye',  '032', '2024-11-05');

SELECT id, name, card_no, joined_on
FROM members
ORDER BY id;

SELECT typeof(id) AS id_type,
       typeof(card_no) AS card_type,
       CAST(card_no AS INTEGER) AS card_as_int
FROM members
WHERE id = 1;
