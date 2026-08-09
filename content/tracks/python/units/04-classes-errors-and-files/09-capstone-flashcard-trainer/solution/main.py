from pathlib import Path

guesses = ["paris", "5", "def", "ValueError", "__init__"]


class DeckError(Exception):
    pass


class Flashcard:
    def __init__(self, prompt, answer):
        self.prompt = prompt
        self.answer = answer

    def check(self, guess):
        return guess.strip().lower() == self.answer.strip().lower()

    def __str__(self):
        return f"{self.prompt}|{self.answer}"


def load_deck(path):
    if not path.exists():
        raise DeckError(f"deck file not found: {path}")
    deck = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip() == "":
            continue
        if "|" not in line:
            raise DeckError(f"bad card line: {line}")
        prompt, answer = line.split("|", 1)
        deck.append(Flashcard(prompt, answer))
    return deck


print("== Flashcard Trainer ==")

deck = load_deck(Path("cards.txt"))

score = 0
missed = []
for i in range(len(deck)):
    card = deck[i]
    if card.check(guesses[i]):
        score = score + 1
        print(f"OK: {card.prompt}")
    else:
        missed.append(card)
        print(f"MISS: {card.prompt} (answer: {card.answer})")

print(f"Score: {score}/{len(deck)}")

review_lines = ""
for card in missed:
    review_lines = review_lines + str(card) + "\n"
Path("review.txt").write_text(review_lines, encoding="utf-8")

print(f"Saved {len(missed)} missed card(s) to review.txt")
