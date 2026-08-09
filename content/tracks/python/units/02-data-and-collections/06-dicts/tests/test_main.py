def t_apple():
    assert "backpack" in globals(), "the backpack variable is missing — keep the starter line"
    assert backpack["apple"] == 2, f"apple count is {backpack['apple']!r}, expected 2 — subtract 1 from the old value"

def t_map():
    assert "map" in backpack, "there's no \"map\" key yet — assigning to a new key adds it"
    assert backpack["map"] == 1, f"map count is {backpack['map']!r}, expected 1"

def t_whole():
    assert backpack == {"rope": 1, "torch": 6, "apple": 2, "map": 1}, f"backpack holds {backpack!r} — expected rope 1, torch 6, apple 2, map 1"

test("one apple was eaten (3 -> 2)", t_apple)
test("the map was added", t_map)
test("the whole backpack matches", t_whole)
