def t_str():
    s = Song("Test Song", "Test Artist")
    assert str(s) == "Test Song by Test Artist", f"str(song) gave {str(s)!r}, expected 'Test Song by Test Artist'"

def t_eq_same():
    assert Song("X", "Y") == Song("X", "Y"), "two Songs with the same title and artist should be =="

def t_eq_different():
    assert not (Song("X", "Y") == Song("X", "Z")), "Songs with different artists should not be =="
    assert not (Song("W", "Y") == Song("X", "Y")), "Songs with different titles should not be =="

test("__str__ formats the song", t_str)
test("__eq__ matches identical songs", t_eq_same)
test("__eq__ rejects different songs", t_eq_different)
