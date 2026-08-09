class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages


favorite = Book("Deep Work", "Cal Newport", 304)
print(f"{favorite.title} by {favorite.author} ({favorite.pages} pages)")
