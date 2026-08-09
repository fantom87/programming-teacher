entries = ["12", "7", "extra cheese", "30"]

total = 0

for entry in entries:
    try:
        total = total + int(entry)
    except ValueError:
        print(f"Skipping: {entry}")

print(total)
