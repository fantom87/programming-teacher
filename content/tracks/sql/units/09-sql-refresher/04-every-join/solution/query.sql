-- 1. Order lines: four tables, one result
SELECT
  c.name  AS customer,
  a.title AS album,
  oi.qty,
  printf('%.2f', oi.qty * a.price) AS line_total
FROM order_items oi
JOIN orders    o ON o.id = oi.order_id
JOIN customers c ON c.id = o.customer_id
JOIN albums    a ON a.id = oi.album_id
ORDER BY oi.order_id, a.title;

-- 2. Shelf report: every album, stocked or not
SELECT a.title, s.on_hand
FROM albums a
LEFT JOIN stock s ON s.album_id = a.id
ORDER BY a.title;

-- 3. Anti-join: artists we carry nothing by
SELECT ar.name
FROM artists ar
LEFT JOIN albums al ON al.artist_id = ar.id
WHERE al.id IS NULL
ORDER BY ar.name;

-- 4. Self-join: album pairs by the same artist
SELECT
  ar.name AS artist,
  a.title AS first_album,
  b.title AS second_album
FROM albums a
JOIN albums  b  ON b.artist_id = a.artist_id AND b.id > a.id
JOIN artists ar ON ar.id = a.artist_id
ORDER BY ar.name;
