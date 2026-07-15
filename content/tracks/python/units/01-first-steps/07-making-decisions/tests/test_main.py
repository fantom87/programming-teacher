def t_score_unchanged():
    assert "score" in globals(), "the score variable is missing — put back score = 85"
    assert score == 85, f"score holds {score!r} — keep it set to 85 so the checks can grade you"

def t_grade():
    assert "grade" in globals(), "there's no variable called grade yet — set it inside your if/elif/else branches"
    assert grade == "B", f"grade holds {grade!r}, expected 'B' — 85 falls in the 80-to-89 band"

test("score is still 85", t_score_unchanged)
test("grade equals 'B' for a score of 85", t_grade)
