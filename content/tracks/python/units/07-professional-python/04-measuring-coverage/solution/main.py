# --- the code under test: a parcel pricer, all money in cents ---

def base_rate(weight):
    """Base cost for a parcel of this many kilos."""
    return 400 + int(weight * 120)


def surcharge(zone):
    """Delivery-zone surcharge."""
    return {"local": 0, "national": 250, "island": 900}.get(zone, 500)


def express_fee(days):
    """Rush delivery: the sooner you want it, the more it costs."""
    return 0 if days >= 3 else 300 * (3 - days)


def apply_discount(total, code):
    """Knock 10% off for a valid coupon."""
    return int(total * 0.9) if code == "SHIP10" else total


def refund(cents):
    """Refunds keep a 200-cent handling fee."""
    return max(0, cents - 200)


def quote(weight, zone, days=None, code=None):
    """The whole price for one parcel."""
    total = base_rate(weight) + surcharge(zone)
    if days is not None:
        total += express_fee(days)
    if code is not None:
        total = apply_discount(total, code)
    return total


UNDER_TEST = ("apply_discount", "base_rate", "express_fee", "quote", "refund", "surcharge")

# --- the tooling ---

HITS = set()


def make_counter(name, fn):
    """A counting wrapper: record the call, then call through. Provided."""
    def wrapper(*args, **kwargs):
        HITS.add(name)
        return fn(*args, **kwargs)
    return wrapper


def run_tests():
    """The collector from lesson 1 — collect test_ functions, run, report."""
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


def instrument(names):
    """Start measuring: every named function reports itself when called."""
    for name in names:
        globals()[name] = make_counter(name, globals()[name])


def coverage_report():
    """Print what the suite touched — and, pointedly, what it didn't."""
    missing = sorted(set(UNDER_TEST) - HITS)
    percent = round(len(HITS) / len(UNDER_TEST) * 100)
    line = f"coverage: {percent}% ({len(HITS)}/{len(UNDER_TEST)})"
    if missing:
        line += f" missing: {', '.join(missing)}"
    print(line)


# --- the suite ---

def test_quote_basic():
    assert quote(2.0, "local") == 640


def test_quote_express():
    assert quote(2.0, "national", days=1) == 1490


def test_quote_coupon():
    assert quote(2.0, "national", code="SHIP10") == 801


def test_refund_keeps_handling_fee():
    assert refund(1000) == 800


instrument(UNDER_TEST)
run_tests()
coverage_report()
