def t_winner():
    assert "winner" in globals(), "there's no winner variable yet"
    assert winner == "Mira", f"winner holds {winner!r}, expected 'Mira' — the FIRST item lives at index 0"

def t_last():
    assert "last" in globals(), "there's no last variable yet"
    assert last == "Ken", f"last holds {last!r}, expected 'Ken' — finishers[-1] counts from the end"

def t_podium():
    assert "podium" in globals(), "there's no podium variable yet"
    assert podium == ["Mira", "Josh", "Priya"], f"podium holds {podium!r} — slice the first three with finishers[:3]"

test("winner is Mira (index 0)", t_winner)
test("last is Ken (index -1)", t_last)
test("podium is the first three finishers", t_podium)
