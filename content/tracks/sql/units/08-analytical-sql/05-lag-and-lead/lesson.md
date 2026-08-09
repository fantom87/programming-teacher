---
id: 05-lag-and-lead
title: LAG and LEAD
language: sql
runner: browser
estMinutes: 16
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Put each sale next to its neighbours within the same region — prev_sale via LAG, next_sale via LEAD, and change as this row's revenue minus the previous one — so the NULLs mark where each region's run begins and ends."
docs: [sql/window-functions, sql/sorting-and-limiting]
checks:
  - id: neighbour-comparison
    type: stdout
    entry: query.sql
    match: exact
    value: "sold_on | region | revenue | prev_sale | next_sale | change\n-----------------------------------------------------------\n2026-01-05 | North | 120 | NULL | 44 | NULL\n2026-01-19 | North | 44 | 120 | 120 | -76\n2026-02-03 | North | 120 | 44 | 72 | 76\n2026-02-18 | North | 72 | 120 | 44 | -48\n2026-03-02 | North | 44 | 72 | 100 | -28\n2026-03-17 | North | 100 | 44 | NULL | 56\n2026-01-12 | South | 60 | NULL | 96 | NULL\n2026-01-27 | South | 96 | 60 | 22 | 36\n2026-02-11 | South | 22 | 96 | 80 | -74\n2026-02-24 | South | 80 | 22 | 168 | 58\n2026-03-09 | South | 168 | 80 | 96 | 88\n2026-03-25 | South | 96 | 168 | NULL | -72\n"
  - id: partitioned-neighbours
    type: ai-judge
    rubric: "prev_sale uses LAG(revenue) and next_sale uses LEAD(revenue), and change is an arithmetic expression subtracting a LAG(revenue) from revenue rather than a typed number. Every one of those OVER clauses partitions by region and orders by sold_on, so no row is ever compared with a sale from the other region. No self-join or correlated subquery is used to reach the neighbouring row."
hints:
  - "LAG reaches backwards and LEAD reaches forwards over the window's ORDER BY: LAG(revenue) OVER (PARTITION BY region ORDER BY sold_on) AS prev_sale."
  - "change is just arithmetic on the same call: revenue - LAG(revenue) OVER (PARTITION BY region ORDER BY sold_on) AS change."
  - "Repeat the full OVER (PARTITION BY region ORDER BY sold_on) on all three columns. Drop PARTITION BY from any one of them and that column starts borrowing rows from the other region — North's first row would stop being NULL."
---
## Looking at the neighbours

Aggregates answer "what about this group?". Ranking answers "where does
this row stand?". The question neither can touch is the one analysts ask
constantly: **how does this row compare with the one before it?**

`LAG` and `LEAD` reach along the window's ordering and pull a value out
of another row:

```sql
LAG(revenue)  OVER (ORDER BY sold_on)   -- the row before
LEAD(revenue) OVER (ORDER BY sold_on)   -- the row after
```

No join, no subquery. Both take an optional offset — `LAG(revenue, 2)`
reaches back two rows — and an optional default:
`LAG(revenue, 1, 0)` hands you `0` instead of `NULL` at the edge.

Because the value is now a plain column expression, differences are
ordinary arithmetic:

```sql
revenue - LAG(revenue) OVER (ORDER BY sold_on) AS change
```

That single line is the engine behind every "vs. last month", "vs. last
week", "day-over-day" number you have ever seen on a dashboard.

Two things to respect.

**The edges are NULL, and that's honest.** The first row has nothing
behind it, so `LAG` yields `NULL`, and `revenue - NULL` is `NULL` too.
Don't paper over it — a change of `NULL` means "no previous value", which
is a genuinely different statement from a change of `0`.

**Partition, or leak.** Comparing a North sale with a South sale produces
a number that means nothing. `PARTITION BY region` walls each region off,
so `LAG` restarts — and each region gets its own `NULL` at the top and
its own `NULL` at the bottom. Watch for those four NULLs in your output:
they're the proof the partition took.

### Your goal

Add `prev_sale`, `next_sale` and `change` so `query.sql` prints exactly:

```
sold_on | region | revenue | prev_sale | next_sale | change
-----------------------------------------------------------
2026-01-05 | North | 120 | NULL | 44 | NULL
2026-01-19 | North | 44 | 120 | 120 | -76
2026-02-03 | North | 120 | 44 | 72 | 76
2026-02-18 | North | 72 | 120 | 44 | -48
2026-03-02 | North | 44 | 72 | 100 | -28
2026-03-17 | North | 100 | 44 | NULL | 56
2026-01-12 | South | 60 | NULL | 96 | NULL
2026-01-27 | South | 96 | 60 | 22 | 36
2026-02-11 | South | 22 | 96 | 80 | -74
2026-02-24 | South | 80 | 22 | 168 | 58
2026-03-09 | South | 168 | 80 | 96 | 88
2026-03-25 | South | 96 | 168 | NULL | -72
```
