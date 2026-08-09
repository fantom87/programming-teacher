point = (3, 7)
high_scores = [("Mira", 12), ("Josh", 9), ("Priya", 15)]
total = 0

x, y = point
print(f"x={x}, y={y}")
for name, score in high_scores:
    print(f"{name} scored {score}")
    total = total + score
print(f"Total: {total}")
