---
id: 04-like-patterns
title: Pattern Matching with LIKE
language: sql
runner: browser
estMinutes: 12
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Find half-remembered products by shape of name rather than exact text: rows whose name contains boo, plus rows whose name starts with C, using LIKE and the % wildcard."
docs: [sql/filtering-with-where]
checks:
  - id: fuzzy-name-search
    type: stdout
    entry: query.sql
    match: exact
    value: "name | category\n---------------\nCast Iron Skillet | kitchen\nBamboo Board | kitchen\nCeramic Mug | kitchen\nKraft Notebook | paper\n"
  - id: two-patterns-one-clause
    type: ai-judge
    rubric: "The WHERE clause uses two LIKE patterns joined by OR: one with a leading and trailing % around boo, and one anchored at the start with C followed by %. No product name is matched with = against a full literal name, no id list is used, and the query ends with ORDER BY id."
hints:
  - "LIKE goes where a comparison would: WHERE name LIKE '<pattern>'. The pattern is ordinary text plus wildcards, in single quotes."
  - "% stands for any run of characters, including none. '%boo%' means 'boo anywhere in the value'; 'C%' means 'starts with C'."
  - "Two patterns, one clause: WHERE name LIKE '%boo%' OR name LIKE 'C%'. Only one OR here, so no parentheses are needed — but they would not hurt."
---
## Searching by shape

`=` is a blunt instrument for text. It demands the whole value, exactly:
miss a letter, guess the capitalisation wrong, and you get nothing back.
But most real text questions are fuzzy. *The one with "boo" in the
name. Everything starting with C. Addresses ending in .edu.* `LIKE`
answers those:

```sql
WHERE name LIKE '%boo%'
```

Two wildcards do all the work:

- `%` — any run of characters, including none at all.
- `_` — exactly one character, no more, no less.

So `'C%'` means *starts with C*, `'%book'` means *ends with book*,
`'%boo%'` means *contains boo somewhere*, and `'C_p'` matches `Cap` and
`Cup` but never `Crisp`. A pattern with no wildcards at all is just an
equality test the slow way.

Two details specific to SQLite. First, `LIKE` is **case-insensitive for
plain ASCII letters** by default — `'c%'` finds `Ceramic Mug` — which is
usually a gift and occasionally a surprise. Second, a pattern that starts
with `%` can't use an index, so on a big table a leading-wildcard search
reads every row. Fine here, worth knowing before you point one at a
million-row table.

And the honest caveat: if the value itself contains a literal `%` or `_`,
you'll need an `ESCAPE` clause to search for it. Rare enough that you can
look it up the day you need it.

### Your goal

A customer half-remembers a product: *it had "boo" in the name... or
maybe it started with C?* Search for both, in one `WHERE` clause. Return
`name` and `category`, ordered by `id`:

```
name | category
---------------
Cast Iron Skillet | kitchen
Bamboo Board | kitchen
Ceramic Mug | kitchen
Kraft Notebook | paper
```

Four rows — and yes, `Kraft Notebook` really does contain `boo`. Reading
patterns back character by character is the whole skill.
