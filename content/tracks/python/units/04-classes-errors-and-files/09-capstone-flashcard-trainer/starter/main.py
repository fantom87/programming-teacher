from pathlib import Path

# == Flashcard Trainer ==
# The deck lives in cards.txt — one card per line, in the form prompt|answer.
# guesses holds this session's answers, one per card, in order.

guesses = ["paris", "5", "def", "ValueError", "__init__"]

# 1. class DeckError(Exception) — your own error type.

# 2. class Flashcard: stores prompt and answer.
#    - check(guess): case-insensitive, ignores surrounding spaces
#    - __str__: returns "prompt|answer"

# 3. load_deck(path) -> list of Flashcards.
#    Raise DeckError if the file is missing.

# 4. The session:
#    - print the header "== Flashcard Trainer =="
#    - load the deck from cards.txt
#    - for each card/guess pair: print "OK: prompt" or
#      "MISS: prompt (answer: answer)", counting the score
#    - print "Score: <score>/<total>"
#    - write missed cards to review.txt, one "prompt|answer" line each
#    - print "Saved <n> missed card(s) to review.txt"
