def t_is_teen():
    assert "is_teen" in globals(), "there's no variable called is_teen yet"
    assert isinstance(is_teen, bool), "is_teen should be a boolean — build it with a comparison, not quotes"
    assert is_teen == True, f"is_teen holds {is_teen!r} — 16 IS between 13 and 19"

def t_can_enter():
    assert "can_enter" in globals(), "there's no variable called can_enter yet"
    assert isinstance(can_enter, bool), "can_enter should be a boolean — build it with a comparison"
    assert can_enter == True, f"can_enter holds {can_enter!r} — the ticket should get them in (or lets either side win)"

def t_is_adult():
    assert "is_adult" in globals(), "there's no variable called is_adult yet"
    assert isinstance(is_adult, bool), "is_adult should be a boolean — build it with a comparison"
    assert is_adult == False, f"is_adult holds {is_adult!r} — 16 is not 18 yet"

def t_still_minor():
    assert "still_minor" in globals(), "there's no variable called still_minor yet"
    assert isinstance(still_minor, bool), "still_minor should be a boolean — use not on is_adult"
    assert still_minor == True, f"still_minor holds {still_minor!r} — not False is True"

test("is_teen is True (16 is between 13 and 19)", t_is_teen)
test("can_enter is True (the ticket saves the day)", t_can_enter)
test("is_adult is False (16 is not 18 yet)", t_is_adult)
test("still_minor is True (the opposite of is_adult)", t_still_minor)
