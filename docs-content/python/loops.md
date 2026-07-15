# Loops

Loops repeat work so you don't have to copy-paste code. Python has two: `for` (repeat over a collection) and `while` (repeat while a condition holds).

## for: once per item

```python
fruits = ["apple", "pear", "plum"]
for fruit in fruits:
    print(f"I like {fruit}")
```

Each pass, `fruit` becomes the next item. This works on lists, strings, dicts, files — anything *iterable*.

Counting a fixed number of times uses `range`:

```python
for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):     # 1..5 (end excluded)
    print(i)

for i in range(0, 20, 5): # 0, 5, 10, 15 (step of 5)
    print(i)
```

Need positions *and* items? `enumerate` gives both:

```python
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")
```

## while: repeat until something changes

```python
lives = 3
while lives > 0:
    print(f"{lives} lives left")
    lives -= 1
print("Game over")
```

The condition is checked before every pass. If nothing inside the loop ever makes it false, you get an *infinite loop* — the classic beginner rite of passage. (Ctrl+C stops a runaway program.)

## break and continue

- `break` exits the loop immediately.
- `continue` skips to the next pass.

```python
while True:                      # loop forever...
    answer = input("Type 'quit' to stop: ")
    if answer == "quit":
        break                    # ...until this
    if answer == "":
        continue                 # ignore empty input
    print(f"You said: {answer}")
```

## Building results in a loop

A very common pattern — start empty, accumulate:

```python
total = 0
for price in [4.5, 3.0, 7.25]:
    total += price
print(f"Total: ${total:.2f}")    # Total: $14.75
```

Rule of thumb: use `for` when you know *what* you're looping over, `while` when you only know *when to stop*.
