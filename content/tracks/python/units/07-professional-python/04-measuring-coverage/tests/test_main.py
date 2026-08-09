def t_instrument_wraps_lazily_and_calls_through():
    def probe(x, offset=0):
        return x * 2 + offset
    globals()["zz_probe"] = probe
    HITS.discard("zz_probe")
    instrument(["zz_probe"])
    try:
        assert globals()["zz_probe"] is not probe, "instrument should replace the global with a counting wrapper"
        assert "zz_probe" not in HITS, "instrumenting must not record a hit — only calling does"
        assert globals()["zz_probe"](20, offset=2) == 42, "the wrapper must pass args and kwargs through and return the real result"
        assert "zz_probe" in HITS, "calling a wrapped function should record its name in HITS"
    finally:
        globals()["zz_probe"] = probe
        HITS.discard("zz_probe")

def t_report_names_the_gaps():
    import contextlib, io
    saved = set(HITS)
    HITS.clear()
    HITS.update({"quote", "base_rate", "surcharge"})
    try:
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            coverage_report()
        out = buf.getvalue().strip()
    finally:
        HITS.clear()
        HITS.update(saved)
    assert out.startswith("coverage: 50% (3/6)"), f"three of six covered should read 'coverage: 50% (3/6)', got {out!r}"
    assert out.endswith("missing: apply_discount, express_fee, refund"), f"the gaps should be named alphabetically, got {out!r}"

def t_report_is_clean_at_full_coverage():
    import contextlib, io
    saved = set(HITS)
    HITS.clear()
    HITS.update(UNDER_TEST)
    try:
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            coverage_report()
        out = buf.getvalue().strip()
    finally:
        HITS.clear()
        HITS.update(saved)
    assert out == "coverage: 100% (6/6)", f"full coverage should print exactly 'coverage: 100% (6/6)', got {out!r}"

def t_suite_reaches_every_function():
    gaps = sorted(set(UNDER_TEST) - HITS)
    assert not gaps, f"the suite never calls: {', '.join(gaps)}"

def t_added_tests_actually_assert():
    for name in ("refund", "apply_discount", "express_fee"):
        original = globals()[name]
        globals()[name] = lambda *args, **kwargs: 123456789
        try:
            broke_something = False
            for test_name, fn in list(globals().items()):
                if test_name.startswith("test_") and callable(fn):
                    try:
                        fn()
                    except AssertionError:
                        broke_something = True
            assert broke_something, f"breaking {name} failed no test — coverage without real assertions proves nothing"
        finally:
            globals()[name] = original

test("instrument wraps lazily and calls through", t_instrument_wraps_lazily_and_calls_through)
test("the report names what was missed", t_report_names_the_gaps)
test("the report is clean at 100%", t_report_is_clean_at_full_coverage)
test("the suite reaches all six functions", t_suite_reaches_every_function)
test("the tests assert results, not just calls", t_added_tests_actually_assert)
