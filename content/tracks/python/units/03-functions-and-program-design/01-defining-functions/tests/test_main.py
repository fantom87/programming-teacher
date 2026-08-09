import io as __check_io
from contextlib import redirect_stdout as __check_redirect

def t_exists():
    assert "welcome" in globals(), "there's no function called welcome yet"
    assert callable(welcome), "welcome exists but isn't a function — use def"

def t_prints_both_lines():
    buf = __check_io.StringIO()
    with __check_redirect(buf):
        welcome()
    out = buf.getvalue()
    assert "Welcome to the Snack Shack!" in out, "welcome() should print the greeting line"
    assert "What can I get you?" in out, "welcome() should also print the question line"

test("welcome is a function", t_exists)
test("welcome() prints both lines", t_prints_both_lines)
