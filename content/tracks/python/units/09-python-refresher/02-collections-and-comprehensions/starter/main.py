# Four data-shapers — comprehensions mandatory.

# 1. lengths(words) -> dict of word -> length. Dict comprehension.

# 2. initials(names) -> SET of uppercased first letters. Set comprehension.

# 3. flat(grid) -> flatten a list of lists. One nested comprehension.

# 4. top(counts, n) -> list of the n (word, count) pairs with the
#    biggest counts, ties alphabetical. sorted + tuple key + slice.

# Drill — leave these prints exactly as they are:
words = ["kestrel", "owl", "kite", "osprey"]
print(lengths(words))
print(sorted(initials(words)))
print(flat([[1, 2], [3], [4, 5]]))
print(top({"owl": 3, "kite": 5, "kestrel": 3}, 2))
