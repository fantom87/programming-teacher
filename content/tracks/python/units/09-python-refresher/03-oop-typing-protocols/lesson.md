---
id: 03-oop-typing-protocols
title: "OOP, Typing, Protocols"
language: python
runner: browser
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Recap modern OOP: a runtime_checkable Shape Protocol, frozen Circle and Rect dataclasses, and total_area typed against the protocol — proven structural by a class the tests invent."
docs: [python/classes, python/variables-and-types]
checks:
  - id: shapes-hold-up
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: drill-output
    type: stdout
    entry: main.py
    match: exact
    value: "True\n24.57\n"
  - id: protocol-not-inheritance
    type: ai-judge
    rubric: "Shape is a typing.Protocol decorated with @runtime_checkable whose area method is a signature-only stub (... body) — not an ABC, and not a base class that Circle or Rect inherit from. Circle and Rect are @dataclass(frozen=True) with typed fields (radius: float; width: float and height: float) and compute area from math.pi and their own fields — no 3.14 literals anywhere. total_area is annotated against the protocol (list[Shape] or Sequence[Shape]), sums s.area() with a generator or loop, rounds to 2 places, and never isinstance-switches on the concrete classes. The drill prints are intact."
hints:
  - "from typing import Protocol, runtime_checkable — the protocol body is just def area(self) -> float: ... (literally three dots)."
  - "@dataclass(frozen=True) above each class; fields are bare typed names (radius: float), and methods are normal defs below them."
  - "def total_area(shapes: list[Shape]) -> float: return round(sum(s.area() for s in shapes), 2) — the annotation is the polymorphism."
---
## Classes, modern shape

Modern Python classes are mostly **dataclasses** — declare typed
fields, and the decorator writes `__init__`, `__repr__`, and `__eq__`.
`frozen=True` makes instances immutable (assignment raises) and
hashable.

```python
@dataclass(frozen=True)
class Circle:
    radius: float
```

For polymorphism, typed Python has a structural answer: **`Protocol`**.
A protocol declares a shape — any class with matching methods conforms,
no inheritance required. It's duck typing that type checkers can
verify:

```python
@runtime_checkable
class Shape(Protocol):
    def area(self) -> float: ...
```

`Circle` never mentions `Shape`; it conforms by *having* `area()`.
`@runtime_checkable` extends the deal to `isinstance`, which checks
that the methods exist. Functions then annotate against the protocol —
`def total_area(shapes: list[Shape])` — and accept anything
shape-shaped, including classes written years later by strangers. Our
checks exploit exactly that: they feed your function a class you've
never seen.

### Your goal

1. `Shape` — a `@runtime_checkable` `Protocol` with one method
   signature: `def area(self) -> float: ...`
2. `Circle(radius)` and `Rect(width, height)` — **frozen dataclasses**
   with typed fields and real `area()` methods (`math.pi`, not 3.14).
3. `total_area(shapes: list[Shape]) -> float` — the sum of the areas,
   rounded to 2 places.

The starter's drill prints exactly:

```
True
24.57
```
