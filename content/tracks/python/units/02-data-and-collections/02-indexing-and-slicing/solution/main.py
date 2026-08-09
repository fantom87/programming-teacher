finishers = ["Mira", "Josh", "Priya", "Tomas", "Ken"]

winner = finishers[0]
print(f"Winner: {winner}")
last = finishers[-1]
print(f"Last place: {last}")
podium = finishers[:3]
print("Podium:")
for name in podium:
    print(name)
