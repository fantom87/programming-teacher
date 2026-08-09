# The code under test. It works — leave it alone.
def slugify(title):
    """Turn a post title into a URL slug."""
    cleaned = "".join(c for c in title.lower() if c.isalnum() or c in " -")
    return "-".join(cleaned.split())


def test_lowercases():
    assert slugify("Hello") == "hello"


def test_punctuation_dropped():
    assert slugify("Hello, World!") == "hello-world"


def test_spaces_become_hyphens():
    assert slugify("deep work wins") == "deep-work-wins"


def run_tests():
    """Collect every test_ function, run it, report like pytest."""
    collected = [fn for name, fn in list(globals().items())
                 if name.startswith("test_") and callable(fn)]

    passed = 0
    failed = 0
    for fn in collected:
        try:
            fn()
            print(".", end="")
            passed += 1
        except AssertionError:
            print("F", end="")
            failed += 1

    print()
    if failed:
        print(f"{failed} failed, {passed} passed")
    else:
        print(f"{passed} passed")


run_tests()
