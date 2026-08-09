import io as __check_io
from contextlib import redirect_stdout as __check_redirect

def t_subtotal():
    assert subtotal([1, 2]) == 3, "subtotal([1, 2]) should be 3"
    assert subtotal([]) == 0, "an empty list should give a subtotal of 0"
    assert subtotal([4.50, 2.00, 8.25]) == 14.75, "subtotal of the starter list should be 14.75"

def t_with_tax():
    assert with_tax(100) == 108.0, "with_tax(100) should be 108.0"
    assert with_tax(50) == 54.0, "with_tax(50) should be 54.0"

def t_receipt_prints():
    buf = __check_io.StringIO()
    with __check_redirect(buf):
        receipt([2.0])
    got = buf.getvalue()
    assert got == "Subtotal: 2.0\nTotal due: 2.16\n", f"receipt([2.0]) printed {got!r} — expected the same two-line format"

test("subtotal sums any list", t_subtotal)
test("with_tax applies 8% and rounds", t_with_tax)
test("receipt prints both lines from its pieces", t_receipt_prints)
