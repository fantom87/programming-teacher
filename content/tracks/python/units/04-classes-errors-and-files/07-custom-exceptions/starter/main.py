# 1. Define EmptyDeckError — a class inheriting from Exception (pass body).

# 2. Write draw(deck): raise EmptyDeckError("the deck is empty") when the
#    deck has no cards; otherwise return deck.pop().

deck = ["ace", "king"]

# 3. Draw and print twice — then draw a third time inside
#    try/except EmptyDeckError as error, printing f"Stop: {error}".
