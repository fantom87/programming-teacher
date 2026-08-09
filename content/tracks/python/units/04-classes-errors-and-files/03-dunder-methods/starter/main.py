class Song:
    def __init__(self, title, artist):
        self.title = title
        self.artist = artist

    # 1. Add __str__(self) — return "title by artist".

    # 2. Add __eq__(self, other) — True when title AND artist match.


a = Song("Holocene", "Bon Iver")
b = Song("Holocene", "Bon Iver")
c = Song("Skinny Love", "Bon Iver")

# 3. Print a, then a == b, then a == c.
