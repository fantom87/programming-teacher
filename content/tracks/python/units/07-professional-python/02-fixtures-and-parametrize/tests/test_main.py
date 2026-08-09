def t_fixture_is_a_factory():
    a = fresh_cart()
    b = fresh_cart()
    assert isinstance(a, Cart), "fresh_cart() should return a Cart"
    assert a is not b, "fresh_cart() must build a NEW cart each call, not hand back a shared one"
    a.add("mug", 8.50)
    assert fresh_cart().count() == 0, "a cart from fresh_cart() should always start empty"

def t_tests_survive_being_rerun():
    names = ("test_add_increases_count", "test_carts_are_isolated", "test_totals")
    for name in names:
        fn = globals().get(name)
        assert callable(fn), f"{name} should be a test function"
    for round_number in (1, 2):
        for name in names:
            globals()[name]()  # order-independent and repeatable, or state is shared

def t_case_table_is_honest():
    assert len(TOTAL_CASES) >= 3, f"TOTAL_CASES needs at least three rows, has {len(TOTAL_CASES)}"
    assert any(list(prices) == [] for prices, _ in TOTAL_CASES), "include the empty-cart case ([], 0.0)"
    assert any(len(prices) >= 2 for prices, _ in TOTAL_CASES), "include a multi-item case"
    for prices, expected in TOTAL_CASES:
        assert abs(round(sum(prices), 2) - expected) < 1e-9, f"case {prices} expects {expected}, which isn't its total"

def t_every_case_is_actually_checked():
    multi = next(prices for prices, _ in TOTAL_CASES if len(prices) >= 2)
    real_total = Cart.total
    Cart.total = lambda self: real_total(self) if len(self.items) < 2 else 0.0
    try:
        message = None
        try:
            test_totals()
        except AssertionError as e:
            message = str(e)
        assert message is not None, "test_totals passed while multi-item totals were broken — is every case asserted?"
        named = str(multi) in message or any(str(p) in message for p in multi)
        assert named, f"the failure message should name the failing case's prices {multi}; got {message!r}"
    finally:
        Cart.total = real_total

test("fresh_cart is a factory, not a shared object", t_fixture_is_a_factory)
test("tests pass in any order, twice over", t_tests_survive_being_rerun)
test("TOTAL_CASES covers empty and multi-item", t_case_table_is_honest)
test("every case is checked, and named when it fails", t_every_case_is_actually_checked)
