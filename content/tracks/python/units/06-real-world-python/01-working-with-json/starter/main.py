import json
from pathlib import Path

profile = {
    "name": "Ada",
    "level": 7,
    "languages": ["python", "javascript"],
}

# 1. Save profile to profile.json — json.dumps(..., indent=2) makes the
#    text, write_text puts it on disk.

# 2. Load it back with json.loads into a dict called data, then:
#    level up by 1, append "csharp" to the languages.

# 3. Save the changed data back to profile.json (same two calls).

# 4. Print the report FROM data — nothing hardcoded:
#      Ada is level 8
#      speaks 3 languages
#      saved profile.json
