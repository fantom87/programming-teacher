---
id: 07-dates-and-months
title: Dates and Months
language: sql
runner: browser
estMinutes: 16
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Roll the twelve sales up into one row per calendar month using strftime('%Y-%m', sold_on) as the grouping key, and measure each month's active span in whole days with julianday arithmetic."
docs: [sql/group-by-and-having, sql/select-basics]
checks:
  - id: monthly-rollup
    type: stdout
    entry: query.sql
    match: exact
    value: "month | orders | revenue | days_span\n------------------------------------\n2026-01 | 4 | 320 | 22\n2026-02 | 4 | 294 | 21\n2026-03 | 4 | 408 | 23\n"
  - id: real-date-functions
    type: ai-judge
    rubric: "The month column is produced by strftime('%Y-%m', sold_on) and the query groups by that month value — not by substr/LIKE string slicing and not by a hand-written list of month literals. days_span is computed from julianday(MAX(sold_on)) - julianday(MIN(sold_on)) cast or rounded to a whole number, not typed in. orders is COUNT(*) and revenue is SUM(revenue)."
hints:
  - "strftime cuts a piece out of a date: strftime('%Y-%m', sold_on) turns 2026-01-05 into 2026-01. Alias it AS month and you can GROUP BY month."
  - "The aggregates are the usual pair: COUNT(*) AS orders and SUM(revenue) AS revenue, with GROUP BY month ORDER BY month underneath."
  - "julianday turns a date into a number of days, so subtracting two of them gives a day count: CAST(julianday(MAX(sold_on)) - julianday(MIN(sold_on)) AS INTEGER) AS days_span."
---
## Dates are text until you ask nicely

SQLite has no date type. None. Your `sold_on` column holds the plain
string `'2026-01-05'`, and everything date-shaped in SQLite is a function
that reads or writes that format.

This sounds like a limitation and mostly isn't, because ISO dates —
`YYYY-MM-DD`, zero-padded, biggest unit first — sort *correctly as text*.
`'2026-01-05' < '2026-02-03'` is true for the same reason `'a' < 'b'` is.
Store dates any other way and you lose that for good; store them like
this and the string functions do real date work.

The workhorse is **`strftime(format, date)`**, which pulls formatted
pieces out:

```sql
strftime('%Y-%m', sold_on)   -- '2026-01'  year and month
strftime('%Y',    sold_on)   -- '2026'     year
strftime('%m',    sold_on)   -- '01'       month number
strftime('%w',    sold_on)   -- '1'        weekday, 0 = Sunday
```

That first one is the one you'll reach for constantly, because it is how
you group by month:

```sql
SELECT strftime('%Y-%m', sold_on) AS month, SUM(revenue)
FROM sales GROUP BY month;
```

For arithmetic there are two more. **`date()`** shifts:
`date(sold_on, '+30 days')`, `date(sold_on, 'start of month')`,
`date('now', '-1 year')` — modifiers stack left to right. And
**`julianday()`** converts a date to a running day number, which makes
*differences* possible:

```sql
julianday(MAX(sold_on)) - julianday(MIN(sold_on))
```

That's a real number of days between two dates. `CAST(... AS INTEGER)`
trims it to whole days.

One warning worth carrying: `strftime` returns **text**, always. Sorting
by it works because ISO strings sort right; doing maths on it does not.
Comparisons need matching shapes — `strftime('%Y-%m', sold_on) =
'2026-03'` is right, `= 2026` is a silent no-match.

### Your goal

Rewrite `query.sql` into a monthly rollup that prints exactly:

```
month | orders | revenue | days_span
------------------------------------
2026-01 | 4 | 320 | 22
2026-02 | 4 | 294 | 21
2026-03 | 4 | 408 | 23
```

`days_span` is the whole number of days between each month's first and
last sale.
