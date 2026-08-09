-- Kitchen or home, and under 30.00. The parentheses are the whole lesson.
SELECT name, category, price
FROM products
WHERE (category = 'kitchen' OR category = 'home')
  AND price < 30
ORDER BY id;
