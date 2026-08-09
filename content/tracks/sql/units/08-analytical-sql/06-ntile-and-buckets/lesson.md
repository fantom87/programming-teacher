---
id: 06-ntile-and-buckets
title: NTILE and Buckets
language: sql
runner: browser
estMinutes: 14
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Split the quarter's twelve sales into four equal-sized revenue quartiles with NTILE(4) over a window ordered by revenue DESC plus a tie-breaker, so the same data always lands in the same buckets."
docs: [sql/window-functions, sql/sorting-and-limiting]
checks:
  - id: quartiles
    type: stdout
    entry: query.sql
    match: exact
    value: "id | customer | revenue | quartile\n----------------------------------\n10 | Dev | 168 | 1\n1 | Ada | 120 | 1\n5 | Dev | 120 | 1\n11 | Bo | 100 | 2\n4 | Ada | 96 | 2\n12 | Cleo | 96 | 2\n8 | Dev | 80 | 3\n7 | Cleo | 72 | 3\n2 | Bo | 60 | 3\n3 | Cleo | 44 | 4\n9 | Ada | 44 | 4\n6 | Bo | 22 | 4\n"
  - id: ntile-with-total-order
    type: ai-judge
    rubric: "quartile comes from NTILE(4) as a window function whose OVER clause orders by revenue DESC and includes a unique tie-breaker column (id) so the bucket assignment is reproducible. The buckets are not produced by a CASE expression on revenue thresholds, by NTILE over an unordered window, or by any hardcoded numbers."
hints:
  - "NTILE takes the number of buckets as an argument, and the window's ORDER BY decides who goes where: NTILE(4) OVER (ORDER BY revenue DESC)."
  - "Two sales tie at $96 and two tie at $44, and NTILE slices strictly by position — so an ambiguous order means an ambiguous bucket. Add id: OVER (ORDER BY revenue DESC, id)."
  - "Twelve rows into four buckets is exactly three each. If your bucket 1 has four rows, check that the window says DESC and that the outer ORDER BY matches it."
---
## Cutting the data into equal piles

`RANK` tells you a row's exact position. Often you don't want that
precision — you want a *shelf*. Top quarter, second quarter, bottom
quarter. "Which customers are in our top 20% by spend?" is a bucket
question, not a ranking question.

`NTILE(n)` sorts the window and deals the rows into `n` piles of as
close to equal size as it can manage:

```sql
NTILE(4) OVER (ORDER BY revenue DESC) AS quartile
```

Twelve rows into four buckets is a clean three apiece. When the count
doesn't divide evenly, `NTILE` makes the earlier buckets one row bigger —
thirteen rows into four gives 4, 3, 3, 3.

Notice what `NTILE` is really doing: **it splits by position, not by
value.** It counts rows off the top and draws a line. That has one
consequence you must plan for. Two of these sales tie at $96, and they
sit right where a bucket boundary could fall — so which one lands in
bucket 2 and which in bucket 3 depends on the order the engine happened
to produce. Same data, same query, potentially different answer.

The fix is the same as it was for `ROW_NUMBER`: make the ordering
**total** by adding a unique column.

```sql
NTILE(4) OVER (ORDER BY revenue DESC, id)
```

Now no two rows compare equal, the cut lands in exactly one place, and
the result is reproducible. This is the habit worth taking away from the
whole unit: any window function that assigns positions — `ROW_NUMBER`,
`NTILE` — needs an `ORDER BY` with no ties left in it.

`NTILE(100)` gives you percentiles, `NTILE(10)` deciles, `NTILE(2)` a
top-and-bottom half. And it partitions like everything else:
`NTILE(4) OVER (PARTITION BY region ORDER BY revenue DESC, id)` quartiles
each region separately.

### Your goal

Add `quartile` so `query.sql` prints exactly:

```
id | customer | revenue | quartile
----------------------------------
10 | Dev | 168 | 1
1 | Ada | 120 | 1
5 | Dev | 120 | 1
11 | Bo | 100 | 2
4 | Ada | 96 | 2
12 | Cleo | 96 | 2
8 | Dev | 80 | 3
7 | Cleo | 72 | 3
2 | Bo | 60 | 3
3 | Cleo | 44 | 4
9 | Ada | 44 | 4
6 | Bo | 22 | 4
```

Three rows per bucket, and the two $96 sales split across the line
exactly where the tie-breaker puts them.
