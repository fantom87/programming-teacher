---
id: 04-every-join
title: Every Join in One Dataset
language: sql
runner: browser
estMinutes: 18
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Four joins over the same six tables: a four-table INNER join for order lines, a LEFT JOIN shelf report that keeps unstocked albums, a LEFT-JOIN-IS-NULL anti-join, and a self-join that pairs an artist's albums without duplicates."
docs: [sql/joins, sql/select-basics, sql/filtering-with-where]
checks:
  - id: joins-output
    type: stdout
    entry: query.sql
    match: exact
    value: "customer | album | qty | line_total\n-----------------------------------\nDara Okon | Ash & Ivory | 2 | 36.50\nDara Okon | Paper Lantern | 1 | 23.95\nPriya Raman | Slow Tide | 1 | 28.75\nDara Okon | Long Winter | 1 | 31.25\nDara Okon | Verre | 1 | 21.45\nTomas Beck | Bleu Nuit | 2 | 69.50\nInes Duarte | Paper Lantern | 1 | 23.95\nInes Duarte | Slow Tide | 2 | 57.50\nPriya Raman | Long Winter | 1 | 31.25\nPriya Raman | Verre | 1 | 21.45\n\ntitle | on_hand\n---------------\nAsh & Ivory | 0\nBleu Nuit | NULL\nLong Winter | 3\nNocturne | NULL\nPaper Lantern | 4\nSlow Tide | 2\nVerre | 7\n\nname\n----\nHalcyon Bay\n\nartist | first_album | second_album\n-----------------------------------\nNina Kestrel | Paper Lantern | Slow Tide\nSolaine | Verre | Bleu Nuit\nThe Ember Hours | Ash & Ivory | Long Winter\n"
  - id: joins-not-subqueries
    type: ai-judge
    rubric: "Query 1 joins order_items to orders, customers and albums with explicit JOIN ... ON syntax and short table aliases — not comma-separated tables with join conditions hidden in WHERE, and not correlated subqueries fetching the name or title per row. Query 2 uses LEFT JOIN so the two albums with no stock row survive with NULL on_hand; it is not an INNER JOIN and not a UNION of two queries. Query 3 is a genuine anti-join — LEFT JOIN albums followed by a WHERE that tests the right-hand side IS NULL — rather than NOT IN, NOT EXISTS, or a hardcoded name. Query 4 joins albums to itself with an inequality (b.id > a.id or equivalent) in the ON clause so each pair appears once and no album pairs with itself."
hints:
  - "Alias every table and qualify every column: FROM order_items oi JOIN orders o ON o.id = oi.order_id JOIN customers c ON c.id = o.customer_id JOIN albums a ON a.id = oi.album_id. Sort by oi.order_id, a.title."
  - "LEFT JOIN keeps the left side whole and fills the right with NULL: FROM albums a LEFT JOIN stock s ON s.album_id = a.id. Turn that into an anti-join by demanding the fill: WHERE al.id IS NULL."
  - "A self-join is two aliases over one table. Put the de-duplication in the ON clause — JOIN albums b ON b.artist_id = a.artist_id AND b.id > a.id — and join artists a third time to get the name."
---
## The same six tables, four ways

Joins are not four features; they are one feature — pair rows from two
row sources on a condition — plus a policy for what happens to rows that
found no partner.

- **INNER** — unmatched rows on either side disappear.
- **LEFT** — the left side survives whole; the right side arrives as
  `NULL`.
- **RIGHT / FULL** — SQLite has supported both since 3.39, but the idiom
  is still to flip the tables and write `LEFT`. Reviewers read it faster.
- **CROSS** — every row with every row. Almost always a forgotten `ON`
  clause rather than an intention.

Three things this drill will make you feel:

`ON` conditions never match `NULL`. A row whose join key is `NULL` finds
no partner, in either direction — that is not a bug to work around, it
is the definition.

The **anti-join** is the LEFT JOIN's best trick: join, then keep only
the rows where the right side came back `NULL`. That is how you ask
"which of these has none of those" without a subquery.

A **self-join** is two aliases over one table. Pairing rows without
duplicates means putting an inequality in the `ON` clause — `b.id >
a.id` gives you each pair once and never pairs a row with itself.

And joins multiply rows. An album with three order lines appears three
times; sum before you join if that would double-count.

### Your goal

Four queries in `query.sql`, in this order:

1. **Order lines** — `customer`, `album`, `qty`, `line_total` (two
   decimals), sorted by order id then album title.
2. **Shelf report** — `title` and `on_hand` for *every* album, sorted by
   title.
3. **Anti-join** — the `name` of every artist we carry nothing by.
4. **Self-join** — `artist`, `first_album`, `second_album`: each pair of
   albums by one artist, once, lower id first, sorted by artist.

```
customer | album | qty | line_total
-----------------------------------
Dara Okon | Ash & Ivory | 2 | 36.50
...

title | on_hand
---------------
Ash & Ivory | 0
Bleu Nuit | NULL
...

name
----
Halcyon Bay

artist | first_album | second_album
-----------------------------------
Nina Kestrel | Paper Lantern | Slow Tide
...
```
