class Cart:
    """A tiny shopping cart: the code under test."""

    def __init__(self):
        self.items = []

    def add(self, name, price):
        self.items.append((name, price))

    def count(self):
        return len(self.items)

    def total(self):
        return round(sum(price for _, price in self.items), 2)


# --- your fixture ---


def fresh_cart():
    ...


# --- your tests ---


def test_add_increases_count():
    assert False, "write me"


def test_carts_are_isolated():
    assert False, "write me"


# --- parametrize: one test body, a table of cases ---

TOTAL_CASES = [
    # (prices, expected_total)
]


def test_totals_parametrized():
    assert False, "write me"


# --- mini test runner (from last lesson) ---


def run_tests():
    collected = [
        (name, fn)
        for name, fn in sorted(globals().items())
        if name.startswith("test_") and callable(fn)
    ]
    failed = 0
    for name, fn in collected:
        try:
            fn()
            print(".", end="")
        except AssertionError:
            failed += 1
            print("F", end="")
    print()
    passed = len(collected) - failed
    if failed:
        print(f"{failed} failed, {passed} passed")
    else:
        print(f"{passed} passed")


run_tests()
