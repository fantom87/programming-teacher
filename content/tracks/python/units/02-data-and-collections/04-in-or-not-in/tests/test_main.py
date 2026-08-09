def t_to_buy():
    assert "to_buy" in globals(), "the to_buy variable is missing — start from to_buy = 0"
    assert to_buy == 2, f"to_buy holds {to_buy!r}, expected 2 — add 1 only in the need-to-buy branch"

def t_lists_untouched():
    assert stock == ["apples", "bread", "milk", "coffee"], "stock changed — this program only READS the lists"
    assert shopping == ["milk", "eggs", "coffee", "jam"], "shopping changed — this program only READS the lists"

test("to_buy counts the 2 missing items", t_to_buy)
test("stock and shopping are unchanged", t_lists_untouched)
