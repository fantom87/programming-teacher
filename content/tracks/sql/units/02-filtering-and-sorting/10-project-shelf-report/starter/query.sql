-- The Monday Shelf Report. Three queries, in this order, each ending in a
-- semicolon and a total ORDER BY. Run after every part.

-- Part 1 — the featured shelf: kitchen or paper, priced 10 to 50, in stock.
--   Columns: name, price, tier (budget / standard / premium via CASE).
--   Priciest first.
SELECT name, price
FROM products
ORDER BY price DESC;

-- Part 2 — the restock list: fewer than 10 units left.
--   Columns: name, stock. Scarcest first, name breaking ties.


-- Part 3 — top rated: the three best-rated products, unreviewed ones out.
--   Columns: name, rating. Best first, name breaking ties.
