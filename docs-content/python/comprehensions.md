# Comprehensions

A comprehension builds a new list (or dict, or set) in one readable line, replacing a common loop pattern. Once it clicks, you'll see them everywhere in Python code.

## The pattern

Here's the loop way to square some numbers:

```python
squares = []
for n in range(5):
    squares.append(n * n)
```

And the comprehension way:

```python
squares = [n * n for n in range(5)]    # [0, 1, 4, 9, 16]
```

Read it as: "a list of `n * n`, for each `n` in `range(5)`." Same result, less ceremony — and the intent ("transform each item") is visible at a glance.

## Adding a filter

An `if` at the end keeps only matching items:

```python
words = ["apple", "fig", "banana", "kiwi"]
long_words = [w for w in words if len(w) > 4]
# ['apple', 'banana']
```

Transform *and* filter together:

```python
shouted = [w.upper() for w in words if w.startswith("a")]
# ['APPLE']
```

## Dict and set comprehensions

The same idea works with braces:

```python
lengths = {w: len(w) for w in words}
# {'apple': 5, 'fig': 3, 'banana': 6, 'kiwi': 4}

first_letters = {w[0] for w in words}    # a set: {'a', 'f', 'b', 'k'}
```

## Real-world flavors

```python
# Clean up user input
raw = ["  Ada ", "", " Grace", "  "]
names = [s.strip() for s in raw if s.strip()]
# ['Ada', 'Grace']

# Parse numbers from a comma-separated string
nums = [int(x) for x in "3,14,15".split(",")]
# [3, 14, 15]
```

## Know when to stop

Comprehensions shine for *one* transform and *one* filter. If you need nested loops, multiple conditions, or side effects, a regular `for` loop is clearer:

```python
# Legal, but hard to read — prefer a loop:
pairs = [(x, y) for x in range(3) for y in range(3) if x != y]
```

The goal is readability, not compression. If you have to squint, write the loop.
