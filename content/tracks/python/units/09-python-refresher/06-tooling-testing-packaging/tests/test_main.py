def t_slugify():
    assert slugify("Python 3.13 — What's New") == "python-3-13-what-s-new", "runs of punctuation collapse to ONE hyphen"
    assert slugify("Already-Slugged") == "already-slugged", "hyphens between words survive"
    assert slugify("!!!") == "", "pure punctuation slugs to empty"
    assert slugify("Rock & Roll") == "rock-roll", "the & and its spaces are one separator, not three"

def t_pytest_style():
    names = [n for n in globals() if n.startswith("test_") and callable(globals()[n])]
    assert len(names) == 3, f"exactly three test_ functions expected, found {len(names)}: {sorted(names)}"
    for n in names:
        assert globals()[n].__code__.co_argcount == 0, f"{n} should take no arguments — pytest calls test functions bare"

def t_green_run():
    import io
    from contextlib import redirect_stdout
    buffer = io.StringIO()
    with redirect_stdout(buffer):
        run_tests()
    assert buffer.getvalue() == "3 passed\n", f"a green run prints exactly '3 passed', got {buffer.getvalue()!r}"

def t_red_run():
    import io
    from contextlib import redirect_stdout
    def boom():
        assert False, "injected failure"
    globals()["test_zz_boom"] = boom
    try:
        buffer = io.StringIO()
        with redirect_stdout(buffer):
            run_tests()
        out = buffer.getvalue()
        assert "FAIL test_zz_boom" in out, "each failing test gets its own FAIL line — discovery must find tests added at runtime"
        assert out.rstrip().endswith("3 passed, 1 failed"), f"the summary should end '3 passed, 1 failed', got {out!r}"
    finally:
        del globals()["test_zz_boom"]

test("slugify handles the rough edges", t_slugify)
test("three bare test_ functions exist", t_pytest_style)
test("a green run counts to 3", t_green_run)
test("a red run reports the failure", t_red_run)
