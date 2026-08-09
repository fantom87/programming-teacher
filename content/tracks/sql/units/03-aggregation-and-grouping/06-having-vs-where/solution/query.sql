SELECT category,
       COUNT(*) AS sales,
       SUM(qty * unit_price) AS revenue
FROM sales
WHERE channel = 'counter'
GROUP BY category
HAVING SUM(qty * unit_price) > 100
ORDER BY category;
