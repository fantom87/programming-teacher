# Python syntax cheatsheet

A quick reference for Python's core syntax. Everything here is explained gently in the other pages — this is the dense at-a-glance version.

## Variables & types

```python
name = "Ada"          # str
age = 36              # int
height = 1.7          # float
happy = True          # bool
nothing = None        # absence of a value
```

## Common operators

| Category | Operators | Example |
|---|---|---|
| Math | `+ - * / // % **` | `7 // 2` → `3`, `2 ** 3` → `8` |
| Comparison | `== != < <= > >=` | `3 != 4` → `True` |
| Logic | `and or not` | `a and not b` |
| Membership | `in`, `not in` | `"x" in "text"` → `True` |

## Strings

```python
s = f"Hi {name}, age {age}"   # f-string formatting
s.upper()  s.strip()  s.split(",")  s.replace("a", "b")
len(s)     s[0]       s[2:5]        s[::-1]   # slicing
```

## Collections

| Type | Literal | Ordered? | Mutable? |
|---|---|---|---|
| list | `[1, 2, 3]` | yes | yes |
| tuple | `(1, 2, 3)` | yes | no |
| dict | `{"a": 1}` | yes (insertion) | yes |
| set | `{1, 2, 3}` | no | yes |

```python
items = [1, 2]
items.append(3)          # [1, 2, 3]
d = {"a": 1}
d["b"] = 2               # add key
d.get("z", 0)            # safe lookup -> 0
```

## Control flow

```python
if x > 0:
    print("positive")
elif x == 0:
    print("zero")
else:
    print("negative")

for item in [1, 2, 3]:
    print(item)

for i in range(5):       # 0..4
    print(i)

while x > 0:
    x -= 1               # break / continue also work
```

## Functions

```python
def greet(name, punctuation="!"):
    """Return a greeting."""
    return f"Hello, {name}{punctuation}"

greet("Ada")             # "Hello, Ada!"
greet("Ada", "?")        # "Hello, Ada?"
```

## Comprehensions

```python
squares = [n * n for n in range(5)]          # [0, 1, 4, 9, 16]
evens = [n for n in range(10) if n % 2 == 0]
lookup = {word: len(word) for word in words}
```

## Errors & files

```python
try:
    value = int(text)
except ValueError:
    value = 0

with open("data.txt", encoding="utf-8") as f:
    content = f.read()
```

## Classes & imports

```python
import math
from pathlib import Path

class Dog:
    def __init__(self, name):
        self.name = name
    def bark(self):
        return f"{self.name} says woof"
```

Indentation (4 spaces) defines blocks; colons `:` start them. Comments begin with `#`.
