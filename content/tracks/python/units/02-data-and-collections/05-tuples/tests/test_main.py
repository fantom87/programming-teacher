def t_unpacked():
    assert "x" in globals() and "y" in globals(), "x and y are missing — unpack with x, y = point"
    assert x == 3 and y == 7, f"x={x!r}, y={y!r} — expected x=3, y=7 straight from point"

def t_total():
    assert "total" in globals(), "the total variable is missing — start from total = 0"
    assert total == 36, f"total holds {total!r}, expected 36 — add score inside the loop, every trip"

test("point unpacks into x=3, y=7", t_unpacked)
test("total collects all three scores (36)", t_total)
