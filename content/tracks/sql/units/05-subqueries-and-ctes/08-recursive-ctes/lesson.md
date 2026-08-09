---
id: 08-recursive-ctes
title: Recursive CTEs
language: sql
runner: browser
estMinutes: 20
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Write two recursive CTEs with the anchor / UNION ALL / step / stop shape: first a numbers series from 1 to 5, then a chain that walks the staff table from the owner down, labelling each person with their level."
docs: [sql/ctes]
checks:
  - id: series-then-org-chart
    type: stdout
    entry: query.sql
    match: exact
    value: "n\n-\n1\n2\n3\n4\n5\n\nlevel | name | role\n-------------------\n1 | Dana Whitlock | owner\n2 | Marcus Bell | cafe lead\n2 | Priya Raman | roast lead\n3 | Elle Byrne | barista\n3 | Jonah Kim | roaster\n3 | Rosa Delgado | barista\n3 | Sofia Ruiz | roaster\n4 | Kwame Osei | apprentice\n"
  - id: genuinely-recursive
    type: ai-judge
    rubric: "Both statements use WITH RECURSIVE with two branches joined by UNION ALL. In the first, the anchor is SELECT 1 and the recursive branch selects n + 1 from the CTE itself with a WHERE n < 5 stopping condition — the numbers are not produced by a literal VALUES list or eight hardcoded SELECTs. In the second, the anchor selects the staff row WHERE manager_id IS NULL with 1 AS level, and the recursive branch joins staff to the CTE on s.manager_id = <cte>.id while incrementing level; levels are not assigned by hardcoding ids or by a CASE over names. Both statements end with an ORDER BY."
hints:
  - "The shape is always three parts: an anchor row, UNION ALL, and a step that selects from the CTE's own name. WITH RECURSIVE numbers(n) AS ( SELECT 1 UNION ALL SELECT n + 1 FROM numbers WHERE n < 5 )."
  - "Without the WHERE the step never runs out of work and the query never ends. The stopping condition is not optional — write it at the same time as the step."
  - "For the org chart the anchor is the owner and the step is a join: SELECT s.id, s.name, s.role, chain.level + 1 FROM staff s JOIN chain ON s.manager_id = chain.id. Each pass finds the people reporting to whoever was found last pass."
---
## A query that feeds itself

Every CTE so far read from tables that already existed. A **recursive**
CTE reads from *itself*, which lets one query build rows that were never
in any table:

```sql
WITH RECURSIVE numbers(n) AS (
  SELECT 1                                -- anchor: where to start
  UNION ALL
  SELECT n + 1 FROM numbers WHERE n < 5   -- step, and when to stop
)
SELECT n FROM numbers ORDER BY n;
```

Three parts, always. The **anchor** produces the first row or rows. The
**step** — everything after `UNION ALL` — reads what the previous pass
produced and derives the next batch. The **stop condition** inside the
step decides when the well runs dry. Pass one yields `1`; pass two feeds
`1` back in and yields `2`; by pass five the `WHERE n < 5` matches
nothing, the machine halts, and you keep the union of everything.

Leave out the stopping condition and the query runs until something kills
it. Write the `WHERE` in the same keystroke as the step and it will never
happen to you.

The interesting use is not counting — it is **hierarchies**. Any table
with a self-reference (an employee's manager, a folder's parent, a
category's parent) is a tree pretending to be rows, and a plain join can
only climb one level per join. Recursion climbs as far as the tree goes:

```sql
WITH RECURSIVE chain AS (
  SELECT id, name, role, 1 AS level
  FROM staff WHERE manager_id IS NULL
  UNION ALL
  SELECT s.id, s.name, s.role, chain.level + 1
  FROM staff s JOIN chain ON s.manager_id = chain.id
)
```

Same three parts: start at the person with no manager, then repeatedly
attach everyone who reports to somebody already found. The `level + 1`
rides along and tells you how deep each person sits — a column that
exists nowhere in the table.

### Your goal

Two statements. First a series, then the org chart:

```
n
-
1
2
3
4
5

level | name | role
-------------------
1 | Dana Whitlock | owner
2 | Marcus Bell | cafe lead
2 | Priya Raman | roast lead
3 | Elle Byrne | barista
3 | Jonah Kim | roaster
3 | Rosa Delgado | barista
3 | Sofia Ruiz | roaster
4 | Kwame Osei | apprentice
```

Levels 2 and 3 hold several people each — sort by `level`, then `name`.
