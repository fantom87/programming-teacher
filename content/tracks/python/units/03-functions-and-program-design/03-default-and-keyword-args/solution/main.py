def ticket(name, row="general", price=25):
    return f"{name} | {row} | ${price}"

print(ticket("Ada"))
print(ticket("Grace", "balcony", 40))
print(ticket("Linus", price=60))
