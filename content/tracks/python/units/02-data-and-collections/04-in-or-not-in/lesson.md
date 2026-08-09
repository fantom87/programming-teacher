---
id: 04-in-or-not-in
title: In or Not In
language: python
runner: browser
estMinutes: 12
files:
  - path: main.py
    starter: starter/main.py
goal: "Loop over the shopping list, using a membership test against stock to print each item's status, and count how many items need buying."
docs: [python/lists, python/conditionals]
checks:
  - id: counts-missing
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-shopping-status
    type: stdout
    entry: main.py
    match: exact
    value: "milk: in stock\neggs: need to buy\ncoffee: in stock\njam: need to buy\n2 items to buy\n"
hints:
  - "item in stock is a True/False question — use it directly in the if: if item in stock:"
  - "The else branch does two jobs: print the need-to-buy line AND to_buy = to_buy + 1."
  - "Everything indented under for item in shopping: runs once per item; the final count prints UN-indented, after the loop."
---
## Asking "is it in there?"

You know how to walk a whole list. But often you just need one yes/no
answer: is `"milk"` on the list? Python makes that a single readable
word — **`in`**. This is called a **membership test**:

```python
stock = ["apples", "bread", "milk"]
print("milk" in stock)      # True
print("kale" in stock)      # False
```

`in` is a question that gives back a boolean, so it drops straight into
an `if`:

```python
if "milk" in stock:
    print("got it already")
```

Its twin `not in` flips the answer — handy when the *missing* case is
the interesting one:

```python
if "kale" not in stock:
    print("better buy kale")
```

Strings support membership too, checking for a piece inside a longer
string:

```python
"gram" in "programming"    # True
"@" in "not-an-email"      # False — the seed of every signup validator
```

Today's program combines membership with two old friends: a loop and a
counter. Walk one list, check each item against *another* list, and
count the misses. This cross-checking move — what's in A but not in
B? — powers real software everywhere: unread messages, missing files,
guests who haven't RSVP'd.

### Your goal

The starter has `stock` (what's at home) and `shopping` (what you
need), plus `to_buy = 0`. Loop over `shopping`; for each item:

1. If it's in `stock`, print `<item>: in stock`.
2. Otherwise, print `<item>: need to buy` and add 1 to `to_buy`.
3. After the loop, print the count line — computed from `to_buy`, not
   typed by hand:

```
milk: in stock
eggs: need to buy
coffee: in stock
jam: need to buy
2 items to buy
```
