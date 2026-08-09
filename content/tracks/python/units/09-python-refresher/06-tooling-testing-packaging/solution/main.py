import re


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def test_lowercases():
    assert slugify("HELLO") == "hello"


def test_hyphenates():
    assert slugify("hello,  world") == "hello-world"


def test_strips_edges():
    assert slugify("  hi!  ") == "hi"


def run_tests():
    passed = failed = 0
    for name in sorted(globals()):
        fn = globals()[name]
        if name.startswith("test_") and callable(fn):
            try:
                fn()
                passed += 1
            except AssertionError:
                print(f"FAIL {name}")
                failed += 1
    summary = f"{passed} passed"
    if failed:
        summary += f", {failed} failed"
    print(summary)


# Drill — leave these lines exactly as they are:
print(slugify("  Hello, World!  "))
run_tests()
