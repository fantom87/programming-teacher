def t_clean():
    assert "clean" in globals(), "there's no clean variable yet"
    assert clean == "learn python every day", f"clean holds {clean!r} — strip removes only the OUTER spaces"

def t_loud():
    assert "loud" in globals(), "there's no loud variable yet"
    assert loud == "LEARN PYTHON EVERY DAY", f"loud holds {loud!r} — call .upper() on clean, not on raw"

def t_swapped():
    assert "swapped" in globals(), "there's no swapped variable yet"
    assert swapped == "learn python every morning", f"swapped holds {swapped!r} — clean.replace(\"day\", \"morning\")"

def t_words():
    assert "words" in globals(), "there's no words variable yet"
    assert words == ["learn", "python", "every", "day"], f"words holds {words!r} — clean.split() with no arguments"

test("clean is stripped", t_clean)
test("loud is ALL CAPS", t_loud)
test("swapped says morning", t_swapped)
test("words is a 4-item list", t_words)
