---
id: 06-deleting-rows
title: Deleting Rows
language: sql
runner: browser
estMinutes: 14
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Retire the Brazilian coffees — counting them before you delete them — and then empty the staging table deliberately, with the one DELETE that is supposed to have no WHERE."
docs: [sql/deleting-data, sql/filtering-with-where]
checks:
  - id: counted-then-deleted
    type: stdout
    entry: query.sql
    match: exact
    value: "doomed\n------\n1\n\nid | name | origin\n------------------\n1 | Morning Ritual | Ethiopia\n2 | Deep Well | Sumatra\n3 | Half Past Four | Colombia\n5 | Cloud Cover | Ethiopia\n\nstaged\n------\n0\n"
  - id: count-first-then-targeted-delete
    type: ai-judge
    rubric: "query.sql opens with SELECT COUNT(*) AS doomed FROM coffees using the same WHERE the delete will use (origin = 'Brazil'), followed by DELETE FROM coffees with that identical WHERE. The staging table is emptied with a bare DELETE FROM staging_deliveries and no WHERE clause. The coffees delete is targeted by origin, not by listing ids or names, and no DROP TABLE is used anywhere."
hints:
  - "DELETE has the same skeleton as UPDATE minus the SET: DELETE FROM coffees WHERE origin = 'Brazil';"
  - "Count with the same condition before you commit to it: SELECT COUNT(*) AS doomed FROM coffees WHERE origin = 'Brazil'; — AS names the column so the output header reads doomed."
  - "Emptying staging_deliveries is the deliberate case: DELETE FROM staging_deliveries; with no WHERE. Then verify with SELECT COUNT(*) AS staged FROM staging_deliveries;"
---
## The statement with no undo

`DELETE` is the shortest statement in this unit and the one that deserves
the most care:

```sql
DELETE FROM coffees WHERE origin = 'Brazil';
```

Same skeleton as `UPDATE`, minus the `SET`. There's nothing to change —
the matching rows simply stop existing. Which means the danger is the
same as `UPDATE`'s, only sharper: an `UPDATE` with a bad `WHERE` writes
wrong values you can often reason back from, while a `DELETE` with a bad
`WHERE` leaves nothing to reason from at all.

So the rehearsal habit tightens by one notch. With `UPDATE` you preview
the rows. With `DELETE`, count them:

```sql
SELECT COUNT(*) AS doomed FROM coffees WHERE origin = 'Brazil';
```

A number you can sanity-check in one glance. Expecting to retire one
supplier's coffee and the count says 47? You just caught a typo in your
`WHERE` before it cost you the table. (`AS doomed` names the output
column — the label is for you, and the habit of naming computed columns
pays off everywhere.)

And then there's the naked delete:

```sql
DELETE FROM staging_deliveries;
```

No `WHERE`, so no filter, so *every row goes*. Written by accident this
is a catastrophe. Written on purpose it's exactly right: a staging table
holds a batch of incoming data, and once you've merged that batch, the
table's job is done and it should be empty for the next one. The
statement is identical either way — only your intent differs, which is
precisely why the count-first habit exists.

One distinction to keep straight: `DELETE FROM staging_deliveries`
empties the table but leaves it standing, columns and all, ready for the
next batch. `DROP TABLE staging_deliveries` removes the table itself.
Rows are data; tables are schema. This unit only touches data.

### Your goal

Count, delete, clear, verify — four statements, three result sets:

```
doomed
------
1

id | name | origin
------------------
1 | Morning Ritual | Ethiopia
2 | Deep Well | Sumatra
3 | Half Past Four | Colombia
5 | Cloud Cover | Ethiopia

staged
------
0
```
