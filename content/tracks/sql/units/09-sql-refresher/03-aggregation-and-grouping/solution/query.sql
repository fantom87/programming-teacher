-- 1. One row for the whole catalog
SELECT
  COUNT(*)                   AS albums,
  COUNT(year)                AS dated,
  COUNT(DISTINCT artist_id)  AS artists,
  printf('%.2f', AVG(price)) AS avg_price,
  printf('%.2f', MAX(price)) AS top_price
FROM albums;

-- 2. Artists with more than one title
SELECT
  artist_id,
  COUNT(*)                   AS titles,
  printf('%.2f', SUM(price)) AS catalog_value
FROM albums
GROUP BY artist_id
HAVING COUNT(*) > 1
ORDER BY SUM(price) DESC, artist_id;

-- 3. Eras, with a conditional count riding along
SELECT
  CASE
    WHEN year IS NULL  THEN 'undated'
    WHEN year >= 2022  THEN 'recent'
    ELSE 'back catalog'
  END                                          AS era,
  COUNT(*)                                     AS titles,
  SUM(CASE WHEN price >= 24 THEN 1 ELSE 0 END) AS premium,
  printf('%.2f', AVG(price))                   AS avg_price
FROM albums
GROUP BY era
ORDER BY era;
