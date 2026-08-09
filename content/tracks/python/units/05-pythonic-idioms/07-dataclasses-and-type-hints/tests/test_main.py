def t_is_dataclass():
    import dataclasses
    assert dataclasses.is_dataclass(Book), "Book should be decorated with @dataclass"

def t_fields_in_order():
    import dataclasses
    names = [f.name for f in dataclasses.fields(Book)]
    assert names == ["title", "author", "pages", "finished"], "fields in order: title, author, pages, finished"

def t_finished_defaults():
    book = Book("Dune", "Frank Herbert", 412)
    assert book.finished is False, "finished should default to False"
    assert Book("Dune", "Frank Herbert", 412, True).finished is True, "a fourth argument overrides the default"

def t_generated_eq():
    assert Book("Dune", "Frank Herbert", 412) == Book("Dune", "Frank Herbert", 412), "equal fields should mean equal Books — @dataclass writes __eq__"
    assert Book("Dune", "Frank Herbert", 412) != Book("Dune", "Frank Herbert", 413), "one different field should break equality"

def t_describe():
    assert Book("Dune", "Frank Herbert", 412).describe() == "Dune by Frank Herbert, 412 pages", 'describe() should read "Dune by Frank Herbert, 412 pages"'

test("Book is a dataclass", t_is_dataclass)
test("the four fields sit in order", t_fields_in_order)
test("finished defaults to False", t_finished_defaults)
test("equality compares field values", t_generated_eq)
test("describe reports title, author, pages", t_describe)
