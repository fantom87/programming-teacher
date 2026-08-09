---
id: 06-dicts
title: Dicts
language: python
runner: browser
estMinutes: 15
files:
  - path: main.py
    starter: starter/main.py
goal: "Look up the torch count, update the apple count, add a map key, then loop over the backpack dict printing every item and its count."
docs: [python/dicts, python/loops]
checks:
  - id: backpack-updated
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-inventory
    type: stdout
    entry: main.py
    match: exact
    value: "Torches: 6\nrope: 1\ntorch: 6\napple: 2\nmap: 1\n"
hints:
  - "Look up by key, not position: backpack[\"torch\"] is 6. Inside an f-string, use the other quote style: f\"Torches: {backpack['torch']}\"."
  - "Assigning to a key updates it — backpack[\"apple\"] = backpack[\"apple\"] - 1 — and assigning to a NEW key adds it."
  - "for item in backpack: hands you each KEY; the matching value is backpack[item]."
---
## Storage with labels

A list numbers its items; a **dict** *names* them. Curly braces, each
entry a `key: value` pair:

```python
backpack = {"rope": 1, "torch": 6, "apple": 3}
```

Now you look things up by **label**, not position:

```python
print(backpack["torch"])    # 6
```

That's the superpower: "how many torches?" beats "what's in slot 1?"
every time. Dicts are how programs store *word → meaning* data — a
contact book, a settings panel, a game inventory.

Assignment does double duty:

```python
backpack["apple"] = 2      # key exists  -> UPDATE its value
backpack["map"] = 1        # key is new  -> ADD the entry
```

Same syntax either way — Python checks whether the key is already
there. And since a lookup is just a value, you can compute with it and
store the result back:

```python
backpack["apple"] = backpack["apple"] - 1     # ate one
```

### Looping a dict

A `for` loop over a dict hands you the **keys**, in the order you
added them. Pair each key with a lookup and you can print the whole
inventory:

```python
for item in backpack:
    print(f"{item}: {backpack[item]}")
```

One small snag when a lookup sits inside an f-string: the string
already uses `"` quotes, so the key needs `'` quotes —
`f"Torches: {backpack['torch']}"`. Different quotes, no confusion.

### Your goal

The starter packs a `backpack`.

1. Print the torch count with a lookup: `Torches: 6`.
2. Eat one apple — subtract 1 from its count.
3. Add a `"map"` with count 1.
4. Loop over the backpack, printing `<item>: <count>` for each entry:

```
Torches: 6
rope: 1
torch: 6
apple: 2
map: 1
```
