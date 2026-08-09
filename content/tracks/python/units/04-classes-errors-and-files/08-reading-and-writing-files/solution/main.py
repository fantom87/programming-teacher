from pathlib import Path

journal = Path("journal.txt")

journal.write_text("Day 1: learned classes\n", encoding="utf-8")

with open(journal, "a", encoding="utf-8") as f:
    f.write("Day 2: survived exceptions\n")

lines = journal.read_text(encoding="utf-8").splitlines()
for line in lines:
    print(line)

print(f"{len(lines)} lines saved")
