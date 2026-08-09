def t_e501_flags_long_lines():
    long_line = "value = '" + "a" * 90 + "'"
    findings = check_source("sample.py", long_line + "\n")
    assert len(findings) == 1, f"one long line is one finding, got {findings}"
    assert findings[0].startswith("sample.py:1: E501"), f"expected 'sample.py:1: E501 ...', got {findings[0]!r}"
    assert check_source("sample.py", "x = 1\n") == [], "a short line is not a finding"

def t_e501_uses_the_limit():
    at_limit = "x = " + "a" * 84
    over_limit = at_limit + "a"
    assert len(at_limit) == MAX_LINE, "the test line should sit exactly on the limit"
    assert check_source("sample.py", at_limit + "\n") == [], f"{MAX_LINE} characters is allowed — only longer lines are E501"
    assert len(check_source("sample.py", over_limit + "\n")) == 1, "one character over the limit is E501"

def t_w291_flags_trailing_whitespace():
    findings = check_source("sample.py", "value = 1   \nvalue = 2\n")
    assert len(findings) == 1, f"only the first line trails whitespace, got {findings}"
    assert findings[0].startswith("sample.py:1: W291"), f"expected 'sample.py:1: W291 ...', got {findings[0]!r}"

def t_f401_flags_unused_imports():
    source = "import json\nimport statistics\n\nprint(statistics.fmean([1, 2]))\n"
    findings = check_source("sample.py", source)
    assert len(findings) == 1, f"statistics is used, json is not — expected one finding, got {findings}"
    assert findings[0].startswith("sample.py:1: F401"), f"expected 'sample.py:1: F401 ...', got {findings[0]!r}"
    assert "json" in findings[0], f"the finding should name the unused import, got {findings[0]!r}"

def t_f401_handles_from_imports():
    source = "from pathlib import Path\nfrom os import getcwd\n\nprint(Path('.'))\n"
    findings = check_source("sample.py", source)
    assert len(findings) == 1, f"Path is used, getcwd is not — expected one finding, got {findings}"
    assert "getcwd" in findings[0] and "F401" in findings[0], f"expected an F401 for getcwd, got {findings[0]!r}"

def t_clean_source_is_silent():
    source = "import statistics\n\n\ndef mean(values):\n    return statistics.fmean(values)\n"
    assert check_source("sample.py", source) == [], "clean source produces no findings at all"

def t_messy_is_clean_now():
    from pathlib import Path
    source = Path("messy.py").read_text(encoding="utf-8")
    findings = check_source("messy.py", source)
    assert findings == [], f"messy.py still has findings: {findings}"
    assert "def summarize" in source, "messy.py should still define summarize — fix the style, keep the code"

def t_messy_still_behaves():
    import messy
    got = messy.summarize([1.0, 2.0, 3.0])
    assert got == "3 readings, average 2.00, range 1.00 to 3.00", f"summarize must return the same string as before the cleanup, got {got!r}"
    assert messy.summarize([4.0]) == "1 readings, average 4.00, range 4.00 to 4.00", "one reading should still summarize correctly"

test("E501 catches long lines", t_e501_flags_long_lines)
test("E501 uses MAX_LINE as the boundary", t_e501_uses_the_limit)
test("W291 catches trailing whitespace", t_w291_flags_trailing_whitespace)
test("F401 catches unused imports", t_f401_flags_unused_imports)
test("F401 understands from-imports", t_f401_handles_from_imports)
test("clean source produces nothing", t_clean_source_is_silent)
test("messy.py passes the linter", t_messy_is_clean_now)
test("messy.py still works", t_messy_still_behaves)
