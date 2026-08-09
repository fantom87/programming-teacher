---
id: 05-normalizing-a-wide-table
title: Normalizing a Wide Table
language: sql
runner: browser
estMinutes: 22
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Take Riverside's one-row-per-checkout spreadsheet and split it into members, books and loans — pulling the distinct entities out first, then rebuilding every original row as foreign keys, with the counts to prove nothing was lost."
docs: [sql/creating-tables, sql/inserting-and-updating, sql/joins]
checks:
  - id: three-tables-from-one
    type: stdout
    entry: query.sql
    match: exact
    value: "id | name | card_no\n-------------------\n1 | Ada Fern | 004\n2 | Marcus Wood | 017\n3 | Priya Rao | 021\n4 | Dana Okoye | 032\n\nid | title | author\n-------------------\n1 | Braiding Sweetgrass | Robin Wall Kimmerer\n2 | Piranesi | Susanna Clarke\n3 | Station Eleven | Emily St. John Mandel\n4 | The Overstory | Richard Powers\n\nloans_rows | export_rows\n------------------------\n8 | 8\n"
  - id: derived-not-retyped
    type: ai-judge
    rubric: "members and books are populated by INSERT ... SELECT DISTINCT reading riverside_export — no member names, card numbers, titles or authors are retyped as VALUES literals anywhere in query.sql. loans is populated by a second INSERT ... SELECT over riverside_export that joins to the new members and books tables to translate card numbers and titles into ids, so no id numbers are hardcoded either. The three CREATE TABLE statements declare integer primary keys, NOT NULL on the required columns, UNIQUE on card_no, and REFERENCES clauses on loans.member_id and loans.book_id."
hints:
  - "Create all three tables first, then fill them in dependency order: members and books can't be looked up until they exist and have ids."
  - "Entities come out with DISTINCT: INSERT INTO members (name, card_no) SELECT DISTINCT member_name, member_card FROM riverside_export ORDER BY member_card; — ids get assigned in that order, and the same shape fills books from the title/author pair."
  - "The loans insert reads the export one more time and swaps text for ids: SELECT m.id, b.id, e.borrowed_on FROM riverside_export e JOIN members m ON m.card_no = e.member_card JOIN books b ON b.title = e.book_title ORDER BY e.row_id;"
---
## One fact, one place

Open `schema.sql` and look at what Riverside branch sent over: one row
per checkout, with the borrower's name and card retyped on every line,
and the title and author retyped beside them. `Piranesi` appears four
times. `Ada Fern` appears three.

Every repetition is a chance to disagree. Someone fixes a typo in one
row and not the others; a member changes their name and the table now
holds two people who are one person. There's no way to record a book the
branch owns but nobody has borrowed yet — no checkout, no row, no book.
And deleting the last loan of a title erases the title. That family of
problems is what **normalization** solves, and the fix is one sentence:
*store each fact once, and refer to it everywhere else.*

Three questions get you there. What are the real things here? Members,
books, and the events connecting them. What identifies each one? A card
number for a member, a title for a book — but you'll give both a
meaningless integer key so the identifying fact stays free to change.
And what depends on what? The borrow date belongs to the checkout, not
to the member and not to the book; that's the whole content of *third
normal form* — no column may depend on anything but the key.

The split itself is two moves. First, pull each distinct entity out:

```sql
INSERT INTO members (name, card_no)
SELECT DISTINCT member_name, member_card FROM riverside_export;
```

Then read the export a second time, joining back to the tables you just
filled, so each original row becomes a pair of ids and a date. Nothing is
retyped by hand — the export is the only source of truth, and if it's
wrong, it's wrong exactly once.

### Your goal

Build `members`, `books` and `loans` with proper keys, fill them from
`riverside_export`, and prove the split was lossless:

```
id | name | card_no
-------------------
1 | Ada Fern | 004
...

loans_rows | export_rows
------------------------
8 | 8
```

Eight rows in, eight rows out — but now `Piranesi` is stored once.
