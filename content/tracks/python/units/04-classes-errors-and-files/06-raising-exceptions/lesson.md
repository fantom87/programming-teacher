---
id: 06-raising-exceptions
title: Raising Exceptions
language: python
runner: browser
estMinutes: 14
files:
  - path: main.py
    starter: starter/main.py
goal: "Write withdraw(balance, amount) that raises ValueError for non-positive amounts or overdrafts and returns the new balance otherwise — print one good withdrawal and one caught error."
docs: [python/errors-and-exceptions, python/functions]
checks:
  - id: withdraw-behaves
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-result-and-block
    type: stdout
    entry: main.py
    match: exact
    value: "70\nBlocked: insufficient funds\n"
hints:
  - "A guard clause is an if at the top of the function: if amount <= 0: raise ValueError(\"amount must be positive\")"
  - "Second guard: if amount > balance: raise ValueError(\"insufficient funds\") — only then return balance - amount."
  - "For the failing call: try: / withdraw(100, 500) / except ValueError as error: / print(f\"Blocked: {error}\") — the message travels inside the exception."
---
## Refusing bad requests

Last lesson you caught exceptions other code raised. Now switch sides:
*your* functions can raise them — and good ones do. Consider a bank
withdrawal. What should `withdraw(100, 500)` return? Not `-400`. Not
`None` (the caller might not check). The honest answer is: *that
operation is invalid, and I refuse*. In Python, refusal is spelled
`raise`:

```python
def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("insufficient funds")
    return balance - amount
```

`raise` stops the function on the spot — no return value, no half-done
work — and the exception travels up to whoever called, carrying your
message. This *fail fast* style is a professional habit: a loud error at
the source beats a wrong number that surfaces three functions later
where nobody can tell where it came from.

These early `if ... raise` lines are called **guard clauses** — bouncers
at the door. They check the inputs first, so the code after them can
trust what it's working with.

And who handles the refusal? The **caller** decides, with the tool you
already know:

```python
try:
    withdraw(100, 500)
except ValueError as error:
    print(f"Blocked: {error}")
```

The `as error` part captures the exception object; printing it shows the
message you wrote at the `raise`. Write those messages for humans —
`"insufficient funds"` beats `"error 7"`.

### Your goal

1. Write `withdraw(balance, amount)` with two guards:
   - `amount <= 0` → raise `ValueError("amount must be positive")`
   - `amount > balance` → raise `ValueError("insufficient funds")`
   - otherwise → return `balance - amount`.
2. Print `withdraw(100, 30)`.
3. Call `withdraw(100, 500)` in a `try`, catching `ValueError as error`
   and printing `Blocked: {error}`:

```
70
Blocked: insufficient funds
```
