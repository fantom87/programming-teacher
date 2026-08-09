# The code under test. It works — leave it alone.
def slugify(title):
    """Turn a post title into a URL slug."""
    cleaned = "".join(c for c in title.lower() if c.isalnum() or c in " -")
    return "-".join(cleaned.split())


# 1. Three tests, pytest style. Name each one test_<what it checks>,
#    give it no parameters, and put ONE bare assert in the body:
#
#      test_lowercases             "Hello"          -> "hello"
#      test_punctuation_dropped    "Hello, World!"  -> "hello-world"
#      test_spaces_become_hyphens  "deep work wins" -> "deep-work-wins"


# 2. run_tests() — pytest's core loop, your version:
#    - collect every callable in globals() whose name starts with "test_"
#      into a list FIRST (collect, then run — like pytest does)
#    - run each one: print "." if it returns, "F" if it raises
#      AssertionError, both with end="" so they share a line
#    - print() to end the dot line, then the summary, computed:
#        3 passed                 (nothing failed)
#        1 failed, 3 passed       (something did)


# 3. Call run_tests() here.
