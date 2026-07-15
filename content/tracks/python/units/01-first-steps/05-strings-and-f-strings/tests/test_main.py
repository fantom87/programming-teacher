def t_intro():
    assert "intro" in globals(), "there's no variable called intro yet"
    assert intro == "Hello, Ada!", f"intro holds {intro!r}, expected 'Hello, Ada!' — check the comma, space, and exclamation mark"

def t_status():
    assert "status" in globals(), "there's no variable called status yet"
    assert status == "Ada is learning Python", f"status holds {status!r}, expected 'Ada is learning Python'"

def t_uses_variables():
    assert name == "Ada", "keep name set to \"Ada\" — build the strings from the variables"
    assert language == "Python", "keep language set to \"Python\" — build the strings from the variables"

test("intro equals 'Hello, Ada!'", t_intro)
test("status equals 'Ada is learning Python'", t_status)
test("name and language are unchanged", t_uses_variables)
