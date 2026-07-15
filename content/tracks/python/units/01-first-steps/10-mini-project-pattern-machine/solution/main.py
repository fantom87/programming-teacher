size = 6   # leave this at 6 — but your code should work for ANY size

for row in range(1, size + 1):
    if row % 2 == 0:
        print("o" * row)
    else:
        print("*" * row)
