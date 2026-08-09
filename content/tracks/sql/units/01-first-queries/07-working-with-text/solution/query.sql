SELECT UPPER(genre) AS shelf,
       title || ' by ' || author AS label,
       LENGTH(title) AS title_length
FROM books
ORDER BY id;
