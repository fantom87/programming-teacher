class Cart:
    """A shopping cart: items in, totals out."""

    def __init__(self):
        self.items = []

    def add(self, name, price):
        self.items.append((name, price))

    def count(self):
        return len(self.items)

    def total(self):
        return round(sum(price for _, price in self.items), 2)


def run_tests():
    """Last lesson's collector — collect test_ functions, run, report."""
    collected = [fn for name, fn in list(globals().items())
                 if name.startswith("test_") and callable(fn)]
    passed = failed = 0
    for fn in collected:
        try:
            fn()
            print(".", end="")
            passed += 1
        except AssertionError:
            print("F", end="")
            failed += 1
    print()
    print(f"{failed} failed, {passed} passed" if failed else f"{passed} passed")


def fresh_cart():
    """The fixture: a brand-new cart, no shared state."""
    return Cart()


def test_add_increases_count():
    cart = fresh_cart()
    cart.add("mug", 8.50)
    assert cart.count() == 1


def test_carts_are_isolated():
    dirty = fresh_cart()
    dirty.add("mug", 8.50)
    assert fresh_cart().count() == 0


TOTAL_CASES = [
    ([], 0.0),
    ([2.50], 2.50),
    ([2.50, 3.00, 4.25], 9.75),
]


def test_totals():
    for prices, expected in TOTAL_CASES:
        cart = fresh_cart()
        for price in prices:
            cart.add("item", price)
        assert cart.total() == expected, f"case {prices}: expected {expected}, got {cart.total()}"


run_tests()
