-- 1. Rank each artist's own catalogue
SELECT
  ar.name  AS artist,
  a.title,
  printf('%.2f', a.price) AS price,
  ROW_NUMBER() OVER (PARTITION BY a.artist_id ORDER BY a.price DESC) AS rank_in_catalog
FROM albums a
JOIN artists ar ON ar.id = a.artist_id
ORDER BY ar.name, rank_in_catalog;

-- 2. Monthly revenue, running total, month-over-month change
WITH lines AS (
  SELECT strftime('%Y-%m', o.ordered_on) AS month, oi.qty * a.price AS amount
  FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  JOIN albums a ON a.id = oi.album_id
),
monthly AS (
  SELECT month, SUM(amount) AS revenue
  FROM lines
  GROUP BY month
),
trend AS (
  SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev,
    SUM(revenue) OVER (ORDER BY month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running
  FROM monthly
)
SELECT
  month,
  printf('%.2f', revenue) AS revenue,
  printf('%.2f', running) AS running,
  CASE WHEN prev IS NULL THEN 'n/a' ELSE printf('%+.2f', revenue - prev) END AS change
FROM trend
ORDER BY month;

-- 3. Best seller of each month
WITH sales AS (
  SELECT
    strftime('%Y-%m', o.ordered_on) AS month,
    a.title,
    SUM(oi.qty) AS units
  FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  JOIN albums a ON a.id = oi.album_id
  GROUP BY month, a.title
),
ranked AS (
  SELECT
    month,
    title,
    units,
    RANK() OVER (PARTITION BY month ORDER BY units DESC, title) AS place
  FROM sales
)
SELECT month, title, units
FROM ranked
WHERE place = 1
ORDER BY month;
