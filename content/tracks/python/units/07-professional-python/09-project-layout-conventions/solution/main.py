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


def relocate(path):
    """Where this file belongs under a src layout."""
    if "/" in path:
        return path
    if not path.endswith(".py"):
        return path
    if path == "conftest.py" or path.startswith("test_"):
        return f"tests/{path}"
    return f"src/{PACKAGE}/{path}"


def missing(paths):
    """The required scaffolding these files don't provide."""
    placed = {relocate(path) for path in paths}
    return [item for item in REQUIRED if item not in placed]


def plan(paths):
    """Print the migration to a conventional layout."""
    for path in paths:
        target = relocate(path)
        if target == path:
            print(f"keep {path}")
        else:
            print(f"move {path} -> {target}")

    gaps = missing(paths)
    for gap in gaps:
        print(f"add {gap}")

    print(f"{len(paths)} placed, {len(gaps)} to add")


plan(PROPOSED)
