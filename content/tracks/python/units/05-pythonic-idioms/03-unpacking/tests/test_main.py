def t_record_unpacked():
    assert name == "Ada Lovelace", "name should hold the record's first slot"
    assert year == 1815, "year should hold the record's second slot"
    assert city == "London", "city should hold the record's third slot"

def t_swap_happened():
    assert gold == "python", 'after the swap, gold should be "python"'
    assert silver == "perl", 'after the swap, silver should be "perl"'

def t_star_unpacking():
    assert first == 92, "first should be the first score"
    assert rest == [75, 88, 60], "rest should be a LIST of the remaining three scores"
    assert scores == [92, 75, 88, 60], "unpacking reads scores — it must not change it"

test("record unpacked into name, year, city", t_record_unpacked)
test("gold and silver swapped places", t_swap_happened)
test("first and *rest split the scores", t_star_unpacking)
