# Modules and imports

A *module* is just a Python file whose code you can use from another file. `import` is how you pull it in. This is how programs grow beyond one file — and how you tap into Python's huge standard library.

## Importing from the standard library

Python ships with hundreds of ready-made modules:

```python
import math

print(math.sqrt(25))     # 5.0
print(math.pi)           # 3.141592653589793
```

`import math` loads the module; `math.sqrt` reads "the `sqrt` function inside `math`."

## from ... import

Pull in specific names to skip the prefix:

```python
from math import sqrt, pi

print(sqrt(25))          # no math. needed
```

You can also rename on the way in:

```python
import datetime as dt

today = dt.date.today()
```

Avoid `from math import *` — it dumps every name into your file, and readers can no longer tell where anything came from.

## Your own modules

Any `.py` file you write is importable. Say you have two files in the same folder:

```python
# helpers.py
def shout(text):
    return text.upper() + "!!!"
```

```python
# main.py
import helpers

print(helpers.shout("hello"))    # HELLO!!!
```

Run `python main.py` and the import just works. This is the first step toward organizing a project: put related functions in a well-named file, import them where needed.

## The __main__ trick

Sometimes a file is both a library *and* a runnable script. This standard pattern makes test code run only when the file is executed directly, not when imported:

```python
# helpers.py
def shout(text):
    return text.upper() + "!!!"

if __name__ == "__main__":
    print(shout("testing"))      # runs only via: python helpers.py
```

## Third-party packages

Beyond the standard library, the community publishes packages (like `requests` for web calls) that you install with `pip` — see the venv-and-pip page. Once installed, they import exactly like standard modules.
