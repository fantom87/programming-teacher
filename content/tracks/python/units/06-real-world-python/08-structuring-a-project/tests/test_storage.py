def t_parse_readings():
    assert parse_readings("1.5\n2.5\n") == [1.5, 2.5], "each line becomes one float"
    assert parse_readings("7.0") == [7.0], "a single line still parses"

def t_parse_skips_blanks():
    assert parse_readings("1.0\n\n2.0\n\n") == [1.0, 2.0], "blank lines should be skipped, not crash float()"
    assert parse_readings("") == [], "empty text parses to an empty list"

def t_load_readings():
    assert load_readings() == [21.5, 19.0, 23.5, 22.0], "load_readings should return the four readings from readings.txt"

test("parse_readings converts lines to floats", t_parse_readings)
test("blank lines are skipped", t_parse_skips_blanks)
test("load_readings reads the real file", t_load_readings)
