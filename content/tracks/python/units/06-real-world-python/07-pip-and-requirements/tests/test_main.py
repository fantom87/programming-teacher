def t_file_exists():
    from pathlib import Path
    assert Path("requirements.txt").exists(), "requirements.txt was not created"

def t_comment_first():
    from pathlib import Path
    lines = Path("requirements.txt").read_text(encoding="utf-8").splitlines()
    assert lines and lines[0].startswith("#"), "the first line should be a # comment naming the project"

def t_three_exact_pins():
    import re
    from pathlib import Path
    lines = Path("requirements.txt").read_text(encoding="utf-8").splitlines()
    pins = [l for l in lines if l.strip() and not l.startswith("#")]
    assert len(pins) == 3, f"found {len(pins)} package lines, expected exactly 3 — the brief needs three"
    for pin in pins:
        assert re.fullmatch(r"[A-Za-z0-9_.-]+==\d[\w.]*", pin), f'"{pin}" is not an exact pin — use name==version'

def t_requests_pinned():
    from pathlib import Path
    text = Path("requirements.txt").read_text(encoding="utf-8")
    assert "requests==2.32.5" in text, "fetching over HTTP is the one certain need — pin requests at the brief's version"

test("requirements.txt exists on disk", t_file_exists)
test("the list is labeled with a comment", t_comment_first)
test("exactly three exact == pins", t_three_exact_pins)
test("requests is pinned at 2.32.5", t_requests_pinned)
