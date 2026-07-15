def t_each():
    assert "each" in globals(), "there's no variable called each yet"
    assert each == 3, f"each holds {each!r}, expected 3 — use // for whole cookies"

def t_left():
    assert "left" in globals(), "there's no variable called left yet"
    assert left == 2, f"left holds {left!r}, expected 2 — use % for the remainder"

def t_exact():
    assert "exact" in globals(), "there's no variable called exact yet"
    assert exact == 3.4, f"exact holds {exact!r}, expected 3.4 — use / for exact division"
    assert isinstance(exact, float), "exact should be a float — the / operator gives you one"

test("each equals 3 (whole cookies per kid)", t_each)
test("left equals 2 (cookies left over)", t_left)
test("exact equals 3.4 (the exact share)", t_exact)
