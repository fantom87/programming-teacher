def t_file_exists():
    from pathlib import Path
    assert Path("profile.json").exists(), "profile.json was not created"

def t_round_trip():
    import json
    from pathlib import Path
    saved = json.loads(Path("profile.json").read_text(encoding="utf-8"))
    assert saved["name"] == "Ada", "the name should still be Ada"
    assert saved["level"] == 8, f"level is {saved['level']}, expected 8 — load, add 1, save again"
    assert saved["languages"] == ["python", "javascript", "csharp"], 'languages should be the original two with "csharp" appended'

def t_pretty_printed():
    from pathlib import Path
    text = Path("profile.json").read_text(encoding="utf-8")
    assert '\n  "' in text, "the file is one long line — pass indent=2 to json.dumps"

test("profile.json exists on disk", t_file_exists)
test("the data survived the round-trip", t_round_trip)
test("the JSON is pretty-printed with indent=2", t_pretty_printed)
