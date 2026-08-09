---
id: 05-math-in-the-select-list
title: Math in the SELECT List
language: sql
runner: browser
estMinutes: 15
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Add a computed column — ROUND(price * copies, 2) — beside title, price, and copies, so the database does the arithmetic once per row."
docs: [sql/select-basics]
checks:
  - id: shelf-value-computed
    type: stdout
    entry: query.sql
    match: exact
    value: "title | price | copies | ROUND(price * copies, 2)\n-------------------------------------------------\nDune | 12.95 | 3 | 38.85\nNeuromancer | 9.25 | 2 | 18.5\nThe Left Hand of Darkness | 11.75 | 1 | 11.75\nBeloved | 10.45 | 4 | 41.8\nThe Hobbit | 8.99 | 6 | 53.94\nA Wizard of Earthsea | 7.25 | 2 | 14.5\nSilent Spring | 6.75 | 1 | 6.75\nThe Sixth Extinction | 14.99 | 5 | 74.95\n"
  - id: computed-not-typed
    type: ai-judge
    rubric: "The fourth column is computed by the database from the price and copies columns — ROUND(price * copies, 2) — not typed in as literal numbers, and not a hardcoded list of values via UNION or VALUES. The first three columns are the plain title, price, and copies columns, and ORDER BY id is present."
hints:
  - "A SELECT list item doesn't have to be a bare column name — it can be a calculation using column names, like price * 2."
  - "Multiply the two columns for each row: price * copies. Add it as a fourth item after copies, separated by a comma."
  - "Wrap the multiplication so stray decimals get tidied: ROUND(price * copies, 2) — the 2 means two decimal places."
---
## Let the database do the arithmetic

Everything in your `SELECT` list so far has been a column name. It doesn't
have to be. Each item can be an **expression** — a calculation the
database performs once for every row:

```sql
SELECT title, price * copies
FROM books
ORDER BY id;
```

That second item isn't stored anywhere. For each book the engine reaches
for that row's `price` and that row's `copies`, multiplies them, and puts
the answer in the result set. Eight rows, eight multiplications, nothing
in the table changed. The usual operators are all there: `+`, `-`, `*`,
`/`.

Two things will surprise you, and both are worth meeting now rather than
in a report that's already wrong.

**Whole numbers divide like whole numbers.** `SELECT 7 / 2` gives `3`, not
`3.5` — two integers in, an integer out. Make one side a decimal and you
get what you expected: `7.0 / 2` is `3.5`.

**Decimals carry crumbs.** Run `price * copies` raw on Dune and you get
`38.849999999999994`. Nothing is broken; decimal numbers are stored in
binary, and a few of them can only be approximated, so tiny errors
survive the multiplication. The cure is to round the answer to the
precision you actually meant:

```sql
SELECT title, ROUND(price * copies, 2)
FROM books
ORDER BY id;
```

`ROUND(value, 2)` keeps two decimal places. Do this to any money that a
human will read.

One more display quirk to expect: SQLite prints numbers as compactly as
it can, so a shelf value of 18.50 comes back as `18.5`. That's a
formatting question, not a wrong number — you'll meet proper money
formatting later.

### Your goal

Show what's sitting on each shelf: `title`, `price`, `copies`, and then
the **shelf value** — price times copies, rounded to two places — ordered
by `id`.

```
title | price | copies | ROUND(price * copies, 2)
-------------------------------------------------
Dune | 12.95 | 3 | 38.85
Neuromancer | 9.25 | 2 | 18.5
...
```

Yes, that fourth header is hideous. The next lesson is entirely about
fixing it.
