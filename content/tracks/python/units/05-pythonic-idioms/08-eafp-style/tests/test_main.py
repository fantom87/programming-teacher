def t_parse_age_valid():
    assert parse_age("7") == 7, 'parse_age("7") should be the int 7'
    assert parse_age(" 19 ") == 19, "int() handles surrounding spaces — a pre-check like isdigit() would wrongly reject this"
    assert parse_age("-3") == -3, "negative numbers are valid ints too — another case isdigit() gets wrong"

def t_parse_age_invalid():
    assert parse_age("forty-two") is None, "words are not ints — expect None back"
    assert parse_age("") is None, "an empty string should give None"
    assert parse_age("3.5") is None, 'int("3.5") raises ValueError, so parse_age returns None'

def t_lookup():
    assert lookup({"a": 1}, "a") == 1, "a present key returns its value"
    assert lookup({}, "x") == 0, "a missing key returns 0"

def t_pantry_untouched():
    assert lookup(pantry, "saffron") == 0, "missing pantry items report 0"
    assert pantry == {"flour": 2, "eggs": 12}, "lookup must not add missing keys to the dict"

test("parse_age accepts what int accepts", t_parse_age_valid)
test("parse_age returns None on bad input", t_parse_age_invalid)
test("lookup falls back to 0", t_lookup)
test("the pantry is left untouched", t_pantry_untouched)
