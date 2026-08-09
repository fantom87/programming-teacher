def t_file_exists():
    from pathlib import Path
    assert Path("totals.csv").exists(), "totals.csv was not created"

def t_rows_correct():
    import csv
    with open("totals.csv", encoding="utf-8", newline="") as f:
        rows = [r for r in csv.reader(f) if r]
    assert rows[0] == ["name", "total"], f"the header row is {rows[0]}, expected ['name', 'total']"
    assert rows[1:] == [["Mira", "85"], ["Deshi", "95"], ["Kai", "87"]], "each data row should be a name and its computed points + bonus"

def t_no_blank_lines():
    from pathlib import Path
    text = Path("totals.csv").read_text(encoding="utf-8")
    assert "\n\n" not in text, 'totals.csv has blank lines between rows — open the file with newline=""'

test("totals.csv exists on disk", t_file_exists)
test("header plus three computed totals", t_rows_correct)
test('no blank lines (newline="" was passed)', t_no_blank_lines)
