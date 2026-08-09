import csv

with open("scores.csv", encoding="utf-8", newline="") as f:
    totals = []
    for row in csv.DictReader(f):
        total = int(row["points"]) + int(row["bonus"])
        totals.append((row["name"], total))
        print(f"{row['name']}: {total}")

with open("totals.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "total"])
    for name, total in totals:
        writer.writerow([name, total])

print("totals.csv written")
