# Variables and types

A variable is a name attached to a value — a labeled box you can peek into later. In Python you create one just by assigning:

```python
score = 0
player = "Ada"
```

No special keyword needed. The `=` means "attach this name to this value," not mathematical equality.

## Values have types

Every value has a *type* — the kind of thing it is:

```python
count = 42            # int: whole number
price = 3.99          # float: decimal number
name = "Grace"        # str: text
is_open = True        # bool: True or False
winner = None         # None: "nothing here yet"
```

Check any value's type with `type()`:

```python
print(type(42))       # <class 'int'>
print(type("42"))     # <class 'str'>
```

That last line matters: `42` and `"42"` look similar but are completely different — one is a number, the other is text that happens to contain digits.

## Converting between types

You often need to convert, especially since `input()` always gives you text:

```python
answer = input("How old are you? ")   # answer is a str, e.g. "30"
age = int(answer)                     # now it's the number 30
print(f"Next year you'll be {age + 1}")
```

The converters are named after the types: `int()`, `float()`, `str()`, `bool()`.

```python
float("3.5")   # 3.5
str(99)        # "99"
int("abc")     # ValueError! Not every conversion is possible.
```

## Variables can be reassigned

A name can point to a new value — even a different type — at any time:

```python
x = 10
x = x + 5      # x is now 15
x = "done"     # now x is a string (legal, but often confusing)
```

Python allows type changes, but your code is easier to follow if each variable keeps one job and one type.

## Naming rules

Names use letters, digits, and underscores, and can't start with a digit. By convention Python uses `snake_case`: `total_price`, `user_name`. Descriptive names are free documentation — spend them generously.
