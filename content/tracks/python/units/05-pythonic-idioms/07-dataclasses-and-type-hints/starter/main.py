from dataclasses import dataclass

# 1. A Book dataclass with four annotated fields:
#    title: str, author: str, pages: int, finished: bool = False

# 2. A method describe(self) -> str returning
#    "TITLE by AUTHOR, PAGES pages".

# 3. favorite = Book("Fluent Python", "Luciano Ramalho", 792)
#    Print favorite.describe(), then favorite itself, then
#    Book("Dune", "Frank Herbert", 412) == Book("Dune", "Frank Herbert", 412)
