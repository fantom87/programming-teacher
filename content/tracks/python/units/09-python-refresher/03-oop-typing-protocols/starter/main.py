import math
from dataclasses import dataclass
from typing import Protocol, runtime_checkable

# 1. Shape — a @runtime_checkable Protocol with one signature:
#    def area(self) -> float: ...

# 2. Circle(radius) and Rect(width, height) — FROZEN dataclasses with
#    typed fields and real area() methods (math.pi, not 3.14).
#    Neither inherits from Shape — conforming is having area().

# 3. total_area(shapes: list[Shape]) -> float — sum of areas,
#    rounded to 2 places.

# Drill — leave these prints exactly as they are:
shapes = [Circle(2), Rect(3, 4)]
print(isinstance(shapes[0], Shape))
print(total_area(shapes))
