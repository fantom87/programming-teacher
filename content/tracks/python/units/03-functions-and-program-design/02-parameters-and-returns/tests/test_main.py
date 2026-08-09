def t_returns():
    result = rect_area(3, 4)
    assert result is not None, "rect_area printed instead of returning — use return"
    assert result == 12, f"rect_area(3, 4) returned {result!r}, expected 12"

def t_any_size():
    assert rect_area(5, 2) == 10, "rect_area(5, 2) should be 10"
    assert rect_area(1, 1) == 1, "rect_area(1, 1) should be 1"
    assert rect_area(7, 3) == 21, "rect_area(7, 3) should be 21"

test("rect_area returns the area", t_returns)
test("rect_area works for any size", t_any_size)
