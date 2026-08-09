-- Ridgeline Roasters quarterly analytics suite.
-- Four queries, four result sets, in this order. Build them one at a time and
-- hit Run after each — the output grows a block at a time.

-- Part 1 — monthly trend.
-- Columns: month, orders, revenue, change, running_total
-- A `monthly` CTE rolls the sales up per month; the outer SELECT adds the
-- month-over-month change (LAG) and revenue to date (a framed SUM).
SELECT 'part 1 not written yet' AS todo;

-- Part 2 — top movers.
-- Columns: roast, revenue, change, mover_rank
-- Roll revenue up per roast per month, take each roast's change from the
-- previous month, keep only the 2026-03 rows, then rank by change.

-- Part 3 — customer leaderboard.
-- Columns: customer, revenue, pct_of_total, place
-- Group by customer. pct_of_total is that customer's share of the quarter's
-- revenue as printf('%.1f', ...); place ranks customers by revenue.

-- Part 4 — cohort retention.
-- Columns: cohort, month, month_no, active
-- Each customer's cohort is the first month they bought anything. For every
-- cohort-and-month pair, count how many of that cohort bought that month.
-- month_no is 0 for the cohort's own month, 1 for the next month they appear.
