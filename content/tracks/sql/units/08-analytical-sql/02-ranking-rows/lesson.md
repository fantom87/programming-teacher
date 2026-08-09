---
id: 02-ranking-rows
title: Ranking Rows
language: sql
runner: browser
estMinutes: 15
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Number North's sales three ways in one query — ROW_NUMBER, RANK and DENSE_RANK over revenue DESC — and watch the two tied 120s and the two tied 44s pull the three columns apart."
docs: [sql/window-functions, sql/sorting-and-limiting]
checks:
  - id: three-rankings
    type: stdout
    entry: query.sql
    match: exact
    value: "id | roast | revenue | row_num | rank_num | dense_num\n-----------------------------------------------------\n1 | Espresso | 120 | 1 | 1 | 1\n5 | Filter | 120 | 2 | 1 | 1\n11 | Filter | 100 | 3 | 3 | 2\n7 | Espresso | 72 | 4 | 4 | 3\n3 | Decaf | 44 | 5 | 5 | 4\n9 | Decaf | 44 | 6 | 5 | 4\n"
  - id: three-real-ranking-functions
    type: ai-judge
    rubric: "row_num, rank_num and dense_num come from ROW_NUMBER(), RANK() and DENSE_RANK() window functions respectively, each with its own OVER (ORDER BY revenue DESC ...) clause. ROW_NUMBER's window carries a tie-breaker column (id) after revenue DESC so its numbering is reproducible, while RANK and DENSE_RANK order by revenue DESC alone so ties are visible. No rank value is hardcoded and no self-join or correlated subquery counts rows."
hints:
  - "All three are called with empty parentheses and ranked by their window's ORDER BY: ROW_NUMBER() OVER (ORDER BY revenue DESC) AS row_num."
  - "RANK and DENSE_RANK take the same shape. Keep their windows as plain ORDER BY revenue DESC — that's what lets the tied rows share a number."
  - "ROW_NUMBER has to break ties somehow, and left to itself the choice is arbitrary. Tell it: OVER (ORDER BY revenue DESC, id) — now the smaller id always wins, every run."
---
## Three ways to say "first"

Rank North's six sales by revenue and you hit a problem the moment two
sales tie. SQL gives you three different answers, and picking the wrong
one quietly corrupts a report.

```sql
ROW_NUMBER() OVER (ORDER BY revenue DESC)
RANK()       OVER (ORDER BY revenue DESC)
DENSE_RANK() OVER (ORDER BY revenue DESC)
```

All three take no arguments — the `ORDER BY` *inside* `OVER` is what they
rank by, and it is completely independent of the `ORDER BY` that sorts
your output. They differ only in how they treat a tie:

- **`ROW_NUMBER`** never ties. It hands out 1, 2, 3, 4… no matter what.
  Two rows worth $120 get 1 and 2, and *which one gets 1 is arbitrary*.
- **`RANK`** lets ties share a number, then skips: 1, 1, 3. The gap is
  the point — third place really is third when two people tied for first.
- **`DENSE_RANK`** lets ties share a number and never skips: 1, 1, 2.
  Use it when you want "how many distinct levels down is this row".

"Arbitrary" should bother you. If a tied `ROW_NUMBER` decides who gets
the prize, the prize depends on the query planner's mood. The fix is to
make the tie impossible: add a column to the window's `ORDER BY` that is
unique, like the primary key.

```sql
ROW_NUMBER() OVER (ORDER BY revenue DESC, id)
```

Now the ordering is total, the numbering is reproducible, and the same
data gives the same answer forever. Leave `RANK` and `DENSE_RANK` on
plain `revenue DESC` — you *want* their ties to show.

Add `PARTITION BY` and any of these restarts per group: `RANK() OVER
(PARTITION BY region ORDER BY revenue DESC)` gives you a leaderboard per
region, which is the standard way to answer "top 3 per category".

### Your goal

Add the three ranking columns so `query.sql` prints exactly:

```
id | roast | revenue | row_num | rank_num | dense_num
-----------------------------------------------------
1 | Espresso | 120 | 1 | 1 | 1
5 | Filter | 120 | 2 | 1 | 1
11 | Filter | 100 | 3 | 3 | 2
7 | Espresso | 72 | 4 | 4 | 3
3 | Decaf | 44 | 5 | 5 | 4
9 | Decaf | 44 | 6 | 5 | 4
```

Read the tie rows across: `RANK` jumps 1, 1, 3 while `DENSE_RANK` walks
1, 1, 2. That gap is the entire difference between them.
