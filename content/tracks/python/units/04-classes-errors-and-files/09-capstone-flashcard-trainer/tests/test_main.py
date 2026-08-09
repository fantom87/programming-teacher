def t_check_forgiving():
    card = Flashcard("capital of France", "Paris")
    assert card.check(" PARIS "), "check(' PARIS ') should pass — strip spaces and compare case-insensitively"
    assert not card.check("london"), "check('london') should fail for answer 'Paris'"

def t_card_str():
    card = Flashcard("a question", "an answer")
    assert str(card) == "a question|an answer", f"str(card) gave {str(card)!r}, expected 'a question|an answer'"

def t_deck_error_type():
    assert issubclass(DeckError, Exception), "DeckError should inherit from Exception"

def t_missing_file_raises():
    from pathlib import Path
    try:
        load_deck(Path("no-such-deck.txt"))
    except DeckError:
        return
    assert False, "load_deck on a missing file should raise DeckError"

def t_loads_all_cards():
    from pathlib import Path
    deck = load_deck(Path("cards.txt"))
    assert len(deck) == 5, f"cards.txt holds 5 cards, but load_deck returned {len(deck)}"
    assert deck[0].prompt == "capital of France", f"first card's prompt is {deck[0].prompt!r}"
    assert deck[0].answer == "Paris", f"first card's answer is {deck[0].answer!r}"

def t_review_file():
    from pathlib import Path
    review = Path("review.txt")
    assert review.exists(), "review.txt was not written"
    assert "2 + 2|4" in review.read_text(encoding="utf-8"), "review.txt should hold the missed card as prompt|answer"

test("Flashcard.check forgives case and spaces", t_check_forgiving)
test("__str__ returns prompt|answer", t_card_str)
test("DeckError is an Exception", t_deck_error_type)
test("load_deck raises DeckError for a missing file", t_missing_file_raises)
test("load_deck reads all 5 cards", t_loads_all_cards)
test("missed cards land in review.txt", t_review_file)
