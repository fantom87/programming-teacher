def lengths(words):
    return {w: len(w) for w in words}


def initials(names):
    return {name[0].upper() for name in names}


def flat(grid):
    return [x for row in grid for x in row]


def top(counts, n):
    return sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[:n]


# Drill — leave these prints exactly as they are:
words = ["kestrel", "owl", "kite", "osprey"]
print(lengths(words))
print(sorted(initials(words)))
print(flat([[1, 2], [3], [4, 5]]))
print(top({"owl": 3, "kite": 5, "kestrel": 3}, 2))
