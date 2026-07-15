# Numbers and math

Python has two everyday number types: `int` for whole numbers and `float` for decimals.

```python
apples = 12        # int
price = 2.50       # float
```

## Arithmetic

```python
7 + 3      # 10
7 - 3      # 4
7 * 3      # 21
7 / 3      # 2.3333333333333335   / always gives a float
7 // 3     # 2                    floor division: drop the remainder
7 % 3      # 1                    modulo: just the remainder
2 ** 10    # 1024                 exponent (power)
```

Two favorites worth memorizing:

- `//` and `%` together answer "how many fit, and what's left?" — great for splitting things into groups.
- `%` checks divisibility: `n % 2 == 0` means `n` is even.

## Updating a number in place

```python
score = 0
score = score + 10   # long form
score += 10          # shorthand, same thing
score -= 3           # also: *=, /=, //=, **=
```

## Floats are approximate

Computers store decimals in binary, so tiny rounding surprises happen:

```python
0.1 + 0.2        # 0.30000000000000004  (!)
round(0.1 + 0.2, 2)   # 0.3
```

This is normal in every language. Use `round(value, digits)` for display, and never compare floats with `==` — check if they're *close* instead. For money, many programs count in whole cents (ints) to dodge the issue entirely.

## Handy built-ins

```python
abs(-7)          # 7
round(3.567, 1)  # 3.6
min(4, 9, 2)     # 2
max([4, 9, 2])   # 9
sum([1, 2, 3])   # 6
```

## The math module

More tools live in the standard `math` module:

```python
import math

math.sqrt(16)     # 4.0
math.floor(3.9)   # 3
math.ceil(3.1)    # 4
math.pi           # 3.141592653589793
```

## Mixing ints and floats

Mixing is fine — the result becomes a float:

```python
3 + 0.5    # 3.5
```

But mixing numbers and *strings* is not: `"5" + 5` raises a `TypeError`. Convert first with `int("5")` or `str(5)`.
