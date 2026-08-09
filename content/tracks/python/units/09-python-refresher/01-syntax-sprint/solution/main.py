def classify(n):
    if n % 15 == 0:
        return "fizzbuzz"
    if n % 3 == 0:
        return "fizz"
    if n % 5 == 0:
        return "buzz"
    return str(n)


def clip(text, width):
    if len(text) <= width:
        return text
    return text[:width - 1] + "…"


def row(name, price):
    return f"{name:<8}|{price:>7.2f}"


# Drill — leave these prints exactly as they are:
print(" ".join(classify(n) for n in range(1, 16)))
print(clip("refactoring", 6))
print(clip("code", 6))
print(row("coffee", 4.5))
print(row("keyboard", 89.999))
