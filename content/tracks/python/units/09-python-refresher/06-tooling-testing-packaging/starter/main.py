import re

# The toolbelt in miniature: a function, its pytest-style tests, and
# pytest's discovery loop rebuilt by hand.

# 1. slugify(text) — lowercase; every run of non-alphanumeric
#    characters becomes ONE hyphen; no leading/trailing hyphens.
#    One re.sub with a negated character class + strip("-").

# 2. Three pytest-style tests — bare functions, bare asserts:
#    test_lowercases, test_hyphenates, test_strips_edges.
#    Each asserts one slugify fact. No classes, no framework.

# 3. run_tests() — walk sorted(globals()); call every CALLABLE whose
#    name starts with "test_", catching AssertionError.
#    Print "FAIL <name>" per failure, then the summary:
#    "<passed> passed" — or "<passed> passed, <failed> failed".

# Drill — leave these lines exactly as they are:
print(slugify("  Hello, World!  "))
run_tests()
