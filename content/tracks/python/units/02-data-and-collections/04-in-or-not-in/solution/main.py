stock = ["apples", "bread", "milk", "coffee"]
shopping = ["milk", "eggs", "coffee", "jam"]
to_buy = 0

for item in shopping:
    if item in stock:
        print(f"{item}: in stock")
    else:
        print(f"{item}: need to buy")
        to_buy = to_buy + 1
print(f"{to_buy} items to buy")
