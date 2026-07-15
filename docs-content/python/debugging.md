# Debugging Python

When your program misbehaves, Python gives you excellent tools for finding out why. Here's your toolkit, from simplest to most powerful.

## Read the traceback (bottom-up)

The last line names the error; the line above shows exactly where:

```text
Traceback (most recent call last):
  File "shop.py", line 12, in <module>
    checkout(cart)
  File "shop.py", line 7, in checkout
    total += item["price"]
KeyError: 'price'
```

Start at the bottom: a `KeyError` on line 7 — some item in the cart has no `"price"` key. The lines above show the call path that got there.

## Print what you assume

Most bugs are wrong assumptions. Print the actual values and compare with what you expected:

```python
def checkout(cart):
    total = 0
    for item in cart:
        print(f"DEBUG: item = {item!r}")    # what IS in there?
        total += item["price"]
    return total
```

The `!r` shows the value's exact form — revealing sneaky things like `'5'` (a string) where you expected `5`, or `' name'` with a hidden space.

A great f-string trick — `=` prints the expression *and* its value:

```python
print(f"{total=}")        # total=41.5
print(f"{len(cart)=}")    # len(cart)=3
```

## breakpoint(): pause and look around

Drop `breakpoint()` anywhere and run your program. It pauses right there and opens an interactive prompt (the debugger, `pdb`):

```python
def checkout(cart):
    total = 0
    breakpoint()          # program pauses here
    for item in cart:
        total += item["price"]
```

At the `(Pdb)` prompt:

- `p cart` — print a variable
- `n` — run the next line
- `s` — step into a function call
- `c` — continue running
- `q` — quit

It's like freezing time and poking around the crime scene.

## Bisect the problem

Still lost? Comment out half the code. Bug gone? It was in that half. Repeat. A few rounds of this corners any bug — even in code you don't understand yet.

Finally: after fixing a bug, re-run and confirm. Then remove your debug prints — future-you will thank you.
