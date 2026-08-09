class Song:
    def __init__(self, title, artist):
        self.title = title
        self.artist = artist

    def __str__(self):
        return f"{self.title} by {self.artist}"

    def __eq__(self, other):
        return self.title == other.title and self.artist == other.artist


a = Song("Holocene", "Bon Iver")
b = Song("Holocene", "Bon Iver")
c = Song("Skinny Love", "Bon Iver")

print(a)
print(a == b)
print(a == c)
