-- North's sales, biggest first, numbered three different ways.
-- TODO: add row_num, rank_num and dense_num using ROW_NUMBER, RANK and
-- DENSE_RANK. All three order by revenue DESC; only row_num needs a
-- tie-breaker so its numbering is reproducible.
SELECT
  id,
  roast,
  revenue
FROM sales
WHERE region = 'North'
ORDER BY revenue DESC, id;
