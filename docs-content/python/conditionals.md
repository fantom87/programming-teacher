# Conditionals

Programs make decisions with `if`: run this block only when a condition is true. This is how code branches instead of doing the same thing every time.

```python
temperature = 31

if temperature > 30:
    print("It's hot — drink water!")
```

The condition (`temperature > 30`) is an expression that's either `True` or `False`. The colon starts the block, and the *indented* lines below belong to it. Indentation isn't decoration in Python — it's the syntax.

## if / elif / else

Chain alternatives with `elif` ("else if") and a final catch-all `else`:

```python
score = 74

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "keep practicing"

print(grade)    # C
```

Python checks top to bottom and runs *only the first* branch that matches, then skips the rest.

## Comparison operators

```python
x == y    # equal (two signs! one = is assignment)
x != y    # not equal
x < y     # less than
x >= y    # greater than or equal
```

## Combining conditions

Use `and`, `or`, and `not` — they read like English:

```python
age = 15
with_adult = True

if age >= 13 and age < 20:
    print("teenager")

if age < 12 or with_adult:
    print("kids' ticket available")

if not with_adult:
    print("flying solo")
```

You can also chain comparisons naturally: `13 <= age < 20`.

## Truthiness

Python treats some values as false in conditions: `0`, `""`, `[]`, `{}`, and `None`. Everything else counts as true:

```python
tasks = []
if tasks:
    print("You have work to do")
else:
    print("All done!")        # runs — empty list is "falsy"
```

## One-line form

For tiny choices there's a compact conditional expression:

```python
label = "even" if n % 2 == 0 else "odd"
```

Use it for simple picks; reach for the full `if` block whenever the logic grows.
