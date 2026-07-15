# Dicts

A dictionary (*dict*) stores pairs: a *key* and its *value* — like a real dictionary maps a word to its definition. Where lists answer "what's at position 3?", dicts answer "what's the value for `'email'`?"

```python
user = {
    "name": "Ada",
    "email": "ada@example.com",
    "age": 36,
}
```

## Reading values

```python
user["name"]          # "Ada"
user["phone"]         # KeyError! no such key
user.get("phone")     # None — the safe version
user.get("phone", "unknown")   # "unknown" — with a fallback
```

Use square brackets when the key *must* exist; use `.get()` when it might not.

## Adding, changing, removing

Dicts are mutable:

```python
user["age"] = 37              # update existing key
user["city"] = "London"       # add new key
del user["email"]             # remove a pair
"city" in user                # True — checks keys
```

## Looping

```python
for key in user:                      # keys
    print(key)

for value in user.values():          # values
    print(value)

for key, value in user.items():     # both — most common
    print(f"{key}: {value}")
```

## A classic use: counting

Dicts shine at tallying things:

```python
votes = ["cat", "dog", "cat", "cat", "dog"]
counts = {}
for animal in votes:
    counts[animal] = counts.get(animal, 0) + 1
print(counts)    # {'cat': 3, 'dog': 2}
```

`counts.get(animal, 0)` reads "the current count, or 0 if we haven't seen this one yet."

## Nesting

Values can be anything — including lists and other dicts. This is how real-world data (like JSON from the web) is shaped:

```python
book = {
    "title": "Dune",
    "authors": ["Frank Herbert"],
    "ratings": {"average": 4.3, "count": 12000},
}
book["ratings"]["average"]    # 4.3
```

Keys must be immutable (strings and numbers are perfect; lists can't be keys). Since Python 3.7, dicts remember insertion order, so items loop in the order you added them.
