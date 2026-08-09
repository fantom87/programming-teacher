def t_unique():
    assert "unique" in globals(), "there's no unique variable yet — unique = set(visits)"
    assert unique == {"ada", "alan", "grace", "katherine"}, f"unique holds {unique!r} — set(visits) plus .add(\"katherine\")"

def t_visits():
    assert visits == ["ada", "grace", "ada", "alan", "grace", "ada"], "visits changed — build the set FROM it, don't edit it"

test("unique holds the 4 distinct visitors", t_unique)
test("the visits log is untouched", t_visits)
