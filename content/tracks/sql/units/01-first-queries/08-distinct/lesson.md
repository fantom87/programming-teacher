---
id: 08-distinct
title: One of Each with DISTINCT
language: sql
runner: browser
estMinutes: 12
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Write two DISTINCT queries — the genres on the shelves, then the authors — so eight rows collapse to the values that actually appear."
docs: [sql/select-basics]
checks:
  - id: genres-then-authors
    type: stdout
    entry: query.sql
    match: exact
    value: "genre\n-----\nfantasy\nliterary\nnonfiction\nsci-fi\n\nauthor\n------\nElizabeth Kolbert\nFrank Herbert\nJ.R.R. Tolkien\nRachel Carson\nToni Morrison\nUrsula K. Le Guin\nWilliam Gibson\n"
  - id: distinct-not-handwritten
    type: ai-judge
    rubric: "Both result sets come from querying the books table with the DISTINCT keyword — SELECT DISTINCT genre and SELECT DISTINCT author — each with an ORDER BY on that column. Neither is a hardcoded list of values typed with VALUES or UNION of literals."
hints:
  - "DISTINCT goes immediately after SELECT, before the column: SELECT DISTINCT column FROM ..."
  - "You need two separate statements, each ending in a semicolon. Don't sort by id — it isn't in the result any more — sort by the column you selected."
  - "SELECT DISTINCT genre FROM books ORDER BY genre; then SELECT DISTINCT author FROM books ORDER BY author;"
---
## Which values actually appear?

`SELECT genre FROM books` gives you eight rows, because there are eight
books. But *"what kinds of book does this shop carry?"* is a different
question — and its answer is four rows, not eight. You don't want a row
per book; you want a row per distinct value.

One keyword does it:

```sql
SELECT DISTINCT genre
FROM books
ORDER BY genre;
```

`DISTINCT` sits directly after `SELECT` and throws away duplicate rows
before you see them. Three sci-fi books become one `sci-fi`. This is how
you take the measure of an unfamiliar column: not by scrolling, but by
asking what's in it.

Two details make `DISTINCT` behave predictably.

**It applies to the whole row, not to one column.** Select two columns
and you get every unique *combination*:

```sql
SELECT DISTINCT genre, year
FROM books
ORDER BY genre, year;
```

Two fantasy books published in different years are two different pairs, so
both survive. People routinely expect `DISTINCT` to attach itself to the
first column only — it doesn't, and there's no syntax that makes it.

**Sort by something you selected.** `ORDER BY id` is meaningless here:
once the duplicates collapse there's no single `id` left to sort by —
three sci-fi books had three different ids and only one row survives.
Stricter engines reject that query outright; SQLite waves it through and
quietly returns whatever order suits it, which is worse, because nothing
looks wrong. Order by a column that's actually in the result and the
answer is stable everywhere — which is why these queries come back
alphabetically rather than in shelf order.

Later on you'll meet `COUNT(DISTINCT ...)` — *how many* kinds, rather than
which — and `GROUP BY`, which does everything `DISTINCT` does and quite a
lot more. For now, `DISTINCT` is the fastest way to see a column's
vocabulary.

### Your goal

Two statements in `query.sql`, in this order:

1. Every genre on the shelves, once each, alphabetically.
2. Every author, once each, alphabetically — Ursula K. Le Guin wrote two
   of these books and should appear only once.

```
genre
-----
fantasy
literary
nonfiction
sci-fi

author
------
Elizabeth Kolbert
...
```

Two statements, two result sets, with a blank line between them.
