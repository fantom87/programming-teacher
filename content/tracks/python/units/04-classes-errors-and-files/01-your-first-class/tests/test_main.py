def t_book_class():
    assert "Book" in globals(), "there's no class called Book yet"
    b = Book("Test Title", "Test Author", 111)
    assert b.title == "Test Title", f"title holds {b.title!r}, expected 'Test Title'"
    assert b.author == "Test Author", f"author holds {b.author!r}, expected 'Test Author'"
    assert b.pages == 111, f"pages holds {b.pages!r}, expected 111"

def t_favorite():
    assert "favorite" in globals(), "there's no variable called favorite yet"
    assert isinstance(favorite, Book), "favorite should be a Book instance"
    assert favorite.title == "Deep Work", f"favorite.title holds {favorite.title!r}, expected 'Deep Work'"
    assert favorite.pages == 304, f"favorite.pages holds {favorite.pages!r}, expected 304"

test("Book stores title, author, and pages", t_book_class)
test("favorite is a Book with the right data", t_favorite)
