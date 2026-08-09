---
id: 05-grouping-by-multiple-columns
title: Grouping By Two Columns
language: sql
runner: browser
estMinutes: 14
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Group by category and channel together so each combination gets its own row, reporting the sale count and the items sold, sorted by category then channel."
docs: [sql/group-by-and-having, sql/sorting-and-limiting]
checks:
  - id: category-by-channel
    type: stdout
    entry: query.sql
    match: exact
    value: "category | channel | sales | items\n----------------------------------\nbread | counter | 3 | 20\nbread | online | 1 | 3\ndrink | counter | 2 | 34\ndrink | online | 1 | 5\npastry | counter | 3 | 27\npastry | online | 2 | 13\n"
  - id: one-grouped-query
    type: ai-judge
    rubric: "A single SELECT over sales grouping by both columns — GROUP BY category, channel — with COUNT(*) as sales and SUM(qty) as items, and ORDER BY category, channel. The six rows are not produced by separate per-channel queries stitched together with UNION, and no counts or quantities are typed as literals."
hints:
  - "Add the second column in both places it belongs: SELECT category, channel, ... and GROUP BY category, channel. The comma is the whole change."
  - "items is the quantity summed inside each pair, so SUM(qty) — not COUNT. The sales column is still COUNT(*)."
  - "Two sort keys, in priority order: ORDER BY category, channel. Category decides first; channel breaks the ties within each category."
---
## Groups made of two things

Last lesson's question was "how did each category do?" Here's a sharper one:
"how did each category do *at the counter versus online*?" That's not one dimension
any more, it's two — and `GROUP BY` handles it by taking a list:

```sql
SELECT category, channel, COUNT(*) AS sales
FROM sales
GROUP BY category, channel;
```

Now the pile-making rule considers both columns at once. Two rows land in the
same group only if they agree on category **and** channel. `pastry/counter` is
one group, `pastry/online` is a different one — the values pair up, and each
distinct pair earns a row.

How many rows should you expect? At most `categories × channels` — here three
times two, so six. Usually fewer, because `GROUP BY` only ever produces groups
that actually exist in the data. If nobody ever sold bread online, there'd
simply be no `bread/online` row. That's worth knowing: a missing combination
looks identical to a combination you forgot to ask for. (Filling in the zeros
takes a join, which is the next unit's business.)

Everything else carries over unchanged. Both grouping columns are legal in the
SELECT list, because you named them in the `GROUP BY`. The aggregates still run
once per group, they just run over smaller piles now.

Sorting deserves the same care as last lesson, only doubled. `ORDER BY
category, channel` sorts by category first and uses channel to break ties
inside each one, which gives you a readable little hierarchy: all the bread
rows together, counter before online. Swap the two and you'd get a channel
report with categories nested inside — same numbers, different story.

### Your goal

One row per category-and-channel pair: both labels, the number of sales, and
the total quantity sold. Sorted by category, then channel.

```
category | channel | sales | items
----------------------------------
bread | counter | 3 | 20
bread | online | 1 | 3
drink | counter | 2 | 34
drink | online | 1 | 5
pastry | counter | 3 | 27
pastry | online | 2 | 13
```

Six rows, and the counter out-sells online in every category — pastry comes
closest to an even split.
