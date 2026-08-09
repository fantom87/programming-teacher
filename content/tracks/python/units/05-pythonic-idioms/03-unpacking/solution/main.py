record = ("Ada Lovelace", 1815, "London")
gold = "perl"
silver = "python"
scores = [92, 75, 88, 60]

name, year, city = record
print(f"{name} ({year}, {city})")

gold, silver = silver, gold
print(f"gold: {gold}, silver: {silver}")

first, *rest = scores
print(f"first: {first}, rest: {rest}")
