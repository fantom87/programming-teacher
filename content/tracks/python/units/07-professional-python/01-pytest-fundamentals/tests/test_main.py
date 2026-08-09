TEST_NAMES = ("test_lowercases", "test_punctuation_dropped", "test_spaces_become_hyphens")

def t_three_tests_exist_and_pass():
    for name in TEST_NAMES:
        fn = globals().get(name)
        assert callable(fn), f"{name} should be a test function taking no parameters"
        fn()  # a passing test just returns

def t_tests_can_actually_fail():
    real = globals()["slugify"]
    globals()["slugify"] = lambda title: "definitely-not-right"
    try:
        for name in TEST_NAMES:
            raised = False
            try:
                globals()[name]()
            except AssertionError:
                raised = True
            assert raised, f"{name} passed against a deliberately broken slugify — is it really asserting?"
    finally:
        globals()["slugify"] = real

def t_collector_finds_new_tests():
    import contextlib, io
    globals()["test_zzz_injected"] = lambda: None
    try:
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            run_tests()
        out = buf.getvalue()
    finally:
        del globals()["test_zzz_injected"]
    assert out.startswith("....\n"), f"a 4th test was added to globals(); expected '....' then a newline, got {out!r}"
    assert out.strip().endswith("4 passed"), f"the summary should count the discovered test, got {out!r}"

def t_failures_are_counted():
    import contextlib, io
    def boom():
        assert False, "failing on purpose"
    globals()["test_zzz_boom"] = boom
    try:
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            run_tests()
        out = buf.getvalue()
    finally:
        del globals()["test_zzz_boom"]
    assert out.startswith("...F\n"), f"a failing test should print 'F' after the three dots, got {out!r}"
    assert out.strip().endswith("1 failed, 3 passed"), f"expected the summary '1 failed, 3 passed', got {out!r}"

test("the three tests exist and pass", t_three_tests_exist_and_pass)
test("the tests fail when slugify is broken", t_tests_can_actually_fail)
test("run_tests discovers tests by name", t_collector_finds_new_tests)
test("run_tests reports failures", t_failures_are_counted)
