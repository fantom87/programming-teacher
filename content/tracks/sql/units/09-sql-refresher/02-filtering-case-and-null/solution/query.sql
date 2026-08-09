-- 1. Range + set membership
SELECT title, year, price
FROM albums
WHERE year BETWEEN 2019 AND 2022
  AND artist_id IN (1, 2)
ORDER BY year DESC, title;

-- 2. Everyone who is not a US artist — including the unknown
SELECT name, country
FROM artists
WHERE country IS NULL OR country <> 'US'
ORDER BY name;

-- 3. Price tiers
SELECT
  title,
  COALESCE(year, 'unknown') AS year,
  CASE
    WHEN price >= 30 THEN 'premium'
    WHEN price >= 24 THEN 'standard'
    ELSE 'budget'
  END AS tier
FROM albums
ORDER BY tier, title;
