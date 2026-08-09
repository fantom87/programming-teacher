def t_classify():
    assert classify(30) == "fizzbuzz", "30 is a multiple of 15 — check 15 first"
    assert classify(9) == "fizz", "9 is a multiple of 3"
    assert classify(25) == "buzz", "25 is a multiple of 5"
    assert classify(7) == "7", "non-multiples come back as strings, not ints"
    assert isinstance(classify(4), str), "classify always returns a string"

def t_clip():
    assert clip("python", 6) == "python", "exactly-fitting text is untouched"
    assert clip("pythonic", 6) == "pytho…", "too-long text: width-1 characters + the ellipsis"
    assert clip("", 4) == "", "empty text stays empty"
    assert len(clip("a very long sentence", 8)) == 8, "clipped text is exactly width characters long"

def t_row():
    line = row("x", 0)
    assert line == "x       |   0.00", f"row('x', 0) should be 'x       |   0.00', got {line!r}"
    assert row("keyboard", 89.999) == "keyboard|  90.00", ".2f rounds — 89.999 becomes 90.00"
    assert line.index("|") == 8, "the bar sits right after the 8-column name field"

test("classify covers all four cases", t_classify)
test("clip respects the width", t_clip)
test("row aligns with format specs", t_row)
