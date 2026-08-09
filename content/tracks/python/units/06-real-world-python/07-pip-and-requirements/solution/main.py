from pathlib import Path

# skycast needs: HTTP (requests), terminal tables (rich),
# timestamp parsing (python-dateutil). No servers, no games.

REQUIREMENTS = [
    "requests==2.32.5",
    "rich==14.1.0",
    "python-dateutil==2.9.0",
]

lines = ["# skycast — terminal weather dashboard"] + REQUIREMENTS
Path("requirements.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")

for pin in REQUIREMENTS:
    name, version = pin.split("==")
    print(f"{name} pinned to {version}")

print(f"{len(REQUIREMENTS)} packages pinned")
