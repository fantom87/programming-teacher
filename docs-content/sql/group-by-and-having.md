# GROUP BY and HAVING

Aggregates over a whole table give one row. `GROUP BY` gives one row *per group* — sales per country, orders per customer, posts per month.

## One row per group

```sql
SELECT country, COUNT(*) AS users
FROM users
GROUP BY country;
```

```
country | users
--------+------
Brazil  | 12
Canada  | 31
Mexico  | 18
```

Every distinct `country` becomes a group; `COUNT(*)` runs once per group. The rule: any column in the SELECT list must either be in the `GROUP BY` or wrapped in an aggregate. (`SELECT name, country, COUNT(*)` with only `GROUP BY country` is ambiguous — which name?)

## Grouping by multiple columns

Each unique combination becomes a group:

```sql
SELECT country, city, COUNT(*) AS users
FROM users
GROUP BY country, city;
```

## HAVING: filtering groups

`WHERE` filters *rows before grouping*. `HAVING` filters *groups after aggregation* — it's the only place you can use an aggregate in a condition:

```sql
-- countries with at least 20 users
SELECT country, COUNT(*) AS users
FROM users
GROUP BY country
HAVING COUNT(*) >= 20;
```

Both can appear in one query, doing different jobs:

```sql
-- among adults, countries averaging over 40
SELECT country, AVG(age) AS avg_age
FROM users
WHERE age >= 18            -- rows in
GROUP BY country
HAVING AVG(age) > 40;      -- groups out
```

## Conditional aggregation

A `CASE` expression inside an aggregate counts or sums selectively — one query, several answers per group:

```sql
SELECT country,
       COUNT(*) AS total,
       SUM(CASE WHEN age < 18 THEN 1 ELSE 0 END) AS minors
FROM users
GROUP BY country;
```

## The logical order of a query

SQL runs your clauses in a different order than you write them:

```
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

This explains the rules you've hit: `WHERE` can't see aggregates (they haven't run yet), and `HAVING` exists because groups don't exist until after `GROUP BY`. Keep this pipeline in your head and most "why won't this work" moments dissolve.
