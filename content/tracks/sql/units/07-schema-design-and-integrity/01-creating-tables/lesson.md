---
id: 01-creating-tables
title: Creating Tables
language: sql
runner: browser
estMinutes: 12
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Write the CREATE TABLE for Fernwood's members, insert the four founding members, and prove with typeof() that a TEXT column keeps card number '004' intact where an INTEGER one would have eaten the zeros."
docs: [sql/creating-tables, sql/what-is-a-database]
checks:
  - id: members-table-and-affinity
    type: stdout
    entry: query.sql
    match: exact
    value: "id | name | card_no | joined_on\n-------------------------------\n1 | Ada Fern | 004 | 2023-01-14\n2 | Marcus Wood | 017 | 2023-06-02\n3 | Priya Rao | 021 | 2024-02-20\n4 | Dana Okoye | 032 | 2024-11-05\n\nid_type | card_type | card_as_int\n---------------------------------\ninteger | text | 4\n"
  - id: real-ddl
    type: ai-judge
    rubric: "query.sql builds the table itself: a CREATE TABLE members statement declaring id INTEGER, name TEXT, card_no TEXT and joined_on TEXT (card_no must be TEXT, not INTEGER), followed by an INSERT that supplies all four member rows. The first SELECT reads the columns back from members and ends with ORDER BY id rather than relying on insertion order; the second reads typeof() and CAST() from the stored row rather than printing the words 'integer' and 'text' as literals."
hints:
  - "One statement at a time, each ending in a semicolon. The table first: CREATE TABLE members ( id INTEGER, name TEXT, card_no TEXT, joined_on TEXT );"
  - "One INSERT can carry every row: INSERT INTO members (id, name, card_no, joined_on) VALUES (1, 'Ada Fern', '004', '2023-01-14'), (2, ...), ... — comma between rows, semicolon at the end."
  - "Quote '004' as a string. If you write it bare, SQLite reads the number 4 and the leading zeros are gone before the row ever lands. Finish with ORDER BY id on the first SELECT and WHERE id = 1 on the typeof() one."
---
## The shape comes first

Every query you've written so far was a question. This unit is about the
thing being questioned — the table itself. `CREATE TABLE` is where you
decide what a *member* is at Fernwood Library: which facts you keep,
what each one is called, and what kind of value it holds.

```sql
CREATE TABLE branches (
  id        INTEGER,
  name      TEXT,
  opened_on TEXT
);
```

Name, type, comma. That's the entire grammar, and `schema.sql` has an
example of it sitting in your workspace already.

Now the part that surprises people arriving from other databases: in
SQLite a column type is an **affinity**, not a rule. It's a preference
about how values should be stored when they can be converted. Hand an
`INTEGER` column the text `'42'` and it quietly stores the number 42.
Hand a `TEXT` column the same thing and it stays the four-character
string. There are five affinities — `INTEGER`, `TEXT`, `REAL`,
`NUMERIC`, `BLOB` — and every type name you can write maps onto one.

That flexibility is friendly right up until it eats your data. Fernwood's
library cards read `004`, `017`, `032`. Declare `card_no INTEGER` and the
first insert turns `'004'` into `4` — the zeros are gone, permanently,
and every printed card in the building is now wrong. Declare it `TEXT`
and the string survives, because you told SQLite these digits are a
label, not a quantity. Same reasoning for dates: SQLite has no date type,
so you store ISO strings like `'2023-01-14'`, which sort and compare
correctly precisely *because* they're text.

One more habit to start now: rows come back in whatever order SQLite
finds convenient, and that order can change when the table does. If you
want a predictable result — and every check in this unit wants one —
end the query with `ORDER BY`.

### Your goal

Create `members` with `id`, `name`, `card_no`, `joined_on`; insert the
four founding members; then show them, and prove the affinity held:

```
id | name | card_no | joined_on
-------------------------------
1 | Ada Fern | 004 | 2023-01-14
...

id_type | card_type | card_as_int
---------------------------------
integer | text | 4
```

That last `4` is what an `INTEGER` card number would have cost you.
