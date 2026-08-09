import json
from pathlib import Path

profile = {
    "name": "Ada",
    "level": 7,
    "languages": ["python", "javascript"],
}

path = Path("profile.json")
path.write_text(json.dumps(profile, indent=2), encoding="utf-8")

data = json.loads(path.read_text(encoding="utf-8"))
data["level"] += 1
data["languages"].append("csharp")
path.write_text(json.dumps(data, indent=2), encoding="utf-8")

print(f"{data['name']} is level {data['level']}")
print(f"speaks {len(data['languages'])} languages")
print("saved profile.json")
