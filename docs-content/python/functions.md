# Functions

A function is a named, reusable block of code. Instead of repeating the same five lines everywhere, you wrap them once and call them by name. Functions are how programs stay organized as they grow.

## Defining and calling

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("Ada")
print(message)            # Hello, Ada!
```

- `def` starts the definition; `greet` is the name; `name` is a *parameter* (a placeholder).
- `return` hands a value back to whoever called.
- Nothing runs until you *call* the function with `greet(...)`.

## Parameters and arguments

Parameters can have defaults, and you can pass arguments by name for clarity:

```python
def make_coffee(size, milk=False, sugars=0):
    drink = f"{size} coffee"
    if milk:
        drink += " with milk"
    if sugars:
        drink += f" and {sugars} sugar(s)"
    return drink

make_coffee("large")                        # 'large coffee'
make_coffee("small", milk=True)             # 'small coffee with milk'
make_coffee("medium", sugars=2, milk=True)  # keyword args, any order
```

## return vs print

A frequent early mix-up: `print` shows something on screen; `return` gives a value back to the code. A function without a `return` returns `None`:

```python
def add(a, b):
    print(a + b)        # shows 7, but...

result = add(3, 4)
print(result)           # None — nothing was returned!
```

If you want to *use* the result, return it.

## Local names stay local

Variables created inside a function exist only there — its private workspace:

```python
def double(n):
    result = n * 2      # 'result' lives only inside double
    return result

double(5)
print(result)           # NameError: name 'result' is not defined
```

This isolation is a feature: functions can't accidentally trample each other's variables.

## Docstrings

A string right under `def` documents the function:

```python
def area(width, height):
    """Return the area of a rectangle."""
    return width * height
```

Good functions do *one* job, have a name that says what it is, and return their answer. If you can't name it cleanly, split it up.
