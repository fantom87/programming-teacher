---
id: 06-naming-columns-with-as
title: Naming Columns with AS
language: sql
runner: browser
estMinutes: 12
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Alias both output columns with AS — title becomes book and the rounded price * copies becomes shelf_value — so the header line reads like a report."
docs: [sql/select-basics]
checks:
  - id: aliased-headers
    type: stdout
    entry: query.sql
    match: exact
    value: "book | shelf_value\n------------------\nDune | 38.85\nNeuromancer | 18.5\nThe Left Hand of Darkness | 11.75\nBeloved | 41.8\nThe Hobbit | 53.94\nA Wizard of Earthsea | 14.5\nSilent Spring | 6.75\nThe Sixth Extinction | 74.95\n"
hints:
  - "AS goes after the thing being named: SELECT something AS chosen_name."
  - "Both items get one: title AS book, and the whole ROUND(...) expression AS shelf_value."
  - "SELECT title AS book, ROUND(price * copies, 2) AS shelf_value FROM books ORDER BY id;"
---
## Give the column a name

Last lesson's result set came back with this for a header:

```
ROUND(price * copies, 2)
```

The database had no name to use, so it printed the recipe. Accurate,
unreadable. `AS` lets you name the output column yourself:

```sql
SELECT ROUND(price * copies, 2) AS shelf_value
FROM books
ORDER BY id;
```

Now the header says `shelf_value`. The name you invent here is called an
**alias**, and it belongs to the result set only — nothing about the
stored table changes, and the next query knows nothing about it.

Aliases work on plain columns too, not just expressions:

```sql
SELECT title AS book, author AS written_by
FROM books
ORDER BY id;
```

That's how you make a result set speak the language of whoever is reading
it — a database column called `qty_on_hand` can arrive as `In stock` in a
report without anybody renaming anything.

Two details worth knowing. First, `AS` is optional: `price * 0.9
sale_price` means the same thing as `price * 0.9 AS sale_price`. Leave the
`AS` in anyway. Without it, one missing comma turns two columns into one
aliased column, and the query runs happily while doing the wrong thing.

Second, an alias with spaces or punctuation needs double quotes:

```sql
SELECT ROUND(price * copies, 2) AS "shelf value"
FROM books
ORDER BY id;
```

Single quotes mean *text* in SQL, double quotes mean *identifier* — a
distinction worth burning in early, because mixing them up produces some
genuinely confusing results. The plain, quote-free `snake_case` alias is
what most professionals reach for, and it's what you'll use here.

Naming things well is most of programming, and SQL is no exception: a
query whose headers explain themselves is one you can hand to a colleague
without a covering note.

### Your goal

Rebuild the shelf-value report from last lesson, but with headers you
chose — `book` and `shelf_value`, ordered by `id`:

```
book | shelf_value
------------------
Dune | 38.85
Neuromancer | 18.5
...
```
