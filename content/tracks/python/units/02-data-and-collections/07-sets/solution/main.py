visits = ["ada", "grace", "ada", "alan", "grace", "ada"]

print(f"{len(visits)} visits")
unique = set(visits)
print(f"{len(unique)} unique visitors")
unique.add("katherine")
for name in sorted(unique):
    print(name)
