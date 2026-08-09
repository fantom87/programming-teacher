def slugify(title):
    """Turn a post title into a URL slug: lowercase, hyphens, a-z0-9 only."""
    words = title.lower().split()
    cleaned = ["".join(ch for ch in word if ch.isalnum()) for word in words]
    return "-".join(word for word in cleaned if word)


# --- tests: pytest style (test_ prefix, one bare assert each) ---


def test_lowercases():
    assert slugify("Hello") == "hello"


def test_punctuation_dropped():
    assert slugify("Hello, World!") == "hello-world"


def test_spaces_become_hyphens():
    assert slugify("deep work wins") == "deep-work-wins"


# --- mini pytest: collect by name, run, report ---


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
