---
id: 01-decorators
title: Decorators
language: python
runner: browser
estMinutes: 20
files:
  - path: main.py
    starter: starter/main.py
goal: "Write logged(func) — a decorator whose wrapper prints a computed calling line, passes through *args/**kwargs, and keeps the original identity with functools.wraps — then apply it to two functions with @logged."
docs: [python/functions, python/stdlib-tour]
checks:
  - id: decorator-behaves
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-the-calls
    type: stdout
    entry: main.py
    match: exact
    value: "calling add(2, 3)\n5\ncalling shout('ship')\nSHIP!\nadd\nAdd two numbers.\n"
  - id: real-wrapper
    type: ai-judge
    rubric: "logged takes func, defines an inner wrapper(*args, **kwargs) decorated with @functools.wraps(func), prints the calling line computed from func.__name__ and ', '.join(repr(a) for a in args) (or equivalent — never a hardcoded function name or argument list), returns func(*args, **kwargs)'s result, and returns wrapper. add and shout are plain defs decorated with @logged, keep their docstrings, and no 'calling ...' string is printed from top-level code."
hints:
  - "The shape is always the same three layers: def logged(func): / def wrapper(*args, **kwargs): ... return func(*args, **kwargs) / return wrapper. The @logged line just means add = logged(add)."
  - "Build the calling line from what the wrapper receives: ', '.join(repr(a) for a in args) turns (2, 3) into \"2, 3\" and ('ship',) into \"'ship'\" — then f\"calling {func.__name__}({arglist})\"."
  - "Without @functools.wraps(func) on wrapper, add.__name__ becomes 'wrapper' and the docstring vanishes — the last two printed lines are your proof it's there."
---
## Functions that rewrite functions

You've passed functions around since the intermediate tier — into
`sorted(key=...)`, out of closures. A **decorator** is the last step of
that idea: a function that *takes* a function and hands back a
replacement, usually a wrapper that does something extra around the
original.

```python
def logged(func):
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}(...)")
        return func(*args, **kwargs)
    return wrapper
```

`wrapper` is a closure — it remembers `func` — and `*args, **kwargs`
means it can stand in for *any* signature. The `@` syntax is nothing
but sugar:

```python
@logged
def add(a, b): ...
# identical to: add = logged(add)
```

From then on, every call to `add` runs `wrapper`, which logs and
delegates. This is exactly how `@property`, `@functools.lru_cache`,
Flask's `@app.route`, and pytest fixtures work — the pattern is
everywhere in professional Python.

One professional detail: the swap has a cost. After decorating,
`add.__name__` is `"wrapper"` and the docstring is gone — debuggers and
help() now lie. The fix ships in the standard library:

```python
import functools

def logged(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        ...
```

`functools.wraps(func)` (a decorator taking arguments — decorators all
the way down) copies `__name__`, `__doc__`, and friends onto the
wrapper. Every decorator you ever write should carry it.

### Your goal

1. Write `logged(func)` exactly as described: the wrapper prints
   `calling name(args)` — name from `func.__name__`, args joined from
   `repr` of each positional argument — then returns the real result.
   Put `@functools.wraps(func)` on the wrapper.
2. Decorate `add(a, b)` (docstring `"Add two numbers."`, returns
   `a + b`) and `shout(word)` (docstring `"Uppercase with a bang."`,
   returns the word uppercased plus `!`).
3. Print `add(2, 3)`, then `shout("ship")`, then `add.__name__`, then
   `add.__doc__`:

```
calling add(2, 3)
5
calling shout('ship')
SHIP!
add
Add two numbers.
```
