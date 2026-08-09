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


# 1. fresh_cart() — the fixture. Returns a NEW Cart every call.


# 2. test_add_increases_count — add one item to a fresh cart, assert
#    count() == 1.
#    test_carts_are_isolated — add to one fresh cart, then assert a
#    SECOND fresh_cart() still has count() == 0.


# 3. TOTAL_CASES — the parametrize table: at least three
#    (prices, expected_total) rows, including ([], 0.0) and a row with
#    several prices. Write the expected totals as literals.
TOTAL_CASES = [
]

# 4. test_totals — ONE loop over TOTAL_CASES. Fresh cart per case, add
#    every price, then assert total() == expected with an f-string
#    message naming that case's prices.


run_tests()
