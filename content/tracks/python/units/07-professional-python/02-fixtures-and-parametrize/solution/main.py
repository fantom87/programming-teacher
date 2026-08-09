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


# --- fixture ---


def fresh_cart():
    return Cart()


# --- tests ---


def test_add_increases_count():
    cart = fresh_cart()
    cart.add("mug", 8.50)
    assert cart.count() == 1


def test_carts_are_isolated():
    dirty = fresh_cart()
    dirty.add("leak", 99.00)
    assert fresh_cart().count() == 0


# --- parametrize: one test body, a table of cases ---

TOTAL_CASES = [
    ([2.50, 3.00], 5.50),
    ([10.00], 10.00),
    ([], 0.0),
]


def test_totals_parametrized():
    for prices, expected in TOTAL_CASES:
        cart = fresh_cart()
        for price in prices:
            cart.add("item", price)
        assert cart.total() == expected, (
            f"case {prices}: expected {expected}, got {cart.total()}"
        )


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
