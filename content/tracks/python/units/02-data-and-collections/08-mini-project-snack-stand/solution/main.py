snacks = [
    {"name": "granola bar", "price": 2, "stock": 12},
    {"name": "trail mix", "price": 3, "stock": 0},
    {"name": "apple", "price": 1, "stock": 25},
    {"name": "cocoa", "price": 2, "stock": 0},
]
wish = "banana"

names = []
sold_out = 0
total_value = 0

print("SNACK STAND REPORT")
for snack in snacks:
    print(f"{snack['name']}: ${snack['price']} each, {snack['stock']} left")
    names.append(snack["name"])
    if snack["stock"] == 0:
        sold_out = sold_out + 1
    total_value = total_value + snack["price"] * snack["stock"]
print(f"Sold out: {sold_out}")
print(f"Stock value: ${total_value}")
if wish in names:
    print(f"{wish} today: yes")
else:
    print(f"no {wish} today")
