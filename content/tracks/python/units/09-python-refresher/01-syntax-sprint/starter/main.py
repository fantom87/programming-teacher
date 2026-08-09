# Syntax sprint — three functions, checked hard.

# 1. classify(n) -> "fizzbuzz" / "fizz" / "buzz" / str(n).
#    Always a string. Check 15 before 3 or 5.

# 2. clip(text, width) -> text unchanged if it fits in width chars,
#    else the first width-1 characters + "…".

# 3. row(name, price) -> ONE f-string:
#    name left-aligned in 8 | price right-aligned in 7, two decimals.

# Drill — leave these prints exactly as they are:
print(" ".join(classify(n) for n in range(1, 16)))
print(clip("refactoring", 6))
print(clip("code", 6))
print(row("coffee", 4.5))
print(row("keyboard", 89.999))
