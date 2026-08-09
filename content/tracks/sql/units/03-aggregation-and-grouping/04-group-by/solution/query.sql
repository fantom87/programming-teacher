SELECT category,
       COUNT(*) AS sales,
       SUM(qty * unit_price) AS revenue
FROM sales
GROUP BY category
ORDER BY category;
