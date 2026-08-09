podium = ["gold", "silver", "bronze"]
names = ["Guido", "Dennis", "Grace"]
langs = ["Python", "C", "COBOL"]

for place, medal in enumerate(podium, start=1):
    print(f"{place}. {medal}")

for name, lang in zip(names, langs):
    print(f"{name} wrote {lang}")

by_name = dict(zip(names, langs))
print(by_name)
