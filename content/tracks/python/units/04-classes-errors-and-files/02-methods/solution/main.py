class BankAccount:
    def __init__(self, owner):
        self.owner = owner
        self.balance = 0

    def deposit(self, amount):
        self.balance = self.balance + amount

    def report(self):
        return f"{self.owner}: ${self.balance}"


account = BankAccount("Ada")

account.deposit(50)
account.deposit(25)
print(account.report())
