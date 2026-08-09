def t_find_dates():
    assert find_dates("shipped 2026-01-02, patched 2027-03-04") == ["2026-01-02", "2027-03-04"], "both dates, in order"
    assert find_dates("meeting on 1999-12-31") == ["1999-12-31"], "a single date comes back as a one-item list"

def t_find_dates_empty():
    assert find_dates("no dates in here") == [], "a text without dates should give an empty list"
    assert find_dates("almost: 2026-1-2") == [], "2026-1-2 is not YYYY-MM-DD — the digit counts matter"

def t_first_error():
    assert first_error("boot ok\nERROR: no signal\nERROR: later") == "no signal", "only the FIRST error message"
    assert first_error("ERROR: x failed hard") == "x failed hard", "capture everything after the marker"

def t_first_error_none():
    assert first_error("all systems nominal") is None, "no ERROR anywhere should return None, not crash"

test("find_dates finds every date", t_find_dates)
test("find_dates is strict about shape", t_find_dates_empty)
test("first_error captures the first message", t_first_error)
test("first_error survives a clean log", t_first_error_none)
