---
id: 07-modules-and-imports
title: Modules and Imports
language: python
runner: local
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
  - path: helpers.py
    starter: starter/helpers.py
goal: "Fill helpers.py with banner() and underline(), then in main.py use both import styles to print the two-line heading."
docs: [python/modules-and-imports, python/functions]
checks:
  - id: helpers-work
    type: tests
    entry: helpers.py
    testFile: tests/test_helpers.py
  - id: main-prints-heading
    type: stdout
    entry: main.py
    match: exact
    value: "== Imports ==\n-------\n"
hints:
  - "helpers.py needs no imports of its own — just define banner and underline like any functions. underline is one line: return \"-\" * len(text)."
  - "import helpers gives you the whole toolbox — call the first one as helpers.banner(\"Imports\")."
  - "from helpers import underline brings ONE name across, so the second call is just underline(\"Imports\")."
---
## Your first second file

Until now, every program fit in `main.py`. Real projects don't — they're
split across files, and Python has a name for a file you use from another
file: a **module**. No ceremony required. Any `.py` file is already a
module; its name is the filename minus `.py`.

This lesson has two tabs. `helpers.py` will hold tools; `main.py` is the
program that uses them. The bridge between them is `import`:

```python
import helpers

print(helpers.banner("Imports"))
```

`import helpers` finds `helpers.py` (same folder), runs it once so its
`def`s exist, and hands you the module as a single object. The dot means
*look inside*: `helpers.banner` is "the `banner` function in `helpers`".

When you'll use a name a lot, skip the prefix by importing the name
itself:

```python
from helpers import underline

print(underline("Imports"))    # no helpers. needed
```

Both styles are everyday Python. `import helpers` keeps the origin
visible at every call site; `from helpers import underline` is shorter.
The one to avoid is `from helpers import *` — it dumps every name into
your file and nobody can tell where anything came from.

This is decomposition, one level up: last lesson you split a program into
functions; now you split it into *files*. Well-named modules are how a
project stays navigable — string tools here, price math there.

Because imports need real files on disk, this lesson runs with your
computer's actual Python — same code, real filesystem.

### Your goal

1. In `helpers.py`, define:
   - `banner(text)` — returns `f"== {text} =="`
   - `underline(text)` — returns a dash for every character: `"-" * len(text)`
2. In `main.py`, `import helpers` **and** `from helpers import underline`,
   then print the heading:

   ```
   == Imports ==
   -------
   ```
