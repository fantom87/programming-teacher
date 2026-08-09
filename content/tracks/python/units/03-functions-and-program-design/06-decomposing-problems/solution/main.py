def subtotal(prices):
    total = 0
    for p in prices:
        total = total + p
    return total

def with_tax(amount):
    return round(amount * 1.08, 2)

def receipt(prices):
    sub = subtotal(prices)
    print("Subtotal:", sub)
    print("Total due:", with_tax(sub))

prices = [4.50, 2.00, 8.25]
receipt(prices)
