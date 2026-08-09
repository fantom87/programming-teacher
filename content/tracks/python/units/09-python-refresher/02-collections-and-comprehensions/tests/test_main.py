def t_lengths():
    assert lengths([]) == {}, "no words, empty dict"
    assert lengths(["a", "bb"]) == {"a": 1, "bb": 2}, "each word maps to its own length"

def t_initials():
    result = initials(["ada", "alan", "grace"])
    assert isinstance(result, set), "initials should build a real set"
    assert result == {"A", "G"}, "uppercase first letters, duplicates collapsed"

def t_flat():
    assert flat([]) == [], "an empty grid flattens to an empty list"
    assert flat([[1], [2, 3], []]) == [1, 2, 3], "rows concatenate in order — outer loop first"

def t_top():
    counts = {"owl": 3, "kite": 5, "kestrel": 3, "heron": 1}
    assert top(counts, 2) == [("kite", 5), ("kestrel", 3)], "ties break alphabetically — kestrel before owl"
    assert top(counts, 10) == [("kite", 5), ("kestrel", 3), ("owl", 3), ("heron", 1)], "asking for more than exists returns everything, still ordered"
    assert top({}, 3) == [], "empty counts, empty answer"

test("lengths maps word to len", t_lengths)
test("initials is a real set", t_initials)
test("flat runs outer loop first", t_flat)
test("top sorts by count desc, word asc", t_top)
