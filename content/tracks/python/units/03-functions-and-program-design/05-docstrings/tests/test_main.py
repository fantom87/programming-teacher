def t_c_to_f_doc():
    assert c_to_f.__doc__ is not None, "c_to_f has no docstring yet"
    assert len(c_to_f.__doc__.strip()) >= 10, "the docstring should be a real sentence, not a word"

def t_clamp_doc():
    assert clamp.__doc__ is not None, "clamp has no docstring yet"
    assert len(clamp.__doc__.strip()) >= 10, "the docstring should be a real sentence, not a word"

def t_still_work():
    assert c_to_f(100) == 212.0, "c_to_f changed — it should still convert correctly"
    assert c_to_f(0) == 32.0, "c_to_f(0) should be 32.0"
    assert clamp(15, 0, 10) == 10, "clamp(15, 0, 10) should cap at 10"
    assert clamp(-3, 0, 10) == 0, "clamp(-3, 0, 10) should raise to 0"
    assert clamp(7, 0, 10) == 7, "clamp(7, 0, 10) should pass 7 through"

test("c_to_f has a docstring", t_c_to_f_doc)
test("clamp has a docstring", t_clamp_doc)
test("both functions still work", t_still_work)
