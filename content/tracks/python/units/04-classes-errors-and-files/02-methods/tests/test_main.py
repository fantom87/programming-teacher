def t_deposit():
    acct = BankAccount("Test")
    acct.deposit(40)
    acct.deposit(2)
    assert acct.balance == 42, f"after depositing 40 and 2, balance holds {acct.balance!r}, expected 42"

def t_report():
    acct = BankAccount("Grace")
    acct.deposit(10)
    result = acct.report()
    assert result == "Grace: $10", f"report() returned {result!r}, expected 'Grace: $10'"

def t_account():
    assert "account" in globals(), "there's no variable called account yet"
    assert account.balance == 75, f"account.balance holds {account.balance!r}, expected 75"

test("deposit grows the balance", t_deposit)
test("report returns owner: $balance", t_report)
test("account ends at $75", t_account)
