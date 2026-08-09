def slugify(title):
    """Turn a post title into a URL slug: lowercase, hyphens, a-z0-9 only."""
    words = title.lower().split()
    cleaned = ["".join(ch for ch in word if ch.isalnum()) for word in words]
    return "-".join(word for word in cleaned if word)


# --- your tests: pytest style (test_ prefix, one bare assert each) ---


def test_lowercases():
    ...


# --- your mini pytest: collect by name, run, report ---


def run_tests():
    ...


run_tests()
