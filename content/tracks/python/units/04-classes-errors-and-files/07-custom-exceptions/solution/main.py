class EmptyDeckError(Exception):
    pass


def draw(deck):
    if len(deck) == 0:
        raise EmptyDeckError("the deck is empty")
    return deck.pop()


deck = ["ace", "king"]

print(draw(deck))
print(draw(deck))

try:
    print(draw(deck))
except EmptyDeckError as error:
    print(f"Stop: {error}")
