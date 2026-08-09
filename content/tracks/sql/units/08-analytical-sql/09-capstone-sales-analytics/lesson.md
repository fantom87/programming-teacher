---
id: 09-capstone-sales-analytics
title: "Capstone: Sales Analytics Suite"
language: sql
runner: browser
estMinutes: 35
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Build the four-query analytics suite a real sales review runs on: a monthly trend with month-over-month change and revenue to date, top movers per roast ranked by change, a customer leaderboard with each share of the quarter, and cohort-style retention — every figure computed by CTEs and window functions."
docs: [sql/window-functions, sql/ctes, sql/group-by-and-having]
checks:
  - id: analytics-suite
    type: stdout
    entry: query.sql
    match: exact
    value: "month | orders | revenue | change | running_total\n-------------------------------------------------\n2026-01 | 4 | 320 | NULL | 320\n2026-02 | 4 | 294 | -26 | 614\n2026-03 | 4 | 408 | 114 | 1022\n\nroast | revenue | change | mover_rank\n-------------------------------------\nEspresso | 264 | 192 | 1\nDecaf | 44 | 22 | 2\nFilter | 100 | -100 | 3\n\ncustomer | revenue | pct_of_total | place\n-----------------------------------------\nDev | 368 | 36.0 | 1\nAda | 260 | 25.4 | 2\nCleo | 212 | 20.7 | 3\nBo | 182 | 17.8 | 4\n\ncohort | month | month_no | active\n----------------------------------\n2026-01 | 2026-01 | 0 | 3\n2026-01 | 2026-02 | 1 | 2\n2026-01 | 2026-03 | 2 | 3\n2026-02 | 2026-02 | 0 | 1\n2026-02 | 2026-03 | 1 | 1\n"
  - id: everything-computed
    type: ai-judge
    rubric: "Four separate SELECT statements, each computed from the sales table with no literal result values typed anywhere (320, 294, 408, 1022, 192, -100, 368, 36.0, the cohort counts and so on must never appear as constants). Part 1 aggregates per month in a CTE, then adds change from LAG(revenue) OVER (ORDER BY month) and running_total from a framed SUM(revenue) OVER (ORDER BY month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW). Part 2 aggregates revenue per roast per month, derives change with LAG(revenue) OVER (PARTITION BY roast ORDER BY month), keeps only the 2026-03 rows, and ranks with RANK() OVER (ORDER BY change DESC). Part 3 groups by customer and gets pct_of_total from an aggregate nested in a window — printf('%.1f', 100.0 * SUM(revenue) / SUM(SUM(revenue)) OVER ()) — with place from RANK() OVER (ORDER BY SUM(revenue) DESC). Part 4 derives each customer's cohort as MIN(strftime('%Y-%m', sold_on)), joins it to that customer's distinct active months, counts distinct active customers per cohort-and-month, and numbers month_no with a DENSE_RANK window rather than by hand. Months everywhere come from strftime, and every statement ends with a deterministic ORDER BY."
hints:
  - "Build one part at a time and hit Run after each — the output grows a block at a time, so you always know which query broke. Part 1 is the shape everything else follows: WITH monthly AS (SELECT strftime('%Y-%m', sold_on) AS month, COUNT(*) AS orders, SUM(revenue) AS revenue FROM sales GROUP BY month) and then window functions over `monthly`."
  - "Part 2 needs two CTEs: `by_roast` groups revenue by roast and month, `moves` adds revenue - LAG(revenue) OVER (PARTITION BY roast ORDER BY month) AS change. The final SELECT filters WHERE month = '2026-03' — WHERE runs before window functions, so RANK() OVER (ORDER BY change DESC) ranks only the three surviving rows. Part 3 needs the odd-looking SUM(SUM(revenue)) OVER (): the inner SUM aggregates the group, the outer window totals the groups."
  - "Part 4: `first_month` is SELECT customer, MIN(strftime('%Y-%m', sold_on)) AS cohort FROM sales GROUP BY customer, and `activity` is SELECT DISTINCT customer, strftime('%Y-%m', sold_on) AS month FROM sales. Join them on customer, GROUP BY cohort and month, count DISTINCT customers, and get month_no from DENSE_RANK() OVER (PARTITION BY cohort ORDER BY month) - 1."
---
## The quarterly review

This is the Advanced capstone, and it is the meeting made of SQL. Someone
asks four questions about the quarter, and every answer is a query you
now know how to write:

*Is revenue growing? What changed most? Who are our biggest customers?
Do the people who buy once come back?*

Four statements, four result sets, printed in order with a blank line
between them. The capstone rule holds: **every number is computed.**
Re-seed the table with next quarter's sales and the suite still reports
the truth.

**Part 1 — monthly trend.** A `monthly` CTE rolls sales up per month
(`month`, `orders`, `revenue`). The outer query adds `change` from `LAG`
and `running_total` from a framed `SUM`. January's `change` is `NULL`,
because there was no December.

**Part 2 — top movers.** Group revenue by roast *and* month, take each
roast's `change` from the previous month with a partitioned `LAG`, keep
only the March rows, and `RANK` them by that change. The filter runs
before the ranking, so `mover_rank` counts only the three roasts left.

**Part 3 — customer leaderboard.** Group by customer, then get each
share with an aggregate nested inside a window: `SUM(SUM(revenue))
OVER ()`. It reads strangely the first time — the inner `SUM` collapses
each group, the outer window adds the groups back up — and it is how you
get a percentage-of-total without a second query.

**Part 4 — cohort retention.** Each customer belongs to the cohort of the
month they first bought anything. For every cohort and month, count how
many of that cohort were active; `month_no` counts months since the
cohort started, so `0` is its own month. Read it down: the January cohort
dips in February and comes all the way back in March.

### Your goal

`query.sql` must print exactly:

```
month | orders | revenue | change | running_total
-------------------------------------------------
2026-01 | 4 | 320 | NULL | 320
2026-02 | 4 | 294 | -26 | 614
2026-03 | 4 | 408 | 114 | 1022

roast | revenue | change | mover_rank
-------------------------------------
Espresso | 264 | 192 | 1
Decaf | 44 | 22 | 2
Filter | 100 | -100 | 3

customer | revenue | pct_of_total | place
-----------------------------------------
Dev | 368 | 36.0 | 1
Ada | 260 | 25.4 | 2
Cleo | 212 | 20.7 | 3
Bo | 182 | 17.8 | 4

cohort | month | month_no | active
----------------------------------
2026-01 | 2026-01 | 0 | 3
2026-01 | 2026-02 | 1 | 2
2026-01 | 2026-03 | 2 | 3
2026-02 | 2026-02 | 0 | 1
2026-02 | 2026-03 | 1 | 1
```

`pct_of_total` is `printf('%.1f', ...)` so every share shows one decimal.
Give every statement a deterministic `ORDER BY`. An AI reviewer reads
your SQL for hardcoded figures and for the windows themselves — get this
green and the Advanced tier is yours.
