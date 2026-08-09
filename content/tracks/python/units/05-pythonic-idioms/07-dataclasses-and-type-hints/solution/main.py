from dataclasses import dataclass

@dataclass
class Book:
    title: str
    author: str
    pages: int
    finished: bool = False

    def describe(self) -> str:
        return f"{self.title} by {self.author}, {self.pages} pages"

favorite = Book("Fluent Python", "Luciano Ramalho", 792)
print(favorite.describe())
print(favorite)
print(Book("Dune", "Frank Herbert", 412) == Book("Dune", "Frank Herbert", 412))
