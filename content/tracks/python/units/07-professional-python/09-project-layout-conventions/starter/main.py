PACKAGE = "slugkit"

# What every repository of this shape must have. Order matters: the
# plan reports gaps in exactly this order.
REQUIRED = (
    "pyproject.toml",
    "README.md",
    ".gitignore",
    f"src/{PACKAGE}/__init__.py",
)

# The project as it stands today — one flat pile at the repo root.
PROPOSED = [
    "cli.py",
    "core.py",
    "test_core.py",
    "notes.txt",
    "README.md",
]


# 1. relocate(path) — where this file belongs, as a string. Rules, most
#    specific first:
#      "/" already in the path      -> it's placed; return it unchanged
#      doesn't end with ".py"       -> stays at the repo root
#      "conftest.py" or "test_*.py" -> tests/<name>
#      anything else                -> src/<PACKAGE>/<name>
#    Build the package folder from PACKAGE — don't type "slugkit".


# 2. missing(paths) — relocate every path, then return the REQUIRED
#    entries that nothing provides, in REQUIRED's own order.


# 3. plan(paths) — print the migration:
#      move cli.py -> src/slugkit/cli.py     (relocate changed it)
#      keep notes.txt                        (it didn't)
#      add pyproject.toml                    (one per gap)
#      5 placed, 3 to add                    (both numbers counted)


# 4. Call plan(PROPOSED).
