CREATE VIEW books_on_loan AS
SELECT l.id AS loan_id,
       m.name AS member,
       b.title AS title,
       l.borrowed_on
FROM loans l
JOIN copies  c ON c.id = l.copy_id
JOIN books   b ON b.id = c.book_id
JOIN members m ON m.id = l.member_id
WHERE l.returned_on IS NULL;

SELECT loan_id, member, title
FROM books_on_loan
ORDER BY loan_id;

UPDATE loans SET returned_on = '2025-04-21' WHERE id = 4;

SELECT loan_id, member, title
FROM books_on_loan
ORDER BY loan_id;

SELECT member, COUNT(*) AS out_now
FROM books_on_loan
GROUP BY member
ORDER BY member;
