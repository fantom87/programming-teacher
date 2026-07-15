# Files

Variables vanish when your program ends. Files are how data survives — reading input, saving results, keeping logs.

## Reading a file

The standard pattern uses `with`, which opens the file and *guarantees* it gets closed, even if an error happens:

```python
with open("notes.txt", encoding="utf-8") as f:
    content = f.read()

print(content)
```

`f.read()` returns the whole file as one string. For big files, or to handle lines one by one, loop instead:

```python
with open("notes.txt", encoding="utf-8") as f:
    for line in f:
        print(line.strip())    # strip() removes the trailing newline
```

Always pass `encoding="utf-8"` — it makes your code behave the same on every computer.

## Writing a file

Open in write mode (`"w"`) to create or *replace* a file, or append mode (`"a"`) to add to the end:

```python
with open("journal.txt", "w", encoding="utf-8") as f:
    f.write("Day 1: learned about files\n")

with open("journal.txt", "a", encoding="utf-8") as f:
    f.write("Day 2: still going!\n")
```

Careful: `"w"` wipes any existing content the moment the file opens.

## When the file doesn't exist

Reading a missing file raises `FileNotFoundError`. Handle it gracefully:

```python
try:
    with open("settings.txt", encoding="utf-8") as f:
        settings = f.read()
except FileNotFoundError:
    settings = ""    # fine — use defaults
```

## Paths, the modern way

The `pathlib` module treats paths as objects and offers shortcuts:

```python
from pathlib import Path

p = Path("data") / "notes.txt"      # data/notes.txt, on any OS
if p.exists():
    text = p.read_text(encoding="utf-8")

Path("out.txt").write_text("hello", encoding="utf-8")
```

`read_text` and `write_text` are perfect for small files — no `with` needed.

A note on relative paths: `"notes.txt"` means "in the folder the program was *run from*," which isn't always where the script lives. When files mysteriously go missing, check your working directory first.
