def t_banner():
    got = banner("Hi")
    assert got == "== Hi ==", f'banner("Hi") gave {got!r}, expected "== Hi =="'
    assert banner("Imports") == "== Imports ==", 'banner("Imports") should be "== Imports =="'

def t_underline():
    assert underline("Hi") == "--", 'underline("Hi") should be "--"'
    assert underline("Imports") == "-------", 'underline("Imports") should be 7 dashes'
    assert underline("") == "", "empty text should give an empty underline"

test("banner wraps the text", t_banner)
test("underline matches the length", t_underline)
