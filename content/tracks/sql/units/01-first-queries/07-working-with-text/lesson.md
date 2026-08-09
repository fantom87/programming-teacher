---
id: 07-working-with-text
title: Working with Text
language: sql
runner: browser
estMinutes: 15
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Build three text columns with SQL's string tools: UPPER(genre) AS shelf, a title || ' by ' || author label, and LENGTH(title) AS title_length."
docs: [sql/select-basics]
checks:
  - id: text-columns
    type: stdout
    entry: query.sql
    match: exact
    value: "shelf | label | title_length\n----------------------------\nSCI-FI | Dune by Frank Herbert | 4\nSCI-FI | Neuromancer by William Gibson | 11\nSCI-FI | The Left Hand of Darkness by Ursula K. Le Guin | 25\nLITERARY | Beloved by Toni Morrison | 7\nFANTASY | The Hobbit by J.R.R. Tolkien | 10\nFANTASY | A Wizard of Earthsea by Ursula K. Le Guin | 20\nNONFICTION | Silent Spring by Rachel Carson | 13\nNONFICTION | The Sixth Extinction by Elizabeth Kolbert | 20\n"
  - id: functions-not-literals
    type: ai-judge
    rubric: "All three columns are computed from the table by SQL: UPPER applied to the genre column, the label built by concatenating the title column, the literal ' by ', and the author column with the || operator, and LENGTH applied to the title column. None of the shelf names, labels, or lengths are typed in as literal values, and ORDER BY id is present."
hints:
  - "UPPER(genre) shouts a column; LENGTH(title) counts its characters. Each still needs an AS name."
  - "Glue text together with two pipes: title || ' by ' || author. The middle piece is literal text, so it needs single quotes — and the spaces inside them matter."
  - "SELECT UPPER(genre) AS shelf, title || ' by ' || author AS label, LENGTH(title) AS title_length FROM books ORDER BY id;"
---
## Text is data too

Numbers aren't the only things you can compute with. SQL ships a set of
**string functions**, and they turn stored text into whatever a human
needs to read.

Three earn their keep immediately:

```sql
SELECT UPPER(genre), LOWER(author), LENGTH(title)
FROM books
ORDER BY id;
```

`UPPER` and `LOWER` change case; `LENGTH` counts characters. Like the
arithmetic in lesson 5, they run once per row and change nothing in the
table — the stored `genre` stays lowercase forever.

The one you'll use most often has no name at all. Two pipe characters
glue text together:

```sql
SELECT title || ' by ' || author
FROM books
ORDER BY id;
```

That's **concatenation**, and it gives you `Dune by Frank Herbert`. Notice
the middle piece: `' by '` in single quotes is *literal text*, spat out
as-is for every row, and the spaces inside the quotes are doing real work.
Drop them and you get `Duneby Frank Herbert`.

Single quotes are how SQL says "this is text, not a column name." Write
`title` and you get the column; write `'title'` and you get the word
*title*, eight times over. That one character is the difference, and it
catches everyone at least once.

The pieces combine as deeply as you like, and numbers join the party
happily:

```sql
SELECT UPPER(title) || ' (' || year || ')' AS headline
FROM books
ORDER BY id;
```

`DUNE (1965)`. The `year` column is an integer, and SQLite converts it to
text on the way into the string without being asked.

This is real work, not decoration: shelf labels, mailing addresses, CSV
exports, and display names in an application are all built exactly this
way — data assembled into a sentence at the moment someone asks for it.

### Your goal

Print a shelf label for every book, ordered by `id`, with three aliased
columns:

- `shelf` — the genre in capitals
- `label` — the title, the word `by`, and the author
- `title_length` — how many characters the title runs to

```
shelf | label | title_length
----------------------------
SCI-FI | Dune by Frank Herbert | 4
SCI-FI | Neuromancer by William Gibson | 11
...
```
