def t_still_computes():
    assert add(2, 3) == 5, "the wrapper must return what add returns"
    assert add(10, -4) == 6, "any arguments should pass through *args"
    assert shout("hey") == "HEY!", "shout should still uppercase and add !"

def t_identity_kept():
    assert add.__name__ == "add", "add.__name__ is 'wrapper' — put @functools.wraps(func) on the wrapper"
    assert add.__doc__ == "Add two numbers.", "the docstring should survive decoration"
    assert shout.__name__ == "shout", "shout should keep its name too"

def t_works_on_any_function():
    double = logged(lambda x: x * 2)
    assert double(4) == 8, "logged should wrap any function, not just add/shout"

def t_prints_computed_line():
    import io
    from contextlib import redirect_stdout
    buf = io.StringIO()
    with redirect_stdout(buf):
        add(7, 8)
    assert buf.getvalue() == "calling add(7, 8)\n", f"expected 'calling add(7, 8)', got {buf.getvalue()!r} — build the line from func.__name__ and repr of each arg"

test("decorated functions still return their results", t_still_computes)
test("functools.wraps preserves name and docstring", t_identity_kept)
test("logged wraps arbitrary functions", t_works_on_any_function)
test("the calling line is computed, not hardcoded", t_prints_computed_line)
