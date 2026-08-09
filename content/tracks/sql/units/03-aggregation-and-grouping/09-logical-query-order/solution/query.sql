SELECT item,
       COUNT(*) AS sales,
       SUM(qty * unit_price) AS revenue,
       ROUND(AVG(rating), 2) AS avg_rating
FROM sales
WHERE rating IS NOT NULL
GROUP BY item
HAVING COUNT(*) >= 2
ORDER BY revenue DESC;
