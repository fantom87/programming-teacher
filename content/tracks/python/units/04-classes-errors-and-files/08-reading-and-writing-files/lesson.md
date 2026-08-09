---
id: 08-reading-and-writing-files
title: Reading and Writing Files
language: python
runner: local
estMinutes: 18
files:
  - path: main.py
    starter: starter/main.py
goal: "Using pathlib, write journal.txt with write_text, append a second line with open in \"a\" mode, then read it back, print every line, and print the line count."
docs: [python/files, python/stdlib-tour]
checks:
  - id: file-round-trip
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-journal
    type: stdout
    entry: main.py
    match: exact
    value: "Day 1: learned classes\nDay 2: survived exceptions\n2 lines saved\n"
hints:
  - "Start with from pathlib import Path, then journal = Path(\"journal.txt\") — the Path object is your handle on the file."
  - "journal.write_text(\"Day 1: learned classes\\n\", encoding=\"utf-8\") creates the file. Appending needs open: with open(journal, \"a\", encoding=\"utf-8\") as f: then f.write(...)."
  - "Read back with lines = journal.read_text(encoding=\"utf-8\").splitlines() — loop to print each line, then print(f\"{len(lines)} lines saved\")."
---
## Programs that remember

Everything you've built so far has amnesia: the program ends, the data
vanishes. Files fix that — and this lesson runs on the **real Python on
your machine**, so the file you create genuinely lands on disk.

Python's modern door to the filesystem is `pathlib`:

```python
from pathlib import Path

journal = Path("journal.txt")
```

A `Path` isn't the file itself — it's an *address* with superpowers. For
whole-file work, it's one call each way:

```python
journal.write_text("Day 1: learned classes\n", encoding="utf-8")
text = journal.read_text(encoding="utf-8")
journal.exists()    # True once written
```

Note `write_text` **replaces** the whole file every time. To *add* to a
file, you open it in append mode — and the `with` statement is how
professionals do it:

```python
with open(journal, "a", encoding="utf-8") as f:
    f.write("Day 2: survived exceptions\n")
```

`"a"` means append (write to the end); `with` guarantees the file is
properly closed when the block ends, even if something raises in the
middle — remember `finally`-style cleanup from your error lessons?
That's what `with` automates. Two more habits hiding in these snippets:
always pass `encoding="utf-8"`, and end each written line with `"\n"` —
files don't add newlines for you.

Back out, `read_text(...).splitlines()` turns the file into a list of
lines, ready for a loop.

### Your goal

1. Make a `Path` called `journal` pointing at `journal.txt`.
2. `write_text` the first line: `"Day 1: learned classes\n"`.
3. Append `"Day 2: survived exceptions\n"` using `with open(..., "a")`.
4. Read the file back, print each line, then print how many lines it
   holds:

```
Day 1: learned classes
Day 2: survived exceptions
2 lines saved
```
