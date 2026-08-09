def t_returns_total():
    result = add_tip(40.0)
    assert result is not None, "add_tip still returns nothing — add a return statement"
    assert result == 50.0, f"add_tip(40.0) returned {result!r}, expected 50.0"

def t_other_bills():
    assert add_tip(8) == 10.0, "add_tip(8) should be 10.0"
    assert add_tip(100) == 125.0, "add_tip(100) should be 125.0"

def t_locals_stayed_local():
    assert "tip" not in globals(), "tip leaked outside — the math should stay inside add_tip"
    assert "dinner" in globals(), "store the returned value in a variable called dinner"
    assert dinner == 50.0, f"dinner holds {dinner!r}, expected 50.0"

test("add_tip returns the total", t_returns_total)
test("add_tip works for any bill", t_other_bills)
test("the locals stayed local", t_locals_stayed_local)
