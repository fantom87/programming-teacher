# Standard library tour

Python ships "batteries included": hundreds of modules ready to import, no installation needed. Here's a tour of the ones you'll reach for first.

## random — dice, shuffles, choices

```python
import random

random.randint(1, 6)              # a die roll: 1..6 inclusive
random.choice(["red", "green"])   # pick one
random.shuffle(my_list)           # mix a list in place
```

## datetime — dates and times

```python
from datetime import date, datetime, timedelta

today = date.today()                    # 2026-07-15
now = datetime.now()
deadline = today + timedelta(days=30)
print(f"Due: {deadline:%d %B %Y}")      # Due: 14 August 2026
```

## pathlib — files and folders

```python
from pathlib import Path

for p in Path(".").glob("*.txt"):       # every .txt here
    print(p.name, p.stat().st_size)
```

## json — save and load structured data

JSON is the universal data format of the web, and it maps directly to dicts and lists:

```python
import json

data = {"name": "Ada", "scores": [88, 92]}
text = json.dumps(data)          # dict -> string
back = json.loads(text)          # string -> dict

Path("save.json").write_text(json.dumps(data), encoding="utf-8")
```

## collections — smarter containers

```python
from collections import Counter

Counter("mississippi").most_common(2)
# [('i', 4), ('s', 4)] — counting in one line
```

## csv — spreadsheet-style files

```python
import csv

with open("scores.csv", encoding="utf-8", newline="") as f:
    for row in csv.reader(f):
        print(row)               # each row is a list of strings
```

## A few more worth knowing

- `math` — `sqrt`, `floor`, `pi`, and friends
- `statistics` — `mean`, `median` without any setup
- `os` — environment variables, current directory
- `time` — `time.sleep(2)` pauses two seconds
- `re` — regular expressions, for pattern-matching text

## Explore from the prompt

The `help()` function works on any module in the interactive interpreter:

```python
import random
help(random.choice)
```

Before writing something from scratch, check whether the standard library already has it. It usually does.
