import math
from dataclasses import dataclass
from typing import Protocol, runtime_checkable


@runtime_checkable
class Shape(Protocol):
    def area(self) -> float: ...


@dataclass(frozen=True)
class Circle:
    radius: float

    def area(self) -> float:
        return math.pi * self.radius ** 2


@dataclass(frozen=True)
class Rect:
    width: float
    height: float

    def area(self) -> float:
        return self.width * self.height


def total_area(shapes: list[Shape]) -> float:
    return round(sum(s.area() for s in shapes), 2)


# Drill — leave these prints exactly as they are:
shapes = [Circle(2), Rect(3, 4)]
print(isinstance(shapes[0], Shape))
print(total_area(shapes))
