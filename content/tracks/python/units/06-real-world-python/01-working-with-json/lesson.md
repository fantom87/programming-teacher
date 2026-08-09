---
id: 01-working-with-json
title: Working with JSON
language: python
runner: local
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Round-trip a profile dict through profile.json: save it pretty-printed with json.dumps(indent=2), load it back with json.loads, level it up, and save it again."
docs: [python/stdlib-tour, python/files, python/dicts]
checks:
  - id: json-round-trip
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-report
    type: stdout
    entry: main.py
    match: exact
    value: "Ada is level 8\nspeaks 3 languages\nsaved profile.json\n"
  - id: genuine-round-trip
    type: ai-judge
    rubric: "The program performs a real round-trip: the starter profile dict is serialized with json.dumps(indent=2) and written to profile.json; the changes (level to 8, csharp appended) are made on the dict returned by json.loads — not by editing the profile literal; the file is written again AFTER the changes; and the printed report reads from the loaded dict (no literal 8 or 3 typed inside the print calls)."
hints:
  - "json.dumps(profile, indent=2) gives you the JSON text; Path(\"profile.json\").write_text(text, encoding=\"utf-8\") puts it on disk — the same write_text you know from the files lesson."
  - "Load with data = json.loads(path.read_text(encoding=\"utf-8\")). What comes back is a plain dict — data[\"level\"] += 1 and data[\"languages\"].append(\"csharp\") work as usual."
  - "Save AGAIN after the changes (the file doesn't watch the dict), then print from data: f\"{data['name']} is level {data['level']}\" and f\"speaks {len(data['languages'])} languages\"."
---
## Data that travels

You can already save text to a file. But real program data has *shape* —
lists inside dicts inside lists — and flattening that into plain text
lines gets painful fast. The world's answer is **JSON**: a text format
that looks almost exactly like Python literals and is spoken by every
language, every web API, and half the config files on your machine.

The `json` module converts both ways:

```python
import json

profile = {"name": "Ada", "level": 7}

text = json.dumps(profile, indent=2)   # dict  -> JSON text
data = json.loads(text)                # text  -> dict (a NEW one)
```

Read the names as *dump-s* and *load-s* — the `s` is for **string**.
`indent=2` pretty-prints with newlines and two-space indents, which
matters the moment a human has to read the file. Combine with the
`pathlib` moves you already know and files fall out for free:

```python
path.write_text(json.dumps(profile, indent=2), encoding="utf-8")
data = json.loads(path.read_text(encoding="utf-8"))
```

That pair is the **round-trip**: save, load, and get equal data back.
Every settings screen, save-game, and API cache you've ever used is this
pattern plus one more step — *load, change, save again*. The file never
updates itself; if you mutate the dict and forget the second save,
your change dies with the program.

One honesty note: JSON is smaller than Python. Keys become strings,
tuples come back as lists, and sets or custom objects don't fit at all
without extra work. For dicts, lists, strings, numbers, bools, and
`None`, it's seamless.

### Your goal

1. Save the starter `profile` dict to `profile.json`, pretty-printed
   with `indent=2`.
2. Load it back with `json.loads` into a variable called `data`, then
   raise the level by 1 and append `"csharp"` to the languages.
3. Save the changed `data` back to `profile.json`.
4. Print the report — every value read from `data`:

```
Ada is level 8
speaks 3 languages
saved profile.json
```
