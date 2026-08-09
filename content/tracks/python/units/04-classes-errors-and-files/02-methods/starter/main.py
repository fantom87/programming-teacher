class BankAccount:
    def __init__(self, owner):
        self.owner = owner
        self.balance = 0

    # 1. Add deposit(self, amount) — add amount to self.balance.

    # 2. Add report(self) — RETURN the string "owner: $balance".


account = BankAccount("Ada")

# 3. Deposit 50, then 25, then print the report.
