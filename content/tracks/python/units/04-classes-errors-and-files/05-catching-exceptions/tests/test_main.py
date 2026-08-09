def t_total():
    assert "total" in globals(), "there's no variable called total yet"
    assert total == 49, f"total holds {total!r}, expected 49 (12 + 7 + 30)"

def t_entries_untouched():
    assert entries == ["12", "7", "extra cheese", "30"], "leave the entries list as given — handle the bad entry, don't remove it"

test("total adds up the valid entries", t_total)
test("the entries list is unchanged", t_entries_untouched)
