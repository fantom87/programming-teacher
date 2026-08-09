def t_count_words():
    assert count_words("a b c") == 3, 'count_words("a b c") should be 3'
    assert count_words("solo") == 1, "a single word should count as 1"
    assert count_words("small functions build big programs") == 5, "the motto has 5 words"

def t_longest_word():
    assert longest_word("go long now") == "long", 'longest_word("go long now") should be "long"'
    assert longest_word("tiny") == "tiny", "a one-word text returns that word"
    assert longest_word("small functions build big programs") == "functions", 'the motto\'s longest word is "functions"'

def t_shout():
    assert shout("hey") == "HEY!", 'shout("hey") should default to "HEY!"'
    assert shout("hey", "?") == "HEY?", "a second argument replaces the punctuation"
    assert shout("done") == "DONE!", 'shout("done") should be "DONE!"'

def t_docstrings():
    for fn in (count_words, longest_word, shout):
        assert fn.__doc__ is not None, f"{fn.__name__} has no docstring yet"
        assert len(fn.__doc__.strip()) >= 10, f"{fn.__name__}'s docstring should be a real sentence"

test("count_words counts any text", t_count_words)
test("longest_word finds the longest", t_longest_word)
test("shout uppercases with default punctuation", t_shout)
test("all three functions are documented", t_docstrings)
