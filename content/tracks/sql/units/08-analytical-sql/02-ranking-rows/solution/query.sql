-- North's sales, biggest first, numbered three different ways.
SELECT
  id,
  roast,
  revenue,
  ROW_NUMBER() OVER (ORDER BY revenue DESC, id) AS row_num,
  RANK()       OVER (ORDER BY revenue DESC)     AS rank_num,
  DENSE_RANK() OVER (ORDER BY revenue DESC)     AS dense_num
FROM sales
WHERE region = 'North'
ORDER BY revenue DESC, id;
