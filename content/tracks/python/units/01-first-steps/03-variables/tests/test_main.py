def t_answer():
    assert "answer" in globals(), "there's no variable called answer yet"
    assert answer == 42, f"answer holds {answer!r}, expected 42"

def t_greeting():
    assert "greeting" in globals(), "there's no variable called greeting yet"
    assert greeting == "Hello", f"greeting holds {greeting!r}, expected 'Hello'"

test("answer equals 42", t_answer)
test("greeting equals 'Hello'", t_greeting)
