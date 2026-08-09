def t_file_created():
    from pathlib import Path
    assert Path("journal.txt").exists(), "journal.txt was not created"

def t_both_lines():
    from pathlib import Path
    text = Path("journal.txt").read_text(encoding="utf-8")
    assert "Day 1: learned classes" in text, "the first line is missing — write it with write_text"
    assert "Day 2: survived exceptions" in text, "the second line is missing — append it with open(..., 'a')"

def t_exactly_two_lines():
    from pathlib import Path
    lines = Path("journal.txt").read_text(encoding="utf-8").splitlines()
    assert len(lines) == 2, f"journal.txt holds {len(lines)} lines, expected 2 — did each written line end with \\n?"

test("journal.txt exists on disk", t_file_created)
test("both journal entries are in the file", t_both_lines)
test("the file holds exactly 2 lines", t_exactly_two_lines)
