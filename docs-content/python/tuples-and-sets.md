# Tuples and sets

Two more containers round out Python's core set: *tuples* (unchangeable lists) and *sets* (bags of unique items).

## Tuples: fixed groups of values

A tuple looks like a list with parentheses — but once created, it can't change:

```python
point = (3, 5)
rgb = (255, 128, 0)
point[0]          # 3 — indexing works like lists
point[0] = 9      # TypeError! tuples are immutable
```

Use a tuple when the values *belong together* and shouldn't be edited: a coordinate, a date, an RGB color. Immutability is a feature — it promises readers "this group won't be modified."

### Unpacking

The nicest tuple trick is unpacking into separate names:

```python
x, y = point
print(x)          # 3

# Functions use this to return multiple values:
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([4, 9, 1])   # low=1, high=9
```

Even swapping variables is tuple unpacking in disguise:

```python
a, b = b, a
```

## Sets: unique items, fast lookups

A set holds each value at most once, with no order:

```python
tags = {"python", "beginner", "python"}
print(tags)               # {'python', 'beginner'} — duplicate gone
```

Adding and checking:

```python
tags.add("tutorial")
tags.remove("beginner")
"python" in tags          # True — and very fast, even for huge sets
```

### De-duplicating a list

The classic one-liner:

```python
names = ["Ada", "Grace", "Ada", "Alan"]
unique = set(names)               # {'Ada', 'Grace', 'Alan'}
unique_list = list(set(names))    # back to a list if you need one
```

### Set math

Sets support comparisons straight out of math class:

```python
staff = {"Ada", "Alan", "Grace"}
attendees = {"Grace", "Alan", "Mary"}

staff & attendees    # {'Alan', 'Grace'}   in both (intersection)
staff | attendees    # everyone            (union)
staff - attendees    # {'Ada'}             staff who didn't attend
```

One gotcha: `{}` creates an empty *dict*, not a set. Use `set()` for an empty set.
