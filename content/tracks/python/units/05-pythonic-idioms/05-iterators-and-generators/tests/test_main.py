def t_is_generator():
    import types
    assert isinstance(countdown(3), types.GeneratorType), "countdown should be a generator — use yield, not return"

def t_counts_down():
    assert list(countdown(5)) == [5, 4, 3, 2, 1], "countdown(5) should yield 5, 4, 3, 2, 1"
    assert list(countdown(1)) == [1], "countdown(1) yields just 1"
    assert list(countdown(0)) == [], "countdown(0) yields nothing at all"

def t_generator_sums():
    assert sum(countdown(100)) == 5050, "sum(countdown(100)) should be 5050"

def t_letters_cursor():
    assert next(letters) == "c", "after your two next() calls, the letters iterator should be resting on 'c'"

test("countdown is a real generator", t_is_generator)
test("countdown yields n down to 1", t_counts_down)
test("sum can drink straight from the generator", t_generator_sums)
test("the letters iterator remembers its place", t_letters_cursor)
