def t_average():
    assert average([2, 4, 6]) == 4, "average([2, 4, 6]) should be 4"
    assert average([5]) == 5, "the average of one number is that number"
    assert average([1.5, 2.5]) == 2.0, "floats average cleanly too"

def t_spread():
    assert spread([1, 9, 4]) == 8, "spread([1, 9, 4]) should be 9 - 1 = 8"
    assert spread([3, 3, 3]) == 0, "identical readings have zero spread"

def t_docstrings():
    for fn in (average, spread):
        assert fn.__doc__ is not None, f"{fn.__name__} has no docstring yet"
        assert len(fn.__doc__.strip()) >= 10, f"{fn.__name__}'s docstring should be a real sentence"

test("average handles any list", t_average)
test("spread is max minus min", t_spread)
test("both functions are documented", t_docstrings)
