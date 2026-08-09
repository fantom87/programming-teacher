def t_make_greeting():
    got = make_greeting("Zoe")
    assert got == "Hello, Zoe!", f'make_greeting("Zoe") gave {got!r}, expected "Hello, Zoe!"'
    assert make_greeting("Bradley") == "Hello, Bradley!", "make_greeting should greet any name"

test("make_greeting still works", t_make_greeting)
