-- Ridgeline Roasters quarterly analytics suite.

-- Part 1 — monthly trend: revenue, month-over-month change, revenue to date.
WITH monthly AS (
  SELECT
    strftime('%Y-%m', sold_on) AS month,
    COUNT(*)                   AS orders,
    SUM(revenue)               AS revenue
  FROM sales
  GROUP BY month
)
SELECT
  month,
  orders,
  revenue,
  revenue - LAG(revenue) OVER (ORDER BY month) AS change,
  SUM(revenue) OVER (
    ORDER BY month
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM monthly
ORDER BY month;

-- Part 2 — top movers: March revenue per roast against February.
WITH by_roast AS (
  SELECT
    roast,
    strftime('%Y-%m', sold_on) AS month,
    SUM(revenue)               AS revenue
  FROM sales
  GROUP BY roast, month
),
moves AS (
  SELECT
    roast,
    month,
    revenue,
    revenue - LAG(revenue) OVER (PARTITION BY roast ORDER BY month) AS change
  FROM by_roast
)
SELECT
  roast,
  revenue,
  change,
  RANK() OVER (ORDER BY change DESC) AS mover_rank
FROM moves
WHERE month = '2026-03'
ORDER BY change DESC, roast;

-- Part 3 — customer leaderboard with each customer's share of the quarter.
SELECT
  customer,
  SUM(revenue) AS revenue,
  printf('%.1f', 100.0 * SUM(revenue) / SUM(SUM(revenue)) OVER ()) AS pct_of_total,
  RANK() OVER (ORDER BY SUM(revenue) DESC) AS place
FROM sales
GROUP BY customer
ORDER BY revenue DESC, customer;

-- Part 4 — cohort retention: customers grouped by the month they first bought.
WITH first_month AS (
  SELECT customer, MIN(strftime('%Y-%m', sold_on)) AS cohort
  FROM sales
  GROUP BY customer
),
activity AS (
  SELECT DISTINCT customer, strftime('%Y-%m', sold_on) AS month
  FROM sales
)
SELECT
  f.cohort,
  a.month,
  DENSE_RANK() OVER (PARTITION BY f.cohort ORDER BY a.month) - 1 AS month_no,
  COUNT(DISTINCT a.customer) AS active
FROM first_month f
JOIN activity a ON a.customer = f.customer
GROUP BY f.cohort, a.month
ORDER BY f.cohort, a.month;
