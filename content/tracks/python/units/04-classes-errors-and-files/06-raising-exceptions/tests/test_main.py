def t_good_withdrawal():
    result = withdraw(100, 30)
    assert result == 70, f"withdraw(100, 30) returned {result!r}, expected 70"

def t_overdraft():
    try:
        withdraw(50, 100)
    except ValueError:
        return
    assert False, "withdraw(50, 100) should raise ValueError (insufficient funds)"

def t_non_positive():
    try:
        withdraw(50, -5)
    except ValueError:
        return
    assert False, "withdraw(50, -5) should raise ValueError (amount must be positive)"

def t_zero():
    try:
        withdraw(50, 0)
    except ValueError:
        return
    assert False, "withdraw(50, 0) should raise ValueError — zero isn't a withdrawal"

test("a valid withdrawal returns the new balance", t_good_withdrawal)
test("overdrafts raise ValueError", t_overdraft)
test("negative amounts raise ValueError", t_non_positive)
test("zero raises ValueError too", t_zero)
