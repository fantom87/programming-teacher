import io
from contextlib import redirect_stdout


def t_tests_pass_individually():
    for fn in (test_lowercases, test_punctuation_dropped, test_spaces_become_hyphens):
        fn()  # a pytest-style test passes by simply not raising


def t_slugify_untouched():
    assert slugify("Deep Work Wins!") == "deep-work-wins", "slugify itself should not be modified"


def t_report_shape():
    buf = io.StringIO()
    with redirect_stdout(buf):
        run_tests()
    out = buf.getvalue()
    assert "..." in out, "each passing test should print one dot on a single line"
    assert out.endswith("3 passed\n"), f"the run should end with a computed '3 passed' line, got {out!r}"


def t_collection_is_dynamic():
    ran = []

    def test_zz_injected():
        ran.append(True)
        raise AssertionError("boom")

    globals()["test_zz_injected"] = test_zz_injected
    try:
        buf = io.StringIO()
        with redirect_stdout(buf):
            run_tests()
        out = buf.getvalue()
    finally:
        del globals()["test_zz_injected"]
    assert ran, "run_tests must discover new test_ functions by scanning globals(), not use a hardcoded list"
    assert "F" in out, "a failing test should print an F"
    assert "1 failed, 3 passed" in out, f"the summary should count the injected failure, got {out!r}"


test("the three slugify tests pass", t_tests_pass_individually)
test("slugify is unchanged", t_slugify_untouched)
test("dots and summary look like pytest", t_report_shape)
test("collection discovers tests by name", t_collection_is_dynamic)
