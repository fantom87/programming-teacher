SELECT COUNT(*) AS sales,
       COUNT(rating) AS rated,
       SUM(rating) AS rating_sum,
       AVG(rating) AS avg_rating,
       SUM(rating) * 1.0 / COUNT(*) AS avg_if_zero
FROM sales;
