def t_dataclasses():
    import dataclasses
    assert dataclasses.is_dataclass(Circle), "Circle should be a dataclass"
    assert dataclasses.is_dataclass(Rect), "Rect should be a dataclass"
    assert Circle(2.0) == Circle(2.0), "dataclasses get __eq__ for free — same fields, equal"

def t_frozen():
    import dataclasses
    c = Circle(1.0)
    try:
        c.radius = 5.0
        mutated = True
    except dataclasses.FrozenInstanceError:
        mutated = False
    assert not mutated, "frozen=True should make attribute assignment raise FrozenInstanceError"

def t_structural():
    class Square:
        def __init__(self, side):
            self.side = side
        def area(self):
            return float(self.side ** 2)
    assert isinstance(Square(2), Shape), "Square never inherits from Shape but conforms — @runtime_checkable isinstance should agree"
    assert abs(total_area([Square(2), Square(3)]) - 13.0) < 0.005, "total_area should accept any shape-shaped class"

def t_areas():
    import math
    assert total_area([]) == 0, "no shapes, zero area"
    assert abs(Rect(2.0, 3.0).area() - 6.0) < 1e-9, "Rect area is width * height"
    assert abs(Circle(1.0).area() - math.pi) < 1e-9, "Circle area should use math.pi"

test("Circle and Rect are dataclasses", t_dataclasses)
test("frozen means immutable", t_frozen)
test("the protocol is structural", t_structural)
test("areas are computed, not guessed", t_areas)
