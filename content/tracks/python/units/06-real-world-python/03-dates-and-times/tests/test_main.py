def t_parse_day():
    d = parse_day("1999-12-31")
    assert d.year == 1999, f"parse_day('1999-12-31').year is {d.year}, expected 1999"
    assert d.month == 12, "the month should be 12"
    assert d.day == 31, "the day should be 31"

def t_parse_returns_date():
    d = parse_day("2026-08-08")
    assert not hasattr(d, "hour"), "parse_day should return a date, not a datetime — add .date()"

def t_days_between():
    assert days_between("2026-01-01", "2026-01-31") == 30, "January 1st to 31st is 30 days"
    assert days_between("2026-08-08", "2026-08-08") == 0, "a date to itself is 0 days"
    assert days_between("2026-01-06", "2026-01-01") == -5, "going backwards should be negative"

def t_leap_year():
    assert days_between("2028-02-01", "2028-03-01") == 29, "February 2028 has 29 days — date math should know that"

test("parse_day builds a real date", t_parse_day)
test("parse_day drops the time part", t_parse_returns_date)
test("days_between counts whole days", t_days_between)
test("leap years are handled for free", t_leap_year)
