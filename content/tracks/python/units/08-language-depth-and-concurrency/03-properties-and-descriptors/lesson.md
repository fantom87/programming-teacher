---
id: 03-properties-and-descriptors
title: Properties and Descriptors
language: python
runner: browser
estMinutes: 20
files:
  - path: main.py
    starter: starter/main.py
goal: "Write Positive — a reusable descriptor with __set_name__/__get__/__set__ that rejects non-positive values — guard Product.price and Product.quantity with it, and add a computed read-only total via @property."
docs: [python/classes, python/errors-and-exceptions]
checks:
  - id: attributes-guarded
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-the-receipt
    type: stdout
    entry: main.py
    match: exact
    value: "book: 37.5\nbook: 30.0\nblocked: quantity must be positive\n30.0\n"
  - id: descriptor-not-boilerplate
    type: ai-judge
    rubric: "Positive implements __set_name__(self, owner, name) storing the attribute name, __get__ reading from the instance's __dict__ (or equivalent per-instance storage keyed by the stored name), and __set__ raising ValueError with a message built from the stored name (f'{self.name} must be positive' — never a hardcoded 'price' or 'quantity') before storing valid values. price and quantity are CLASS-level Positive() instances shared by the one descriptor class. total is a @property computing price * quantity fresh on every access (rounded), never cached in __init__. The demo's blocked line comes from catching the ValueError and printing its message — 37.5, 30.0 and the error text are never typed as literals."
hints:
  - "Three methods: __set_name__(self, owner, name) saves self.name = name; __get__(self, obj, objtype=None) returns obj.__dict__[self.name]; __set__(self, obj, value) raises ValueError(f\"{self.name} must be positive\") if value <= 0, else obj.__dict__[self.name] = value."
  - "In Product, the guards are class attributes: price = Positive() and quantity = Positive() — then __init__ just assigns self.price = price as usual and the descriptor intercepts every assignment."
  - "total is @property: return round(self.price * self.quantity, 2). For the demo, catch with except ValueError as e: print(f\"blocked: {e}\")."
---
## Attributes with opinions

`book.price = -1` is legal Python — and a lie your program will trip
over three functions later. The professional fix is to make attribute
*access itself* run code. That mechanism is the **descriptor
protocol**, and it's how `@property`, methods, `classmethod`, and
half of Django models are built.

A descriptor is an object with `__get__`/`__set__` that lives on the
*class*. When you touch `obj.attr` and the class attribute `attr` is a
descriptor, Python routes the access through it:

```python
class Positive:
    def __set_name__(self, owner, name):
        self.name = name                     # told its own attribute name
    def __get__(self, obj, objtype=None):
        return obj.__dict__[self.name]
    def __set__(self, obj, value):
        if value <= 0:
            raise ValueError(f"{self.name} must be positive")
        obj.__dict__[self.name] = value
```

`__set_name__` is the quiet star: Python calls it at class-creation
time, so *one* descriptor class can guard `price`, `quantity`,
anything — each instance knows which name it's guarding. That
reusability is why you write a descriptor instead of two pairs of
getters and setters.

For a single computed attribute, the built-in descriptor you already
know is lighter:

```python
@property
def total(self):
    return round(self.price * self.quantity, 2)
```

`total` recomputes from live data on every read and can't be assigned
— read-only by construction. Rule of thumb: `@property` for one-off
computed or guarded attributes, a custom descriptor when the same
guard repeats.

### Your goal

1. Write the `Positive` descriptor exactly as above.
2. Write `Product`: class-level `price = Positive()` and
   `quantity = Positive()`, an `__init__(name, price, quantity)` that
   assigns normally, and the `total` property.
3. Demo: `book = Product("book", 12.50, 3)`; print `f"{book.name}:
   {book.total}"`; set `book.price = 10.00` and print the line again;
   try `book.quantity = -1`, catching the `ValueError` as `e` and
   printing `f"blocked: {e}"`; finally print `book.total`:

```
book: 37.5
book: 30.0
blocked: quantity must be positive
30.0
```
