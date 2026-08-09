def t_is_exception():
    assert "EmptyDeckError" in globals(), "there's no class called EmptyDeckError yet"
    assert issubclass(EmptyDeckError, Exception), "EmptyDeckError should inherit from Exception"

def t_draw_pops():
    cards = ["two", "three"]
    assert draw(cards) == "three", "draw should return the top (last) card via deck.pop()"
    assert cards == ["two"], "draw should remove the card it returns"

def t_empty_raises():
    try:
        draw([])
    except EmptyDeckError:
        return
    assert False, "draw([]) should raise EmptyDeckError"

test("EmptyDeckError is an Exception", t_is_exception)
test("draw returns and removes the top card", t_draw_pops)
test("drawing from an empty deck raises EmptyDeckError", t_empty_raises)
