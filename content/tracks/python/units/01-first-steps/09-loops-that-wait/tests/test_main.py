def t_number():
    assert "number" in globals(), "the number variable is missing — start from number = 1"
    assert number == 128, f"number holds {number!r}, expected 128 — double it INSIDE the loop, and break only when it's over 100"

def t_steps():
    assert "steps" in globals(), "the steps variable is missing — start from steps = 0"
    assert steps == 7, f"steps holds {steps!r}, expected 7 — add 1 on every trip, including the last one"

test("number ends at 128 (first double past 100)", t_number)
test("steps ends at 7 (seven doublings)", t_steps)
