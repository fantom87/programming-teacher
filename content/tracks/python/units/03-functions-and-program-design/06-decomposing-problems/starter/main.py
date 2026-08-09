# It works... but it's a blob. Refactor into three functions:
#   subtotal(prices)  -> returns the sum of the list
#   with_tax(amount)  -> returns round(amount * 1.08, 2)
#   receipt(prices)   -> calls the other two, prints both lines
# Top level at the end: just the list + receipt(prices).
# The printed output must stay EXACTLY the same.

prices = [4.50, 2.00, 8.25]

total = 0
for p in prices:
    total = total + p
print("Subtotal:", total)
print("Total due:", round(total * 1.08, 2))
