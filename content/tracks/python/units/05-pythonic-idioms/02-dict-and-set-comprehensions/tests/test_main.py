def t_word_lengths():
    assert word_lengths(["a", "bee"]) == {"a": 1, "bee": 3}, 'word_lengths(["a", "bee"]) should be {"a": 1, "bee": 3}'
    assert word_lengths([]) == {}, "no words means an empty dict"
    assert word_lengths(["zip"]) == {"zip": 3}, "each word maps to its own length"

def t_initials_are_a_set():
    result = unique_initials(["ada", "alan"])
    assert isinstance(result, set), "unique_initials should return a SET, not a list — sort at the print instead"

def t_initials_deduplicate():
    assert unique_initials(["ada", "alan"]) == {"a"}, "two a-names collapse to one initial"
    assert unique_initials(["ada", "alan", "grace", "guido", "linus"]) == {"a", "g", "l"}, "the crew has three distinct initials"
    assert unique_initials(["bo"]) == {"b"}, "one name, one initial"

test("word_lengths maps word to length", t_word_lengths)
test("unique_initials returns a real set", t_initials_are_a_set)
test("duplicate initials collapse", t_initials_deduplicate)
