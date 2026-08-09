def t_names():
    assert "names" in globals(), "there's no names list yet — start names = [] before the loop"
    assert names == ["granola bar", "trail mix", "apple", "cocoa"], f"names holds {names!r} — append each snack[\"name\"] inside the loop"

def t_sold_out():
    assert "sold_out" in globals(), "there's no sold_out counter yet — start it at 0"
    assert sold_out == 2, f"sold_out holds {sold_out!r}, expected 2 — count snacks whose stock == 0"

def t_total_value():
    assert "total_value" in globals(), "there's no total_value yet — start it at 0"
    assert total_value == 49, f"total_value holds {total_value!r}, expected 49 — add price * stock for EVERY snack"

test("names lists all four snacks in order", t_names)
test("sold_out counts the two empty snacks", t_sold_out)
test("total_value is 49 (price times stock, summed)", t_total_value)
