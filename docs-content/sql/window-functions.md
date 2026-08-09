# Window functions

Aggregates collapse rows; window functions *don't*. They compute over a group of related rows — the "window" — while keeping every row in the result. Rankings, running totals, and compare-to-previous-row all live here.

## OVER: an aggregate that keeps the rows

```sql
SELECT name, category, price,
       AVG(price) OVER (PARTITION BY category) AS category_avg
FROM products;
```

```
name     | category | price | category_avg
---------+----------+-------+-------------
Dune     | book     | 12.0  | 10.0
Emma     | book     | 8.0   | 10.0
Chess    | game     | 25.0  | 25.0
```

`PARTITION BY category` splits rows into per-category windows; `AVG` runs within each. Every product keeps its own row *and* sees its group's average — with GROUP BY you'd have to choose. Now `price - category_avg` is trivial.

## Ranking

```sql
SELECT name, price,
       ROW_NUMBER() OVER (ORDER BY price DESC) AS rn,
       RANK()       OVER (ORDER BY price DESC) AS rank,
       DENSE_RANK() OVER (ORDER BY price DESC) AS dense
FROM products;
```

They differ only on ties: `ROW_NUMBER` never ties (1, 2, 3), `RANK` ties then skips (1, 1, 3), `DENSE_RANK` ties without skipping (1, 1, 2). Add `PARTITION BY category` and the ranking restarts within each category — "top 3 per category" is a CTE with `ROW_NUMBER` plus `WHERE rn <= 3`.

## Running totals

`ORDER BY` inside `OVER` makes aggregates cumulative:

```sql
SELECT order_date, total,
       SUM(total) OVER (ORDER BY order_date) AS running_total
FROM orders;
```

Each row's `running_total` sums everything up to and including that row. A window *frame* narrows it further — a 7-row moving average:

```sql
AVG(total) OVER (ORDER BY order_date
                 ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)
```

## LAG and LEAD: neighboring rows

`LAG` fetches a value from the previous row, `LEAD` from the next:

```sql
SELECT month, revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change
FROM monthly_revenue;
```

The first row has no previous, so its `LAG` is NULL (a default fills it: `LAG(revenue, 1, 0)`).

Window functions are allowed only in `SELECT` and `ORDER BY`. To filter on one — "rows where rank ≤ 3" — compute it in a CTE, then `WHERE` in the outer query.
