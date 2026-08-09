import io
from contextlib import redirect_stdout


def t_fixture_returns_fresh():
    a = fresh_cart()
    b = fresh_cart()
    assert isinstance(a, Cart), "fresh_cart should return a Cart"
    assert a is not b, "each call must build a NEW cart, not hand back the same one"
    assert a.count() == 0, "a fresh cart starts empty"


def t_fixture_isolates():
    dirty = fresh_cart()
    dirty.add("x", 1.0)
    assert fresh_cart().count() == 0, "state must not leak from one fixture to the next"


def t_cases_cover_edges():
    assert len(TOTAL_CASES) >= 3, "cover at least three cases"
    assert any(prices == [] for prices, _ in TOTAL_CASES), "include the empty-cart edge case ([], 0.0)"
    assert any(len(prices) >= 2 for prices, _ in TOTAL_CASES), "include a multi-item case"
    for prices, expected in TOTAL_CASES:
        assert round(sum(prices), 2) == expected, f"case {prices} expects {expected} — that math is wrong"


def t_suite_green():
    buf = io.StringIO()
    with redirect_stdout(buf):
        run_tests()
    out = buf.getvalue()
    assert "failed" not in out, f"every test should pass, got {out!r}"
    assert out.endswith("passed\n"), f"run_tests should end with the summary line, got {out!r}"


test("fresh_cart builds a new cart each call", t_fixture_returns_fresh)
test("fixtures isolate state", t_fixture_isolates)
test("the case table covers the edges", t_cases_cover_edges)
test("the whole suite is green", t_suite_green)
