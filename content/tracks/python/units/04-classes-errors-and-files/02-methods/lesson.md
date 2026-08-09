---
id: 02-methods
title: Methods
language: python
runner: browser
estMinutes: 14
files:
  - path: main.py
    starter: starter/main.py
goal: "Give BankAccount a deposit(amount) method that grows self.balance and a report() method returning \"owner: $balance\" — then deposit 50 and 25 and print the report."
docs: [python/classes, python/functions]
checks:
  - id: methods-work
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-report
    type: stdout
    entry: main.py
    match: exact
    value: "Ada: $75\n"
hints:
  - "A method is just a def indented inside the class — and its first parameter is always self."
  - "deposit changes state: self.balance = self.balance + amount. report answers a question: return f\"...\" — return, don't print."
  - "After the class: account.deposit(50), account.deposit(25), then print(account.report())."
---
## Objects that do things

A Book that only stores data is a fancy dict. The real power of classes
is attaching **behavior** — functions that live on the object and work
with its data. Those functions are called **methods**:

```python
class BankAccount:
    def __init__(self, owner):
        self.owner = owner
        self.balance = 0

    def deposit(self, amount):
        self.balance = self.balance + amount
```

`deposit` is defined *inside* the class, indented like `__init__`, and
takes `self` first — that's how it reaches this account's own balance.
You call it with the dot, and Python fills in `self`:

```python
account = BankAccount("Ada")
account.deposit(50)        # self is account, amount is 50
print(account.balance)     # 50
```

Methods come in two broad flavors, and good classes use both:

- **Commands** change the object's state: `deposit` updates
  `self.balance` and returns nothing.
- **Queries** answer questions: they `return` a value computed from the
  attributes, and change nothing.

A query for our account might be:

```python
    def report(self):
        return f"{self.owner}: ${self.balance}"
```

Note that `report` *returns* the string instead of printing it. That's
deliberate — the caller decides what to do with it: print it, log it,
put it in a webpage. Methods that return are more reusable than methods
that print.

### Your goal

The starter has the `BankAccount` class with `__init__` done.

1. Add `deposit(self, amount)` — add `amount` to `self.balance`.
2. Add `report(self)` — **return** the string `owner: $balance`.
3. Deposit `50`, then `25`, into the `account`, and print the report:

```
Ada: $75
```
