def t_modules_go_under_src():
    assert relocate("core.py") == "src/slugkit/core.py", f"package modules belong under src/<package>/, got {relocate('core.py')!r}"
    assert relocate("cli.py") == "src/slugkit/cli.py", f"got {relocate('cli.py')!r}"

def t_tests_go_beside_the_package():
    assert relocate("test_core.py") == "tests/test_core.py", f"tests sit beside the package, not inside it — got {relocate('test_core.py')!r}"
    assert relocate("conftest.py") == "tests/conftest.py", f"conftest.py is pytest's shared setup and lives in tests/, got {relocate('conftest.py')!r}"

def t_non_python_files_stay_put():
    for path in ("README.md", ".gitignore", "notes.txt", "pyproject.toml"):
        assert relocate(path) == path, f"{path} belongs at the repo root, got {relocate(path)!r}"

def t_already_placed_files_are_left_alone():
    for path in ("src/slugkit/__init__.py", "tests/test_core.py", "docs/guide.md"):
        assert relocate(path) == path, f"{path} is already placed — relocate should return it unchanged, got {relocate(path)!r}"

def t_relocate_uses_the_package_constant():
    original = globals()["PACKAGE"]
    globals()["PACKAGE"] = "otherpkg"
    try:
        assert relocate("core.py") == "src/otherpkg/core.py", "build the destination from PACKAGE instead of typing the package name"
    finally:
        globals()["PACKAGE"] = original

def t_missing_names_the_gaps():
    gaps = missing(PROPOSED)
    assert gaps == ["pyproject.toml", ".gitignore", "src/slugkit/__init__.py"], f"README.md is already there; expected the other three in REQUIRED order, got {gaps}"
    assert missing(list(REQUIRED)) == [], "a project that already has everything needs nothing added"
    assert missing([]) == list(REQUIRED), "an empty project is missing all of it"

def t_plan_prints_the_migration():
    import contextlib, io
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        plan(["core.py", "notes.txt"])
    lines = buf.getvalue().strip().splitlines()
    assert lines[0] == "move core.py -> src/slugkit/core.py", f"a relocated file is a move line, got {lines[0]!r}"
    assert lines[1] == "keep notes.txt", f"a file already in the right place is a keep line, got {lines[1]!r}"
    assert lines[-1] == "2 placed, 4 to add", f"the tally should count the paths given and the gaps found, got {lines[-1]!r}"
    assert "add README.md" in lines, f"this smaller project has no README either, so it should be listed: {lines}"

test("modules move under src/", t_modules_go_under_src)
test("tests and conftest move to tests/", t_tests_go_beside_the_package)
test("non-Python files stay at the root", t_non_python_files_stay_put)
test("already-placed files are untouched", t_already_placed_files_are_left_alone)
test("the destination is built from PACKAGE", t_relocate_uses_the_package_constant)
test("missing names exactly the gaps", t_missing_names_the_gaps)
test("plan prints moves, keeps, adds and a tally", t_plan_prints_the_migration)
