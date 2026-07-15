# Errors and exceptions

When something goes wrong at runtime, Python *raises an exception* — an alarm that stops the program unless someone handles it. Handling exceptions is how programs fail gracefully instead of crashing.

## try / except

Wrap risky code in `try`; catch specific failures in `except`:

```python
text = input("Enter a number: ")

try:
    number = int(text)
    print(f"Double is {number * 2}")
except ValueError:
    print(f"'{text}' isn't a number, sorry!")
```

If `int(text)` fails, Python jumps straight to the matching `except` block — no crash, and the program continues.

## Catch specifically

Name the exception you expect. A bare `except:` catches *everything*, including bugs you'd want to know about, so avoid it:

```python
try:
    with open("config.txt", encoding="utf-8") as f:
        data = f.read()
except FileNotFoundError:
    data = ""                      # expected, fine
except PermissionError as e:
    print(f"Can't read config: {e}")   # e holds the message
```

Multiple `except` blocks handle different failures differently. `as e` captures the exception object so you can show or log its message.

## else and finally

```python
try:
    number = int(text)
except ValueError:
    print("Bad input")
else:
    print(f"Got {number}")      # runs only if NO exception occurred
finally:
    print("Done either way")    # always runs — cleanup goes here
```

## Raising your own

Your code can raise exceptions to reject bad situations early:

```python
def set_age(age):
    if age < 0:
        raise ValueError(f"Age can't be negative, got {age}")
    return age
```

A clear early error beats a mysterious wrong answer later.

## Common exceptions to recognize

```python
int("hi")        # ValueError — right type, bad value
"a" + 1          # TypeError — wrong type entirely
items[99]        # IndexError — list position doesn't exist
data["missing"]  # KeyError — dict key doesn't exist
open("nope.txt") # FileNotFoundError
1 / 0            # ZeroDivisionError
```

Rule of thumb: catch exceptions you can genuinely *do something about* (retry, use a default, tell the user). Let the rest crash loudly during development — the traceback is your friend.
