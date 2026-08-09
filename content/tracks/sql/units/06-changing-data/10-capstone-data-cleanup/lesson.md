---
id: 10-capstone-data-cleanup
title: "Capstone: Data Cleanup"
language: sql
runner: browser
estMinutes: 35
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Turn last night's filthy supplier import into clean shelf data with one script: normalize the text, backfill the missing prices from the house list, dedupe by name, upsert everything into coffees, clear the staging table, and print the receipt."
docs: [sql/inserting-and-updating, sql/deleting-data, sql/subqueries]
checks:
  - id: cleanup-receipt
    type: stdout
    entry: query.sql
    match: exact
    value: "name | origin | roast | price | bags\n------------------------------------\nCloud Cover | Ethiopia | light | 19.45 | 15\nDeep Well | Sumatra | dark | 18.95 | 22\nFog Line | Rwanda | light | 17.45 | 12\nHalf Past Four | Colombia | medium | 15.75 | 40\nHarbor Light | Honduras | medium | 15.95 | 20\nMorning Ritual | Ethiopia | light | 16.95 | 24\nNight Shift | Brazil | dark | 13.45 | 14\nQuarry Road | Yemen | dark | 21.55 | 4\n\ncoffees | bags_on_hand\n----------------------\n8 | 151\n\nleftover_imports\n----------------\n0\n"
  - id: every-value-derived
    type: ai-judge
    rubric: "The script does the work in SQL rather than by hand. Part 1 is one UPDATE over all of imports that TRIMs the name, lowercases the trimmed roast, and rebuilds the trimmed origin in capitalised house style with SUBSTR and UPPER/LOWER. Part 2 backfills with UPDATE imports SET price = (a correlated subquery over roast_prices matched on roast) WHERE price IS NULL, and relies on Part 1 having lowercased the roast — the house prices 17.45, 15.45 and 18.95 are never typed in query.sql. Part 3 dedupes with a single DELETE keeping the minimum id per name (DELETE FROM imports WHERE id NOT IN (SELECT MIN(id) FROM imports GROUP BY name)) rather than deleting a hardcoded id. Part 4 is one INSERT INTO coffees ... SELECT ... FROM imports with an ON CONFLICT(name) DO UPDATE that adds excluded.bags to the existing bags and takes excluded.price — no per-coffee INSERT or UPDATE statements, and no coffee name or bag total typed as a literal. Part 5 empties imports with a bare DELETE and ends with the three verifying SELECTs."
hints:
  - "Do one part at a time and run after each. Debug Part 1 by ending your script temporarily with SELECT id, name, origin, roast, price FROM imports ORDER BY id; — you should see 'Deep Well' with no spaces, 'Sumatra' capitalised, and 'dark' lowercase before you go on."
  - "House style for origin is capital-first: UPPER(SUBSTR(TRIM(origin), 1, 1)) || LOWER(SUBSTR(TRIM(origin), 2)) — the || operator glues strings together. Part 2 depends on Part 1, because 'DARK' would never match the 'dark' row in roast_prices."
  - "Part 4 needs a WHERE for SQLite's parser to tell the upsert's ON from a join's ON: SELECT name, origin, roast, price, bags FROM imports WHERE true ON CONFLICT(name) DO UPDATE SET bags = coffees.bags + excluded.bags, price = excluded.price; — qualify the left-hand bags with the table name so it is clear you mean the shelf, not the arriving row."
---
## The morning after the import

This is the Intermediate capstone, and it's the job you'll actually be
handed. Overnight a supplier file landed in `imports` exactly as it
arrived: stray spaces around names, lowercase origins, roasts shouting
in capitals, two missing prices, one coffee listed twice. Somebody turns
that into shelf data before the shop opens. Today it's you.

Every tool is from this unit. What the capstone adds is **order** — five
parts, each working only because the one before it ran. Get the sequence
wrong and nothing errors; you just get quietly wrong data.

### Your goal

**Part 1 — normalize.** One `UPDATE` over every row of `imports`: `TRIM`
the `name`, lowercase the trimmed `roast`, rebuild the trimmed `origin`
in house style (capital first letter, lowercase rest). No `WHERE`.

**Part 2 — backfill.** Rows whose `price` is `NULL` take the house price
for their roast from `roast_prices`, via a correlated subquery. Needs
Part 1: `'DARK'` matches nothing in `roast_prices`.

**Part 3 — dedupe.** One coffee appears twice. Keep the lowest `id` per
name — `DELETE ... WHERE id NOT IN (SELECT MIN(id) ... GROUP BY name)`.
Needs Part 1 too: untrimmed names don't group.

**Part 4 — merge.** One `INSERT INTO coffees ... SELECT ... FROM imports`
with `ON CONFLICT(name) DO UPDATE`: known names get the arriving bags
added and their price refreshed, new names are inserted.

**Part 5 — clear and prove.** Empty `imports`, then three `SELECT`s: the
shelf by name, a `COUNT(*)`/`SUM(bags)` summary, and what's left in
staging.

```
name | origin | roast | price | bags
------------------------------------
Cloud Cover | Ethiopia | light | 19.45 | 15
Deep Well | Sumatra | dark | 18.95 | 22
Fog Line | Rwanda | light | 17.45 | 12
Half Past Four | Colombia | medium | 15.75 | 40
Harbor Light | Honduras | medium | 15.95 | 20
Morning Ritual | Ethiopia | light | 16.95 | 24
Night Shift | Brazil | dark | 13.45 | 14
Quarry Road | Yemen | dark | 21.55 | 4

coffees | bags_on_hand
----------------------
8 | 151

leftover_imports
----------------
0
```

Not one coffee name, price or bag total is typed in your script — every
value is read, computed or merged. Ship it, and the Intermediate tier is
yours.
