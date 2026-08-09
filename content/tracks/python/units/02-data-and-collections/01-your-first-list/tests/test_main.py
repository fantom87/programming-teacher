def t_count():
    assert "tasks" in globals(), "the tasks variable is missing — keep the starter line"
    assert len(tasks) == 3, f"tasks has {len(tasks)} items, expected 3 — append \"go outside\" exactly once"

def t_contents():
    assert tasks == ["feed the cat", "write some code", "go outside"], f"tasks holds {tasks!r} — the two starter chores, then \"go outside\" at the end"

test("tasks has 3 items after the append", t_count)
test("tasks holds the right items in order", t_contents)
