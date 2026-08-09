def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("amount must be positive")
    if amount > balance:
        raise ValueError("insufficient funds")
    return balance - amount


print(withdraw(100, 30))

try:
    withdraw(100, 500)
except ValueError as error:
    print(f"Blocked: {error}")
