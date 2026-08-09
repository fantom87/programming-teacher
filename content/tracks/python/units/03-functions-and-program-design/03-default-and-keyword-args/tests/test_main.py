def t_defaults():
    got = ticket("Ada")
    assert got == "Ada | general | $25", f'ticket("Ada") gave {got!r} — row should default to "general", price to 25'

def t_positional():
    got = ticket("Grace", "balcony", 40)
    assert got == "Grace | balcony | $40", f'ticket("Grace", "balcony", 40) gave {got!r}'

def t_keyword_skips_row():
    got = ticket("Linus", price=60)
    assert got == "Linus | general | $60", "price=60 should override the price but leave row at its default"

def t_keywords_any_order():
    got = ticket(price=5, name="Zoe")
    assert got == "Zoe | general | $5", "keyword arguments should work in any order"

test("defaults fill in the blanks", t_defaults)
test("positional arguments still work", t_positional)
test("a keyword can skip a middle parameter", t_keyword_skips_row)
test("keywords work in any order", t_keywords_any_order)
