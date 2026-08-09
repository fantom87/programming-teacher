-- Aggregation and grouping. Three queries, in this order.

-- 1. One row for the whole catalog: albums (row count), dated (albums with
--    a year), artists (distinct artist_id), avg_price, top_price.
--    Money to two decimals.


-- 2. artist_id, titles, catalog_value for artists with MORE THAN ONE album,
--    richest catalog first.


-- 3. One row per era — "undated" (no year), "recent" (2022 or later),
--    otherwise "back catalog" — with titles, premium (how many priced 24+)
--    and avg_price. Sorted by era.
