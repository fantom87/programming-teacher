def t_by_name():
    assert by_name == {"Guido": "Python", "Dennis": "C", "Grace": "COBOL"}, "by_name should pair each name with their language"
    assert isinstance(by_name, dict), "by_name should be a dict"

def t_sources_untouched():
    assert names == ["Guido", "Dennis", "Grace"], "names must be left as-is"
    assert langs == ["Python", "C", "COBOL"], "langs must be left as-is"
    assert podium == ["gold", "silver", "bronze"], "podium must be left as-is"

test("by_name pairs names with languages", t_by_name)
test("the source lists are untouched", t_sources_untouched)
