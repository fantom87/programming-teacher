CREATE TABLE members (
  id      INTEGER PRIMARY KEY,
  name    TEXT NOT NULL,
  card_no TEXT NOT NULL UNIQUE
);

CREATE TABLE books (
  id     INTEGER PRIMARY KEY,
  title  TEXT NOT NULL,
  author TEXT NOT NULL
);

CREATE TABLE loans (
  id          INTEGER PRIMARY KEY,
  member_id   INTEGER NOT NULL REFERENCES members(id),
  book_id     INTEGER NOT NULL REFERENCES books(id),
  borrowed_on TEXT NOT NULL
);

INSERT INTO members (name, card_no)
SELECT DISTINCT member_name, member_card
FROM riverside_export
ORDER BY member_card;

INSERT INTO books (title, author)
SELECT DISTINCT book_title, book_author
FROM riverside_export
ORDER BY book_title;

INSERT INTO loans (member_id, book_id, borrowed_on)
SELECT m.id, b.id, e.borrowed_on
FROM riverside_export e
JOIN members m ON m.card_no = e.member_card
JOIN books   b ON b.title   = e.book_title
ORDER BY e.row_id;

SELECT id, name, card_no
FROM members
ORDER BY id;

SELECT id, title, author
FROM books
ORDER BY id;

SELECT COUNT(*) AS loans_rows,
       (SELECT COUNT(*) FROM riverside_export) AS export_rows
FROM loans;
