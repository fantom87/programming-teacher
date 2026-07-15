# Classes

A class is a blueprint for creating objects that bundle *data* and *behavior* together. You've been using objects all along — strings, lists, and dicts are all instances of classes. Now you get to design your own.

## Defining a class

```python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        return f"{self.name} says woof!"

    def birthday(self):
        self.age += 1
```

- `__init__` is the *initializer* — it runs when a new object is created and sets up its data.
- `self` means "this particular object." Every method receives it first.
- `self.name` and `self.age` are *attributes*: variables that live on each object.

## Creating and using objects

```python
rex = Dog("Rex", 3)
bella = Dog("Bella", 5)

print(rex.bark())      # Rex says woof!
print(bella.bark())    # Bella says woof!

rex.birthday()
print(rex.age)         # 4 — only Rex aged; bella.age is still 5
```

Each object is independent: same blueprint, separate data. That's the whole point — one `Dog` class, as many dogs as you need.

## Why bother?

Before classes, related data travels in loose bundles:

```python
# Without a class — fragile and repetitive
dog_name = "Rex"
dog_age = 3
```

With a class, the data and the functions that operate on it live together. Code that says `rex.birthday()` reads like the idea in your head.

## A friendly printout with __repr__

By default, printing an object shows something unhelpful like `<Dog object at 0x...>`. Define `__repr__` to fix that:

```python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __repr__(self):
        return f"Dog(name={self.name!r}, age={self.age})"

print(Dog("Rex", 3))    # Dog(name='Rex', age=3)
```

Start simple: reach for a class when you notice the same group of variables traveling together with functions that act on them. Until then, dicts and functions are perfectly fine.
