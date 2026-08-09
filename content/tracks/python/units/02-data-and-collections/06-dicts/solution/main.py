backpack = {"rope": 1, "torch": 6, "apple": 3}

print(f"Torches: {backpack['torch']}")
backpack["apple"] = backpack["apple"] - 1
backpack["map"] = 1
for item in backpack:
    print(f"{item}: {backpack[item]}")
